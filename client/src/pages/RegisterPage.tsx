import React from 'react';
import { motion } from 'framer-motion';
import { Award, Clock, Heart, Stethoscope } from 'lucide-react';
import { RegisterForm } from '@/components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  const benefits = [
    {
      icon: <Stethoscope className="w-6 h-6" />,
      title: 'Professional Care',
      description: 'Access to qualified doctors'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Health Tracking',
      description: 'Monitor your wellness journey'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: '24/7 Support',
      description: 'Round-the-clock assistance'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Premium Features',
      description: 'Advanced healthcare tools'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-32 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-32 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-green-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative flex min-h-screen">
        {/* Left side - Register Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <RegisterForm />
        </div>

        {/* Right side - Benefits */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-16">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Join{' '}
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Thousands
                </span>
                {' '}of Users
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                Start your journey towards better health management. Whether you're a patient
                seeking care or a doctor providing services, we've got you covered.
              </p>
            </div>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl flex items-center justify-center text-purple-600">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{benefit.title}</h3>
                    <p className="text-sm text-slate-600">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              <h3 className="text-lg font-semibold mb-2">Ready to get started?</h3>
              <p className="text-purple-100">
                Join our community and experience healthcare like never before.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export { RegisterPage }