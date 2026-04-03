import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplicants } from '../../context/ApplicantContext';
import { useDataDirs } from '../../context/DataDirsContext';

export default function ADARevertedApplicantList() {
  const navigate = useNavigate();
  const { applicants, loadADAReverted, revertedMeta } = useApplicants();
  const { gramPanchayats } = useDataDirs();

  const [ackInput, setAckInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [aadhaarInput, setAadhaarInput] = useState('');
  const [mobileInput, setMobileInput] = useState('');
  const [gpInput, setGpInput] = useState('');
  const [filters, setFilters] = useState({ ack: '', name: '', aadhaar: '', mobile: '', gp: '' });
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadADAReverted(page);
  }, [loadADAReverted, page]);

  const revertedApplicants = useMemo(() => {
    return applicants
      .filter((app) => app.status === 'reverted' || app.is_reverted === true)
      .filter((app) => {
        const gpId = app.fullForm?.gramPanchayat || app.gram_panchayat || '';
        return (
          (!filters.ack || app.ackId?.toLowerCase().includes(filters.ack.toLowerCase())) &&
          (!filters.name || app.name?.toLowerCase().includes(filters.name.toLowerCase())) &&
          (!filters.aadhaar || app.aadhaar?.includes(filters.aadhaar)) &&
          (!filters.mobile || app.mobile?.includes(filters.mobile)) &&
          (!filters.gp || gpId === filters.gp)
        );
      });
  }, [applicants, filters]);

  const totalPages = Math.max(1, revertedMeta.totalPages || 1);
  const listCount = revertedMeta.totalCount || revertedApplicants.length;

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleSearch = () => {
    setFilters({
      ack: ackInput,
      name: nameInput,
      aadhaar: aadhaarInput,
      mobile: mobileInput,
      gp: gpInput,
    });
    setPage(1);
  };

  const handleReset = () => {
    setAckInput('');
    setNameInput('');
    setAadhaarInput('');
    setMobileInput('');
    setGpInput('');
    setFilters({ ack: '', name: '', aadhaar: '', mobile: '', gp: '' });
    setPage(1);
  };

  const goPage = (nextPage) => {
    if (nextPage >= 1 && nextPage <= totalPages) setPage(nextPage);
  };

  const visiblePages = () => {
    const pages = [];
    for (let i = 1; i <= Math.min(totalPages, 3); i += 1) pages.push(i);
    return pages;
  };

  return (
    <main className="grow w-full px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-base font-bold text-gray-700 tracking-widest uppercase mb-4">
          Reverted Search Application
        </h2>

        <div className="mb-6">
          <div className="flex flex-wrap gap-3 items-end">
            <FilterInput label="Acknowledgement ID" value={ackInput} onChange={setAckInput} />
            <FilterInput label="Applicant Name" value={nameInput} onChange={setNameInput} />
            <FilterInput label="Aadhar No" value={aadhaarInput} onChange={setAadhaarInput} narrow />
            <FilterInput label="Mobile No" value={mobileInput} onChange={setMobileInput} narrow />

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-600">Gram Panchayat</label>
              <select
                value={gpInput}
                onChange={(e) => setGpInput(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1.5 text-sm w-52 focus:outline-none focus:border-[#3eb0c9]"
              >
                <option value="">Select Gram Panchayat</option>
                {gramPanchayats?.map((gp) => (
                  <option key={gp.id} value={String(gp.id)}>{gp.name}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pb-0.5">
              <button type="button" onClick={handleSearch} className="bg-[#3eb0c9] hover:bg-[#2a9ab0] text-white text-sm font-medium px-5 py-1.5 rounded transition-colors">
                Search
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium px-5 py-1.5 rounded transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <p className="text-[#0891b2] font-bold text-sm">
            Reverted Applicant List ({listCount})
          </p>
          <button
            type="button"
            onClick={() => loadADAReverted(page)}
            className="bg-[#3eb0c9] hover:bg-[#2a9ab0] text-white text-xs font-medium px-4 py-1.5 rounded transition-colors"
          >
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-700 text-xs font-semibold border-b border-gray-200">
                <th className="px-3 py-2.5 text-center border-r border-gray-200 w-10">#</th>
                <th className="px-3 py-2.5 text-center border-r border-gray-200">Acknowledgement ID</th>
                <th className="px-3 py-2.5 text-center border-r border-gray-200">Applicant Name</th>
                <th className="px-3 py-2.5 text-center border-r border-gray-200">Aadhaar No</th>
                <th className="px-3 py-2.5 text-center border-r border-gray-200">Mobile No</th>
                <th className="px-3 py-2.5 text-center border-r border-gray-200">Bank Name</th>
                <th className="px-3 py-2.5 text-center border-r border-gray-200">Branch Name</th>
                <th className="px-3 py-2.5 text-center border-r border-gray-200">Account Number</th>
                <th className="px-3 py-2.5 text-center border-r border-gray-200">IFSC</th>
                <th className="px-3 py-2.5 text-center border-r border-gray-200">Present in KB(N)</th>
                <th className="px-3 py-2.5 text-center border-r border-gray-200">Applied for Yuvasathi</th>
                <th className="px-3 py-2.5 text-center border-r border-gray-200">Revert Remarks</th>
                <th className="px-3 py-2.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {revertedApplicants.length === 0 ? (
                <tr>
                  <td colSpan="13" className="text-center py-10 text-gray-400 text-sm">
                    No reverted applicants found.
                  </td>
                </tr>
              ) : (
                revertedApplicants.map((app, index) => (
                  <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2 text-center text-xs text-gray-500 border-r border-gray-100">{((revertedMeta.currentPage || page) - 1) * (revertedMeta.perPage || revertedApplicants.length || 20) + index + 1}</td>
                    <td className="px-3 py-2 text-center text-xs font-mono text-[#0891b2] border-r border-gray-100">{app.ackId}</td>
                    <td className="px-3 py-2 text-center text-xs border-r border-gray-100">{app.name}</td>
                    <td className="px-3 py-2 text-center text-xs font-mono border-r border-gray-100">{app.aadhaar}</td>
                    <td className="px-3 py-2 text-center text-xs font-mono border-r border-gray-100">{app.mobile}</td>
                    <td className="px-3 py-2 text-center text-xs border-r border-gray-100">{app.bank_name || app.fullForm?.bankName || '—'}</td>
                    <td className="px-3 py-2 text-center text-xs border-r border-gray-100">{app.branch_name || app.fullForm?.branchName || '—'}</td>
                    <td className="px-3 py-2 text-center text-xs border-r border-gray-100">{app.account_number || app.fullForm?.accountNumber || '—'}</td>
                    <td className="px-3 py-2 text-center text-xs border-r border-gray-100">{app.ifsc || app.fullForm?.ifscCode || '—'}</td>
                    <td className="px-3 py-2 text-center text-xs border-r border-gray-100">{toYesNo(app.present_in_kbn ?? app.present_in_kb_n)}</td>
                    <td className="px-3 py-2 text-center text-xs border-r border-gray-100">{toYesNo(app.applied_yuvasathi ?? app.applied_for_yuvasathi)}</td>
                    <td className="px-3 py-2 text-center text-xs text-red-600 border-r border-gray-100">{app.revert_remarks || 'Reverted'}</td>
                    <td className="px-3 py-2 text-center">
                      <ActionBtn onClick={() => navigate(`/portal/ada/registration/${app.id}/view`)} title="View Application">
                        <EyeIcon />
                      </ActionBtn>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {revertedApplicants.length > 0 && (
          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <span>
              Showing <strong>{Math.min(((revertedMeta.currentPage || page) - 1) * (revertedMeta.perPage || revertedApplicants.length || 20) + 1, revertedMeta.totalCount || revertedApplicants.length)}</strong> to{' '}
              <strong>{Math.min((revertedMeta.currentPage || page) * (revertedMeta.perPage || revertedApplicants.length || 20), revertedMeta.totalCount || revertedApplicants.length)}</strong> of{' '}
              <strong>{revertedMeta.totalCount || revertedApplicants.length}</strong> records
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => goPage(1)}
                disabled={(revertedMeta.currentPage || page) === 1}
                className="px-2 py-1 text-xs border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-100"
              >
                First
              </button>
              {visiblePages().map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => goPage(p)}
                  className={`px-2.5 py-1 text-xs border rounded transition-colors ${
                    p === (revertedMeta.currentPage || page)
                      ? 'bg-[#3eb0c9] text-white border-[#3eb0c9]'
                      : 'border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              ))}
              {totalPages > 3 && (revertedMeta.currentPage || page) < totalPages && (
                <>
                  <span className="px-1 text-gray-400">...</span>
                  <button
                    type="button"
                    onClick={() => goPage(totalPages)}
                    className="px-2.5 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100"
                  >
                    {totalPages}
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => goPage(page + 1)}
                disabled={(revertedMeta.currentPage || page) === totalPages}
                className="px-2 py-1 text-xs border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-100"
              >
                Next
              </button>
              <button
                type="button"
                onClick={() => goPage(totalPages)}
                disabled={(revertedMeta.currentPage || page) === totalPages}
                className="px-2 py-1 text-xs border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-100"
              >
                Last
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function FilterInput({ label, value, onChange, narrow = false }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-600">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`border border-gray-300 rounded px-3 py-1.5 text-sm ${narrow ? 'w-40' : 'w-52'} focus:outline-none focus:border-[#3eb0c9]`}
      />
    </div>
  );
}

function ActionBtn({ onClick, title, children }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="bg-[#3eb0c9] hover:bg-[#2a9ab0] text-white p-1.5 rounded transition-colors"
    >
      {children}
    </button>
  );
}

function toYesNo(value) {
  if ([true, 'true', 1, '1'].includes(value)) return 'Yes';
  if ([false, 'false', 0, '0'].includes(value)) return 'No';
  return '—';
}

const EyeIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
