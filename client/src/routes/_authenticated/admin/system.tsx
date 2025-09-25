import { createFileRoute } from '@tanstack/react-router';
import { Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

const AdminSystemPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">System Management</h1>
        <p className="text-slate-600 mt-1">Configure system settings and monitor platform health</p>
      </div>

      <Card>
        <CardContent className="p-12">
          <div className="text-center">
            <Settings className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              System Control Panel
            </h3>
            <p className="text-slate-600 mb-4">
              This would be a comprehensive system management interface with:
            </p>
            <div className="text-left space-y-2 max-w-md mx-auto">
              <p className="text-sm text-slate-600">• System health monitoring</p>
              <p className="text-sm text-slate-600">• Configuration management</p>
              <p className="text-sm text-slate-600">• Database administration</p>
              <p className="text-sm text-slate-600">• Backup and recovery tools</p>
              <p className="text-sm text-slate-600">• Security and audit logs</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const Route = createFileRoute('/_authenticated/admin/system')({
  component: AdminSystemPage,
});
