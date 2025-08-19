import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ExclamationTriangleIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);


export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border-l-4 border-red-400 text-red-800 p-4 rounded-r-lg my-6 flex items-start shadow-md" role="alert">
        <ExclamationTriangleIcon className="h-6 w-6 mr-3 mt-0.5 text-red-500 flex-shrink-0"/>
      <div>
        <p className="font-bold text-red-900">An Error Occurred</p>
        <p className="text-red-700">{message}</p>
      </div>
    </div>
  );
};