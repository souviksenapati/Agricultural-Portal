import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ApplicantProvider } from './context/ApplicantContext';
import { DataDirsProvider } from './context/DataDirsContext';

//  Shared layout components 
import TopBar from './components/TopBar';
import Header from './components/Header';
import Footer from './components/Footer';
import SubFooter from './components/SubFooter';
import Copyright from './pages/Copyright';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const SOP = React.lazy(() => import('./pages/SOP'));
const Helpline = React.lazy(() => import('./pages/Helpline'));
const FarmerSearch = React.lazy(() => import('./components/FarmerSearch'));

//  Portal pages 
import PortalRoute from './components/PortalRoute';
import ADAApprovedApplicantList from './pages/ada/ApprovedList';
import ADASentToBankApplicantList from './pages/ada/SentToBankList';
import ADARejectedApplicantList from './pages/ada/RejectedList';
import ADARevertedApplicantList from './pages/ada/RevertedList';
import ADADeletedApplicantList from './pages/ada/DeletedList';

import ADAMembersList from './pages/ada/MemberList';
import NewMember from './pages/ada/NewMember';

const GramdootDashboard = React.lazy(() => import('./pages/gramdoot/Dashboard'));
const RegistrationForm = React.lazy(() => import('./pages/gramdoot/RegistrationForm'));
const FullRegistrationForm = React.lazy(() => import('./pages/gramdoot/FullRegistrationForm'));
const ViewApplication = React.lazy(() => import('./pages/gramdoot/ViewApplication'));
const ApplicantList = React.lazy(() => import('./pages/gramdoot/ApplicantList'));
const ADADashboard = React.lazy(() => import('./pages/ada/Dashboard'));
const ADAApplicantList = React.lazy(() => import('./pages/ada/ApplicantList'));
const SNODashboard = React.lazy(() => import('./pages/sno/Dashboard'));
const BankDashboard = React.lazy(() => import('./pages/bank/Dashboard'));

//  Unified App Layout 
// wrapMain=true   wraps children in <main> (for public pages without own <main>)
// wrapMain=false  passes children through directly (portal pages have own <main>)
function AppLayout({ children, wrapMain = true }) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  return (
    <div className="min-h-screen flex flex-col font-roboto text-[15px] bg-white relative overflow-x-hidden">
      <TopBar />
      <Header />
      {wrapMain ? (
        <main className="grow flex flex-col items-center w-full bg-white">{children}</main>
      ) : (
        children
      )}
      {isHome && <Footer />}
      <SubFooter />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataDirsProvider>
        <ApplicantProvider>
          <Suspense fallback={<div className="p-12 text-center text-gray-500">Loading...</div>}>
            <Routes>
              {/*  Public pages  */}
              <Route path="/" element={<AppLayout><Home /></AppLayout>} />
              <Route path="/about" element={<AppLayout><About /></AppLayout>} />
              <Route path="/sop" element={<AppLayout><SOP /></AppLayout>} />
              <Route path="/helpline" element={<AppLayout><Helpline /></AppLayout>} />
              <Route path="/status" element={<AppLayout><FarmerSearch /></AppLayout>} />
              <Route path="/copyright" element={<AppLayout><Copyright /></AppLayout>} />
              <Route path="/contact" element={<AppLayout><Contact /></AppLayout>} />

              {/*  /portal → back to home; login is via TopBar modal only */}
              <Route path="/portal" element={<Navigate to="/" replace />} />

              {/*  Gramdoot  */}
              <Route path="/portal/dashboard"
                element={<AppLayout wrapMain={false}><PortalRoute role="gramdoot"><GramdootDashboard /></PortalRoute></AppLayout>} />
              <Route path="/portal/quick-registration/new"
                element={<AppLayout wrapMain={false}><PortalRoute role="gramdoot"><RegistrationForm /></PortalRoute></AppLayout>} />
              <Route path="/portal/quick-registration/list"
                element={<AppLayout wrapMain={false}><PortalRoute role="gramdoot"><ApplicantList /></PortalRoute></AppLayout>} />
              <Route path="/portal/registration/:id/edit"
                element={<AppLayout wrapMain={false}><PortalRoute role="gramdoot"><FullRegistrationForm /></PortalRoute></AppLayout>} />
              <Route path="/portal/registration/:id/view"
                element={<AppLayout wrapMain={false}><PortalRoute role="gramdoot"><ViewApplication /></PortalRoute></AppLayout>} />

              {/*  ADA  */}
              <Route path="/portal/ada/dashboard"
                element={<AppLayout wrapMain={false}><PortalRoute role="ada"><ADADashboard /></PortalRoute></AppLayout>} />
              <Route path="/portal/ada/applications"
                element={<AppLayout wrapMain={false}><PortalRoute role="ada"><ADAApplicantList /></PortalRoute></AppLayout>} />
              <Route path="/portal/ada/approved"
                element={<AppLayout wrapMain={false}><PortalRoute role="ada"><ADAApplicantList /></PortalRoute></AppLayout>} />
              <Route path="/portal/ada/send_to_bank"
                element={<AppLayout wrapMain={false}><PortalRoute role="ada"><ADASentToBankApplicantList /></PortalRoute></AppLayout>} />
              <Route path="/portal/ada/pending"
                element={<AppLayout wrapMain={false}><PortalRoute role="ada"><ADAApplicantList /></PortalRoute></AppLayout>} />
              <Route path="/portal/ada/rejected_list"
                element={<AppLayout wrapMain={false}><PortalRoute role="ada"><ADARejectedApplicantList /></PortalRoute></AppLayout>} />
              <Route path="/portal/ada/reverted_list"
                element={<AppLayout wrapMain={false}><PortalRoute role="ada"><ADARevertedApplicantList /></PortalRoute></AppLayout>} />
              <Route path="/portal/ada/deleted_list"
                element={<AppLayout wrapMain={false}><PortalRoute role="ada"><ADADeletedApplicantList /></PortalRoute></AppLayout>} />
              <Route path="/portal/ada/members"
                element={<AppLayout wrapMain={false}><PortalRoute role="ada"><ADAMembersList /></PortalRoute></AppLayout>} />
              <Route path="/portal/ada/members/new"
                element={<AppLayout wrapMain={false}><PortalRoute role="ada"><NewMember /></PortalRoute></AppLayout>} />


              <Route path="/portal/ada/registration/:id/view"
                element={<AppLayout wrapMain={false}><PortalRoute role="ada"><ViewApplication /></PortalRoute></AppLayout>} />

              {/*  SNO  */}
              <Route path="/portal/sno/dashboard"
                element={<AppLayout wrapMain={false}><PortalRoute role="sno"><SNODashboard /></PortalRoute></AppLayout>} />
              <Route path="/portal/sno/registration/:id/view"
                element={<AppLayout wrapMain={false}><PortalRoute role="sno"><ViewApplication /></PortalRoute></AppLayout>} />

              {/*  Bank  */}
              <Route path="/portal/bank/dashboard"
                element={<AppLayout wrapMain={false}><PortalRoute role="bank"><BankDashboard /></PortalRoute></AppLayout>} />

              {/*  404  */}
              <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
            </Routes>
          </Suspense>
        </ApplicantProvider>
      </DataDirsProvider>
    </AuthProvider>
  );
}