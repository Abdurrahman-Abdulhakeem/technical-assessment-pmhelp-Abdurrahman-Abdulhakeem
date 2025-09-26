import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  Plus,
  Search,
  User,
  XCircle
} from 'lucide-react';
import { useAppointments } from '@/hooks/useAppointments';
import { usePermissions } from '@/hooks/usePermissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { formatDateTime } from '@/utils/cn';
import { AppointmentStatus } from '@/types';
import { Link } from '@tanstack/react-router';

const AppointmentsPage: React.FC = () => {
  const { appointments, isLoading, cancelAppointment, updateAppointmentStatus } = useAppointments();
  const { isPatient, isDoctor } = usePermissions();
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [filter, setFilter] = useState('all');

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

  const filteredAppointments = appointments?.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  }) || [];

  console.log(filteredAppointments)

  const handleCancelAppointment = (appointmentId: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      cancelAppointment.mutate(appointmentId);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">Appointments</h1>
        </div>
        <Loading size="lg" text="Loading appointments..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Appointments</h1>
          <p className="text-slate-600 mt-1">
            {isPatient ? 'Manage your medical appointments' : 'View and manage patient appointments'}
          </p>
        </div>
        
        {isPatient && (
          <Link to="/new-appointments/book">
          <Button onClick={() => setShowBookModal(true)} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Book Appointment
          </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {['all', 'scheduled', 'confirmed', 'completed', 'cancelled'].map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <EmptyState
              icon={<Calendar className="w-8 h-8 text-slate-400" />}
              title="No appointments found"
              description={
                filter === 'all'
                  ? 'You have no appointments scheduled'
                  : `No ${filter} appointments found`
              }
              action={
                isPatient && (
                  <Button onClick={() => setShowBookModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Book Your First Appointment
                  </Button>
                )
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredAppointments.map((appointment, index) => (
            <motion.div
              key={appointment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-slate-900">
                            {isPatient
                              ? `Dr. ${appointment.doctor?.firstName} ${appointment.doctor?.lastName}`
                              : `${appointment.patient?.firstName} ${appointment.patient?.lastName}`
                          
                            }
                          </h3>
                          <Badge
                            variant={getStatusVariant(appointment.status)}
                            size="sm"
                          >
                            {getStatusIcon(appointment.status)}
                            {appointment.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        
                        <p className="text-slate-600 mb-2">{appointment.reason}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDateTime(appointment.appointmentDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {appointment.duration} minutes
                          </span>
                        </div>
                        
                        {appointment.notes && (
                          <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                            <p className="text-sm text-slate-600">
                              <strong>Notes:</strong> {appointment.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {appointment.status === 'scheduled' && (
                        <>
                          {isDoctor && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateAppointmentStatus.mutate({
                                id: appointment._id,
                                status: AppointmentStatus.CONFIRMED
                              })}
                            >
                              Confirm
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleCancelAppointment(appointment._id)}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      
                      {isDoctor && appointment.status === 'confirmed' && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => updateAppointmentStatus.mutate({
                            id: appointment._id,
                            status: AppointmentStatus.COMPLETED
                          })}
                        >
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Book Appointment Modal */}
      {showBookModal && (
        <Modal
          isOpen={showBookModal}
          onClose={() => setShowBookModal(false)}
          title="Book New Appointment"
          size="lg"
        >
          <div className="text-center py-8">
            <Calendar className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Book Appointment Feature
            </h3>
            <p className="text-slate-600 mb-4">
              This would open the appointment booking form with doctor selection,
              date/time picker, and reason input.
            </p>
            <Button onClick={() => setShowBookModal(false)}>
              Close
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export { AppointmentsPage };