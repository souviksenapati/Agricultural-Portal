import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApplicants } from '../../context/ApplicantContext';
import PortalHeader from '../../components/PortalHeader';
import PortalFooter from '../../components/PortalFooter';

const PAGE_SIZE = 20;

export default function ApplicantList() {
  const { user } = useAuth();
  const { applicants } = useApplicants();
  const navigate = useNavigate();

  // Search state
  const [search, setSearch] = useState({ ackId: '', name: '', aadhaar: '', mobile: '' });
  const [applied, setApplied] = useState({ ackId: '', name: '', aadhaar: '', mobile: '' });
  const [page, setPage] = useState(1);

  // Exclude deleted from Gramdoot view
  const visible = useMemo(
    () => applicants.filter((a) => a.status !== 'deleted'),
    [applicants]
  );

  const filtered = useMemo(() => {
    return visible.filter((a) => {
      const s = applied;
      return (
        (!s.ackId   || a.ackId.toLowerCase().includes(s.ackId.toLowerCase())) &&
        (!s.name    || a.name.toLowerCase().includes(s.name.toLowerCase())) &&
        (!s.aadhaar || a.aadhaar.includes(s.aadhaar)) &&
        (!s.mobile  || a.mobile.includes(s.mobile))
      );
    });
  }, [visible, applied]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = () => { setApplied({ ...search }); setPage(1); };
  const handleReset  = () => {
    const empty = { ackId: '', name: '', aadhaar: '', mobile: '' };
    setSearch(empty); setApplied(empty); setPage(1);
  };

  const goPage = (p) => { if (p >= 1 && p <= totalPages) setPage(p); };

  const visiblePages = () => {
    const pages = [];
    for (let i = 1; i <= Math.min(totalPages, 3); i++) pages.push(i);
    return pages;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PortalHeader />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8">

        {/* ── Search section ── */}
        <h2 className="text-sm font-bold text-gray-800 tracking-widest mb-4">
          SEARCH REGISTERED APPLICANT
        </h2>

        <div className="flex flex-wrap items-end gap-3 mb-6">
          {[
            { key: 'ackId',   label: 'Acknowledgement ID' },
            { key: 'name',    label: 'Applicant Name' },
            { key: 'aadhaar', label: 'Aadhar No' },
            { key: 'mobile',  label: 'Mobile No' },
          ].map(({ key, label }) => (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">{label}</label>
              <input
                type="text"
                value={search[key]}
                onChange={(e) => setSearch({ ...search, [key]: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="border border-gray-300 rounded px-3 py-1.5 text-sm w-44 focus:outline-none focus:border-[#0891b2] focus:ring-1 focus:ring-[#0891b2]"
              />
            </div>
          ))}
          <div className="flex gap-2 pb-0.5">
            <button
              onClick={handleSearch}
              className="bg-[#1565c0] hover:bg-[#1253a0] text-white text-sm font-medium px-5 py-2 rounded transition-colors"
            >
              Search
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium px-5 py-2 rounded transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* ── Table ── */}
        <h3 className="text-[#0891b2] font-semibold text-sm mb-3">
          Registered Applicant List
        </h3>

        <div className="overflow-x-auto border border-gray-200 rounded">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-xs uppercase tracking-wide">
                <th className="px-3 py-2.5 text-center w-10">#</th>
                <th className="px-3 py-2.5 text-center">Acknowledgement ID</th>
                <th className="px-3 py-2.5 text-center">Applicant Name</th>
                <th className="px-3 py-2.5 text-center">Aadhaar No</th>
                <th className="px-3 py-2.5 text-center">Mobile No</th>
                <th className="px-3 py-2.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400 text-sm">
                    No records found.
                  </td>
                </tr>
              ) : (
                paginated.map((row, idx) => (
                  <tr
                    key={row.id}
                    className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-3 py-2 text-center text-gray-600">
                      {(page - 1) * PAGE_SIZE + idx + 1}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => navigate(`/portal/registration/${row.id}/view`)}
                        className="text-[#0891b2] hover:underline font-mono text-xs"
                      >
                        {row.ackId}
                      </button>
                    </td>
                    <td className="px-3 py-2 text-center text-gray-700">{row.name}</td>
                    <td className="px-3 py-2 text-center text-gray-600 font-mono text-xs">{row.aadhaar}</td>
                    <td className="px-3 py-2 text-center text-gray-600 font-mono text-xs">{row.mobile}</td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Edit: only for pending/rejected */}
                        {(row.status === 'pending' || row.status === 'rejected') && (
                          <button
                            onClick={() => navigate(`/portal/registration/${row.id}/edit`)}
                            title="Edit Application"
                            className="bg-[#0891b2] hover:bg-[#0e7490] text-white p-1.5 rounded transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        )}
                        {/* View */}
                        <button
                          onClick={() => navigate(`/portal/registration/${row.id}/view`)}
                          title="View Application"
                          className="bg-[#0891b2] hover:bg-[#0e7490] text-white p-1.5 rounded transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <span>
              Showing{' '}
              <strong>{Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}</strong> to{' '}
              <strong>{Math.min(page * PAGE_SIZE, filtered.length)}</strong> of{' '}
              <strong>{filtered.length}</strong> records
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => goPage(1)}
                disabled={page === 1}
                className="px-2 py-1 text-xs border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-100"
              >
                « First
              </button>
              {visiblePages().map((p) => (
                <button
                  key={p}
                  onClick={() => goPage(p)}
                  className={`px-2.5 py-1 text-xs border rounded transition-colors ${
                    p === page
                      ? 'bg-[#1565c0] text-white border-[#1565c0]'
                      : 'border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              ))}
              {totalPages > 3 && page < totalPages && (
                <>
                  <span className="px-1 text-gray-400">…</span>
                  <button onClick={() => goPage(totalPages)} className="px-2.5 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100">
                    {totalPages}
                  </button>
                </>
              )}
              <button
                onClick={() => goPage(page + 1)}
                disabled={page === totalPages}
                className="px-2 py-1 text-xs border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-100"
              >
                Next ›
              </button>
              <button
                onClick={() => goPage(totalPages)}
                disabled={page === totalPages}
                className="px-2 py-1 text-xs border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-100"
              >
                Last »
              </button>
            </div>
          </div>
        )}
      </main>

      <PortalFooter />
    </div>
  );
}
