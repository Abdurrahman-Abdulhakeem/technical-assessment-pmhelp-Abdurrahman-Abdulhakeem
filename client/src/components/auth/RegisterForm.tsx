import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import { Calendar, Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { UserRole } from '@/types';

const registerSchema = z.object({
  role:z.nativeEnum(UserRole),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    registerUser.mutate(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded"></div>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <p className="text-slate-600 mt-2">Join MedPortal today</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Role Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="relative">
                  <input
                    type="radio"
                    value={UserRole.PATIENT}
                    {...register('role')}
                    className="sr-only peer"
                  />
                  <div className="p-3 border-2 border-slate-200 rounded-xl cursor-pointer transition-all peer-checked:border-blue-500 peer-checked:bg-blue-50 text-center">
                    <User className="w-6 h-6 mx-auto mb-1 text-slate-400 peer-checked:text-blue-500" />
                    <span className="text-sm font-medium text-slate-600">Patient</span>
                  </div>
                </label>
                <label className="relative">
                  <input
                    type="radio"
                    value={UserRole.DOCTOR}
                    {...register('role')}
                    className="sr-only peer"
                  />
                  <div className="p-3 border-2 border-slate-200 rounded-xl cursor-pointer transition-all peer-checked:border-blue-500 peer-checked:bg-blue-50 text-center">
                    <User className="w-6 h-6 mx-auto mb-1 text-slate-400 peer-checked:text-blue-500" />
                    <span className="text-sm font-medium text-slate-600">Doctor</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="John"
                icon={<User className="h-4 w-4" />}
                error={errors.firstName?.message}
                {...register('firstName')}
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                icon={<User className="h-4 w-4" />}
                error={errors.lastName?.message}
                {...register('lastName')}
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              icon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              icon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              icon={<Phone className="h-4 w-4" />}
              error={errors.phone?.message}
              {...register('phone')}
            />

            <Input
              label="Date of Birth (Optional)"
              type="date"
              icon={<Calendar className="h-4 w-4" />}
              error={errors.dateOfBirth?.message}
              {...register('dateOfBirth')}
            />

            <Button
              type="submit"
              loading={registerUser.isPending}
              fullWidth
              size="lg"
              className="font-semibold"
            >
              Create Account
            </Button>

            <div className="text-center pt-4">
              <p className="text-slate-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export { RegisterForm };
