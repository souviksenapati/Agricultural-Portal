import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApplicants } from '../../context/ApplicantContext';
import PortalHeader from '../../components/PortalHeader';
import PortalFooter from '../../components/PortalFooter';

export default function GramdootDashboard() {
  const { user } = useAuth();
  const { applicants } = useApplicants();

  // Count non-deleted applicants (in real app this would be per-gramdoot)
  const total = applicants.filter((a) => a.status !== 'deleted').length;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PortalHeader />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-10">
        <h2 className="text-base font-bold text-gray-800 text-center tracking-widest mb-6">
          DASHBOARD SUMMARY
        </h2>

        <div className="flex items-center gap-3 text-sm text-gray-700">
          <span className="font-medium">Quick Registration Application Count :</span>
          <span className="inline-flex items-center justify-center bg-gray-600 text-white text-xs font-bold rounded-full h-7 px-3 min-w-[28px]">
            {total}
          </span>
        </div>
      </main>

      <PortalFooter />
    </div>
  );
}
