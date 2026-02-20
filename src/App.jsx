import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import TopBar from './components/TopBar';
import Footer from './components/Footer';
import SubFooter from './components/SubFooter';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load route components
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const SOP = React.lazy(() => import('./pages/SOP'));
const Helpline = React.lazy(() => import('./pages/Helpline'));
const FarmerSearch = React.lazy(() => import('./components/FarmerSearch'));

export default function AgriculturalPortal() {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <div className="min-h-screen flex flex-col font-roboto text-[15px] bg-white relative overflow-x-hidden">
            <AuthProvider>
                <TopBar />
                <Header />
                <main className="flex-grow flex flex-col items-center w-full bg-white">
                    <Suspense fallback={<div className="flex-grow flex items-center justify-center p-8 text-gray-500">Loading...</div>}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/sop" element={<SOP />} />
                            <Route path="/helpline" element={<Helpline />} />
                            <Route path="/status" element={<FarmerSearch />} />
                        </Routes>
                    </Suspense>
                </main>
                {isHome && <Footer />}
                <SubFooter />
            </AuthProvider>
        </div>
    );
}
