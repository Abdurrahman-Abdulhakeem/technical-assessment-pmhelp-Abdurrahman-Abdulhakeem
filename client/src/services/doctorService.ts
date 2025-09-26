import { apiService } from './api';
import type { 
  ApiResponse, 
  DoctorProfile, 
  PaginationParams 
} from '@/types';

export class DoctorService {
  static async getDoctorProfile(id: string): Promise<DoctorProfile> {
    const response = await apiService.get<ApiResponse<DoctorProfile>>(`/doctors/${id}/profile`);
    return response.data!;
  }

  static async getMyProfile(): Promise<DoctorProfile> {
    const response = await apiService.get<ApiResponse<DoctorProfile>>('/doctors/profile/me');
    return response.data!;
  }

  static async updateDoctorProfile(profileData: Partial<DoctorProfile>): Promise<DoctorProfile> {
    const response = await apiService.patch<ApiResponse<DoctorProfile>>('/doctors/profile', profileData);
    return response.data!;
  }

  static async updateAvailability(availability: DoctorProfile['profile']['availability']): Promise<DoctorProfile> {
    const response = await apiService.patch<ApiResponse<DoctorProfile>>('/doctors/availability', { availability });
    return response.data!;
  }

  static async getDoctorAvailability(id: string, date?: string): Promise<{
    date?: Date;
    availability: DoctorProfile['profile']['availability'];
    timeSlots?: Array<{
      time: string;
      available: boolean;
    }>;
  }> {
    const params = date ? `?date=${date}` : '';
    const response = await apiService.get<ApiResponse<{
      date?: Date;
      availability: DoctorProfile['profile']['availability'];
      timeSlots?: Array<{
        time: string;
        available: boolean;
      }>;
    }>>(`/doctors/${id}/availability${params}`);
    return response.data!;
  }

  static async getAllDoctors(params?: PaginationParams & { specialization?: string }) {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.specialization) queryParams.append('specialization', params.specialization);
    if (params?.search) queryParams.append('search', params.search);

    const response = await apiService.get<ApiResponse<Array<DoctorProfile>>>(`/users/doctors?${queryParams}`);
    return {
      doctors: response.data!,
      pagination: response.meta?.pagination
    };
  }
}
