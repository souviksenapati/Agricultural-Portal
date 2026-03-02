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

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const result = login(email, password);
      if (result.success) {
        setIsLoginModalOpen(false);
        sessionStorage.setItem('km_just_logged_in', '1');
        navigate(ROLE_HOME[result.user.role] || '/');
      } else {
        setError(result.message || 'Invalid email or password.');
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
      <div className="w-full bg-[#f8f8f8] py-1 border-b border-gray-200">
        <div className="w-full max-w-[1280px] mx-auto flex justify-end px-4">
          {user ? (
            /* ── Logged-in: user email + logout dropdown ── */
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900 bg-white border border-gray-300 rounded px-3 py-1 shadow-sm"
              >
                <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                {user.email}
                <svg className="w-3.5 h-3.5 ml-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded shadow-lg z-50">
                  <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                    Logged in as <strong>{ROLE_LABELS[user.role]}</strong>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ── Not logged-in: Login button ── */
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-white border border-[#00ace6] text-gray-600 hover:bg-[#00ace6] hover:text-white text-sm font-medium flex items-center gap-2 px-6 py-1 rounded-sm transition shadow-sm cursor-pointer"
            >
              <i className="fa fa-lock text-xs"></i> Login
            </button>
          )}
        </div>
      </div>

      {/* ── Login Modal ── */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-sm p-4">
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
