import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useAppointments } from '@/hooks/useAppointments';
import { useDoctorAvailability, useDoctors } from '@/hooks/useDoctors';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { bookAppointmentSchema } from '@/utils/validations';
import type { BookAppointmentData } from '@/types';
import { Calendar, Clock, FileText } from 'lucide-react';

interface BookAppointmentFormProps {
  onSuccess?: () => void;
  preselectedDoctorId?: string;
}

const BookAppointmentForm: React.FC<BookAppointmentFormProps> = ({
  onSuccess,
  preselectedDoctorId
}) => {
  const { bookAppointment } = useAppointments();
  const { data: doctorsData } = useDoctors();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<BookAppointmentData>({
    resolver: zodResolver(bookAppointmentSchema),
    defaultValues: {
      doctorId: preselectedDoctorId || '',
      duration: 30
    }
  });

  
  const selectedDoctor = watch('doctorId');
  const appointmentDate = watch('appointmentDate')?.split('T')[0]; // only date part

    // Get availability when doctor + date are chosen
  const { data: availabilityData } = useDoctorAvailability(selectedDoctor, appointmentDate);

  const onSubmit = (data: BookAppointmentData) => {
    bookAppointment.mutate(data, {
      onSuccess: () => {
        onSuccess?.();
      }
    });
  };

  const doctors = doctorsData?.doctors || [];
const slots = availabilityData?.timeSlots || [];

console.log(doctors)


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Doctor Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Select Doctor
          </label>
          <select
            {...register('doctorId')}
            className="w-full px-4 py-3 text-sm bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
            disabled={!!preselectedDoctorId}
          >
            <option value="">Choose a doctor...</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                Dr. {doctor?.firstName} {doctor?.lastName} - {doctor.profile.specialization}
              </option>
            ))}
          </select>
          {errors.doctorId && (
            <p className="text-sm text-red-600">{errors.doctorId.message}</p>
          )}
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Appointment Date"
            type="datetime-local"
            icon={<Calendar className="h-4 w-4" />}
            error={errors.appointmentDate?.message}
            {...register('appointmentDate')}
          />
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Duration (minutes)
            </label>
            <select
              {...register('duration', { valueAsNumber: true })}
              className="w-full px-4 py-3 text-sm bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>
          </div>
        </div>

        {/* Reason */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Reason for Appointment
          </label>
          <textarea
            {...register('reason')}
            rows={4}
            className="w-full px-4 py-3 text-sm bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
            placeholder="Please describe your symptoms or reason for the appointment..."
          />
          {errors.reason && (
            <p className="text-sm text-red-600">{errors.reason.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <Button
            type="submit"
            loading={bookAppointment.isPending}
            fullWidth
            size="lg"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book Appointment
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export { BookAppointmentForm };
