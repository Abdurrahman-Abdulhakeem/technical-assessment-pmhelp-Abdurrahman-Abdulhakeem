import { AppointmentModel } from '../models/Appointment';
import { UserModel } from '../models/User';
import { MedicalRecordModel } from '../models/MedicalRecord';
import { UserSubscriptionModel } from '../models/UserSubscription';
import { UserRole, AppointmentStatus, SubscriptionTier } from '../types';

export class AnalyticsService {
  static async getDoctorPracticeAnalytics(
    doctorId: string,
    startDate?: string,
    endDate?: string
  ) {
    const dateFilter: any = {};
    
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const filter: any = { doctorId };
    if (Object.keys(dateFilter).length > 0) {
      filter.createdAt = dateFilter;
    }

    // Appointment statistics
    const appointmentStats = await AppointmentModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalDuration: { $sum: '$duration' }
        }
      }
    ]);

    // Total patients served
    const totalPatients = await AppointmentModel.distinct('patientId', filter);

    // Average consultation duration
    const avgDuration = await AppointmentModel.aggregate([
      { $match: { ...filter, status: AppointmentStatus.COMPLETED } },
      {
        $group: {
          _id: null,
          avgDuration: { $avg: '$duration' }
        }
      }
    ]);

    // Monthly appointment trends
    const monthlyTrends = await AppointmentModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          totalHours: { $sum: { $divide: ['$duration', 60] } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Total hours spent
    const totalHours = appointmentStats.reduce(
      (total, stat) => total + (stat.totalDuration / 60), 
      0
    );

    return {
      totalAppointments: appointmentStats.reduce((total, stat) => total + stat.count, 0),
      totalPatients: totalPatients.length,
      totalHours: Math.round(totalHours * 100) / 100,
      averageDuration: avgDuration[0]?.avgDuration || 0,
      appointmentsByStatus: appointmentStats,
      monthlyTrends
    };
  }

  static async getSystemAnalytics(startDate?: string, endDate?: string) {
    const dateFilter: any = {};
    
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const filter: any = {};
    if (Object.keys(dateFilter).length > 0) {
      filter.createdAt = dateFilter;
    }

    // User statistics
    const userStats = await UserModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
          active: { $sum: { $cond: ['$isActive', 1, 0] } }
        }
      }
    ]);

    // Appointment statistics
    const appointmentStats = await AppointmentModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Revenue by subscription (mock calculation)
    const subscriptionRevenue = await UserSubscriptionModel.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: 'subscriptions',
          localField: 'subscriptionId',
          foreignField: '_id',
          as: 'subscription'
        }
      },
      { $unwind: '$subscription' },
      {
        $group: {
          _id: '$subscription.tier',
          count: { $sum: 1 },
          revenue: { $sum: '$subscription.price' }
        }
      }
    ]);

    return {
      userStats,
      appointmentStats,
      subscriptionRevenue,
      totalUsers: userStats.reduce((total, stat) => total + stat.count, 0),
      totalAppointments: appointmentStats.reduce((total, stat) => total + stat.count, 0),
      totalRevenue: subscriptionRevenue.reduce((total, stat) => total + stat.revenue, 0)
    };
  }

  static async getAppointmentAnalytics(startDate?: string, endDate?: string) {
    const dateFilter: any = {};
    
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const filter: any = {};
    if (Object.keys(dateFilter).length > 0) {
      filter.appointmentDate = dateFilter;
    }

    // Daily appointment trends
    const dailyTrends = await AppointmentModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: '$appointmentDate' },
            month: { $month: '$appointmentDate' },
            day: { $dayOfMonth: '$appointmentDate' }
          },
          count: { $sum: 1 },
          cancelled: { $sum: { $cond: [{ $eq: ['$status', AppointmentStatus.CANCELLED] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ['$status', AppointmentStatus.COMPLETED] }, 1, 0] } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Peak hours analysis
    const peakHours = await AppointmentModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $hour: '$appointmentDate' },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Average wait time (mock calculation based on booking to appointment date)
    const avgWaitTime = await AppointmentModel.aggregate([
      { $match: filter },
      {
        $project: {
          waitDays: {
            $divide: [
              { $subtract: ['$appointmentDate', '$createdAt'] },
              1000 * 60 * 60 * 24
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgWaitDays: { $avg: '$waitDays' }
        }
      }
    ]);

    return {
      dailyTrends,
      peakHours: peakHours.slice(0, 5), // Top 5 peak hours
      averageWaitTime: avgWaitTime[0]?.avgWaitDays || 0
    };
  }

  static async getSubscriptionAnalytics() {
    // Active subscriptions by tier
    const subscriptionDistribution = await UserSubscriptionModel.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: 'subscriptions',
          localField: 'subscriptionId',
          foreignField: '_id',
          as: 'subscription'
        }
      },
      { $unwind: '$subscription' },
      {
        $group: {
          _id: '$subscription.tier',
          count: { $sum: 1 },
          revenue: { $sum: '$subscription.price' }
        }
      }
    ]);

    // Conversion rates (users who upgraded from free)
    const conversionData = await UserSubscriptionModel.aggregate([
      {
        $lookup: {
          from: 'subscriptions',
          localField: 'subscriptionId',
          foreignField: '_id',
          as: 'subscription'
        }
      },
      { $unwind: '$subscription' },
      {
        $group: {
          _id: '$userId',
          subscriptions: { $push: '$subscription.tier' },
          currentTier: { $last: '$subscription.tier' }
        }
      },
      {
        $group: {
          _id: '$currentTier',
          count: { $sum: 1 },
          upgradedFromFree: {
            $sum: {
              $cond: [
                { $in: [SubscriptionTier.FREE, '$subscriptions'] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Monthly recurring revenue
    const mrr = subscriptionDistribution.reduce((total, tier) => {
      return total + (tier.revenue * tier.count);
    }, 0);

    return {
      subscriptionDistribution,
      conversionData,
      totalActiveSubscriptions: subscriptionDistribution.reduce((total, tier) => total + tier.count, 0),
      monthlyRecurringRevenue: mrr
    };
  }

  static async getPatientAnalytics(
    patientId: string,
    startDate?: string,
    endDate?: string
  ) {
    const dateFilter: any = {};
    
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const filter: any = { patientId };
    if (Object.keys(dateFilter).length > 0) {
      filter.createdAt = dateFilter;
    }

    // Appointment history
    const appointmentHistory = await AppointmentModel.find(filter)
      .populate('doctor', 'firstName lastName specialization')
      .sort({ appointmentDate: -1 })
      .limit(10);

    // Appointment stats by status
    const appointmentStats = await AppointmentModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Medical records count
    const medicalRecordsCount = await MedicalRecordModel.countDocuments({
      patientId,
      ...(Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {})
    });

    // Doctors visited
    const doctorsVisited = await AppointmentModel.distinct('doctorId', filter);

    return {
      appointmentHistory,
      appointmentStats,
      medicalRecordsCount,
      totalAppointments: appointmentStats.reduce((total, stat) => total + stat.count, 0),
      uniqueDoctorsVisited: doctorsVisited.length
    };
  }
}