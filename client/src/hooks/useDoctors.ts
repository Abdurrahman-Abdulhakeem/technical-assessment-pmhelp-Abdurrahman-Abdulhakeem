import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import type { DoctorProfile, PaginationParams } from '@/types';
import { DoctorService } from '@/services/doctorService';

export const useDoctors = (params?: PaginationParams & { specialization?: string }) => {
  return useQuery({
    queryKey: ['doctors', params],
    queryFn: () => DoctorService.getAllDoctors(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDoctorProfile = (id?: string) => {
  return useQuery({
    queryKey: ['doctorProfile', id],
    queryFn: () => id ? DoctorService.getDoctorProfile(id) : DoctorService.getMyProfile(),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useDoctorAvailability = (id: string, date?: string) => {
  return useQuery({
    queryKey: ['doctorAvailability', id, date],
    queryFn: () => DoctorService.getDoctorAvailability(id, date),
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useDoctorMutations = () => {
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: (profileData: Partial<DoctorProfile>) =>
      DoctorService.updateDoctorProfile(profileData),
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['doctorProfile'] });
    },
    onError: () => {
      toast.error('Failed to update profile.');
    },
  });

  const updateAvailabilityMutation = useMutation({
    mutationFn: (availability: DoctorProfile['profile']['availability']) =>
      DoctorService.updateAvailability(availability),
    onSuccess: () => {
      toast.success('Availability updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['doctorProfile'] });
      queryClient.invalidateQueries({ queryKey: ['doctorAvailability'] });
    },
    onError: () => {
      toast.error('Failed to update availability.');
    },
  });

  return {
    updateProfile: updateProfileMutation,
    updateAvailability: updateAvailabilityMutation,
  };
};
