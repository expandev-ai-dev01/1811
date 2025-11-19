import { cn } from '@/core/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  className?: string;
}

export const LoadingSpinner = ({ className }: LoadingSpinnerProps) => {
  return <Loader2 className={cn('h-4 w-4 animate-spin', className)} />;
};
