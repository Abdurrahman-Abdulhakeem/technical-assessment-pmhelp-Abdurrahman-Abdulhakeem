import { createFileRoute } from '@tanstack/react-router';
import { AnalyticsPage } from '@/pages/AnalyticsPage';

export const Route = createFileRoute('/_authenticated/admin/analytics')({
  component: AnalyticsPage,
});
