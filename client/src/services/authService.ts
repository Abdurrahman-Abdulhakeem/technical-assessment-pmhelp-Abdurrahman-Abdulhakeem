import { apiService } from './api';
import type { 
  ApiResponse, 
  AuthResponse, 
  LoginCredentials, 
  RegisterData, 
  User 
} from '@/types';

export class AuthService {
  private static readonly USER_STORAGE_KEY = 'user_data';

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);
    
    if (response.data?.token) {
      apiService.setAuth(response.data.token);
      this.setUser(response.data.user);
    }
    
    return response;
  }

  static async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/register', userData);
    
    if (response.data?.token) {
      apiService.setAuth(response.data.token);
      this.setUser(response.data.user);
    }
    
    return response;
  }

  static async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      apiService.logout();
      this.clearUser();
    }
  }

  static async getCurrentUser(): Promise<User> {
    const response = await apiService.get<ApiResponse<User>>('/auth/me');
    
    if (response.data) {
      this.setUser(response.data);
      return response.data;
    }
    
    throw new Error('Failed to get current user');
  }

  static getStoredUser(): User | null {
    try {
      const userData = localStorage.getItem(this.USER_STORAGE_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  static setUser(user: User): void {
    localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(user));
  }

  static clearUser(): void {
    localStorage.removeItem(this.USER_STORAGE_KEY);
  }

  static isAuthenticated(): boolean {
    return apiService.isAuthenticated();
  }

  static getUserRole(): string | null {
    const user = this.getStoredUser();
    return user?.role || null;
  }

  static async updateProfile(
  data: Partial<RegisterData>
): Promise<User> {
  const response = await apiService.patch<ApiResponse<User>>('/auth/me', data);

  if (response.data) {
    this.setUser(response.data); // keep localStorage in sync
    return response.data;
  }

  throw new Error('Failed to update profile');
}
}
