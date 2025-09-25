// src/pages/LoginPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Calendar, Shield, Users } from 'lucide-react';
import { LoginForm } from '@/components/auth/LoginForm';

const LoginPage: React.FC = () => {
  const features = [
    {
      icon: <Activity className="w-8 h-8" />,
      title: 'Health Monitoring',
      description: 'Track your health metrics and get insights'
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Easy Scheduling',
      description: 'Book appointments with your preferred doctors'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Expert Care',
      description: 'Connect with qualified healthcare professionals'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure & Private',
      description: 'Your health data is protected and confidential'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative flex min-h-screen">
        {/* Left side - Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">MedPortal</h1>
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Your Health,{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Our Priority
                </span>
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                Experience seamless healthcare management with our comprehensive medical platform.
                Connect with doctors, manage appointments, and take control of your health journey.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="group"
                >
                  <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20 hover:bg-white/70 transition-all duration-300">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
                      <p className="text-sm text-slate-600">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right side - Login Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export { LoginPage };