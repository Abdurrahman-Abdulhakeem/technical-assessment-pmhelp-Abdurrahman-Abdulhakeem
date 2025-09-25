import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    // Always redirect to login for the root route
    throw redirect({
      to: '/login',
    });
  },
});
