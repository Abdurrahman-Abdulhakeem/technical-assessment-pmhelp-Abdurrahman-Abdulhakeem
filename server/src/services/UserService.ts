import { UserModel, IUserDocument } from '../models/User';
import { DoctorProfileModel } from '../models/DoctorProfile';
import { PatientProfileModel } from '../models/PatientProfile';
import { UserSubscriptionModel } from '../models/UserSubscription';
import { AppError } from '../utils/appError';
import { UserRole, PaginationQuery } from '../types';
import { SubscriptionService } from './SubscriptionService';

interface GetUsersQuery extends PaginationQuery {
  role?: UserRole;
  search?: string;
  status?: 'active' | 'inactive';
}

interface GetDoctorsQuery extends PaginationQuery {
  specialization?: string;
}

export class UserService {
  static async getAllUsers(query: GetUsersQuery) {
    const { page = 1, limit = 10, role, search, sort = '-createdAt', status } = query;
    
    // Build filter object
    const filter: any = {};
    
    if (role) {
      filter.role = role;
    }
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (status === 'active') filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;

    const skip = (page - 1) * limit;
    
    const users = await UserModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-password');
    
    const total = await UserModel.countDocuments(filter);
    const pages = Math.ceil(total / limit);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    };
  }

  static async getUserById(id: string): Promise<IUserDocument> {
    const user = await UserModel.findById(id).select('-password');
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  static async updateUser(id: string, updateData: Partial<IUserDocument>): Promise<IUserDocument> {
    const user = await UserModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  static async deleteUser(id: string): Promise<void> {
    const user = await UserModel.findById(id);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Delete related profiles
    if (user.role === UserRole.DOCTOR) {
      await DoctorProfileModel.findOneAndDelete({ userId: id });
    } else if (user.role === UserRole.PATIENT) {
      await PatientProfileModel.findOneAndDelete({ userId: id });
      await UserSubscriptionModel.updateMany(
        { userId: id },
        { isActive: false }
      );
    }

    await UserModel.findByIdAndDelete(id);
  }

  static async deactivateUser(id: string): Promise<IUserDocument> {
    const user = await UserModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  static async activateUser(id: string): Promise<IUserDocument> {
    const user = await UserModel.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    ).select('-password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  static async getDoctors(query: GetDoctorsQuery) {
    const { page = 1, limit = 10, specialization } = query;
    
    const matchStage: any = { 
      role: UserRole.DOCTOR, 
      isActive: true 
    };

    const pipeline: any[] = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'doctorprofiles',
          localField: '_id',
          foreignField: 'userId',
          as: 'profile'
        }
      },
      { $unwind: '$profile' }
    ];

    if (specialization) {
      pipeline.push({
        $match: {
          'profile.specialization': { $regex: specialization, $options: 'i' }
        }
      });
    }

    pipeline.push(
      { $sort: { 'profile.rating': -1, createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $project: {
          password: 0
        }
      }
    );

    const doctors = await UserModel.aggregate(pipeline);
    
    // Get total count
    const countPipeline = [...pipeline.slice(0, -3)];
    countPipeline.push({ $count: 'total' });
    const totalResult = await UserModel.aggregate(countPipeline);
    const total = totalResult[0]?.total || 0;
    const pages = Math.ceil(total / limit);

    return {
      doctors,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    };
  }

  static async updateUserSubscription(userId: string, subscriptionId: string) {
    const user = await UserModel.findById(userId);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.role !== UserRole.PATIENT) {
      throw new AppError('Only patients can have subscriptions', 400);
    }

    return await SubscriptionService.upgradeSubscription(userId, subscriptionId);
  }
}