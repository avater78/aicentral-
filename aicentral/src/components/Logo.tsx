import React from 'react';
import { Sparkles } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showBadge = false, className = '' }) => {
  const iconBoxSizes = {
    sm: 'w-7 h-7 rounded-lg',
    md: 'w-8.5 h-8.5 rounded-xl',
    lg: 'w-10 h-10 rounded-2xl'
  };

  const sparkleSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4.5 h-4.5',
    lg: 'w-5 h-5'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2.5 group shrink-0 select-none ${className}`}>
      {/* Sleek Gradient Box Icon */}
      <div className={`${iconBoxSizes[size]} bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200`}>
        <Sparkles className={`${sparkleSizes[size]} text-white`} />
      </div>

      {/* Brand Text */}
      <div className="flex items-center gap-2">
        <span className={`font-black ${textSizes[size]} tracking-tight bg-gradient-to-r from-cyan-400 via-blue-300 to-purple-300 bg-clip-text text-transparent`}>
          AICENTRAL
        </span>
        {showBadge && (
          <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            PRO
          </span>
        )}
      </div>
    </div>
  );
};

