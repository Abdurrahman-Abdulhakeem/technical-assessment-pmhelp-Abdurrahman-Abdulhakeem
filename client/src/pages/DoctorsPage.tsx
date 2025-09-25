import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Stethoscope,
  Search,
  Star,
  MapPin,
  Calendar,
  Clock,
  GraduationCap,
  Award,
  Filter
} from 'lucide-react';
import { useDoctors } from '@/hooks/useDoctors';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency, getInitials } from '@/utils/cn';
import { useDebounce } from '@/hooks/useDebounce';

const DoctorsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data: doctorsData, isLoading } = useDoctors({
    search: debouncedSearch,
    specialization: specializationFilter,
    page: 1,
    limit: 12
  });

  const doctors = doctorsData?.doctors || [];
  const specializations = [
    'Cardiology', 'Dermatology', 'Neurology', 'Orthopedics', 
    'Pediatrics', 'Psychiatry', 'Radiology', 'Surgery'
  ];

  const handleBookAppointment = (doctor: any) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">Find Doctors</h1>
        </div>
        <Loading size="lg" text="Loading doctors..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Find Doctors</h1>
          <p className="text-slate-600 mt-1">Connect with qualified healthcare professionals</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search doctors by name or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          
          <div className="flex gap-2">
            <select
              className="px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
            >
              <option value="">All Specializations</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
            
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      {doctors.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <EmptyState
              icon={<Stethoscope className="w-8 h-8 text-slate-400" />}
              title="No doctors found"
              description="Try adjusting your search criteria or filters"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor, index) => (
            <motion.div
              key={doctor._id || doctor.userId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6">
                  {/* Doctor Header */}
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                      {doctor.user 
                        ? getInitials(doctor.user.firstName, doctor.user.lastName)
                        : 'DR'
                      }
                    </div>
                    <h3 className="font-bold text-slate-900">
                      Dr. {doctor.user?.firstName} {doctor.user?.lastName}
                    </h3>
                    <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{doctor.rating || 4.8}</span>
                      <span className="text-slate-500">({doctor.reviewCount || 23} reviews)</span>
                    </div>
                  </div>

                  {/* Doctor Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <GraduationCap className="w-4 h-4" />
                      <span>{doctor.experience} years experience</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Award className="w-4 h-4" />
                      <span>License: {doctor.licenseNumber}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Consultation Fee:</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(doctor.consultationFee)}
                      </span>
                    </div>

                    {/* Education */}
                    {doctor.education && doctor.education.length > 0 && (
                      <div className="pt-2">
                        <p className="text-xs font-medium text-slate-700 mb-1">Education:</p>
                        <p className="text-xs text-slate-500">
                          {doctor.education[0]}
                          {doctor.education.length > 1 && ` +${doctor.education.length - 1} more`}
                        </p>
                      </div>
                    )}

                    {/* Availability Status */}
                    <div className="pt-2">
                      <Badge variant="success" size="sm">
                        <Clock className="w-3 h-3 mr-1" />
                        Available Today
                      </Badge>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      onClick={() => handleBookAppointment(doctor)}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Appointment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Book Appointment Modal */}
      {showBookingModal && selectedDoctor && (
        <Modal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          title={`Book Appointment with Dr. ${selectedDoctor.user?.firstName} ${selectedDoctor.user?.lastName}`}
          size="lg"
        >
          <div className="text-center py-8">
            <Calendar className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Book Appointment
            </h3>
            <p className="text-slate-600 mb-6">
              This would open a comprehensive appointment booking form with:
            </p>
            <div className="text-left space-y-2 mb-6">
              <p className="text-sm text-slate-600">• Date and time selection</p>
              <p className="text-sm text-slate-600">• Appointment reason input</p>
              <p className="text-sm text-slate-600">• Duration selection</p>
              <p className="text-sm text-slate-600">• Insurance information</p>
              <p className="text-sm text-slate-600">• Confirmation and payment</p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setShowBookingModal(false)} variant="outline">
                Cancel
              </Button>
              <Button onClick={() => setShowBookingModal(false)}>
                Continue to Booking
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export { DoctorsPage };