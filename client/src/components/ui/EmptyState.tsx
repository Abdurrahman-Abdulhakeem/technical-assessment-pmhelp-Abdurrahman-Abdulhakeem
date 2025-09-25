import { cn } from '@/utils/cn';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className
}) => {
  return (
    <div className={cn('text-center py-12', className)}>
      {icon && (
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      {description && (
        <p className="text-slate-600 mb-4 max-w-sm mx-auto">
          {description}
        </p>
      )}
      {action}
    </div>
  );
};

export { EmptyState };