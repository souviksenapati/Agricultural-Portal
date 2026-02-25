import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ApplicantProvider } from './context/ApplicantContext';

// ── Public portal ─────────────────────────────────────────────────────────────
import TopBar from './components/TopBar';
import Header from './components/Header';
import Footer from './components/Footer';
import SubFooter from './components/SubFooter';
import Copyright from './pages/Copyright';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
const Home         = React.lazy(() => import('./pages/Home'));
const About        = React.lazy(() => import('./pages/About'));
const SOP          = React.lazy(() => import('./pages/SOP'));
const Helpline     = React.lazy(() => import('./pages/Helpline'));
const FarmerSearch = React.lazy(() => import('./components/FarmerSearch'));

// ── Internal portal ───────────────────────────────────────────────────────────
import Login       from './pages/Login';
import PortalRoute from './components/PortalRoute';
const GramdootDashboard    = React.lazy(() => import('./pages/gramdoot/Dashboard'));
const RegistrationForm     = React.lazy(() => import('./pages/gramdoot/RegistrationForm'));
const FullRegistrationForm = React.lazy(() => import('./pages/gramdoot/FullRegistrationForm'));
const ViewApplication      = React.lazy(() => import('./pages/gramdoot/ViewApplication'));
const ApplicantList        = React.lazy(() => import('./pages/gramdoot/ApplicantList'));
const ADADashboard         = React.lazy(() => import('./pages/ada/Dashboard'));
const SNODashboard         = React.lazy(() => import('./pages/sno/Dashboard'));
const BankDashboard        = React.lazy(() => import('./pages/bank/Dashboard'));

// ── Public layout wrapper ─────────────────────────────────────────────────────
function PublicLayout({ children }) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  return (
    <div className="min-h-screen flex flex-col font-roboto text-[15px] bg-white relative overflow-x-hidden">
      <TopBar />
      <Header />
      <main className="flex-grow flex flex-col items-center w-full bg-white">
        {children}
      </main>
      {isHome && <Footer />}
      <SubFooter />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ApplicantProvider>
        <Suspense fallback={<div className="p-12 text-center text-gray-500">Loading...</div>}>
          <Routes>
            {/* ── Public pages ── */}
            <Route path="/"          element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/about"     element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/sop"       element={<PublicLayout><SOP /></PublicLayout>} />
            <Route path="/helpline"  element={<PublicLayout><Helpline /></PublicLayout>} />
            <Route path="/status"    element={<PublicLayout><FarmerSearch /></PublicLayout>} />
            <Route path="/copyright" element={<PublicLayout><Copyright /></PublicLayout>} />
            <Route path="/contact"   element={<PublicLayout><Contact /></PublicLayout>} />

            {/* ── Portal login ── */}
            <Route path="/portal"       element={<Navigate to="/portal/login" replace />} />
            <Route path="/portal/login" element={<Login />} />

            {/* ── Gramdoot ── */}
            <Route path="/portal/dashboard"
              element={<PortalRoute role="gramdoot"><GramdootDashboard /></PortalRoute>} />
            <Route path="/portal/quick-registration/new"
              element={<PortalRoute role="gramdoot"><RegistrationForm /></PortalRoute>} />
            <Route path="/portal/quick-registration/list"
              element={<PortalRoute role="gramdoot"><ApplicantList /></PortalRoute>} />
            <Route path="/portal/registration/:id/edit"
              element={<PortalRoute role="gramdoot"><FullRegistrationForm /></PortalRoute>} />
            <Route path="/portal/registration/:id/view"
              element={<PortalRoute role="gramdoot"><ViewApplication /></PortalRoute>} />

            {/* ── ADA ── */}
            <Route path="/portal/ada/dashboard"
              element={<PortalRoute role="ada"><ADADashboard /></PortalRoute>} />
            <Route path="/portal/ada/registration/:id/view"
              element={<PortalRoute role="ada"><ViewApplication /></PortalRoute>} />

            {/* ── SNO ── */}
            <Route path="/portal/sno/dashboard"
              element={<PortalRoute role="sno"><SNODashboard /></PortalRoute>} />
            <Route path="/portal/sno/registration/:id/view"
              element={<PortalRoute role="sno"><ViewApplication /></PortalRoute>} />

            {/* ── Bank ── */}
            <Route path="/portal/bank/dashboard"
              element={<PortalRoute role="bank"><BankDashboard /></PortalRoute>} />

            {/* ── 404 ── */}
            <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
          </Routes>
        </Suspense>
      </ApplicantProvider>
    </AuthProvider>
  );
}

