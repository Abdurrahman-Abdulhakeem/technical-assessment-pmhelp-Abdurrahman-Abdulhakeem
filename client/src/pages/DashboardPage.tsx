import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Calendar,
  Clock,
  FileText,
  Heart,
  Shield,
  TrendingUp,
  Users
} from 'lucide-react';
import { useCurrentUser } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/utils/cn';

const DashboardPage: React.FC = () => {
  const { data: user } = useCurrentUser();
  const { isPatient, isDoctor, isAdmin } = usePermissions();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getRoleColor = () => {
    if (isAdmin) return 'danger';
    if (isDoctor) return 'success';
    if (isPatient) return 'info';
    return 'info';
  };

  const getStatsForRole = () => {
    // These would be fetched from actual APIs
    if (isPatient) {
      return [
        {
          title: 'Upcoming Appointments',
          value: '2',
          icon: <Calendar className="w-6 h-6" />,
          color: 'blue' as const,
          trend: { value: 0, isPositive: true }
        },
        {
          title: 'Medical Records',
          value: '8',
          icon: <FileText className="w-6 h-6" />,
          color: 'green' as const,
          trend: { value: 12.5, isPositive: true }
        },
        {
          title: 'Health Score',
          value: '85%',
          icon: <Heart className="w-6 h-6" />,
          color: 'red' as const,
          trend: { value: 5, isPositive: true }
        },
        {
          title: 'Days Active',
          value: '24',
          icon: <Activity className="w-6 h-6" />,
          color: 'purple' as const,
          trend: { value: 8, isPositive: true }
        }
      ];
    }

    if (isDoctor) {
      return [
        {
          title: "Today's Appointments",
          value: '6',
          icon: <Calendar className="w-6 h-6" />,
          color: 'blue' as const,
          trend: { value: 15, isPositive: true }
        },
        {
          title: 'Total Patients',
          value: '142',
          icon: <Users className="w-6 h-6" />,
          color: 'green' as const,
          trend: { value: 8, isPositive: true }
        },
        {
          title: 'Hours This Week',
          value: '38',
          icon: <Clock className="w-6 h-6" />,
          color: 'purple' as const,
          trend: { value: 3, isPositive: true }
        },
        {
          title: 'Patient Rating',
          value: '4.8',
          icon: <TrendingUp className="w-6 h-6" />,
          color: 'yellow' as const,
          trend: { value: 2, isPositive: true }
        }
      ];
    }

    if (isAdmin) {
      return [
        {
          title: 'Total Users',
          value: '1,248',
          icon: <Users className="w-6 h-6" />,
          color: 'blue' as const,
          trend: { value: 12, isPositive: true }
        },
        {
          title: 'Active Sessions',
          value: '324',
          icon: <Activity className="w-6 h-6" />,
          color: 'green' as const,
          trend: { value: 18, isPositive: true }
        },
        {
          title: 'System Health',
          value: '99.9%',
          icon: <Shield className="w-6 h-6" />,
          color: 'green' as const,
          trend: { value: 0.1, isPositive: true }
        },
        {
          title: 'Revenue',
          value: '$24,567',
          icon: <TrendingUp className="w-6 h-6" />,
          color: 'purple' as const,
          trend: { value: 23, isPositive: true }
        }
      ];
    }

    return [];
  };

  const stats = getStatsForRole();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-3xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {getGreeting()}, {user?.firstName}!
            </h1>
            <p className="text-blue-100 text-lg mb-4">
              {formatDate(new Date())} • {isPatient ? 'Take control of your health journey' : isDoctor ? 'Ready to help your patients' : 'Manage your platform'}
            </p>
            <div className="flex items-center gap-3">
              <Badge variant={getRoleColor()}>
                {user?.role?.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="border-white/30 text-white">
                {user?.isEmailVerified ? 'Verified' : 'Unverified'}
              </Badge>
            </div>
          </div>
          
          <div className="mt-6 md:mt-0">
            <div className="w-32 h-32 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center">
                <Activity className="w-10 h-10 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions - Takes up 1 column */}
        <div className="lg:col-span-1">
          <QuickActions />
        </div>

        {/* Recent Activity - Takes up 2 columns */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>

      {/* Additional Cards for specific roles */}
      {isPatient && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Health Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                  <span className="font-medium text-green-900">Blood Pressure</span>
                  <span className="text-green-600">Normal</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                  <span className="font-medium text-blue-900">Heart Rate</span>
                  <span className="text-blue-600">72 BPM</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-xl">
                  <span className="font-medium text-yellow-900">BMI</span>
                  <span className="text-yellow-600">22.5</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Next Appointment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Dr. Sarah Johnson
                </h3>
                <p className="text-slate-600 text-sm mb-2">Dermatology Consultation</p>
                <p className="text-blue-600 font-medium">Tomorrow, 2:00 PM</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {isDoctor && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: '09:00', patient: 'John Smith', type: 'Consultation' },
                { time: '10:30', patient: 'Mary Johnson', type: 'Follow-up' },
                { time: '14:00', patient: 'Robert Davis', type: 'Check-up' },
                { time: '15:30', patient: 'Lisa Wilson', type: 'Consultation' },
              ].map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-slate-900">{appointment.patient}</p>
                      <p className="text-sm text-slate-600">{appointment.type}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-blue-600">{appointment.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export { DashboardPage };