// src/hooks/useSubscriptions.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { SubscriptionService } from '@/services/subscriptionService';

export const useSubscriptions = () => {
  const queryClient = useQueryClient();

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: SubscriptionService.getAllSubscriptions,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const { data: currentSubscription, isLoading: isLoadingCurrent } = useQuery({
    queryKey: ['currentSubscription'],
    queryFn: SubscriptionService.getCurrentSubscription,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: appointmentLimit, isLoading: isLoadingLimit } = useQuery({
    queryKey: ['appointmentLimit'],
    queryFn: SubscriptionService.checkAppointmentLimit,
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
    onError: () => {
      toast.error('Failed to upgrade subscription.');
    },
  });

  return {
    subscriptions,
    currentSubscription,
    appointmentLimit,
    isLoading: isLoading || isLoadingCurrent || isLoadingLimit,
    upgradeSubscription: upgradeSubscriptionMutation,
  };
};