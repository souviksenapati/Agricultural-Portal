import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ROLE_HOME = {
  gramdoot: '/portal/dashboard',
  ada: '/portal/ada/dashboard',
  sno: '/portal/sno/dashboard',
  bank: '/portal/bank/dashboard',
};

const ROLE_LABELS = {
  gramdoot: 'Gramdoot',
  ada: 'ADA',
  sno: 'SNO',
  bank: 'Bank',
};

export default function Header() {
  const { user } = useAuth();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [quickRegOpen, setQuickRegOpen] = useState(false);
  const [adaMenuOpen, setAdaMenuOpen] = useState(false);

  const navRef = useRef(null);

  const dashboardPath = ROLE_HOME[user?.role] || '/';
  const isActive = (path) => location.pathname === path;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setQuickRegOpen(false);
        setAdaMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Auto close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // ==============================
  // 🔵 PORTAL HEADER (Logged In)
  // ==============================
  if (user) {
    return (
      <>
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-[72px]">

            {/* Logo */}
            <Link to={dashboardPath}>
              <img
                src="/image/logo_bsb.png"
                alt="WB Govt"
                className="h-14 w-auto object-contain"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-700">

              <Link
                to={dashboardPath}
                className={`hover:text-[#0891b2] transition ${isActive(dashboardPath)
                  ? 'text-[#0891b2] font-semibold'
                  : ''
                  }`}
              >
                Dashboard
              </Link>

              {/* Gramdoot */}
              {user.role === 'gramdoot' && (
                <div className="relative" ref={navRef}>
                  <button
                    onClick={() => setQuickRegOpen(!quickRegOpen)}
                    className={`flex items-center gap-1 hover:text-[#0891b2] ${location.pathname.startsWith('/portal/quick-registration')
                      ? 'text-[#0891b2] font-semibold'
                      : ''
                      }`}
                  >
                    Quick Registration
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {quickRegOpen && (
                    <div className="absolute left-0 mt-2 w-52 bg-white border rounded shadow-lg z-50">
                      <Link
                        to="/portal/quick-registration/new"
                        className="block px-4 py-2 hover:bg-gray-50"
                      >
                        Registration Form
                      </Link>
                      <Link
                        to="/portal/quick-registration/list"
                        className="block px-4 py-2 border-t hover:bg-gray-50"
                      >
                        Registered Applicant List
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* ADA */}
              {user.role === 'ada' && (
                <div className="relative" ref={navRef}>
                  <button
                    onClick={() => setAdaMenuOpen(!adaMenuOpen)}
                    className={`flex items-center gap-1 hover:text-[#0891b2] ${location.pathname.startsWith('/portal/ada')
                      ? 'text-[#0891b2] font-semibold'
                      : ''
                      }`}
                  >
                    Registered Applicant List
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {adaMenuOpen && (
                    <div className="absolute left-0 mt-2 w-52 bg-white border rounded shadow-lg z-50">
                      <Link
                        to="/portal/ada/applications"
                        className="block px-4 py-2 hover:bg-gray-50"
                      >
                        Registered Applicant List
                      </Link>
                      <Link
                        to="/portal/ada/pending"
                        className="block px-4 py-2 border-t hover:bg-gray-50"
                      >
                        Pending List
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* SNO */}
              {user.role === 'sno' && (
                <Link
                  to="/portal/sno/dashboard"
                  className={`hover:text-[#0891b2] ${location.pathname.startsWith('/portal/sno')
                    ? 'text-[#0891b2] font-semibold'
                    : ''
                    }`}
                >
                  Applications
                </Link>
              )}

              {/* Bank */}
              {user.role === 'bank' && (
                <Link
                  to="/portal/bank/dashboard"
                  className={`hover:text-[#0891b2] ${location.pathname.startsWith('/portal/bank')
                    ? 'text-[#0891b2] font-semibold'
                    : ''
                    }`}
                >
                  DBT Applications
                </Link>
              )}

              <a href="#" className="hover:text-[#0891b2]">
                Download App
              </a>
            </nav>

            {/* Mobile Hamburger */}
            <div className="sm:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Role Menu */}
        {isMenuOpen && (
          <div className="sm:hidden bg-white border-t px-4 py-4 flex flex-col gap-3 text-sm font-medium text-gray-700 shadow-md">

            <Link to={dashboardPath}>Dashboard</Link>

            {user.role === 'gramdoot' && (
              <>
                <Link to="/portal/quick-registration/new">
                  Registration Form
                </Link>
                <Link to="/portal/quick-registration/list">
                  Registered Applicant List
                </Link>
              </>
            )}

            {user.role === 'ada' && (
              <>
                <Link to="/portal/ada/applications">
                  Registered Applicant List
                </Link>
                <Link to="/portal/ada/pending">
                  Pending List
                </Link>
              </>
            )}

            {user.role === 'sno' && (
              <Link to="/portal/sno/dashboard">Applications</Link>
            )}

            {user.role === 'bank' && (
              <Link to="/portal/bank/dashboard">
                DBT Applications
              </Link>
            )}

            <a href="#">Download App</a>
          </div>
        )}

        {/* Blue Announcement Bar */}
        <div className="bg-[#1565c0] h-11 flex items-center justify-center">
          <p className="text-white font-semibold text-sm tracking-wide">
            Welcome to {ROLE_LABELS[user.role]} Portal Agricultural Labour Scheme
          </p>
        </div>
      </>
    );
  }

  // ==============================
  // 🟢 PUBLIC HEADER
  // ==============================
  return (
    <>
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/">
            <img
              src="/image/logo_bsb.png"
              alt="Govt Logo"
              className="h-16 w-auto"
            />
          </Link>

          <div className="hidden sm:flex gap-2">
            <Link
              to="/status"
              className="bg-[#00ACED] text-white px-4 py-2 rounded"
            >
              Check Application
            </Link>
            <button className="bg-[#00ACED] text-white px-4 py-2 rounded">
              New Application Form
            </button>
            <button className="bg-[#00ACED] text-white px-4 py-2 rounded">
              Faq
            </button>
          </div>

          <div className="sm:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="sm:hidden px-4 pb-4 flex flex-col gap-2 bg-white border-t">
            <Link
              to="/status"
              className="bg-[#00ACED] text-center text-white px-4 py-2 rounded"
            >
              Check Application
            </Link>
            <button className="bg-[#00ACED] text-center text-white px-4 py-2 rounded">
              New Application Form
            </button>
            <button className="bg-[#00ACED] text-center text-white px-4 py-2 rounded">
              Faq
            </button>
          </div>
        )}
      </header>

      <div className="bg-[#0648b3] text-white py-2 text-center font-medium">
        Welcome to Agricultural Labour Portal
      </div>
    </>
  );
}