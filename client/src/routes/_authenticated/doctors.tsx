import { createFileRoute } from '@tanstack/react-router';
import { DoctorsPage } from '@/pages/DoctorsPage';

export const Route = createFileRoute('/_authenticated/doctors')({
  component: DoctorsPage,
});
