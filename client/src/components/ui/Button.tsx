import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading, 
    icon,
    fullWidth,
    children, 
    disabled, 
    ...props 
  }, ref) => {
    
    const baseStyles = [
      'inline-flex items-center justify-center gap-2',
      'font-medium rounded-xl transition-all duration-200',
      'focus-ring disabled:opacity-50 disabled:cursor-not-allowed',
      'transform hover:scale-[1.02] active:scale-[0.98]',
      'shadow-lg hover:shadow-xl'
    ];

    const variants = {
      primary: [
        'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
        'hover:from-blue-700 hover:to-purple-700',
        'shadow-blue-500/25'
      ],
      secondary: [
        'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700',
        'hover:from-slate-200 hover:to-slate-300',
        'border border-slate-300'
      ],
      outline: [
        'border-2 border-blue-500 text-blue-600 bg-transparent',
        'hover:bg-blue-500 hover:text-white'
      ],
      ghost: [
        'bg-transparent text-slate-600 hover:bg-slate-100',
        'shadow-none hover:shadow-md'
      ],
      danger: [
        'bg-gradient-to-r from-red-500 to-pink-500 text-white',
        'hover:from-red-600 hover:to-pink-600',
        'shadow-red-500/25'
      ],
      success: [
        'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
        'hover:from-green-600 hover:to-emerald-600',
        'shadow-green-500/25'
      ]
    };

    const sizes = {
      sm: 'px-3 py-2 text-sm h-9',
      md: 'px-4 py-2.5 text-sm h-10',
      lg: 'px-6 py-3 text-base h-12',
      xl: 'px-8 py-4 text-lg h-14'
    };

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!loading && icon && icon}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export { Button };
