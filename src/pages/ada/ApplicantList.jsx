import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApplicants } from '../../context/ApplicantContext';
import { useDataDirs } from '../../context/DataDirsContext';

export default function ADAApplicantList() {
  const navigate = useNavigate();
  const { search, pathname } = useLocation();
  const params = new URLSearchParams(search);
  const gpFilter    = params.get('gp') || '';
  const isPending   = pathname.endsWith('/pending');

  const { applicants, approveApplicant, rejectApplicant, deleteApplicant, loadFarmers } = useApplicants();
  const { districtName, blockName } = useDataDirs();

  useEffect(() => { loadFarmers(); }, []);

  // Search field states (applied only on Search click)
  const [ackInput,    setAckInput]    = useState('');
  const [nameInput,   setNameInput]   = useState('');
  const [aadhaarInput,setAadhaarInput]= useState('');
  const [mobileInput, setMobileInput] = useState('');
  const [applied, setApplied] = useState({ ack: '', name: '', aadhaar: '', mobile: '' });

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [actionError, setActionError] = useState('');

  const handleSearch = () => setApplied({ ack: ackInput, name: nameInput, aadhaar: aadhaarInput, mobile: mobileInput });
  const handleReset  = () => {
    setAckInput(''); setNameInput(''); setAadhaarInput(''); setMobileInput('');
    setApplied({ ack: '', name: '', aadhaar: '', mobile: '' });
  };

  const list = useMemo(() => {
    let arr = applicants.filter((a) => a.status !== 'deleted');
    if (isPending) arr = arr.filter((a) => a.status === 'pending');
    if (gpFilter)  arr = arr.filter((a) => (a.fullForm?.gramPanchayat || '—') === gpFilter);
    if (applied.ack)     arr = arr.filter((a) => a.ackId?.toLowerCase().includes(applied.ack.toLowerCase()));
    if (applied.name)    arr = arr.filter((a) => a.name?.toLowerCase().includes(applied.name.toLowerCase()));
    if (applied.aadhaar) arr = arr.filter((a) => a.aadhaar?.includes(applied.aadhaar));
    if (applied.mobile)  arr = arr.filter((a) => a.mobile?.includes(applied.mobile));
    return arr;
  }, [applicants, isPending, gpFilter, applied]);

  const searchHeading = isPending ? 'Search Pending Applicant' : 'Search Registered Applicant';
  const listHeading   = isPending ? 'Pending Applicant List'   : 'Registered Applicant List';

  return (
    <>
      <main className="flex-grow w-full px-4 py-8">
        <div className="max-w-7xl mx-auto">

          {/* Page heading */}
          <h2 className="text-base font-bold text-gray-700 tracking-widest uppercase mb-4">
            {searchHeading}
          </h2>

          {/* Search form */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600">Acknowledgement ID</label>
                <input
                  value={ackInput}
                  onChange={(e) => setAckInput(e.target.value)}
                  placeholder={isPending ? 'Search by acknowledgement ID' : ''}
                  className="border border-gray-300 rounded px-3 py-1.5 text-sm w-52 focus:outline-none focus:border-[#3eb0c9]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600">Applicant Name</label>
                <input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder={isPending ? 'Search by name' : ''}
                  className="border border-gray-300 rounded px-3 py-1.5 text-sm w-48 focus:outline-none focus:border-[#3eb0c9]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600">Aadhar No</label>
                <input
                  value={aadhaarInput}
                  onChange={(e) => setAadhaarInput(e.target.value)}
                  placeholder={isPending ? 'Search by Aadhaar' : ''}
                  className="border border-gray-300 rounded px-3 py-1.5 text-sm w-40 focus:outline-none focus:border-[#3eb0c9]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className={`text-xs ${isPending ? 'text-[#c08000]' : 'text-gray-600'}`}>Mobile No</label>
                <input
                  value={mobileInput}
                  onChange={(e) => setMobileInput(e.target.value)}
                  placeholder={isPending ? 'Search by mobile' : ''}
                  className="border border-gray-300 rounded px-3 py-1.5 text-sm w-36 focus:outline-none focus:border-[#3eb0c9]"
                />
              </div>
              <div className="flex gap-2 pb-0.5">
                <button
                  onClick={handleSearch}
                  className="bg-[#3eb0c9] hover:bg-[#2a9ab0] text-white text-sm font-medium px-5 py-1.5 rounded"
                >
                  Search
                </button>
                <button
                  onClick={handleReset}
                  className="bg-[#3eb0c9] hover:bg-[#2a9ab0] text-white text-sm font-medium px-5 py-1.5 rounded"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Action error banner */}
          {actionError && (
            <div className="mb-3 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded">
              <span className="flex-1">{actionError}</span>
              <button onClick={() => setActionError('')} className="text-red-400 hover:text-red-700 text-lg leading-none">&times;</button>
            </div>
          )}

          {/* List heading */}
          <p className="text-[#0891b2] font-bold text-sm mb-2">{listHeading}</p>

          {/* Table */}
          <div className="overflow-x-auto border border-gray-200">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-700 text-xs font-semibold border-b border-gray-200">
                  <th className="px-3 py-2.5 text-center border-r border-gray-200 w-10">#</th>
                  <th className="px-3 py-2.5 text-center border-r border-gray-200">Acknowledgement ID</th>
                  <th className="px-3 py-2.5 text-center border-r border-gray-200">Applicant Name</th>
                  <th className="px-3 py-2.5 text-center border-r border-gray-200">Aadhaar No</th>
                  <th className="px-3 py-2.5 text-center border-r border-gray-200">Mobile No</th>
                  {isPending && <th className="px-3 py-2.5 text-center border-r border-gray-200">District</th>}
                  {isPending && <th className="px-3 py-2.5 text-center border-r border-gray-200">Block</th>}
                  <th className="px-3 py-2.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0 ? (
                  <tr>
                    <td colSpan={isPending ? 8 : 6} className="text-center py-10 text-gray-400 text-sm">
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  list.map((row, idx) => (
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2 text-center text-gray-500 border-r border-gray-100 text-xs">{idx + 1}</td>
                      <td className="px-3 py-2 text-center font-mono text-xs text-[#0891b2] border-r border-gray-100">{row.ackId}</td>
                      <td className="px-3 py-2 text-center text-gray-700 text-xs border-r border-gray-100">{row.name}</td>
                      <td className="px-3 py-2 text-center font-mono text-xs text-gray-600 border-r border-gray-100">{row.aadhaar}</td>
                      <td className={`px-3 py-2 text-center font-mono text-xs text-gray-600 border-r border-gray-100${isPending ? '' : ''}`}>{row.mobile}</td>
                      {isPending && (
                        <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">
                          {districtName(row.fullForm?.district) || '—'}
                        </td>
                      )}
                      {isPending && (
                        <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">
                          {blockName(row.fullForm?.block) || '—'}
                        </td>
                      )}
                      <td className="px-3 py-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <ActionBtn color="cyan" title="View Application" onClick={() => navigate(`/portal/ada/registration/${row.id}/view`)}>
                            <EyeIcon />
                          </ActionBtn>
                          {(row.status === 'pending' || row.status === 'rejected') && (
                            <ActionBtn color="green" title="Approve" onClick={async () => {
                              try { await approveApplicant(row.id); }
                              catch (e) { setActionError(e.message || 'Approve failed'); }
                            }}>
                              <CheckIcon />
                            </ActionBtn>
                          )}
                          {(row.status === 'pending' || row.status === 'approved') && (
                            <ActionBtn color="orange" title="Reject" onClick={async () => {
                              try { await rejectApplicant(row.id); }
                              catch (e) { setActionError(e.message || 'Reject failed'); }
                            }}>
                              <XIcon />
                            </ActionBtn>
                          )}
                          <ActionBtn color="red" title="Delete" onClick={() => setConfirmDelete(row)}>
                            <TrashIcon />
                          </ActionBtn>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </main>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h4 className="font-bold text-gray-800 text-sm">Confirm Delete</h4>
              <button onClick={() => setConfirmDelete(null)} className="text-gray-400 hover:text-gray-700 text-xl leading-none">&times;</button>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-gray-700 mb-1">
                Are you sure you want to <strong className="text-red-600">permanently delete</strong> this application?
              </p>
              <p className="text-xs text-gray-500 mb-5">
                Ack ID: <strong>{confirmDelete.ackId}</strong> — <strong>{confirmDelete.name}</strong>
                <br />This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <button onClick={() => setConfirmDelete(null)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium px-5 py-1.5 rounded">Cancel</button>
                <button
                  onClick={async () => {
                  try {
                    await deleteApplicant(confirmDelete.id);
                    setConfirmDelete(null);
                  } catch (e) {
                    setConfirmDelete(null);
                    setActionError(e.message || 'Delete failed');
                  }
                }}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-5 py-1.5 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────
function ActionBtn({ color, title, onClick, children }) {
  const colorMap = {
    cyan:   'bg-[#3eb0c9] hover:bg-[#2a9ab0]',
    green:  'bg-green-600 hover:bg-green-700',
    orange: 'bg-orange-500 hover:bg-orange-600',
    red:    'bg-red-600 hover:bg-red-700',
  };
  return (
    <button title={title} onClick={onClick} className={`${colorMap[color]} text-white p-1.5 rounded transition-colors`}>
      {children}
    </button>
  );
}

const EyeIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const CheckIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const XIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const TrashIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

