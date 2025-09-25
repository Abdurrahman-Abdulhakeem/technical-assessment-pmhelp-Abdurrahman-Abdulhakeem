import { apiService } from './api';
import type { 
  ApiResponse, 
  PaginationParams, 
  User 
} from '@/types';

export class UserService {
  static async getAllUsers(params?: PaginationParams & { role?: string }) {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.role) queryParams.append('role', params.role);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sort) queryParams.append('sort', params.sort);

    const response = await apiService.get<ApiResponse<Array<User>>>(`/users?${queryParams}`);
    return {
      users: response.data!,
      pagination: response.meta?.pagination
    };
  }

  static async getUserById(id: string): Promise<User> {
    const response = await apiService.get<ApiResponse<User>>(`/users/${id}`);
    return response.data!;
  }

  static async updateUser(id: string, updateData: Partial<User>): Promise<User> {
    const response = await apiService.patch<ApiResponse<User>>(`/users/${id}`, updateData);
    return response.data!;
  }

  static async deleteUser(id: string): Promise<void> {
    await apiService.delete(`/users/${id}`);
  }

  static async deactivateUser(id: string): Promise<User> {
    const response = await apiService.patch<ApiResponse<User>>(`/users/${id}/deactivate`);
    return response.data!;
  }

  static async activateUser(id: string): Promise<User> {
    const response = await apiService.patch<ApiResponse<User>>(`/users/${id}/activate`);
    return response.data!;
  }

  static async updateUserSubscription(id: string, subscriptionId: string) {
    const response = await apiService.post<ApiResponse>(`/users/${id}/subscription`, { subscriptionId });
    return response.data!;
  }
}