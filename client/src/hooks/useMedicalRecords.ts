import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import type { CreateMedicalRecordData } from '@/types';
import { MedicalRecordService } from '@/services/medicalRecordService';

export const useMedicalRecords = () => {
  const queryClient = useQueryClient();

  const { data: medicalRecords, isLoading } = useQuery({
    queryKey: ['myMedicalRecords'],
    queryFn: MedicalRecordService.getMyMedicalRecords,
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
    onError: () => {
      toast.error('Failed to create medical record.');
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
    onError: () => {
      toast.error('Failed to update medical record.');
    },
  });

  const deleteMedicalRecordMutation = useMutation({
    mutationFn: (id: string) => MedicalRecordService.deleteMedicalRecord(id),
    onSuccess: () => {
      toast.success('Medical record deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['myMedicalRecords'] });
      queryClient.invalidateQueries({ queryKey: ['patientRecords'] });
    },
    onError: () => {
      toast.error('Failed to delete medical record.');
    },
  });

  return {
    medicalRecords,
    isLoading,
    createMedicalRecord: createMedicalRecordMutation,
    updateMedicalRecord: updateMedicalRecordMutation,
    deleteMedicalRecord: deleteMedicalRecordMutation,
  };
};

export const usePatientRecords = (patientId: string) => {
  return useQuery({
    queryKey: ['patientRecords', patientId],
    queryFn: () => MedicalRecordService.getPatientRecords(patientId),
    enabled: !!patientId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useMedicalRecord = (id: string) => {
  return useQuery({
    queryKey: ['medicalRecord', id],
    queryFn: () => MedicalRecordService.getMedicalRecordById(id),
    enabled: !!id,
  });
};
