import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  variant?: 'spinner' | 'dots' | 'pulse';
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text, 
  className,
  variant = 'spinner'
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const SpinnerLoader = () => (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={cn(
        'rounded-full border-2 border-slate-200',
        'border-t-blue-500 border-r-blue-500',
        sizes[size]
      )}
    />
  );

  const DotsLoader = () => (
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            y: ["0%", "-50%", "0%"],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.2
          }}
          className="w-2 h-2 bg-blue-500 rounded-full"
        />
      ))}
    </div>
  );

  const PulseLoader = () => (
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.5, 1, 0.5]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity
      }}
      className={cn('bg-blue-500 rounded-full', sizes[size])}
    />
  );

  const loaders = {
    spinner: <SpinnerLoader />,
    dots: <DotsLoader />,
    pulse: <PulseLoader />
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      {loaders[variant]}
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-slate-600"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export { Loading };
