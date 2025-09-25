import { createFileRoute } from '@tanstack/react-router';
import { CreditCard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

const AdminSubscriptionsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Subscription Management</h1>
        <p className="text-slate-600 mt-1">Manage plans, pricing, and user subscriptions</p>
      </div>

      <Card>
        <CardContent className="p-12">
          <div className="text-center">
            <CreditCard className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Subscription Control Panel
            </h3>
            <p className="text-slate-600 mb-4">
              This would be a comprehensive subscription management system with:
            </p>
            <div className="text-left space-y-2 max-w-md mx-auto">
              <p className="text-sm text-slate-600">• Plan creation and modification</p>
              <p className="text-sm text-slate-600">• User subscription overview</p>
              <p className="text-sm text-slate-600">• Revenue analytics and forecasting</p>
              <p className="text-sm text-slate-600">• Billing and payment management</p>
              <p className="text-sm text-slate-600">• Discount and promotion tools</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const Route = createFileRoute('/_authenticated/admin/subscriptions')({
  component: AdminSubscriptionsPage,
});
