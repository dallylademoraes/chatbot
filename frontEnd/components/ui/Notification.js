import React, { useEffect } from 'react';

const Notification = ({ message, type = 'info', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    const closeOnClickOutside = () => onClose();

    document.addEventListener('click', closeOnClickOutside);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', closeOnClickOutside);
    };
  }, [onClose, duration]);

  const getColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'info':
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-6 pointer-events-none">
      <div
        className={`pointer-events-auto w-full max-w-sm rounded-lg shadow-lg text-white px-4 py-3 ${getColor()}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <p className="text-sm">{message}</p>
          <button onClick={onClose} className="ml-4 font-bold text-xl leading-none">&times;</button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
