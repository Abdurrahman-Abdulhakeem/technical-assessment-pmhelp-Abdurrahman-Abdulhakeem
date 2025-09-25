import { apiService } from './api';
import type { 
  ApiResponse, 
  Subscription, 
  UserSubscription 
} from '@/types';

export class SubscriptionService {
  static async getAllSubscriptions(): Promise<Array<Subscription>> {
    const response = await apiService.get<ApiResponse<Array<Subscription>>>('/subscriptions');
    return response.data!;
  }

  static async getCurrentSubscription(): Promise<UserSubscription> {
    const response = await apiService.get<ApiResponse<UserSubscription>>('/subscriptions/current');
    return response.data!;
  }

  static async upgradeSubscription(subscriptionId: string): Promise<UserSubscription> {
    const response = await apiService.post<ApiResponse<UserSubscription>>(
      '/subscriptions/upgrade', 
      { subscriptionId }
    );
    return response.data!;
  }

  static async checkAppointmentLimit(): Promise<{
    canBook: boolean;
    remainingAppointments: number;
    subscriptionTier: string;
  }> {
    const response = await apiService.get<ApiResponse<{
      canBook: boolean;
      remainingAppointments: number;
      subscriptionTier: string;
    }>>('/subscriptions/appointment-limit');
    return response.data!;
  }
}
