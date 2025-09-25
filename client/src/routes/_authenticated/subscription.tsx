import { createFileRoute } from '@tanstack/react-router';
import { SubscriptionPage } from '@/pages/SubscriptionPage';

export const Route = createFileRoute('/_authenticated/subscription')({
  component: SubscriptionPage,
});