import React from 'react';

const GlassCard = ({ 
  children, 
  className = '', 
  blur = 'md',
  border = true,
  hover = true
}) => {
  const blurClass = blur === 'sm' ? 'backdrop-blur-sm' : 
                   blur === 'lg' ? 'backdrop-blur-lg' : 
                   blur === 'xl' ? 'backdrop-blur-xl' : 
                   blur === '2xl' ? 'backdrop-blur-2xl' : 
                   blur === '3xl' ? 'backdrop-blur-3xl' : 'backdrop-blur-md';
  
  const borderClass = border ? 'border border-white/20' : '';
  const hoverClass = hover ? 'hover:bg-white/10 transition-colors duration-300' : '';
  
  return (
    <div 
      className={`
        ${blurClass}
        ${borderClass}
        ${hoverClass}
        bg-white/10 rounded-xl shadow-xl overflow-hidden
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassCard; 