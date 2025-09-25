import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Calendar,
  Camera,
  Clock,
  Edit,
  Mail,
  Phone,
  Save,
  Shield,
  User
} from 'lucide-react';
import { useAuth, useCurrentUser } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { useDoctorMutations, useDoctorProfile } from '@/hooks/useDoctors';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Loading } from '@/components/ui/Loading';
import { formatDate, getInitials } from '@/utils/cn';

const ProfilePage: React.FC = () => {
  const { data: user } = useCurrentUser();
  const { updateProfile } = useAuth();
  const { isDoctor, isPatient, isAdmin } = usePermissions();
  const { data: doctorProfile } = useDoctorProfile(isDoctor ? undefined : user?._id);
  const { updateProfile: updateDoctorProfile } = useDoctorMutations();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateProfile.mutate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth || '',
    });
    setIsEditing(false);
  };

  if (!user) {
    return <Loading size="lg" text="Loading profile..." />;
  }

  const getRoleBadgeVariant = () => {
    if (isAdmin) return 'danger';
    if (isDoctor) return 'success';
    if (isPatient) return 'info';
    return 'default';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
          <p className="text-slate-600 mt-1">Manage your account information and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1"
        >
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                {/* Profile Picture */}
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                    {getInitials(user.firstName, user.lastName)}
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                {/* User Info */}
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-slate-600">{user.email}</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Badge variant={getRoleBadgeVariant()}>
                      <Shield className="w-3 h-3 mr-1" />
                      {user.role.toUpperCase()}
                    </Badge>
                    {user.isEmailVerified && (
                      <Badge variant="success" size="sm">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900">
                      {isPatient ? '8' : isDoctor ? '142' : '1.2K'}
                    </p>
                    <p className="text-sm text-slate-600">
                      {isPatient ? 'Records' : isDoctor ? 'Patients' : 'Users'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900">
                      {formatDate(user.createdAt).split(',')[1]}
                    </p>
                    <p className="text-sm text-slate-600">Member Since</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      loading={updateProfile.isPending}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  value={isEditing ? formData.firstName : user.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  disabled={!isEditing}
                  icon={<User className="h-4 w-4" />}
                />
                
                <Input
                  label="Last Name"
                  value={isEditing ? formData.lastName : user.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  disabled={!isEditing}
                  icon={<User className="h-4 w-4" />}
                />
              </div>

              <Input
                label="Email Address"
                value={user.email}
                disabled
                icon={<Mail className="h-4 w-4" />}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Phone Number"
                  value={isEditing ? formData.phone : user.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter phone number"
                  icon={<Phone className="h-4 w-4" />}
                />
                
                <Input
                  label="Date of Birth"
                  type="date"
                  value={isEditing ? formData.dateOfBirth : user.dateOfBirth || ''}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  disabled={!isEditing}
                  icon={<Calendar className="h-4 w-4" />}
                />
              </div>

              {/* Account Status */}
              <div className="p-4 bg-slate-50 rounded-xl">
                <h4 className="font-semibold text-slate-900 mb-3">Account Status</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm text-slate-600">
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${user.isEmailVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-sm text-slate-600">
                      {user.isEmailVerified ? 'Email Verified' : 'Email Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Doctor-specific Profile */}
      {isDoctor && doctorProfile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Specialization
                  </label>
                  <p className="text-slate-900 font-medium">
                    {doctorProfile.specialization}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    License Number
                  </label>
                  <p className="text-slate-900 font-medium">
                    {doctorProfile.licenseNumber}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Experience
                  </label>
                  <p className="text-slate-900 font-medium">
                    {doctorProfile.experience} years
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Education
                </label>
                <div className="space-y-2">
                  {doctorProfile.education?.map((edu, index) => (
                    <div key={index} className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-slate-900">{edu}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Consultation Fee
                  </label>
                  <p className="text-2xl font-bold text-green-600">
                    ${doctorProfile.consultationFee}
                  </p>
                </div>
                
                <div className="text-center">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Rating
                  </label>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-yellow-500">
                      {doctorProfile.rating}
                    </span>
                    <span className="text-slate-500">
                      ({doctorProfile.reviewCount} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export { ProfilePage };
