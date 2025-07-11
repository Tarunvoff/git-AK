import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api.service';

const initialState = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
  confirm_password: '',
  terms: false,
};

const RegisterForm: React.FC = () => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [passwordStrength, setPasswordStrength] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!form.first_name) errs.first_name = 'First name is required';
    if (!form.last_name) errs.last_name = 'Last name is required';
    if (!form.email) errs.email = 'Email is required';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(form.password)) errs.password = 'Password must contain an uppercase letter';
    if (!/[0-9]/.test(form.password)) errs.password = 'Password must contain a number';
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(form.password)) errs.password = 'Password must contain a symbol';
    if (form.password !== form.confirm_password) errs.confirm_password = 'Passwords do not match';
    if (!form.terms) errs.terms = 'You must accept the terms';
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    if (name === 'password') {
      setPasswordStrength(getPasswordStrength(value));
    }
  };

  const getPasswordStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(pw)) score++;
    if (score <= 1) return 'Weak';
    if (score === 2) return 'Medium';
    if (score >= 3) return 'Strong';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setLoading(true);
      try {
        await api.post('/auth/register', form);
        setLoading(false);
        navigate('/login');
      } catch (err: any) {
        setApiError(err.response?.data?.error || 'Registration failed');
        setLoading(false);
      }
    }
  };

  return (
    <form className="bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6">Register</h2>
      {apiError && <div className="text-red-500 text-sm mb-4">{apiError}</div>}
      <div className="mb-4">
        <input name="first_name" value={form.first_name} onChange={handleChange} placeholder="First Name" className="w-full p-2 border rounded" />
        {errors.first_name && <div className="text-red-500 text-sm">{errors.first_name}</div>}
      </div>
      <div className="mb-4">
        <input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last Name" className="w-full p-2 border rounded" />
        {errors.last_name && <div className="text-red-500 text-sm">{errors.last_name}</div>}
      </div>
      <div className="mb-4">
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" />
        {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
      </div>
      <div className="mb-4">
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone (optional)" className="w-full p-2 border rounded" />
      </div>
      <div className="mb-4">
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full p-2 border rounded" />
        {passwordStrength && <div className="text-xs mt-1">Strength: <span className={passwordStrength === 'Strong' ? 'text-green-600' : passwordStrength === 'Medium' ? 'text-yellow-600' : 'text-red-600'}>{passwordStrength}</span></div>}
        {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
      </div>
      <div className="mb-4">
        <input name="confirm_password" type="password" value={form.confirm_password} onChange={handleChange} placeholder="Confirm Password" className="w-full p-2 border rounded" />
        {errors.confirm_password && <div className="text-red-500 text-sm">{errors.confirm_password}</div>}
      </div>
      <div className="mb-4 flex items-center">
        <input name="terms" type="checkbox" checked={form.terms} onChange={handleChange} className="mr-2" />
        <span>I accept the <Link to="#" className="text-blue-600 underline">terms of service</Link></span>
        {errors.terms && <div className="text-red-500 text-sm ml-2">{errors.terms}</div>}
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
      <div className="mt-4 text-center text-sm">
        Already have an account? <Link to="/login" className="text-blue-600 underline">Login</Link>
      </div>
    </form>
  );
};

export default RegisterForm;
