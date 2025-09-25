import React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Calendar,
  Clock,
  CreditCard,
  FileText,
  LayoutDashboard,
  Settings,
  Shield,
  Stethoscope,
  User,
  Users,
} from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { cn } from "@/utils/cn";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { isPatient, isDoctor, isAdmin } = usePermissions();

  const getNavigationItems = () => {
    const commonItems = [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Profile", href: "/profile", icon: User },
    ];

    if (isPatient) {
      return [
        ...commonItems,
        { name: "Appointments", href: "/appointments", icon: Calendar },
        { name: "Medical Records", href: "/medical-records", icon: FileText },
        { name: "Doctors", href: "/doctors", icon: Stethoscope },
        { name: "Subscription", href: "/subscription", icon: CreditCard },
      ];
    }

    if (isDoctor) {
      return [
        ...commonItems,
        { name: "My Appointments", href: "/appointments", icon: Calendar },
        { name: "Patients", href: "/patients", icon: Users },
        { name: "Medical Records", href: "/medical-records", icon: FileText },
        { name: "Schedule", href: "/schedule", icon: Clock },
        { name: "Analytics", href: "/analytics", icon: BarChart3 },
      ];
    }

    if (isAdmin) {
      return [
        ...commonItems,
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Appointments", href: "/admin/appointments", icon: Calendar },
        { name: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
        { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
        { name: "System", href: "/admin/system", icon: Settings },
      ];
    }

    return commonItems;
  };

  const navigationItems = getNavigationItems();

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-slate-900">MedPortal</h1>
            <p className="text-sm text-slate-500">Healthcare Platform</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200",
                "group hover:bg-slate-50",
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
          <Activity className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-sm font-medium text-slate-900">System Status</p>
            <p className="text-xs text-green-600">All systems operational</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-72 bg-white border-r border-slate-200 shadow-xl lg:hidden flex flex-col"
        )}
      >
        <SidebarContent />
      </motion.aside>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex lg:flex-col lg:static lg:z-0",
          "h-full w-72 bg-white border-r border-slate-200"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export { Sidebar };
