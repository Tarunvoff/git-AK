import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <h1 className="text-4xl font-bold mb-4">Welcome to RickCooling Auth App</h1>
    <div className="flex gap-4">
      <Link to="/register" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Register</Link>
      <Link to="/login" className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-900">Login</Link>
    </div>
  </div>
);

export default Landing;
