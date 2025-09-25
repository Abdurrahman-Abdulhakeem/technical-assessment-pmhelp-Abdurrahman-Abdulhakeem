import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ApiResponse, User } from '@/types';
import { apiService } from '@/services/api';

interface UseUsersParams {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}

export const useUsers = (params: UseUsersParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const res = await apiService.get<ApiResponse<{ users: Array<User>; pagination: any }>>(
        '/users',
        { params }
      );
      return res.data;
    },
  });
};

export const useUserMutations = () => {
  const queryClient = useQueryClient();

  const updateUser = useMutation({
    mutationFn: (data: Partial<User> & { id: string }) =>
      apiService.patch<ApiResponse<User>>(`/admin/users/${data.id}`, data),
    onSuccess: () => {
      toast.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => toast.error('Failed to update user'),
  });

  const deleteUser = useMutation({
    mutationFn: (id: string) => apiService.delete(`/admin/users/${id}`),
    onSuccess: () => {
      toast.success('User deleted');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => toast.error('Failed to delete user'),
  });

  const deactivateUser = useMutation({
    mutationFn: (id: string) => apiService.post(`/admin/users/${id}/deactivate`),
    onSuccess: () => {
      toast.success('User deactivated');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => toast.error('Failed to deactivate user'),
  });

  const activateUser = useMutation({
    mutationFn: (id: string) => apiService.post(`/admin/users/${id}/activate`),
    onSuccess: () => {
      toast.success('User activated');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => toast.error('Failed to activate user'),
  });

  return { updateUser, deleteUser, deactivateUser, activateUser };
};