import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { usePermissions } from '@/hooks/usePermissions';
import { SubscriptionService } from '@/services/subscriptionService';

export const useSubscriptions = () => {
  const queryClient = useQueryClient();
  const { isPatient, isAdmin } = usePermissions();

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: SubscriptionService.getAllSubscriptions,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const { data: currentSubscription, isLoading: isLoadingCurrent } = useQuery({
    queryKey: ['currentSubscription'],
    queryFn: SubscriptionService.getCurrentSubscription,
    enabled: isPatient, // Only patients have subscriptions
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: appointmentLimit, isLoading: isLoadingLimit } = useQuery({
    queryKey: ['appointmentLimit'],
    queryFn: SubscriptionService.checkAppointmentLimit,
    enabled: isPatient, // Only patients have appointment limits
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  const upgradeSubscriptionMutation = useMutation({
    mutationFn: (subscriptionId: string) => 
      SubscriptionService.upgradeSubscription(subscriptionId),
    onSuccess: () => {
      toast.success('Subscription upgraded successfully!');
      queryClient.invalidateQueries({ queryKey: ['currentSubscription'] });
      queryClient.invalidateQueries({ queryKey: ['appointmentLimit'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to upgrade subscription.');
    },
  });

  return {
    subscriptions,
    currentSubscription: isPatient ? currentSubscription : null,
    appointmentLimit: isPatient ? appointmentLimit : null,
    isLoading: isLoading || (isPatient ? (isLoadingCurrent || isLoadingLimit) : false),
    upgradeSubscription: upgradeSubscriptionMutation,
  };
};
