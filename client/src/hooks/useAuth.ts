import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'react-hot-toast';
import type { LoginCredentials, RegisterData} from '@/types';
import { AuthService } from '@/services/authService';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => AuthService.login(credentials),
    onSuccess: (data) => {
      toast.success('Welcome back!');
      queryClient.setQueryData(['currentUser'], data.data.user);
      navigate({ to: '/dashboard' });
    },
    onError: () => {
      toast.error('Invalid credentials. Please try again.');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterData) => AuthService.register(userData),
    onSuccess: (data) => {
      toast.success('Account created successfully!');
      queryClient.setQueryData(['currentUser'], data.data.user);
      navigate({ to: '/dashboard' });
    },
    onError: () => {
      toast.error('Registration failed. Please try again.');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      queryClient.clear();
      toast.success('Logged out successfully');
      navigate({ to: '/login' });
    },
    
  });

  const updateProfileMutation = useMutation({
  mutationFn: (data: Partial<RegisterData>) => AuthService.updateProfile(data),
  onSuccess: (data) => {
    toast.success('Profile updated successfully!');
    queryClient.setQueryData(['currentUser'], data);
  },
  onError: () => {
    toast.error('Failed to update profile.');
  },
});

  return {
    login: loginMutation,
    register: registerMutation,
    logout: logoutMutation,
    updateProfile: updateProfileMutation,
    isAuthenticated: AuthService.isAuthenticated(),
    userRole: AuthService.getUserRole(),
  };
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: AuthService.getCurrentUser,
    enabled: AuthService.isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
    initialData: AuthService.getStoredUser() || undefined,
  });
};