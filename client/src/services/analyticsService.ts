import { apiService } from './api';
import type { 
  ApiResponse, 
  PatientAnalytics, 
  PracticeAnalytics,
  SystemAnalytics 
} from '@/types';

export class AnalyticsService {
  static async getDoctorPracticeAnalytics(startDate?: string, endDate?: string): Promise<PracticeAnalytics> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await apiService.get<ApiResponse<PracticeAnalytics>>(`/analytics/practice?${params}`);
    return response.data!;
  }

  static async getSystemAnalytics(startDate?: string, endDate?: string): Promise<SystemAnalytics> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await apiService.get<ApiResponse<SystemAnalytics>>(`/analytics/system?${params}`);
    return response.data!;
  }

  static async getPatientAnalytics(startDate?: string, endDate?: string): Promise<PatientAnalytics> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await apiService.get<ApiResponse<PatientAnalytics>>(`/analytics/patient?${params}`);
    return response.data!;
  }

  static async getAppointmentAnalytics(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await apiService.get<ApiResponse>(`/analytics/appointments?${params}`);
    return response.data!;
  }

  static async getSubscriptionAnalytics() {
    const response = await apiService.get<ApiResponse>('/analytics/subscriptions');
    return response.data!;
  }
}