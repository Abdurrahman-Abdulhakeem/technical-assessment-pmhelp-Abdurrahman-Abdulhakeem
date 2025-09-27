"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Calendar,
  Camera,
  Edit,
  Mail,
  Phone,
  Save,
  Shield,
  User,
  Clock,
} from "lucide-react";
import { useAuth, useCurrentUser } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { useDoctorMutations, useDoctorProfile } from "@/hooks/useDoctors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Loading } from "@/components/ui/Loading";
import { formatDate, getInitials } from "@/utils/cn";

const ProfilePage: React.FC = () => {
  const { data: user } = useCurrentUser();
  const { updateProfile } = useAuth();
  const { isDoctor, isPatient, isAdmin } = usePermissions();

  // fetch doctor profile only if user is doctor
  const { data: rawDoctorProfile } = useDoctorProfile(
    isDoctor ? user?._id : undefined
  );

  const doctorProfile = rawDoctorProfile
  ? { ...rawDoctorProfile, profile: { ...rawDoctorProfile } }
  : null;
  
  const { updateProfile: updateDoctorProfile } = useDoctorMutations();

  // personal info editing
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    dateOfBirth: user?.dateOfBirth || "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth || "",
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateProfile.mutate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      dateOfBirth: user?.dateOfBirth || "",
    });
    setIsEditing(false);
  };

  // doctor info editing
  const [isDoctorEditing, setIsDoctorEditing] = useState(false);
const [doctorForm, setDoctorForm] = useState({
  specialization: "",
  licenseNumber: "",
  experience: 0,
  education: [] as string[],
  consultationFee: 0,
});

  useEffect(() => {
    if (doctorProfile?.profile) {
      setDoctorForm({
        specialization: doctorProfile.profile.specialization || "",
        licenseNumber: doctorProfile.profile.licenseNumber || "",
        experience: doctorProfile.profile.experience || 0,
        education: doctorProfile.profile.education || [],
        consultationFee: doctorProfile.profile.consultationFee || 0,
      });
    }
  }, [doctorProfile]);

  const handleDoctorInput = (field: string, value: any) => {
    setDoctorForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDoctorSave = () => {
    updateDoctorProfile.mutate({
      profile: {
        ...doctorForm,
        availability: doctorProfile?.profile.availability || [],
        rating: doctorProfile?.profile.rating ?? 0,
        reviewCount: doctorProfile?.profile.reviewCount ?? 0,
      }
    });
    setIsDoctorEditing(false);
  };

  const handleDoctorCancel = () => {
    setDoctorForm({
      specialization: doctorProfile?.profile.specialization || "",
      licenseNumber: doctorProfile?.profile.licenseNumber || "",
      experience: doctorProfile?.profile.experience || 0,
      education: doctorProfile?.profile.education || [],
      consultationFee: doctorProfile?.profile.consultationFee || 0,
    });
    setIsDoctorEditing(false);
  };

  if (!user) {
    return <Loading size="lg" text="Loading profile..." />;
  }

  const getRoleBadgeVariant = () => {
    if (isAdmin) return "danger";
    if (isDoctor) return "success";
    if (isPatient) return "info";
    return "default";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
          <p className="text-slate-600 mt-1">
            Manage your account information and preferences
          </p>
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
                {/* Avatar */}
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                    {getInitials(user.firstName, user.lastName)}
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                {/* Info */}
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
                      {isPatient ? "8" : isDoctor ? "142" : "1.2K"}
                    </p>
                    <p className="text-sm text-slate-600">
                      {isPatient ? "Records" : isDoctor ? "Patients" : "Users"}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900">
                      {formatDate(user.createdAt).split(",")[1]}
                    </p>
                    <p className="text-sm text-slate-600">Member Since</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Personal Info */}
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
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      loading={updateProfile.isPending}
                    >
                      <Save className="w-4 h-4 mr-2" /> Save
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
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  disabled={!isEditing}
                  icon={<User className="h-4 w-4" />}
                />
                <Input
                  label="Last Name"
                  value={isEditing ? formData.lastName : user.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  disabled={!isEditing}
                  icon={<User className="h-4 w-4" />}
                />
              </div>
              <Input
                label="Email"
                value={user.email}
                disabled
                icon={<Mail className="h-4 w-4" />}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Phone"
                  value={isEditing ? formData.phone : user.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  disabled={!isEditing}
                  icon={<Phone className="h-4 w-4" />}
                />
                <Input
                  label="Date of Birth"
                  type="date"
                  value={
                    isEditing ? formData.dateOfBirth : user.dateOfBirth || ""
                  }
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                  disabled={!isEditing}
                  icon={<Calendar className="h-4 w-4" />}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Doctor Info */}
      {isDoctor && doctorProfile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Professional Information
                </CardTitle>
                {!isDoctorEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDoctorEditing(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDoctorCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleDoctorSave}
                      loading={updateDoctorProfile.isPending}
                    >
                      <Save className="w-4 h-4 mr-2" /> Save
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isDoctorEditing ? (
                <>
                  <p>
                    <span className="font-semibold">Specialization:</span>{" "}
                    {doctorForm.specialization}
                  </p>
                  <p>
                    <span className="font-semibold">License:</span>{" "}
                    {doctorForm.licenseNumber}
                  </p>
                  <p>
                    <span className="font-semibold">Experience:</span>{" "}
                    {doctorForm.experience} years
                  </p>
                  <p>
                    <span className="font-semibold">Education:</span>{" "}
                    {doctorForm.education.join(", ")}
                  </p>
                  <p>
                    <span className="font-semibold">Consultation Fee:</span> $
                    {doctorForm.consultationFee}
                  </p>
                  <div>
                    <span className="font-semibold">Availability:</span>
                    <ul className="mt-2 space-y-1">
                      {doctorProfile?.profile?.availability?.map((slot: any, i: any) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-slate-500" />
                          {slot.day}: {slot.startTime} - {slot.endTime} (
                          {slot.isAvailable ? "Available" : "Off"})
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <Input
                    label="Specialization"
                    value={doctorProfile.specialization}
                    onChange={(e) =>
                      handleDoctorInput("specialization", e.target.value)
                    }
                  />
                  <Input
                    label="License Number"
                    value={doctorForm.licenseNumber}
                    onChange={(e) =>
                      handleDoctorInput("licenseNumber", e.target.value)
                    }
                  />
                  <Input
                    label="Experience (years)"
                    type="number"
                    value={doctorForm.experience}
                    onChange={(e) =>
                      handleDoctorInput("experience", parseInt(e.target.value))
                    }
                  />
                  <Input
                    label="Education (comma separated)"
                    value={doctorForm.education.join(", ")}
                    onChange={(e) =>
                      handleDoctorInput(
                        "education",
                        e.target.value.split(",").map((s) => s.trim())
                      )
                    }
                  />
                  <Input
                    label="Consultation Fee"
                    type="number"
                    value={doctorForm.consultationFee}
                    onChange={(e) =>
                      handleDoctorInput(
                        "consultationFee",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export { ProfilePage };
