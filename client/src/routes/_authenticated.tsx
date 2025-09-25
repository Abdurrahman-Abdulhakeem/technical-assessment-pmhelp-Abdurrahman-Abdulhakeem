import React from 'react';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { MainLayout } from '@/components/layout/MainLayout';
import { AuthService } from '@/services/authService';

const AuthenticatedLayout = () => {
  return (
    <MainLayout>
      <Outlet />
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