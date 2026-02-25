import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_HOME = {
  gramdoot: '/portal/dashboard',
  ada: '/portal/ada/dashboard',
  sno: '/portal/sno/dashboard',
  bank: '/portal/bank/dashboard',
};

const DEMO_CREDS = [
  { role: 'Gramdoot', email: 'gramdoot1@khetmojur.in', password: 'Gramdoot@123' },
  { role: 'ADA',      email: 'ada1@khetmojur.in',      password: 'ADA@123' },
  { role: 'SNO',      email: 'sno1@khetmojur.in',      password: 'SNO@123' },
  { role: 'Bank',     email: 'bank1@khetmojur.in',      password: 'Bank@123' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);
      if (result.success) {
        navigate(ROLE_HOME[result.user.role] || '/portal/login');
      } else {
        setError(result.message);
      }
    }, 400);
  };

  const fillCreds = (cred) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header bar */}
      <div className="bg-[#1565c0] h-11" />

      <div className="flex flex-col items-center justify-center flex-grow py-12 px-4">
        <div className="bg-white w-full max-w-md rounded shadow-md overflow-hidden">

          {/* Logo area */}
          <div className="bg-[#add8e6] flex items-center justify-center py-5">
            <img
              src="/image/logo_bsb.png"
              alt="Bangla Shasya Bima"
              className="h-20 object-contain"
            />
          </div>

          {/* Form area */}
          <div className="px-8 py-7">
            <h3 className="text-xl font-bold text-gray-800 text-center mb-1">Sign In</h3>
            <p className="text-gray-500 text-sm text-center mb-6">
              Welcome to Bhumihin Khetmajur
            </p>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-2.5 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-sm text-gray-700 font-medium shrink-0">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="Enter email"
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1565c0] focus:ring-1 focus:ring-[#1565c0]"
                />
              </div>

              {/* Password */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-sm text-gray-700 font-medium shrink-0">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter password"
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1565c0] focus:ring-1 focus:ring-[#1565c0]"
                />
              </div>

              {/* Remember me */}
              <div className="flex justify-end">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300" />
                  Remember me
                </label>
              </div>

              {/* Submit */}
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#1565c0] hover:bg-[#1253a0] disabled:opacity-60 text-white text-sm font-medium px-6 py-2 rounded transition-colors"
                >
                  {loading ? 'Signing in…' : 'Log in'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Demo credentials card */}
        <div className="mt-6 w-full max-w-md bg-white border border-gray-200 rounded shadow-sm p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Demo Credentials (click to fill)
          </p>
          <div className="space-y-2">
            {DEMO_CREDS.map((c) => (
              <button
                key={c.role}
                onClick={() => fillCreds(c)}
                className="w-full text-left flex items-center justify-between border border-gray-100 hover:border-[#1565c0] hover:bg-blue-50 rounded px-3 py-2 transition-colors group"
              >
                <span className="text-xs font-bold text-[#1565c0] w-20">{c.role}</span>
                <span className="text-xs text-gray-600 flex-1">{c.email}</span>
                <span className="text-xs text-gray-400 font-mono ml-2">{c.password}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-3">
        <p className="text-center text-xs text-gray-500">
          Copyright © 2026 Department of Agriculture. Govt. of West Bengal. All Rights Reserved
        </p>
      </footer>
    </div>
  );
}
