import { createFileRoute } from '@tanstack/react-router';
import { AppointmentsPage } from '@/pages/AppointmentsPage';

export const Route = createFileRoute('/_authenticated/appointments')({
  component: AppointmentsPage,
});