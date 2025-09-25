import { apiService } from './api';
import type { 
  ApiResponse, 
  CreateMedicalRecordData, 
  MedicalRecord 
} from '@/types';

export class MedicalRecordService {
  static async createMedicalRecord(recordData: CreateMedicalRecordData): Promise<MedicalRecord> {
    const response = await apiService.post<ApiResponse<MedicalRecord>>('/medical-records', recordData);
    return response.data!;
  }

  static async getMyMedicalRecords(): Promise<Array<MedicalRecord>> {
    const response = await apiService.get<ApiResponse<Array<MedicalRecord>>>('/medical-records/my');
    return response.data!;
  }

  static async getPatientRecords(patientId: string): Promise<Array<MedicalRecord>> {
    const response = await apiService.get<ApiResponse<Array<MedicalRecord>>>(`/medical-records/patient/${patientId}`);
    return response.data!;
  }

  static async getMedicalRecordById(id: string): Promise<MedicalRecord> {
    const response = await apiService.get<ApiResponse<MedicalRecord>>(`/medical-records/${id}`);
    return response.data!;
  }

  static async updateMedicalRecord(id: string, updateData: Partial<MedicalRecord>): Promise<MedicalRecord> {
    const response = await apiService.patch<ApiResponse<MedicalRecord>>(`/medical-records/${id}`, updateData);
    return response.data!;
  }

  static async deleteMedicalRecord(id: string): Promise<void> {
    await apiService.delete(`/medical-records/${id}`);
  }
}
