import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_LABELS = {
  gramdoot: 'Gramdoot',
  ada: 'ADA',
  sno: 'SNO',
  bank: 'Bank',
};

export default function PortalHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [quickRegOpen, setQuickRegOpen] = useState(false);
  const userRef = useRef(null);
  const navRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false);
      if (navRef.current && !navRef.current.contains(e.target)) setQuickRegOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardPath =
    user?.role === 'gramdoot' ? '/portal/dashboard'
    : user?.role === 'ada' ? '/portal/ada/dashboard'
    : user?.role === 'sno' ? '/portal/sno/dashboard'
    : '/portal/bank/dashboard';

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ── Top bar: user email ── */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex justify-end items-center h-9">
          <div className="relative" ref={userRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900 bg-white border border-gray-300 rounded px-3 py-1 shadow-sm"
            >
              <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              {user?.email}
              <svg className="w-3.5 h-3.5 ml-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded shadow-lg z-50">
                <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                  Logged in as <strong>{ROLE_LABELS[user?.role]}</strong>
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
        </div>
      </div>

      {/* ── Main header ── */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-[72px]">
          {/* Logo + Name */}
          <div className="flex items-center gap-3">
            <img
              src="/image/logo_bsb.png"
              alt="WB Govt"
              className="h-14 w-14 object-contain"
            />
            <div>
              <div className="text-[#1565c0] font-bold text-lg leading-tight">
                Government of West Bengal
              </div>
              <div className="text-[#b45309] text-sm font-medium leading-tight">
                Department of Agriculture
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">
            <Link
              to={dashboardPath}
              className={`hover:text-[#0891b2] transition-colors ${isActive(dashboardPath) ? 'text-[#0891b2] font-semibold' : ''}`}
            >
              Dashboard
            </Link>

            {/* Gramdoot: Quick Registration dropdown */}
            {user?.role === 'gramdoot' && (
              <div className="relative" ref={navRef}>
                <button
                  onClick={() => setQuickRegOpen(!quickRegOpen)}
                  className={`flex items-center gap-1 hover:text-[#0891b2] transition-colors ${
                    location.pathname.startsWith('/portal/quick-registration') || location.pathname.startsWith('/portal/registration')
                      ? 'text-[#0891b2] font-semibold' : ''
                  }`}
                >
                  Quick Registration
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {quickRegOpen && (
                  <div className="absolute left-0 mt-2 w-52 bg-white border border-gray-200 rounded shadow-lg z-50">
                    <Link
                      to="/portal/quick-registration/new"
                      onClick={() => setQuickRegOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0891b2]"
                    >
                      Registration Form
                    </Link>
                    <Link
                      to="/portal/quick-registration/list"
                      onClick={() => setQuickRegOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0891b2] border-t border-gray-100"
                    >
                      Registered Applicant List
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* ADA: Applications Review link */}
            {user?.role === 'ada' && (
              <Link
                to="/portal/ada/dashboard"
                className={`hover:text-[#0891b2] transition-colors ${
                  location.pathname.startsWith('/portal/ada') ? 'text-[#0891b2] font-semibold' : ''
                }`}
              >
                Applications Review
              </Link>
            )}

            {/* SNO: Applications link */}
            {user?.role === 'sno' && (
              <Link
                to="/portal/sno/dashboard"
                className={`hover:text-[#0891b2] transition-colors ${
                  location.pathname.startsWith('/portal/sno') ? 'text-[#0891b2] font-semibold' : ''
                }`}
              >
                Applications
              </Link>
            )}

            {/* Bank: DBT Applications link */}
            {user?.role === 'bank' && (
              <Link
                to="/portal/bank/dashboard"
                className={`hover:text-[#0891b2] transition-colors ${
                  location.pathname.startsWith('/portal/bank') ? 'text-[#0891b2] font-semibold' : ''
                }`}
              >
                DBT Applications
              </Link>
            )}

            <a
              href="#"
              className="flex items-center gap-1 hover:text-[#0891b2] transition-colors"
            >
              Download App
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
          </nav>
        </div>
      </header>

      {/* ── Blue announcement bar ── */}
      <div className="bg-[#1565c0] h-11 flex items-center justify-center">
        <p className="text-white font-semibold text-sm tracking-wide">
          {user?.role === 'gramdoot' && 'Welcome to Gramdoot Portal — Agricultural Labour Scheme'}
          {user?.role === 'ada' && 'Welcome to ADA Portal — Agricultural Labour Scheme'}
          {user?.role === 'sno' && 'Welcome to SNO Portal — Agricultural Labour Scheme'}
          {user?.role === 'bank' && 'Welcome to Bank Portal — Agricultural Labour Scheme'}
          {!user?.role && 'Welcome to Agricultural Labour Portal'}
        </p>
      </div>
    </>
  );
}
