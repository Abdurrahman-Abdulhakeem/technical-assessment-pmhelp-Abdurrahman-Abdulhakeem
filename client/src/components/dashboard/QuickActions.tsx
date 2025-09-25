import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Calendar,
  Clock,
  CreditCard,
  FileText,
  Plus,
  Stethoscope,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { usePermissions } from '@/hooks/usePermissions';
import { cn } from '@/utils/cn';

const QuickActions: React.FC = () => {
  const { isPatient, isDoctor, isAdmin } = usePermissions();

  const getQuickActions = () => {
    if (isPatient) {
      return [
        {
          title: 'Book Appointment',
          description: 'Schedule with your doctor',
          icon: <Calendar className="w-5 h-5" />,
          color: 'blue',
          href: '/appointments/book'
        },
        {
          title: 'View Records',
          description: 'Access medical history',
          icon: <FileText className="w-5 h-5" />,
          color: 'green',
          href: '/medical-records'
        },
        {
          title: 'Find Doctors',
          description: 'Browse specialists',
          icon: <Stethoscope className="w-5 h-5" />,
          color: 'purple',
          href: '/doctors'
        },
        {
          title: 'Manage Plan',
          description: 'Upgrade subscription',
          icon: <CreditCard className="w-5 h-5" />,
          color: 'yellow',
          href: '/subscription'
        }
      ];
    }

    if (isDoctor) {
      return [
        {
          title: 'Today\'s Schedule',
          description: 'View appointments',
          icon: <Calendar className="w-5 h-5" />,
          color: 'blue',
          href: '/appointments'
        },
        {
          title: 'Add Record',
          description: 'Create medical note',
          icon: <Plus className="w-5 h-5" />,
          color: 'green',
          href: '/medical-records/new'
        },
        {
          title: 'Patient List',
          description: 'Manage patients',
          icon: <Users className="w-5 h-5" />,
          color: 'purple',
          href: '/patients'
        },
        {
          title: 'Analytics',
          description: 'View practice stats',
          icon: <Activity className="w-5 h-5" />,
          color: 'yellow',
          href: '/analytics'
        }
      ];
    }

    if (isAdmin) {
      return [
        {
          title: 'User Management',
          description: 'Manage all users',
          icon: <Users className="w-5 h-5" />,
          color: 'blue',
          href: '/admin/users'
        },
        {
          title: 'System Analytics',
          description: 'View platform stats',
          icon: <Activity className="w-5 h-5" />,
          color: 'green',
          href: '/admin/analytics'
        },
        {
          title: 'Appointments',
          description: 'Monitor bookings',
          icon: <Calendar className="w-5 h-5" />,
          color: 'purple',
          href: '/admin/appointments'
        },
        {
          title: 'Subscriptions',
          description: 'Manage plans',
          icon: <CreditCard className="w-5 h-5" />,
          color: 'yellow',
          href: '/admin/subscriptions'
        }
      ];
    }

    return [];
  };

  const quickActions = getQuickActions();

  const colors = {
    blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    yellow: 'from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Button
                variant="ghost"
                className={cn(
                  'h-auto p-4 flex flex-col items-center gap-3 w-full',
                  'bg-gradient-to-r text-white shadow-lg',
                  colors[action.color as keyof typeof colors]
                )}
              >
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  {action.icon}
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm">{action.title}</p>
                  <p className="text-xs opacity-90">{action.description}</p>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export { QuickActions }