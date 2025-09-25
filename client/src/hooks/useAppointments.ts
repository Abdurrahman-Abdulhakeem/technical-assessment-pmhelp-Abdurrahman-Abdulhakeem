import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import type { AppointmentStatus, BookAppointmentData } from '@/types';
import { AppointmentService } from '@/services/appointmentService';

export const useAppointments = () => {
  const queryClient = useQueryClient();

  const { data: appointments, isLoading, error } = useQuery({
    queryKey: ['myAppointments'],
    queryFn: AppointmentService.getMyAppointments,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const bookAppointmentMutation = useMutation({
    mutationFn: (appointmentData: BookAppointmentData) => 
      AppointmentService.bookAppointment(appointmentData),
    onSuccess: () => {
      toast.success('Appointment booked successfully!');
      queryClient.invalidateQueries({ queryKey: ['myAppointments'] });
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
    onError: () => {
      toast.error('Failed to book appointment. Please try again.');
    },
  });

  const cancelAppointmentMutation = useMutation({
    mutationFn: (appointmentId: string) => 
      AppointmentService.cancelAppointment(appointmentId),
    onSuccess: () => {
      toast.success('Appointment cancelled successfully!');
      queryClient.invalidateQueries({ queryKey: ['myAppointments'] });
    },
    onError: () => {
      toast.error('Failed to cancel appointment.');
    },
  });

  const updateAppointmentStatusMutation = useMutation({
    mutationFn: ({ id, status, notes }: { 
      id: string; 
      status: AppointmentStatus; 
      notes?: string;
    }) => AppointmentService.updateAppointmentStatus(id, status, notes),
    onSuccess: () => {
      toast.success('Appointment status updated!');
      queryClient.invalidateQueries({ queryKey: ['myAppointments'] });
    },
    onError: () => {
      toast.error('Failed to update appointment status.');
    },
  });

  return {
    appointments,
    isLoading,
    error,
    bookAppointment: bookAppointmentMutation,
    cancelAppointment: cancelAppointmentMutation,
    updateAppointmentStatus: updateAppointmentStatusMutation,
  };
};

export const useAppointment = (id: string) => {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: () => AppointmentService.getAppointmentById(id),
    enabled: !!id,
  });
};

export const useDoctorAppointments = (doctorId: string) => {
  return useQuery({
    queryKey: ['doctorAppointments', doctorId],
    queryFn: () => AppointmentService.getDoctorAppointments(doctorId),
    enabled: !!doctorId,
    staleTime: 2 * 60 * 1000,
  });
};