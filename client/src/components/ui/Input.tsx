import React from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, icon, rightIcon, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-semibold text-slate-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              'w-full px-4 py-3 text-sm bg-white border-2 border-slate-200',
              'rounded-xl focus:border-blue-500 focus:ring-0',
              'transition-all duration-200 placeholder:text-slate-400',
              'hover:border-slate-300 focus:shadow-lg focus:shadow-blue-500/10',
              icon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-red-500 focus:border-red-500',
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export { Input };