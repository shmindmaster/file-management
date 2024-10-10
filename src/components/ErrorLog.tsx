import React from 'react';
import { X } from 'lucide-react';
import { AppError } from '../types';

interface ErrorLogProps {
  errors: AppError[];
  setErrors: React.Dispatch<React.SetStateAction<AppError[]>>;
}

const ErrorLog: React.FC<ErrorLogProps> = ({ errors, setErrors }) => {
  const removeError = (index: number) => {
    setErrors(errors.filter((_, i) => i !== index));
  };

  if (errors.length === 0) return null;

  return (
    <div className="fixed bottom-0 right-0 m-4 max-w-sm">
      {errors.map((error, index) => (
        <div
          key={index}
          className={`mb-2 p-2 rounded-lg shadow-lg flex justify-between items-center ${
            error.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}
        >
          <span>{error.message}</span>
          <button onClick={() => removeError(index)} className="ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ErrorLog;