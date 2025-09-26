import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import type { PaginationParams, User } from '@/types';
import { UserService } from '@/services/userService';

export const useUsers = (params?: PaginationParams & { role?: string }) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => UserService.getAllUsers(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => UserService.getUserById(id),
    enabled: !!id,
  });
};

export const useUserMutations = () => {
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: (data: Partial<User>) => UserService.createUser(data),
    onSuccess: () => {
      toast.success('User created successfully!');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create user.');
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      UserService.updateUser(id, data),
    onSuccess: () => {
      toast.success('User updated successfully!');
      // Invalidate and refetch users queries
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update user.');
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => UserService.deleteUser(id),
    onSuccess: () => {
      toast.success('User deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete user.');
    },
  });

  const deactivateUserMutation = useMutation({
    mutationFn: (id: string) => UserService.deactivateUser(id),
    onSuccess: () => {
      toast.success('User deactivated successfully!');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to deactivate user.');
    },
  });

  const activateUserMutation = useMutation({
    mutationFn: (id: string) => UserService.activateUser(id),
    onSuccess: () => {
      toast.success('User activated successfully!');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to activate user.');
    },
  });

  const updateUserSubscriptionMutation = useMutation({
    mutationFn: ({ id, subscriptionId }: { id: string; subscriptionId: string }) =>
      UserService.updateUserSubscription(id, subscriptionId),
    onSuccess: () => {
      toast.success('User subscription updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update user subscription.');
    },
  });

  return {
    createUser: createUserMutation,
    updateUser: updateUserMutation,
    deleteUser: deleteUserMutation,
    deactivateUser: deactivateUserMutation,
    activateUser: activateUserMutation,
    updateUserSubscription: updateUserSubscriptionMutation,
  };
};