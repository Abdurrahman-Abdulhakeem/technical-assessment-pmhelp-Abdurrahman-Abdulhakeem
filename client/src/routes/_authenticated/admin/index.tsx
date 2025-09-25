import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { AuthService } from '@/services/authService';

export const Route = createFileRoute('/_authenticated/admin/')({
  component: () => <Outlet />,
  beforeLoad: () => {
    const userRole = AuthService.getUserRole();
    if (userRole !== 'admin') {
      throw redirect({
        to: '/dashboard',
      });
    }
  },
});