import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  online?: boolean;
  className?: string;
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getColorFromName = (name: string): string => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-orange-500',
    'bg-teal-500',
  ];
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

export const Avatar: React.FC<AvatarProps> = ({ 
  name, 
  size = 'md', 
  online,
  className 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div className={cn('relative inline-block', className)}>
      <div
        className={cn(
          'rounded-full flex items-center justify-center text-white font-semibold',
          sizeClasses[size],
          getColorFromName(name)
        )}
      >
        {getInitials(name)}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-success border-2 border-card" />
      )}
    </div>
  );
};
