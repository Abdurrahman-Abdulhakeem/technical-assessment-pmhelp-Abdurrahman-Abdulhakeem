import { useNavigate, useSearch } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BookAppointmentForm } from '@/components/forms/BookAppointmentForm';
import { ArrowLeft, Calendar } from 'lucide-react';

const BookAppointmentPage: React.FC = () => {
  const navigate = useNavigate();
  const search = useSearch({ from: '/_authenticated/new-appointments/book' });
  const doctorId = (search as any)?.doctorId;

  const handleSuccess = () => {
    navigate({ to: '/appointments' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: '/appointments' })}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Appointments
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Book Appointment</h1>
          <p className="text-slate-600 mt-1">Schedule your next medical consultation</p>
        </div>
      </div>

      {/* Booking Form */}
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Appointment Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BookAppointmentForm
                onSuccess={handleSuccess}
                preselectedDoctorId={doctorId}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export { BookAppointmentPage };
