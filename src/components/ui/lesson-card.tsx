import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { ProgressBar } from './progress-bar';
import { cn } from '@/lib/utils';

interface LessonCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  progress: number;
  iconColor?: string;
  iconBgColor?: string;
  className?: string;
  isLocked?: boolean;
  estimatedTime?: number;
}

export function LessonCard({
  title,
  description,
  href,
  icon: Icon,
  progress,
  iconColor = 'text-blue-600',
  iconBgColor = 'bg-blue-100',
  className,
  isLocked = false,
  estimatedTime,
}: LessonCardProps) {
  const CardWrapper = isLocked ? 'div' : Link;
  const cardProps = isLocked ? {} : { href };

  return (
    <CardWrapper
      {...cardProps}
      className={cn(
        'block bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-200',
        !isLocked && 'hover:shadow-md hover:border-blue-200 cursor-pointer',
        isLocked && 'opacity-60 cursor-not-allowed',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className={cn(
            'p-3 rounded-full transition-colors',
            iconBgColor,
            !isLocked && 'group-hover:bg-opacity-80'
          )}>
            <Icon className={cn('h-6 w-6', iconColor)} />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 chinese-text mb-1">
              {title}
            </h3>
            <p className="text-sm text-gray-600 chinese-text">
              {description}
            </p>
          </div>
        </div>
        {isLocked && (
          <div className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-500 chinese-text">
            已锁定
          </div>
        )}
      </div>

      <div className="space-y-2">
        <ProgressBar progress={progress} size="sm" />
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 chinese-text">
            进度: {progress}%
          </span>
          {estimatedTime && (
            <span className="text-gray-500 chinese-text">
              约 {estimatedTime} 分钟
            </span>
          )}
        </div>
      </div>

      {!isLocked && progress === 0 && (
        <div className="mt-3 text-xs text-blue-600 chinese-text">
          点击开始学习
        </div>
      )}

      {!isLocked && progress > 0 && progress < 100 && (
        <div className="mt-3 text-xs text-green-600 chinese-text">
          继续学习
        </div>
      )}

      {progress === 100 && (
        <div className="mt-3 text-xs text-gray-500 chinese-text flex items-center">
          <span className="mr-1">✓</span>
          已完成
        </div>
      )}
    </CardWrapper>
  );
}
