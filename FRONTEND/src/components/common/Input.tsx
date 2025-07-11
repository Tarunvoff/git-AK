import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

const Input: React.FC<InputProps> = ({ error, className = '', ...props }) => (
  <div>
    <input
      className={`w-full p-2 border rounded ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
      {...props}
    />
    {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
  </div>
);

export default Input;
