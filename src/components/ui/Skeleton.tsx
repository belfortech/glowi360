// components/ui/Skeleton.tsx
import React from 'react';
import { cn } from '../../utils/helpers';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}


const Skeleton: React.FC<SkeletonProps> = ({ className = '', width, height }) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 rounded',
        className
      )}
      style={{ width, height }}
    />
  );
};

// Skeleton variants for common use cases
export const ProductCardSkeleton: React.FC = () => (
  <div className="w-full max-w-[290px] h-card bg-white rounded-card shadow-sm">
    <Skeleton className="w-full h-card-image rounded-t-card" />
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-3 h-3 rounded-full" />
          ))}
        </div>
        <Skeleton className="w-12 h-3" />
      </div>
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-3/4 h-4" />
      <div className="flex items-center justify-between">
        <Skeleton className="w-20 h-6" />
        <Skeleton className="w-9 h-9 rounded-full" />
      </div>
    </div>
  </div>
);

export const OrderCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-24 h-6" />
        <Skeleton className="w-20 h-5 rounded-full" />
      </div>
      <div className="text-right">
        <Skeleton className="w-20 h-6 mb-1" />
        <Skeleton className="w-24 h-4" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-lg" />
          <div className="flex-1">
            <Skeleton className="w-full h-4 mb-1" />
            <Skeleton className="w-16 h-3" />
          </div>
        </div>
      ))}
    </div>
    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
      <Skeleton className="w-32 h-4" />
      <div className="flex gap-2">
        <Skeleton className="w-24 h-8 rounded-lg" />
        <Skeleton className="w-20 h-8 rounded-lg" />
      </div>
    </div>
  </div>
);

export default Skeleton;