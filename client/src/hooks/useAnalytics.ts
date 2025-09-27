import { useQuery } from '@tanstack/react-query';
import { usePermissions } from '@/hooks/usePermissions';
import { AnalyticsService } from '@/services/analyticsService';

export const usePracticeAnalytics = (startDate?: string, endDate?: string) => {
  const { isDoctor } = usePermissions();
  
  return useQuery({
    queryKey: ['practiceAnalytics', startDate, endDate],
    queryFn: () => AnalyticsService.getDoctorPracticeAnalytics(startDate, endDate),
    enabled: isDoctor, // Only doctors can access practice analytics
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSystemAnalytics = (startDate?: string, endDate?: string) => {
  const { isAdmin } = usePermissions();
  
  return useQuery({
    queryKey: ['systemAnalytics', startDate, endDate],
    queryFn: () => AnalyticsService.getSystemAnalytics(startDate, endDate),
    enabled: isAdmin, // Only admins can access system analytics
    staleTime: 5 * 60 * 1000,
  });
};

export const usePatientAnalytics = (startDate?: string, endDate?: string) => {
  const { isPatient } = usePermissions();
  
  return useQuery({
    queryKey: ['patientAnalytics', startDate, endDate],
    queryFn: () => AnalyticsService.getPatientAnalytics(startDate, endDate),
    enabled: isPatient, // Only patients can access their own analytics
    staleTime: 5 * 60 * 1000,
  });
};

export const useAppointmentAnalytics = (startDate?: string, endDate?: string) => {
  const { isAdmin } = usePermissions();
  
  return useQuery({
    queryKey: ['appointmentAnalytics', startDate, endDate],
    queryFn: () => AnalyticsService.getAppointmentAnalytics(startDate, endDate),
    enabled: isAdmin, // Only admins can access appointment analytics
    staleTime: 5 * 60 * 1000,
  });
};

export const useSubscriptionAnalytics = () => {
  const { isAdmin } = usePermissions();
  
  return useQuery({
    queryKey: ['subscriptionAnalytics'],
    queryFn: AnalyticsService.getSubscriptionAnalytics,
    enabled: isAdmin, // Only admins can access subscription analytics
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};