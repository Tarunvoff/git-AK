import React, { useState } from 'react';

interface MFAVerificationProps {
  onVerify: (code: string) => void;
  loading?: boolean;
  error?: string;
}

const MFAVerification: React.FC<MFAVerificationProps> = ({ onVerify, loading, error }) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) {
      onVerify(code);
    }
  };

  return (
    <form className="bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6">Multi-Factor Authentication</h2>
      <div className="mb-4">
        <input
          type="text"
          maxLength={6}
          value={code}
          onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
          placeholder="Enter 6-digit code"
          className="w-full p-2 border rounded text-center tracking-widest text-lg"
        />
      </div>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading || code.length !== 6}
      >
        {loading ? 'Verifying...' : 'Verify'}
      </button>
    </form>
  );
};

export default MFAVerification;

