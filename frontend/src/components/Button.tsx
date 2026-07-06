import React from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

const variantStyles = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 border-primary-600',
  secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-400 border-slate-300',
  success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 border-green-600',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border-red-600',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-400 border-transparent',
};

const sizeStyles = {
  sm: 'px-3 py-2 text-sm min-h-[36px]',
  md: 'px-4 py-3 text-base min-h-touch',
  lg: 'px-6 py-4 text-lg min-h-[56px]',
  xl: 'px-8 py-5 text-xl min-h-[64px] font-semibold',
};

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl border-2 font-medium',
        'transition-colors duration-150 ease-in-out',
        'focus:outline-none focus:ring-4 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
