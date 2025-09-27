import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { usePermissions } from '@/hooks/usePermissions';
import type { CreateMedicalRecordData } from '@/types';
import { MedicalRecordService } from '@/services/medicalRecordService';

export const useMedicalRecords = () => {
  const queryClient = useQueryClient();
  const { isPatient, isDoctor } = usePermissions();

  const { data: medicalRecords, isLoading } = useQuery({
    queryKey: ['myMedicalRecords'],
    queryFn: MedicalRecordService.getMyMedicalRecords,
    enabled: isPatient, // Only fetch if user is a patient
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const createMedicalRecordMutation = useMutation({
    mutationFn: (recordData: CreateMedicalRecordData) =>
      MedicalRecordService.createMedicalRecord(recordData),
    onSuccess: () => {
      toast.success('Medical record created successfully!');
      queryClient.invalidateQueries({ queryKey: ['myMedicalRecords'] });
      queryClient.invalidateQueries({ queryKey: ['patientRecords'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create medical record.');
    },
  });

  const updateMedicalRecordMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<any> }) =>
      MedicalRecordService.updateMedicalRecord(id, data),
    onSuccess: () => {
      toast.success('Medical record updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['myMedicalRecords'] });
      queryClient.invalidateQueries({ queryKey: ['patientRecords'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update medical record.');
    },
  });

  const deleteMedicalRecordMutation = useMutation({
    mutationFn: (id: string) => MedicalRecordService.deleteMedicalRecord(id),
    onSuccess: () => {
      toast.success('Medical record deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['myMedicalRecords'] });
      queryClient.invalidateQueries({ queryKey: ['patientRecords'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete medical record.');
    },
  });

  return {
    medicalRecords: isPatient ? medicalRecords : [], // Return empty array if not patient
    isLoading: isPatient ? isLoading : false,
    createMedicalRecord: createMedicalRecordMutation,
    updateMedicalRecord: updateMedicalRecordMutation,
    deleteMedicalRecord: deleteMedicalRecordMutation,
  };
};

export const usePatientRecords = (patientId: string) => {
  const { isDoctor, isAdmin } = usePermissions();
  
  return useQuery({
    queryKey: ['patientRecords', patientId],
    queryFn: () => MedicalRecordService.getPatientRecords(patientId),
    enabled: !!patientId && (isDoctor || isAdmin), // Only doctors and admins can view patient records
    staleTime: 5 * 60 * 1000,
  });
};

export const useMedicalRecord = (id: string) => {
  const { isPatient, isDoctor, isAdmin } = usePermissions();
  
  return useQuery({
    queryKey: ['medicalRecord', id],
    queryFn: () => MedicalRecordService.getMedicalRecordById(id),
    enabled: !!id && (isPatient || isDoctor || isAdmin),
  });
};