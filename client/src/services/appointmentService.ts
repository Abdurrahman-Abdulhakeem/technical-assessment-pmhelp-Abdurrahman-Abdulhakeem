import { apiService } from './api';
import type { 
  ApiResponse, 
  Appointment, 
  AppointmentStatus, 
  BookAppointmentData 
} from '@/types';

export class AppointmentService {
  static async bookAppointment(appointmentData: BookAppointmentData): Promise<Appointment> {
    const response = await apiService.post<ApiResponse<Appointment>>('/appointments', appointmentData);
    return response.data!;
  }

  static async getMyAppointments(): Promise<Array<Appointment>> {
    const response = await apiService.get<ApiResponse<Array<Appointment>>>('/appointments/my');
    return response.data!;
  }

  static async getAppointmentById(id: string): Promise<Appointment> {
    const response = await apiService.get<ApiResponse<Appointment>>(`/appointments/${id}`);
    return response.data!;
  }

  static async updateAppointmentStatus(
    id: string, 
    status: AppointmentStatus, 
    notes?: string
  ): Promise<Appointment> {
    const response = await apiService.patch<ApiResponse<Appointment>>(
      `/appointments/${id}/status`,
      { status, notes }
    );
    return response.data!;
  }

  static async cancelAppointment(id: string): Promise<Appointment> {
    const response = await apiService.patch<ApiResponse<Appointment>>(`/appointments/${id}/cancel`);
    return response.data!;
  }

  static async getDoctorAppointments(doctorId: string): Promise<Array<Appointment>> {
    const response = await apiService.get<ApiResponse<Array<Appointment>>>(`/appointments/doctor/${doctorId}`);
    return response.data!;
  }
}
