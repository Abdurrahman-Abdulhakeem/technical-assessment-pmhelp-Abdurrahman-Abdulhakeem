import { useQuery } from '@tanstack/react-query';
import { AnalyticsService } from '@/services/analyticsService';

export const usePracticeAnalytics = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['practiceAnalytics', startDate, endDate],
    queryFn: () => AnalyticsService.getDoctorPracticeAnalytics(startDate, endDate),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSystemAnalytics = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['systemAnalytics', startDate, endDate],
    queryFn: () => AnalyticsService.getSystemAnalytics(startDate, endDate),
    staleTime: 5 * 60 * 1000,
  });
};

export const usePatientAnalytics = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['patientAnalytics', startDate, endDate],
    queryFn: () => AnalyticsService.getPatientAnalytics(startDate, endDate),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAppointmentAnalytics = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['appointmentAnalytics', startDate, endDate],
    queryFn: () => AnalyticsService.getAppointmentAnalytics(startDate, endDate),
    staleTime: 5 * 60 * 1000,
  });
};

export const useSubscriptionAnalytics = () => {
  return useQuery({
    queryKey: ['subscriptionAnalytics'],
    queryFn: AnalyticsService.getSubscriptionAnalytics,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
