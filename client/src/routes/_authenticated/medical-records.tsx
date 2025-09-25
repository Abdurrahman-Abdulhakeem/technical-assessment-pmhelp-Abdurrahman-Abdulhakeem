import { createFileRoute } from '@tanstack/react-router';
import { MedicalRecordsPage } from '@/pages/MedicalRecordsPage';

export const Route = createFileRoute('/_authenticated/medical-records')({
  component: MedicalRecordsPage,
});