import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDateTime } from '@/utils/cn';
import { useAppointments } from '@/hooks/useAppointments';
import { usePermissions } from '@/hooks/usePermissions';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';

const RecentActivity: React.FC = () => {
  const { appointments, isLoading } = useAppointments();
  const { isPatient } = usePermissions();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'scheduled':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'danger';
      case 'scheduled':
        return 'info';
      case 'confirmed':
        return 'success';
      default:
        return 'warning';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Loading size="md" text="Loading activities..." />
        </CardContent>
      </Card>
    );
  }

  const recentAppointments = appointments?.slice(0, 5) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentAppointments.length === 0 ? (
          <EmptyState
            icon={<Calendar className="w-6 h-6 text-slate-400" />}
            title="No recent activity"
            description="Your recent appointments will appear here"
          />
        ) : (
          <div className="space-y-4">
            {recentAppointments.map((appointment, index) => (
              <motion.div
                key={appointment._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex-shrink-0">
                  {getStatusIcon(appointment.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {isPatient
                          ? `Dr. ${appointment.doctor?.firstName} ${appointment.doctor?.lastName}`
                          : `${appointment.patient?.firstName} ${appointment.patient?.lastName}`
                        }
                      </h4>
                      <p className="text-sm text-slate-600 mt-1">
                        {appointment.reason}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {formatDateTime(appointment.appointmentDate)}
                      </p>
                    </div>
                    
                    <Badge
                      variant={getStatusVariant(appointment.status)}
                      size="sm"
                    >
                      {appointment.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { RecentActivity };