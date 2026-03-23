import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplicants } from '../../context/ApplicantContext';
import { useDataDirs } from '../../context/DataDirsContext';


export default function ADADashboard() {
  const navigate = useNavigate();
  const { applicants, loadFarmers } = useApplicants();
  const { gpName } = useDataDirs();

  // Pull latest data from server on mount
  useEffect(() => { loadFarmers(); }, []);

  // Flash message — shown once right after login
  const [showWelcome] = useState(() => {
    const flag = sessionStorage.getItem('km_just_logged_in');
    if (flag) { sessionStorage.removeItem('km_just_logged_in'); return true; }
    return false;
  });

  // All non-deleted apps
  const visible = useMemo(
    () => applicants.filter((a) => a.status !== 'deleted'),
    [applicants]
  );

  // Group by Gram Panchayat ID (key = numeric id string, display via gpName)
  const gpRows = useMemo(() => {
    const map = {};
    visible.forEach((a) => {
      const gpId = a.fullForm?.gramPanchayat || '';
      const key = gpId || '—';
      if (!map[key]) map[key] = { total: 0, approved: 0, rejected: 0, pending: 0 };
      map[key].total++;
      if (a.status === 'approved' || a.status === 'sent_to_bank' || a.status === 'processed') {
        map[key].approved++;
      } else if (a.status === 'rejected') {
        map[key].rejected++;
      } else {
        map[key].pending++;
      }
    });
    return Object.entries(map).sort(([a], [b]) => {
      const nameA = gpName(a) || a;
      const nameB = gpName(b) || b;
      return nameA.localeCompare(nameB);
    });
  }, [visible, gpName]);

  const totals = gpRows.reduce(
    (acc, [, v]) => ({
      total: acc.total + v.total,
      approved: acc.approved + v.approved,
      rejected: acc.rejected + v.rejected,
      pending: acc.pending + v.pending,
    }),
    { total: 0, approved: 0, rejected: 0, pending: 0 }
  );

  const downloadCSV = () => {
    const header = 'Sl No,Gram Panchayat,Total Submitted,Approved,Rejected,Pending\n';
    const rows = gpRows
      .map(([gpId, v], i) => `${i + 1},"${gpName(gpId) || gpId}",${v.total},${v.approved},${v.rejected},${v.pending}`)
      .join('\n');
    const total = `Total,,${totals.total},${totals.approved},${totals.rejected},${totals.pending}`;
    const blob = new Blob([header + rows + '\n' + total], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ada_dashboard_summary.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="grow w-full px-0 py-0">
      {/* Signed in banner */}
      {showWelcome && (
        <div className="w-full bg-[#d9edf7] border-b border-[#bcdff1] px-6 py-3 text-[#31708f] text-sm font-medium">
          Signed in successfully.
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Title */}
        <h2 className="text-sm font-bold text-gray-800 text-center tracking-widest mb-6 uppercase">
          Dashboard Summary
        </h2>

        {/* Top bar: Download CSV (left) + count (right) */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={downloadCSV}
            className="bg-[#4caf50] hover:bg-[#388e3c] text-white text-xs font-semibold px-4 py-2 rounded transition-colors"
          >
            Download CSV
          </button>
          <div className="text-sm text-gray-700 font-medium flex items-center gap-2">
            Quick Registration Application Count :
            <span className="inline-flex items-center justify-center bg-[#555] text-white text-xs font-bold rounded-full h-7 px-3 min-w-7">
              {visible.length}
            </span>
          </div>
        </div>

        {/* GP Summary Table */}
        <div className="overflow-x-auto border border-gray-200">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-xs font-semibold border-b border-gray-300">
                <th className="px-4 py-2.5 text-center border-r border-gray-200 w-16">Sl No</th>
                <th className="px-4 py-2.5 text-center border-r border-gray-200">Gram Panchayat</th>
                <th className="px-4 py-2.5 text-center border-r border-gray-200">Total Submitted Application</th>
                <th className="px-4 py-2.5 text-center border-r border-gray-200">Approved Application</th>
                <th className="px-4 py-2.5 text-center border-r border-gray-200">Rejected Application</th>
                <th className="px-4 py-2.5 text-center">Pending Application</th>
              </tr>
            </thead>
            <tbody>
              {gpRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400 text-sm">
                    No applications found.
                  </td>
                </tr>
              ) : (
                gpRows.map(([gp, v], idx) => (
                  <tr
                    key={gp}
                    className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}
                  >
                    <td className="px-4 py-2 text-center text-gray-500 border-r border-gray-100">{idx + 1}</td>
                    <td className="px-4 py-2 text-center border-r border-gray-100">
                      <button
                        onClick={() => navigate(`/portal/ada/applications?gp=${encodeURIComponent(gp)}`)}
                        className="text-[#0891b2] hover:underline font-medium"
                      >
                        {gpName(gp) || gp}
                      </button>
                    </td>
                    <td className="px-4 py-2 text-center text-gray-600 border-r border-gray-100">{v.total}</td>
                    <td className="px-4 py-2 text-center text-gray-600 border-r border-gray-100">{v.approved}</td>
                    <td className="px-4 py-2 text-center text-gray-600 border-r border-gray-100">{v.rejected}</td>
                    <td className="px-4 py-2 text-center text-gray-600">{v.pending}</td>
                  </tr>
                ))
              )}
              {/* Total row */}
              {gpRows.length > 0 && (
                <tr className="bg-gray-100 font-semibold text-gray-700 border-t-2 border-gray-300">
                  <td className="px-4 py-2 text-center border-r border-gray-200" colSpan={2}>Total</td>
                  <td className="px-4 py-2 text-center border-r border-gray-200">{totals.total}</td>
                  <td className="px-4 py-2 text-center border-r border-gray-200">{totals.approved}</td>
                  <td className="px-4 py-2 text-center border-r border-gray-200">{totals.rejected}</td>
                  <td className="px-4 py-2 text-center">{totals.pending}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
