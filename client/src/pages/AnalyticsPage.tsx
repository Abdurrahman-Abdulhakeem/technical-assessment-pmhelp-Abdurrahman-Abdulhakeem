import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import {
  Activity,
  Calendar,
  Clock,
  DollarSign,
  Download,
  Filter,
  TrendingUp,
  Users
} from 'lucide-react';
import { usePatientAnalytics, usePracticeAnalytics, useSystemAnalytics } from '@/hooks/useAnalytics';
import { usePermissions } from '@/hooks/usePermissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { StatsCard } from '@/components/dashboard/StatsCard';

const AnalyticsPage: React.FC = () => {
  const { isDoctor, isPatient, isAdmin } = usePermissions();
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // Fetch analytics based on user role
  const { data: practiceData, isLoading: practiceLoading } = usePracticeAnalytics(
    isDoctor ? dateRange.startDate : undefined,
    isDoctor ? dateRange.endDate : undefined
  );
  
  const { data: patientData, isLoading: patientLoading } = usePatientAnalytics(
    isPatient ? dateRange.startDate : undefined,
    isPatient ? dateRange.endDate : undefined
  );
  
  const { data: systemData, isLoading: systemLoading } = useSystemAnalytics(
    isAdmin ? dateRange.startDate : undefined,
    isAdmin ? dateRange.endDate : undefined
  );

  const isLoading = practiceLoading || patientLoading || systemLoading;

  // Mock chart data for demonstration
  const appointmentTrendsData = [
    { month: 'Jan', appointments: 45, revenue: 9000 },
    { month: 'Feb', appointments: 52, revenue: 10400 },
    { month: 'Mar', appointments: 61, revenue: 12200 },
    { month: 'Apr', appointments: 58, revenue: 11600 },
    { month: 'May', appointments: 67, revenue: 13400 },
    { month: 'Jun', appointments: 73, revenue: 14600 },
  ];

  const appointmentStatusData = [
    { name: 'Completed', value: 65, color: '#10b981' },
    { name: 'Scheduled', value: 25, color: '#3b82f6' },
    { name: 'Cancelled', value: 10, color: '#ef4444' },
  ];

  const peakHoursData = [
    { hour: '8:00', appointments: 5 },
    { hour: '9:00', appointments: 12 },
    { hour: '10:00', appointments: 18 },
    { hour: '11:00', appointments: 15 },
    { hour: '13:00', appointments: 6 },
    { hour: '14:00', appointments: 20 },
    { hour: '15:00', appointments: 22 },
    { hour: '16:00', appointments: 16 },
    { hour: '17:00', appointments: 10 },
  ];

  const getAnalyticsData = () => {
    if (isDoctor && practiceData) {
      return {
        title: 'Practice Analytics',
        stats: [
          {
            title: 'Total Appointments',
            value: practiceData.totalAppointments.toString(),
            icon: <Calendar className="w-6 h-6" />,
            color: 'blue' as const,
            trend: { value: 15, isPositive: true }
          },
          {
            title: 'Total Patients',
            value: practiceData.totalPatients.toString(),
            icon: <Users className="w-6 h-6" />,
            color: 'green' as const,
            trend: { value: 8, isPositive: true }
          },
          {
            title: 'Hours Worked',
            value: `${practiceData.totalHours}h`,
            icon: <Clock className="w-6 h-6" />,
            color: 'purple' as const,
            trend: { value: 3, isPositive: true }
          },
          {
            title: 'Avg Duration',
            value: `${practiceData.averageDuration}min`,
            icon: <Activity className="w-6 h-6" />,
            color: 'yellow' as const,
            trend: { value: 2, isPositive: true }
          }
        ]
      };
    }

    if (isPatient && patientData) {
      return {
        title: 'Your Health Analytics',
        stats: [
          {
            title: 'Total Appointments',
            value: patientData.appointmentsCount.toString(),
            icon: <Calendar className="w-6 h-6" />,
            color: 'blue' as const,
            trend: { value: 5, isPositive: true }
          },
          {
            title: 'Medical Records',
            value: patientData.medicalRecordsCount.toString(),
            icon: <Activity className="w-6 h-6" />,
            color: 'green' as const,
            trend: { value: 12, isPositive: true }
          },
          {
            title: 'Doctors Visited',
            value: patientData.uniqueDoctorsVisited.toString(),
            icon: <Users className="w-6 h-6" />,
            color: 'purple' as const,
            trend: { value: 0, isPositive: true }
          },
          {
            title: 'Health Score',
            value: '85%',
            icon: <TrendingUp className="w-6 h-6" />,
            color: 'yellow' as const,
            trend: { value: 8, isPositive: true }
          }
        ]
      };
    }

    if (isAdmin && systemData) {
      return {
        title: 'System Analytics',
        stats: [
          {
            title: 'Total Users',
            value: systemData.totalUsers.toString(),
            icon: <Users className="w-6 h-6" />,
            color: 'blue' as const,
            trend: { value: 12, isPositive: true }
          },
          {
            title: 'Total Appointments',
            value: systemData.totalAppointments.toString(),
            icon: <Calendar className="w-6 h-6" />,
            color: 'green' as const,
            trend: { value: 18, isPositive: true }
          },
          {
            title: 'Revenue',
            value: `${systemData.totalRevenue.toLocaleString()}`,
            icon: <DollarSign className="w-6 h-6" />,
            color: 'purple' as const,
            trend: { value: 23, isPositive: true }
          },
          {
            title: 'Growth Rate',
            value: '14.5%',
            icon: <TrendingUp className="w-6 h-6" />,
            color: 'yellow' as const,
            trend: { value: 4, isPositive: true }
          }
        ]
      };
    }

    return { title: 'Analytics', stats: [] };
  };

  const { title, stats } = getAnalyticsData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
        </div>
        <Loading size="lg" text="Loading analytics..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
          <p className="text-slate-600 mt-1">
            {isDoctor && 'Insights into your practice performance'}
            {isPatient && 'Track your health journey and progress'}
            {isAdmin && 'System-wide performance metrics and insights'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
            <span className="text-slate-500">to</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                {isDoctor ? 'Appointment Trends' : isPatient ? 'Health Trends' : 'Platform Growth'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={appointmentTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }} 
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="appointments" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff' }}
                    />
                    {isDoctor && (
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#fff' }}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Appointment Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={appointmentStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${percent ? (Number(percent) * 100).toFixed(0) : '0'}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {appointmentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Peak Hours Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Peak Hours Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peakHoursData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="hour" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }} 
                  />
                  <Bar 
                    dataKey="appointments" 
                    fill="url(#colorGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Growth Rate</h3>
                <p className="text-2xl font-bold text-blue-600">+14.5%</p>
                <p className="text-sm text-slate-500">vs last month</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Satisfaction</h3>
                <p className="text-2xl font-bold text-green-600">96%</p>
                <p className="text-sm text-slate-500">patient satisfaction</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Efficiency</h3>
                <p className="text-2xl font-bold text-purple-600">92%</p>
                <p className="text-sm text-slate-500">operational efficiency</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export { AnalyticsPage };
