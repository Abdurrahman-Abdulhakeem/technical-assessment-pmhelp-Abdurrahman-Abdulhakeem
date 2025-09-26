import { createFileRoute } from '@tanstack/react-router';
import { BookAppointmentPage } from '@/pages/BookAppointmentPage';

export const Route = createFileRoute('/_authenticated/new-appointments/book')({
  component: BookAppointmentPage,
});