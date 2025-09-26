import React, { type ReactNode } from 'react';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { MainLayout } from '@/components/layout/MainLayout';
import { AuthService } from '@/services/authService';

type Props = {
  children?: ReactNode;
};

const AuthenticatedLayout = ({ children }: Props) => {
  return (
    <MainLayout>
      {children ?? <Outlet />}
    </MainLayout>
  );
};

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
  beforeLoad: () => {
    if (!AuthService.isAuthenticated()) {
      throw redirect({
        to: '/login',
      });
    }
  },
});
