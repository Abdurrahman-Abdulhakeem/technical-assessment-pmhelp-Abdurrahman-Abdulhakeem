import { UserModel, IUserDocument } from '../models/User';
import { PatientProfileModel } from '../models/PatientProfile';
import { DoctorProfileModel } from '../models/DoctorProfile';
import { UserSubscriptionModel } from '../models/UserSubscription';
import { SubscriptionModel } from '../models/Subscription';
import { AppError } from '../utils/appError';
import { UserRole, SubscriptionTier } from '../types';

export class AuthService {
  static async registerUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    phone?: string;
    dateOfBirth?: Date;
  }): Promise<IUserDocument> {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: userData.email });
    if (existingUser) {
      throw new AppError('User already exists with this email', 400);
    }

    // Create user
    const user = await UserModel.create(userData);

    // Create role-specific profile
    if (userData.role === UserRole.PATIENT) {
      await PatientProfileModel.create({
        userId: user._id,
        emergencyContact: {
          name: '',
          relationship: '',
          phone: ''
        }
      });

      // Assign free subscription to patients
      const freeSubscription = await SubscriptionModel.findOne({ 
        tier: SubscriptionTier.FREE 
      });
      
      if (freeSubscription) {
        await UserSubscriptionModel.create({
          userId: user._id,
          subscriptionId: freeSubscription._id,
          startDate: new Date(),
          isActive: true
        });
      }
    }

    if (userData.role === UserRole.DOCTOR) {
      await DoctorProfileModel.create({
        userId: user._id,
        specialization: '',
        licenseNumber: '',
        experience: 0,
        education: [],
        availability: [],
        consultationFee: 0
      });
    }

    return user;
  }

  static async loginUser(email: string, password: string): Promise<IUserDocument> {
    // Find user and include password for comparison
    const user = await UserModel.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw new AppError('Your account has been deactivated', 401);
    }

    return user;
  }

  static async findUserById(id: string): Promise<IUserDocument | null> {
    return await UserModel.findById(id);
  }
}
