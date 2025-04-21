import React, { useState } from 'react';

const FuturisticButton = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500';
      case 'secondary':
        return 'bg-gray-800 hover:bg-gray-700 text-white border-gray-700';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white border-green-500';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white border-red-500';
      case 'outline':
        return 'bg-transparent hover:bg-blue-600/10 text-blue-500 border-blue-500';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500';
    }
  };
  
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-1.5 text-sm';
      case 'medium':
        return 'px-4 py-2';
      case 'large':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2';
    }
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      className={`
        relative overflow-hidden rounded-lg font-medium transition-all duration-300
        border border-opacity-50 shadow-lg
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${widthClass}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect */}
      <div 
        className={`
          absolute inset-0 opacity-0 transition-opacity duration-300
          ${isHovered && !disabled ? 'opacity-20' : ''}
        `}
        style={{ 
          background: `radial-gradient(circle at center, ${variant === 'outline' ? '#3B82F6' : 'white'} 0%, transparent 70%)`,
        }}
      />
      
      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
      
      {/* Animated border */}
      <div 
        className={`
          absolute inset-0 rounded-lg transition-opacity duration-300
          ${isHovered && !disabled ? 'opacity-100' : 'opacity-0'}
        `}
        style={{ 
          border: '1px solid transparent',
          background: `linear-gradient(90deg, transparent, ${variant === 'outline' ? '#3B82F6' : 'white'}, transparent) border-box`,
          WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'destination-out',
          maskComposite: 'exclude',
        }}
      />
    </button>
  );
};

export default FuturisticButton; 