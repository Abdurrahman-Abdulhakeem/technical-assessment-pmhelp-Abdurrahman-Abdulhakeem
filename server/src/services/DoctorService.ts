import { DoctorProfileModel, IDoctorProfileDocument } from '../models/DoctorProfile';
import { UserModel } from '../models/User';
import { AppointmentModel } from '../models/Appointment';
import { AppError } from '../utils/appError';
import { UserRole, AppointmentStatus } from '../types';
import { PipelineStage } from 'mongoose';

export class DoctorService {
  static async updateDoctorProfile(
    userId: string,
    profileData: Partial<IDoctorProfileDocument>
  ): Promise<IDoctorProfileDocument> {
    // Verify user is a doctor
    const user = await UserModel.findById(userId);
    if (!user || user.role !== UserRole.DOCTOR) {
      throw new AppError('Only doctors can update doctor profiles', 400);
    }

    let profile = await DoctorProfileModel.findOne({ userId });
    
    if (!profile) {
      // Create new profile if doesn't exist
      profile = await DoctorProfileModel.create({
        userId,
        ...profileData
      });
    } else {
      // Update existing profile
      Object.assign(profile, profileData);
      await profile.save();
    }

    return await DoctorProfileModel.findOne({ userId })
      .populate('user', 'firstName lastName email phone') as IDoctorProfileDocument;
  }

  static async getDoctorProfile(userId: string): Promise<IDoctorProfileDocument> {
    const profile = await DoctorProfileModel.findOne({ userId })
      .populate('user', 'firstName lastName email phone createdAt');

    if (!profile) {
      throw new AppError('Doctor profile not found', 404);
    }

    return profile;
  }

  static async updateAvailability(
    userId: string,
    availability: Array<{
      day: string;
      startTime: string;
      endTime: string;
      isAvailable: boolean;
    }>
  ): Promise<IDoctorProfileDocument> {
    const profile = await DoctorProfileModel.findOne({ userId });
    
    if (!profile) {
      throw new AppError('Doctor profile not found', 404);
    }

    profile.availability = availability;
    await profile.save();

    return await DoctorProfileModel.findOne({ userId })
      .populate('user', 'firstName lastName email') as IDoctorProfileDocument;
  }

  static async getDoctorAvailability(userId: string, date?: string) {
    const profile = await DoctorProfileModel.findOne({ userId });
    
    if (!profile) {
      throw new AppError('Doctor profile not found', 404);
    }

    let availableSlots = profile.availability;

    if (date) {
      const targetDate = new Date(date);
      const dayName =  targetDate.toLocaleDateString("en-US", { weekday: "short" }).toLowerCase();  // e.g., 'mon', 'tue'
      
      // Get existing appointments for the date
      const existingAppointments = await AppointmentModel.find({
        doctorId: userId,
        appointmentDate: {
          $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
          $lt: new Date(targetDate.setHours(23, 59, 59, 999))
        },
        status: { $nin: [AppointmentStatus.CANCELLED] }
      });

      // Filter availability for the specific day and remove booked slots
      const dayAvailability = availableSlots.filter(slot => 
        slot.day.toLowerCase().startsWith(dayName) && slot.isAvailable
      );

      // Generate time slots and mark as booked if appointment exists
      const timeSlots = this.generateTimeSlots(dayAvailability, existingAppointments);
      
      return {
        date: targetDate,
        availability: dayAvailability,
        timeSlots
      };
    }

    return {
      availability: availableSlots
    };
  }

  private static generateTimeSlots(
    availability: any[],
    existingAppointments: any[]
  ) {
    const slots = [];
    
    for (const avail of availability) {
      const startTime = this.timeToMinutes(avail.startTime);
      const endTime = this.timeToMinutes(avail.endTime);
      
      // Generate 30-minute slots
      for (let time = startTime; time < endTime; time += 30) {
        const slotTime = this.minutesToTime(time);
        const isBooked = existingAppointments.some(apt => {
          const aptTime = apt.appointmentDate.getHours() * 60 + apt.appointmentDate.getMinutes();
          return aptTime === time;
        });
        
        slots.push({
          time: slotTime,
          available: !isBooked
        });
      }
    }
    
    return slots;
  }

  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private static minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  static async searchDoctors(query: {
    specialization?: string;
    location?: string;
    rating?: number;
    page?: number;
    limit?: number;
  }) {
    const { specialization, rating = 0, page = 1, limit = 10 } = query;
    
    const matchStage: any = {};
    
    if (specialization) {
      matchStage.specialization = { $regex: specialization, $options: 'i' };
    }
    
    if (rating > 0) {
      matchStage.rating = { $gte: rating };
    }

    const pipeline: PipelineStage[] = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      { $match: { 'user.isActive': true, 'user.role': UserRole.DOCTOR } },
      { $sort: { rating: -1, reviewCount: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $project: {
          'user.password': 0
        }
      }
    ];

    const doctors = await DoctorProfileModel.aggregate(pipeline);
    
    // Get total count
    const totalDoctors = await DoctorProfileModel.countDocuments(matchStage);
    const pages = Math.ceil(totalDoctors / limit);

    return {
      doctors,
      pagination: {
        page,
        limit,
        total: totalDoctors,
        pages
      }
    };
  }
}
