import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  ChevronDown, 
  LogOut,
  Menu, 
  Search,
  Settings,
  User
} from 'lucide-react';
import { useCurrentUser, useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn, getInitials } from '@/utils/cn';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { data: user } = useCurrentUser();
  const { logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications] = useState(3); // Mock notification count

  const handleLogout = () => {
    logout.mutate();
  };

  const getUserRoleColor = () => {
    switch (user?.role) {
      case 'admin': return 'danger';
      case 'doctor': return 'success';
      case 'patient': return 'info';
      default: return 'default';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search */}
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-64 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                >
                  {notifications}
                </motion.span>
              )}
            </Button>
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {user ? getInitials(user.firstName, user.lastName) : 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-slate-900">
                    {user ? `${user.firstName} ${user.lastName}` : 'User'}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant={getUserRoleColor()} size="sm">
                      {user?.role || 'User'}
                    </Badge>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </div>
            </button>

            {/* User dropdown */}
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2"
              >
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="font-semibold text-slate-900">
                    {user ? `${user.firstName} ${user.lastName}` : 'User'}
                  </p>
                  <p className="text-sm text-slate-500">{user?.email}</p>
                </div>
                
                <div className="py-2">
                  <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                </div>
                
                <div className="border-t border-slate-100 pt-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export { Header };