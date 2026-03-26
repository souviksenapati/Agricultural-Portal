import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplicants } from '../../context/ApplicantContext';
import { useDataDirs } from '../../context/DataDirsContext';

export default function ADARejectedApplicantList() {
  const navigate = useNavigate();
  const { applicants, loadFarmers } = useApplicants();
  const { gramPanchayats } = useDataDirs();

  const [filters, setFilters] = useState({
    ack: '',
    name: '',
    aadhaar: '',
    mobile: '',
    gp: '',
  });

  useEffect(() => {
    loadFarmers();
  }, [loadFarmers]);

  const rejectedApplicants = useMemo(() => {
    return applicants
      .filter((app) => app.status === 'rejected' || app.is_rejected === true)
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

  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleReset = () => {
    setFilters({ ack: '', name: '', aadhaar: '', mobile: '', gp: '' });
  };

  return (
    <main className="grow w-full px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-base font-bold text-gray-700 tracking-widest uppercase mb-4">
          Rejected Search Application
        </h2>

        <div className="mb-6">
          <div className="flex flex-wrap gap-3 items-end">
            <FilterInput label="Acknowledgement ID" name="ack" value={filters.ack} onChange={handleChange} />
            <FilterInput label="Applicant Name" name="name" value={filters.name} onChange={handleChange} />
            <FilterInput label="Aadhar No" name="aadhaar" value={filters.aadhaar} onChange={handleChange} narrow />
            <FilterInput label="Mobile No" name="mobile" value={filters.mobile} onChange={handleChange} narrow />

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-600">Gram Panchayat</label>
              <select
                name="gp"
                value={filters.gp}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-1.5 text-sm w-52 focus:outline-none focus:border-[#3eb0c9]"
              >
                <option value="">Select Gram Panchayat</option>
                {gramPanchayats?.map((gp) => (
                  <option key={gp.id} value={String(gp.id)}>{gp.name}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pb-0.5">
              <button type="button" className="bg-[#3eb0c9] hover:bg-[#2a9ab0] text-white text-sm font-medium px-5 py-1.5 rounded transition-colors">
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
            Rejected Applicant List ({rejectedApplicants.length})
          </p>
          <button
            type="button"
            onClick={loadFarmers}
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
                <th className="px-3 py-2.5 text-center border-r border-gray-200">Remarks</th>
                <th className="px-3 py-2.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {rejectedApplicants.length === 0 ? (
                <tr>
                  <td colSpan="13" className="text-center py-10 text-gray-400 text-sm">
                    No rejected applicants found.
                  </td>
                </tr>
              ) : (
                rejectedApplicants.map((app, index) => (
                  <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2 text-center text-xs text-gray-500 border-r border-gray-100">{index + 1}</td>
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
                    <td className="px-3 py-2 text-center text-xs text-red-600 border-r border-gray-100">{app.remarks || 'Rejected'}</td>
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
      </div>
    </main>
  );
}

function FilterInput({ label, name, value, onChange, narrow = false }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-600">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
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
