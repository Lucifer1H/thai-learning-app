import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
        sizeClasses[size],
        className
      )}
    />
  );
}

interface LoadingPageProps {
  message?: string;
  className?: string;
}

export function LoadingPage({ message = '加载中...', className }: LoadingPageProps) {
  return (
    <div className={cn(
      'min-h-screen bg-gray-50 flex items-center justify-center',
      className
    )}>
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-600 chinese-text">{message}</p>
      </div>
    </div>
  );
}

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  className?: string;
}

export function LoadingOverlay({ 
  isVisible, 
  message = '处理中...', 
  className 
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className={cn(
      'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
      className
    )}>
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-700 chinese-text">{message}</p>
        </div>
      </div>
    </div>
  );
}

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className, lines = 1 }: SkeletonProps) {
  return (
    <div className="animate-pulse">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'bg-gray-200 rounded h-4 mb-2 last:mb-0',
            className
          )}
        />
      ))}
    </div>
  );
}

export function LessonCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center mb-4">
        <div className="bg-gray-200 w-12 h-12 rounded-full" />
        <div className="ml-4 flex-1">
          <div className="bg-gray-200 h-5 rounded mb-2 w-3/4" />
          <div className="bg-gray-200 h-4 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="bg-gray-200 h-2 rounded w-full" />
        <div className="flex justify-between">
          <div className="bg-gray-200 h-3 rounded w-16" />
          <div className="bg-gray-200 h-3 rounded w-20" />
        </div>
      </div>
    </div>
  );
}
