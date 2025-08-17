import React from 'react';

const Spinner = ({ size = 'lg', className = '', text = '' }) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-4xl',
    xl: 'text-6xl'
  };

  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="inline-block">
        <i className={`fas fa-spinner fa-spin ${sizeClasses[size]} text-primary`}></i>
      </div>
      {text && (
        <div className="mt-3 text-gray-600">
          {text}
        </div>
      )}
    </div>
  );
};

export default Spinner; 