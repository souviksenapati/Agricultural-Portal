import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ROLE_HOME = {
  gramdoot: '/portal/dashboard',
  ada: '/portal/ada/dashboard',
  sno: '/portal/sno/dashboard',
  bank: '/portal/bank/dashboard',
};
const ROLE_LABELS = { gramdoot: 'Gramdoot', ada: 'ADA', sno: 'SNO', bank: 'Bank' };

export default function TopBar() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        setIsLoginModalOpen(false);
        setEmail(''); setPassword('');
        sessionStorage.setItem('km_just_logged_in', '1');
        navigate(ROLE_HOME[result.user.role] || '/');
      } else {
        setError(result.message || 'Invalid credentials or OTP.');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <div className="w-full bg-[#f8f8f8] py-1 border-b border-gray-200 relative z-60">
        <div className="w-full max-w-[1280px] mx-auto flex justify-end px-4 py-1">
          {user ? (
            /* ── Logged-in: user email + logout dropdown ── */
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 text-sm font-medium text-slate-700 bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-full pl-2 pr-4 py-1.5 shadow-sm hover:shadow-md hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-inner group-hover:scale-105 transition-transform duration-300">
                  <span className="text-xs font-bold">{user.email.charAt(0).toUpperCase()}</span>
                </div>
                <span className="truncate max-w-[160px]">{user.email}</span>
                <svg
                  className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Attractive Dropdown Menu */}
              <div
                className={`absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.2)] z-100 transform transition-all duration-300 origin-top-right overflow-hidden ${userMenuOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 -translate-y-2 pointer-events-none'}`}
              >
                <div className="px-5 py-4 bg-linear-to-br from-indigo-50/50 to-purple-50/50 border-b border-indigo-100/50 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-purple-500/10 rounded-full blur-xl"></div>
                  <p className="text-[11px] text-indigo-500/80 uppercase tracking-widest font-bold mb-1">Signed in as</p>
                  <p className="text-sm font-extrabold text-slate-800 truncate">{ROLE_LABELS[user.role] || user.role}</p>
                  <p className="text-xs font-medium text-slate-500 truncate mt-0.5">{user.email}</p>
                </div>

                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-rose-600 rounded-xl hover:bg-rose-50 hover:text-rose-700 transition-all duration-200 group cursor-pointer"
                  >
                    <div className="bg-rose-100/80 text-rose-500 p-1.5 rounded-lg group-hover:bg-rose-200 group-hover:text-rose-600 group-hover:scale-110 transition-all shadow-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </div>
                    Sign out securely
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ── Not logged-in: Login button ── */
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="relative inline-flex items-center justify-center gap-2 px-6 py-2 text-sm font-bold text-white transition-all duration-300 bg-linear-to-r from-blue-600 to-indigo-600 border border-transparent rounded-full shadow-md hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
              <i className="fa fa-lock text-white/90 group-hover:scale-110 transition-transform relative z-10 w-3"></i>
              <span className="relative z-10 tracking-wide">Access Portal</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Login Modal ── */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-100 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden relative">
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-2xl z-10 font-light cursor-pointer"
            >
              &times;
            </button>
            <div className="bg-[#dcf4ff] py-6 flex flex-col items-center border-b border-blue-100">
              <img src="/image/logo_bsb.png" alt="Logo" className="h-16 mb-2" />
            </div>
            <div className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Sign In</h3>
                <p className="text-sm text-gray-500 mt-1">Welcome to Bhumihin Khetmajur</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="text-red-500 text-sm text-center bg-red-100 p-2 rounded">{error}</div>
                )}
                <div>
                  <label className="block text-gray-600 text-sm font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2.5 rounded focus:outline-none focus:ring-2 focus:ring-[#2B78E4] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm font-semibold mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2.5 rounded focus:outline-none focus:ring-2 focus:ring-[#2B78E4] text-sm"
                  />
                </div>
                <div className="flex items-center mt-2">
                  <input type="checkbox" id="remember" className="w-4 h-4 border-gray-300 rounded" />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-600 cursor-pointer">
                    Remember me
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#2B78E4] text-white font-bold py-3 rounded hover:bg-blue-600 w-full transition shadow-md text-sm uppercase tracking-wide disabled:opacity-50 mt-2"
                >
                  {isSubmitting ? 'Logging In...' : 'Log In'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
