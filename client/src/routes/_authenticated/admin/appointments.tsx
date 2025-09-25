import { createFileRoute } from '@tanstack/react-router';
import { Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

const AdminAppointmentsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Appointment Management</h1>
        <p className="text-slate-600 mt-1">Monitor and manage all platform appointments</p>
      </div>

      <Card>
        <CardContent className="p-12">
          <div className="text-center">
            <Calendar className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Admin Appointment Dashboard
            </h3>
            <p className="text-slate-600 mb-4">
              This would be a comprehensive appointment management system with:
            </p>
            <div className="text-left space-y-2 max-w-md mx-auto">
              <p className="text-sm text-slate-600">• Real-time appointment monitoring</p>
              <p className="text-sm text-slate-600">• System-wide calendar view</p>
              <p className="text-sm text-slate-600">• Appointment conflicts resolution</p>
              <p className="text-sm text-slate-600">• Bulk operations and management</p>
              <p className="text-sm text-slate-600">• Revenue and utilization metrics</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const Route = createFileRoute('/_authenticated/admin/appointments')({
  component: AdminAppointmentsPage,
});
