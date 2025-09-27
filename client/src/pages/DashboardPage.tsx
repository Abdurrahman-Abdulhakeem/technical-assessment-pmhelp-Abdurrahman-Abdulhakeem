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
import { useAppointments } from '@/hooks/useAppointments';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { usePracticeAnalytics, useSystemAnalytics, usePatientAnalytics } from '@/hooks/useAnalytics';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Loading } from '@/components/ui/Loading';
import { formatDate, formatDateTime } from '@/utils/cn';

const DashboardPage: React.FC = () => {
  const { data: user } = useCurrentUser();
  const { isPatient, isDoctor, isAdmin } = usePermissions();

  // Fetch real data based on user role
  const { appointments, isLoading: appointmentsLoading } = useAppointments();
  const { medicalRecords, isLoading: recordsLoading } = useMedicalRecords();
  const { currentSubscription, appointmentLimit, isLoading: subscriptionLoading } = useSubscriptions();
  
  // Analytics data
  const { data: practiceData, isLoading: practiceLoading } = usePracticeAnalytics();
  const { data: systemData, isLoading: systemLoading } = useSystemAnalytics();
  const { data: patientData, isLoading: patientLoading } = usePatientAnalytics();

  const isLoading = appointmentsLoading || recordsLoading || subscriptionLoading || 
                   practiceLoading || systemLoading || patientLoading;

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

  const getUpcomingAppointments = () => {
    if (!appointments) return [];
    const now = new Date();
    return appointments
      .filter(apt => new Date(apt.appointmentDate) > now)
      .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
  };

  const getTodaysAppointments = () => {
    if (!appointments) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return appointments.filter(apt => {
      const aptDate = new Date(apt.appointmentDate);
      return aptDate >= today && aptDate < tomorrow;
    });
  };

  const getStatsForRole = () => {
    if (isPatient) {
      const upcomingAppointments = getUpcomingAppointments();
      const recordsCount = medicalRecords?.length || 0;
      const appointmentsUsed = currentSubscription?.appointmentsUsed || 0;
      const appointmentLimitValue = currentSubscription?.subscription?.appointmentLimit || 0;
      
      return [
        {
          title: 'Upcoming Appointments',
          value: upcomingAppointments.length.toString(),
          icon: <Calendar className="w-6 h-6" />,
          color: 'blue' as const,
          trend: { value: 0, isPositive: true }
        },
        {
          title: 'Medical Records',
          value: recordsCount.toString(),
          icon: <FileText className="w-6 h-6" />,
          color: 'green' as const,
          trend: { value: 12.5, isPositive: true }
        },
        {
          title: 'Appointments Used',
          value: `${appointmentsUsed}/${appointmentLimitValue === -1 ? '∞' : appointmentLimitValue}`,
          icon: <Activity className="w-6 h-6" />,
          color: 'purple' as const,
          trend: { value: 8, isPositive: true }
        },
        {
          title: 'Plan',
          value: currentSubscription?.subscription?.tier?.toUpperCase() || 'FREE',
          icon: <Shield className="w-6 h-6" />,
          color: 'yellow' as const,
          trend: { value: 0, isPositive: true }
        }
      ];
    }

    if (isDoctor) {
      const todaysAppointments = getTodaysAppointments();
      const totalPatients = practiceData?.totalPatients || 0;
      const totalHours = practiceData?.totalHours || 0;
      const avgDuration = practiceData?.averageDuration || 0;
      
      return [
        {
          title: "Today's Appointments",
          value: todaysAppointments.length.toString(),
          icon: <Calendar className="w-6 h-6" />,
          color: 'blue' as const,
          trend: { value: 15, isPositive: true }
        },
        {
          title: 'Total Patients',
          value: totalPatients.toString(),
          icon: <Users className="w-6 h-6" />,
          color: 'green' as const,
          trend: { value: 8, isPositive: true }
        },
        {
          title: 'Hours This Month',
          value: `${Math.round(totalHours)}h`,
          icon: <Clock className="w-6 h-6" />,
          color: 'purple' as const,
          trend: { value: 3, isPositive: true }
        },
        {
          title: 'Avg Duration',
          value: `${Math.round(avgDuration)}min`,
          icon: <TrendingUp className="w-6 h-6" />,
          color: 'yellow' as const,
          trend: { value: 2, isPositive: true }
        }
      ];
    }

    if (isAdmin) {
      const totalUsers = systemData?.totalUsers || 0;
      const totalAppointments = systemData?.totalAppointments || 0;
      const totalRevenue = systemData?.totalRevenue || 0;
      
      return [
        {
          title: 'Total Users',
          value: totalUsers.toLocaleString(),
          icon: <Users className="w-6 h-6" />,
          color: 'blue' as const,
          trend: { value: 12, isPositive: true }
        },
        {
          title: 'Total Appointments',
          value: totalAppointments.toLocaleString(),
          icon: <Calendar className="w-6 h-6" />,
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
          value: `$${totalRevenue.toLocaleString()}`,
          icon: <TrendingUp className="w-6 h-6" />,
          color: 'purple' as const,
          trend: { value: 23, isPositive: true }
        }
      ];
    }

    return [];
  };

  const getNextAppointment = () => {
    const upcoming = getUpcomingAppointments();
    return upcoming.length > 0 ? upcoming[0] : null;
  };

  const getTodaysSchedule = () => {
    if (!isDoctor) return [];
    return getTodaysAppointments().slice(0, 4);
  };

  const stats = getStatsForRole();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <Loading size="lg" text="Loading your dashboard..." />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - keeping existing code */}
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
              {formatDate(new Date())} • {
                isPatient ? 'Take control of your health journey' : 
                isDoctor ? 'Ready to help your patients' : 
                'Manage your platform'
              }
            </p>
            <div className="flex items-center gap-3">
              <Badge variant={getRoleColor()}>
                {user?.role?.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="border-white/30 text-white">
                {user?.isEmailVerified ? 'Verified' : 'Unverified'}
              </Badge>
              {isPatient && currentSubscription && (
                <Badge variant="outline" className="border-white/30 text-white">
                  {currentSubscription.subscription?.name || 'Free Plan'}
                </Badge>
              )}
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
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>

      {/* Patient-specific content */}
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
                  <span className="font-medium text-green-900">Medical Records</span>
                  <span className="text-green-600">{medicalRecords?.length || 0} Records</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                  <span className="font-medium text-blue-900">Total Appointments</span>
                  <span className="text-blue-600">{appointments?.length || 0} Visits</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                  <span className="font-medium text-purple-900">Plan Status</span>
                  <span className="text-purple-600">
                    {currentSubscription?.subscription?.tier
                      ? currentSubscription.subscription.tier.charAt(0).toUpperCase() +
                        currentSubscription.subscription.tier.slice(1)
                      : 'Free'}
                  </span>
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
              {(() => {
                const nextAppointment = getNextAppointment();
                if (!nextAppointment) {
                  return (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="font-semibold text-slate-600 mb-1">No upcoming appointments</h3>
                      <p className="text-slate-500 text-sm">Schedule your next visit</p>
                    </div>
                  );
                }
                
                return (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">
                      Dr. {nextAppointment.doctor?.firstName} {nextAppointment.doctor?.lastName}
                    </h3>
                    <p className="text-slate-600 text-sm mb-2">{nextAppointment.reason}</p>
                    <p className="text-blue-600 font-medium">
                      {formatDateTime(nextAppointment.appointmentDate)}
                    </p>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Doctor-specific content */}
      {isDoctor && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const todaysSchedule = getTodaysSchedule();
              
              if (todaysSchedule.length === 0) {
                return (
                  <div className="text-center py-6">
                    <Clock className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="font-semibold text-slate-600 mb-1">No appointments today</h3>
                    <p className="text-slate-500 text-sm">Enjoy your day off!</p>
                  </div>
                );
              }
              
              return (
                <div className="space-y-3">
                  {todaysSchedule.map((appointment) => (
                    <div key={appointment._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {appointment.patient?.firstName} {appointment.patient?.lastName}
                          </p>
                          <p className="text-sm text-slate-600">{appointment.reason}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-blue-600">
                          {new Date(appointment.appointmentDate).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p className="text-xs text-slate-500">{appointment.duration} min</p>
                      </div>
                    </div>
                  ))}
                  
                  {getTodaysAppointments().length > 4 && (
                    <div className="text-center pt-3">
                      <p className="text-sm text-blue-600">
                        +{getTodaysAppointments().length - 4} more appointments today
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Fixed Admin-specific content */}
      {isAdmin && systemData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                User Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemData.userStats && systemData.userStats.length > 0 ? (
                  systemData.userStats.map((stat) => (
                    <div key={stat._id} className="flex justify-between items-center">
                      <span className="text-slate-600 capitalize">{stat._id}s</span>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">{stat.count}</p>
                        <p className="text-xs text-green-600">{stat.active} active</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-slate-500">
                    <p>No user data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-500" />
                Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemData.appointmentStats && systemData.appointmentStats.length > 0 ? (
                  systemData.appointmentStats.map((stat) => (
                    <div key={stat._id} className="flex justify-between items-center">
                      <span className="text-slate-600 capitalize">{stat._id.replace('_', ' ')}</span>
                      <span className="font-semibold text-slate-900">{stat.count}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-slate-500">
                    <p>No appointment data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemData.subscriptionRevenue && systemData.subscriptionRevenue.length > 0 ? (
                  systemData.subscriptionRevenue.map((stat) => (
                    <div key={stat._id} className="flex justify-between items-center">
                      <span className="text-slate-600 capitalize">{stat._id}</span>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">${stat.revenue}</p>
                        <p className="text-xs text-slate-500">{stat.count} users</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-slate-500">
                    <p>No revenue data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export { DashboardPage };