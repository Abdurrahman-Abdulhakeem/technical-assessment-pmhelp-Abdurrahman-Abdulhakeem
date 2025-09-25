import { createFileRoute } from '@tanstack/react-router';
import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const PatientsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Patients</h1>
        <p className="text-slate-600 mt-1">Manage your patient roster and medical histories</p>
      </div>

      <Card>
        <CardContent className="p-12">
          <div className="text-center">
            <Users className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Patient Management System
            </h3>
            <p className="text-slate-600 mb-4">
              This would be a comprehensive patient management interface with:
            </p>
            <div className="text-left space-y-2 max-w-md mx-auto">
              <p className="text-sm text-slate-600">• Patient roster with search and filters</p>
              <p className="text-sm text-slate-600">• Medical history timeline</p>
              <p className="text-sm text-slate-600">• Appointment scheduling</p>
              <p className="text-sm text-slate-600">• Communication tools</p>
              <p className="text-sm text-slate-600">• Treatment planning</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const Route = createFileRoute('/_authenticated/patients')({
  component: PatientsPage,
});