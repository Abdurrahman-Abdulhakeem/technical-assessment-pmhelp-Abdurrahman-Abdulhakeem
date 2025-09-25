import axios from 'axios';
import { toast } from 'react-hot-toast';
import type {AxiosError, AxiosInstance, AxiosRequestConfig} from 'axios';

export interface ApiError {
  success: false;
  message: string;
  data?: any;
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
      timeout: 30000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        this.handleApiError(error);
        return Promise.reject(error);
      }
    );
  }

  private handleApiError(error: AxiosError<ApiError>) {
    const { response } = error;

    if (!response) {
      toast.error('Network error. Please check your connection.');
      return;
    }

    const { status, data } = response;

    switch (status) {
      case 401:
        this.clearAuth();
        if (!window.location.pathname.includes('/login')) {
          toast.error('Session expired. Please log in again.');
          window.location.href = '/login';
        }
        break;
      case 403:
        toast.error(data?.message || 'Access denied');
        break;
      case 404:
        toast.error(data?.message || 'Resource not found');
        break;
      case 422:
        toast.error(data?.message || 'Validation error');
        break;
      case 429:
        toast.error('Too many requests. Please try again later.');
        break;
      case 500:
      default:
        toast.error(data?.message || 'An unexpected error occurred');
        break;
    }
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  private clearAuth(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig) {
    const response = await this.api.get<T>(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.api.post<T>(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.api.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig) {
    const response = await this.api.delete<T>(url, config);
    return response.data;
  }

  setAuth(token: string) {
    this.setAuthToken(token);
  }

  logout() {
    this.clearAuth();
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

export const apiService = new ApiService();
