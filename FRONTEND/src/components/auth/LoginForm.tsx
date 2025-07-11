import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api.service';
import MFAVerification from './MFAVerification';

const LoginForm: React.FC = () => {
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaToken, setMfaToken] = useState('');
  const [mfaLoading, setMfaLoading] = useState(false);
  const [mfaError, setMfaError] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!form.email) errs.email = 'Email is required';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setLoading(true);
      try {
        const res = await api.post('/auth/login', form);
        if (res.data.mfa_required && res.data.mfaToken) {
          setMfaRequired(true);
          setMfaToken(res.data.mfaToken);
        } else if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          navigate('/dashboard');
        }
      } catch (err: any) {
        setApiError(err.response?.data?.error || 'Login failed');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVerifyMfa = async (code: string) => {
    setMfaLoading(true);
    setMfaError('');
    try {
      const res = await api.post('/auth/verify-mfa', { token: code }, {
        headers: { Authorization: `Bearer ${mfaToken}` }
      });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setMfaError(err.response?.data?.error || 'Invalid MFA code');
    } finally {
      setMfaLoading(false);
    }
  };

  if (mfaRequired) {
    return <MFAVerification onVerify={handleVerifyMfa} loading={mfaLoading} error={mfaError} />;
  }

  return (
    <form className="bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      {apiError && <div className="text-red-500 text-sm mb-4">{apiError}</div>}
      <div className="mb-4">
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" />
        {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
      </div>
      <div className="mb-4">
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full p-2 border rounded" />
        {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
      </div>
      <div className="mb-4 flex items-center justify-between">
        <label className="flex items-center">
          <input name="remember" type="checkbox" checked={form.remember} onChange={handleChange} className="mr-2" />
          <span>Remember me</span>
        </label>
        <Link to="#" className="text-blue-600 underline text-sm">Forgot password?</Link>
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account? <Link to="/register" className="text-blue-600 underline">Register</Link>
      </div>
    </form>
  );
};

export default LoginForm;
