import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ children, className = '', ...props }) => (
  <button
    className={`bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;
