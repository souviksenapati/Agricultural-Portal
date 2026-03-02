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
const ROLE_LABELS = { gramdoot: 'Gramdoot', ada: 'ADA', sno: 'SNO', bank: 'Bank' };

// Single Header � renders portal nav when logged in, public nav when logged out.
// TopBar.jsx handles the login bar / user email bar above this.
export default function Header() {
  const { user } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [quickRegOpen, setQuickRegOpen] = useState(false);
  const [adaMenuOpen,  setAdaMenuOpen]  = useState(false);
  const navRef = useRef(null);

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

  const dashboardPath = ROLE_HOME[user?.role] || '/';
  const isActive = (path) => location.pathname === path;

  //  Portal Header 
  if (user) {
    return (
      <>
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link to={dashboardPath}>
              <img src="/image/logo_bsb.png" alt="WB Govt" className="h-14 w-auto object-contain" />
            </Link>

            {/* Role-based nav */}
            <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-700">
              <Link
                to={dashboardPath}
                className={`hover:text-[#0891b2] transition-colors ${isActive(dashboardPath) ? 'text-[#0891b2] font-semibold' : ''}`}
              >
                Dashboard
              </Link>

              {user.role === 'gramdoot' && (
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

              {user.role === 'ada' && (
                <div className="relative" ref={navRef}>
                  <button
                    onClick={() => setAdaMenuOpen(!adaMenuOpen)}
                    className={`flex items-center gap-1 hover:text-[#0891b2] transition-colors ${
                      location.pathname.startsWith('/portal/ada') ? 'text-[#0891b2] font-semibold' : ''
                    }`}
                  >
                    Registered Applicant List
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {adaMenuOpen && (
                    <div className="absolute left-0 mt-2 w-52 bg-white border border-gray-200 rounded shadow-lg z-50">
                      <Link
                        to="/portal/ada/applications"
                        onClick={() => setAdaMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0891b2]"
                      >
                        Registered Applicant List
                      </Link>
                      <Link
                        to="/portal/ada/pending"
                        onClick={() => setAdaMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0891b2] border-t border-gray-100"
                      >
                        Pending List
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {user.role === 'sno' && (
                <Link
                  to="/portal/sno/dashboard"
                  className={`hover:text-[#0891b2] transition-colors ${location.pathname.startsWith('/portal/sno') ? 'text-[#0891b2] font-semibold' : ''}`}
                >
                  Applications
                </Link>
              )}

              {user.role === 'bank' && (
                <Link
                  to="/portal/bank/dashboard"
                  className={`hover:text-[#0891b2] transition-colors ${location.pathname.startsWith('/portal/bank') ? 'text-[#0891b2] font-semibold' : ''}`}
                >
                  DBT Applications
                </Link>
              )}

              <a href="#" className="flex items-center gap-1 hover:text-[#0891b2] transition-colors">
                Download App
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            </nav>
          </div>
        </header>

        {/* Blue announcement bar */}
        <div className="bg-[#1565c0] h-11 flex items-center justify-center">
          <p className="text-white font-semibold text-sm tracking-wide">
            Welcome to {ROLE_LABELS[user.role]} Portal � Agricultural Labour Scheme
          </p>
        </div>
      </>
    );
  }

  //  Public Header 
  return (
    <>
      <header className="w-full bg-white border-b shadow-sm">
        <div className="w-full max-w-[1280px] mx-auto flex items-center justify-between px-4 py-3">
          <div className="shrink-0">
            <Link to="/">
              <img src="/image/logo_bsb.png" alt="Govt Logo" className="h-14 sm:h-16 md:h-20 w-auto" />
            </Link>
          </div>

          {/* Desktop buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <Link
              to="/status"
              className="bg-[#00ACED] text-white text-xs sm:text-sm px-4 py-2 rounded shadow-sm hover:bg-[#009bd5] transition font-medium whitespace-nowrap"
            >
              Check Application
            </Link>
            <button className="bg-[#00ACED] text-white text-xs sm:text-sm px-4 py-2 rounded shadow-sm hover:bg-[#009bd5] transition font-medium whitespace-nowrap">
              New Application Form
            </button>
            <button className="bg-[#00ACED] text-white text-xs sm:text-sm px-4 py-2 rounded shadow-sm hover:bg-[#009bd5] transition font-medium whitespace-nowrap">
              Faq
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="sm:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {isMenuOpen && (
          <div className="sm:hidden px-4 pb-4 flex flex-col gap-2 bg-white border-t">
            <Link
              to="/status"
              className="mt-2 bg-[#00ACED] text-white text-sm px-4 py-2 rounded shadow-sm hover:bg-[#009bd5] transition font-medium text-center"
            >
              Check Application
            </Link>
            <button className="bg-[#00ACED] text-white text-sm px-4 py-2 rounded shadow-sm hover:bg-[#009bd5] transition font-medium">
              New Application Form
            </button>
            <button className="bg-[#00ACED] text-white text-sm px-4 py-2 rounded shadow-sm hover:bg-[#009bd5] transition font-medium">
              Faq
            </button>
          </div>
        )}
      </header>

      {/* Marquee */}
      <div className="w-full bg-[#0648b3] text-white overflow-hidden py-2 md:py-3">
        <div className="w-full max-w-[1280px] mx-auto whitespace-nowrap animate-marquee text-center font-medium text-sm sm:text-base md:text-lg tracking-wide px-4">
          <span>Welcome to Agricultural Labour Portal</span>
        </div>
      </div>
    </>
  );
}