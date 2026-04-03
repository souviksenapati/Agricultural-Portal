import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApplicants } from '../../context/ApplicantContext';
import { useDataDirs } from '../../context/DataDirsContext';

export default function ADAApplicantList() {
  const navigate = useNavigate();
  const { search, pathname } = useLocation();
  const params = new URLSearchParams(search);
  const gpFilter = params.get('gp') || '';

  const isPending = pathname.endsWith('/pending');
  const isApproved = pathname.endsWith('/approved');
  const isApplicantList = !isPending && !isApproved;

  const {
    applicants,
    approveApplicant,
    rejectApplicant,
    revertToADA,
    deleteApplicant,
    loadFarmers,
    loadADAPendings,
    loadADAApproved,
    pendingMeta,
    approvedMeta,
  } = useApplicants();
  const { districtName, blockName } = useDataDirs();

  const [ackInput, setAckInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [aadhaarInput, setAadhaarInput] = useState('');
  const [mobileInput, setMobileInput] = useState('');
  const [applied, setApplied] = useState({ ack: '', name: '', aadhaar: '', mobile: '' });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [actionError, setActionError] = useState('');
  const [actingId, setActingId] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (isPending) {
      loadADAPendings(page);
      return;
    }

    if (isApproved) {
      loadADAApproved(page);
      return;
    }

    loadFarmers();
  }, [isPending, isApproved, page, loadADAPendings, loadADAApproved, loadFarmers]);

  const list = useMemo(() => {
    let arr = applicants;

    if (isPending) {
      arr = arr.filter((a) => a.status === 'pending');
    } else if (isApproved) {
      arr = arr.filter((a) => a.status === 'approved');
    } else {
      arr = arr.filter((a) => a.status !== 'deleted');
    }

    if (gpFilter) {
      arr = arr.filter((a) => (a.fullForm?.gramPanchayat || a.gram_panchayat || '') === gpFilter);
    }

    if (applied.ack) {
      arr = arr.filter((a) => a.ackId?.toLowerCase().includes(applied.ack.toLowerCase()));
    }
    if (applied.name) {
      arr = arr.filter((a) => a.name?.toLowerCase().includes(applied.name.toLowerCase()));
    }
    if (applied.aadhaar) {
      arr = arr.filter((a) => a.aadhaar?.includes(applied.aadhaar));
    }
    if (applied.mobile) {
      arr = arr.filter((a) => a.mobile?.includes(applied.mobile));
    }

    return arr;
  }, [applicants, isPending, isApproved, gpFilter, applied]);

  const activeMeta = isPending ? pendingMeta : isApproved ? approvedMeta : null;
  const isPagedRoute = isPending || isApproved;
  const totalPages = isPagedRoute ? Math.max(1, activeMeta?.totalPages || 1) : Math.max(1, list.length);
  const paginatedList = list;

  const searchHeading = isPending
    ? 'Search Pending Applicant'
    : isApproved
      ? 'Search Approved Applicant'
      : 'Search Registered Applicant';

  const listHeading = isPending
    ? 'Pending Applicant List'
    : isApproved
      ? 'Approved Applicant List'
      : 'Registered Applicant List';
  const listCount = isPagedRoute ? (activeMeta?.totalCount || list.length) : list.length;

  const handleSearch = () => {
    setApplied({
      ack: ackInput,
      name: nameInput,
      aadhaar: aadhaarInput,
      mobile: mobileInput,
    });
    setPage(1);
  };

  const handleReset = () => {
    setAckInput('');
    setNameInput('');
    setAadhaarInput('');
    setMobileInput('');
    setApplied({ ack: '', name: '', aadhaar: '', mobile: '' });
    setPage(1);
  };

  useEffect(() => {
    if (!isPagedRoute) return;
    if (page > totalPages) setPage(totalPages);
  }, [isPagedRoute, page, totalPages]);

  const goPage = (nextPage) => {
    if (nextPage >= 1 && nextPage <= totalPages) setPage(nextPage);
  };

  const visiblePages = () => {
    const pages = [];
    for (let i = 1; i <= Math.min(totalPages, 3); i += 1) pages.push(i);
    return pages;
  };

  const runAction = async (id, action, fallbackMessage) => {
    try {
      setActionError('');
      setActingId(id);
      await action();
    } catch (e) {
      setActionError(e.message || fallbackMessage);
    } finally {
      setActingId(null);
    }
  };

  const yesNo = (value) => {
    if ([true, 'true', 1, '1'].includes(value)) return 'Yes';
    if ([false, 'false', 0, '0'].includes(value)) return 'No';
    return '—';
  };

  const emptyColSpan = isApproved ? 13 : isPending ? 8 : 6;

  return (
    <>
      <main className="grow w-full px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-base font-bold text-gray-700 tracking-widest uppercase mb-4">
            {searchHeading}
          </h2>

          <div className="mb-6">
            <div className="flex flex-wrap gap-3 items-end">
              <SearchInput label="Acknowledgement ID" value={ackInput} onChange={setAckInput} />
              <SearchInput label="Applicant Name" value={nameInput} onChange={setNameInput} />
              <SearchInput label="Aadhar No" value={aadhaarInput} onChange={setAadhaarInput} narrow />
              <SearchInput label="Mobile No" value={mobileInput} onChange={setMobileInput} narrow />
              <div className="flex gap-2 pb-0.5">
                <button
                  type="button"
                  onClick={handleSearch}
                  className="bg-[#3eb0c9] hover:bg-[#2a9ab0] text-white text-sm font-medium px-5 py-1.5 rounded transition-colors"
                >
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

              {actionError && (
            <div className="mb-3 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded">
              <span className="flex-1">{actionError}</span>
              <button
                type="button"
                onClick={() => setActionError('')}
                className="text-red-400 hover:text-red-700 text-lg leading-none"
              >
                ×
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mb-2">
            <p className="text-[#0891b2] font-bold text-sm">
              {listHeading} ({listCount})
            </p>
            <button
              type="button"
              onClick={() => {
                if (isPending) {
                  loadADAPendings(page);
                  return;
                }

                if (isApproved) {
                  loadADAApproved(page);
                  return;
                }

                loadFarmers();
              }}
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
                  <th className="px-3 py-2.5 text-center border-r border-gray-200">Ack ID</th>
                  {isApproved && <th className="px-3 py-2.5 text-center border-r border-gray-200">Khetmajur ID</th>}
                  <th className="px-3 py-2.5 text-center border-r border-gray-200">Applicant Name</th>
                  <th className="px-3 py-2.5 text-center border-r border-gray-200">Aadhaar No</th>
                  <th className="px-3 py-2.5 text-center border-r border-gray-200">Mobile No</th>
                  {isPending && <th className="px-3 py-2.5 text-center border-r border-gray-200">District</th>}
                  {isPending && <th className="px-3 py-2.5 text-center border-r border-gray-200">Block</th>}
                  {isApproved && <th className="px-3 py-2.5 text-center border-r border-gray-200">Bank Name</th>}
                  {isApproved && <th className="px-3 py-2.5 text-center border-r border-gray-200">Branch Name</th>}
                  {isApproved && <th className="px-3 py-2.5 text-center border-r border-gray-200">Account Number</th>}
                  {isApproved && <th className="px-3 py-2.5 text-center border-r border-gray-200">IFSC</th>}
                  {isApproved && <th className="px-3 py-2.5 text-center border-r border-gray-200">KB(N)</th>}
                  {isApproved && <th className="px-3 py-2.5 text-center border-r border-gray-200">Yuvasathi</th>}
                  <th className="px-3 py-2.5 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedList.length === 0 ? (
                  <tr>
                    <td colSpan={emptyColSpan} className="text-center py-10 text-gray-400 text-sm">
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  paginatedList.map((row, idx) => {
                    const khetmajurId = row.khetmajurId || row.khetmajur_id || row.id;
                    const isBusy = actingId === row.id;
                    const perPage = activeMeta?.perPage || paginatedList.length || 20;
                    const currentPage = activeMeta?.currentPage || page;
                    const rowNumber = isPagedRoute ? (currentPage - 1) * perPage + idx + 1 : idx + 1;

                    return (
                      <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 text-center text-gray-500 border-r border-gray-100 text-xs">{rowNumber}</td>
                        <td className="px-3 py-2 text-center font-mono text-xs text-[#0891b2] border-r border-gray-100">{row.ackId}</td>
                        {isApproved && <td className="px-3 py-2 text-center text-xs border-r border-gray-100">{khetmajurId}</td>}
                        <td className="px-3 py-2 text-center text-xs border-r border-gray-100">{row.name}</td>
                        <td className="px-3 py-2 text-center text-xs border-r border-gray-100">{row.aadhaar}</td>
                        <td className="px-3 py-2 text-center text-xs border-r border-gray-100">{row.mobile}</td>
                        {isPending && (
                          <td className="px-3 py-2 text-center text-xs border-r border-gray-100">
                            {districtName(row.fullForm?.district) || '—'}
                          </td>
                        )}
                        {isPending && (
                          <td className="px-3 py-2 text-center text-xs border-r border-gray-100">
                            {blockName(row.fullForm?.block) || '—'}
                          </td>
                        )}
                        {isApproved && <td className="px-3 py-2 text-center text-xs border-r border-gray-100">{row.fullForm?.bankName || '—'}</td>}
                        {isApproved && <td className="px-3 py-2 text-center text-xs border-r border-gray-100">{row.fullForm?.branchName || '—'}</td>}
                        {isApproved && <td className="px-3 py-2 text-center text-xs border-r border-gray-100">{row.fullForm?.accountNumber || '—'}</td>}
                        {isApproved && <td className="px-3 py-2 text-center text-xs border-r border-gray-100">{row.fullForm?.ifscCode || '—'}</td>}
                        {isApproved && <td className="px-3 py-2 text-center text-xs border-r border-gray-100">{yesNo(row.present_in_kb_n)}</td>}
                        {isApproved && <td className="px-3 py-2 text-center text-xs border-r border-gray-100">{yesNo(row.applied_for_yuvasathi)}</td>}
                        <td className="px-3 py-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <ActionBtn
                              title="View Application"
                              onClick={() => navigate(`/portal/ada/registration/${row.id}/view`)}
                              disabled={isBusy}
                            >
                              <EyeIcon />
                            </ActionBtn>
                            {/* 
                            {isApplicantList && (
                              <ActionBtn
                                color="blue"
                                title="Edit Application"
                                onClick={() => navigate(`/portal/ada/registration/${row.id}/edit`)}
                                disabled={isBusy}
                              >
                                <EditIcon />
                              </ActionBtn>
                            )} */}

                            {!isApplicantList && !isApproved && (row.status === 'pending' || row.status === 'rejected') && (
                              <ActionBtn
                                color="green"
                                title="Approve"
                                onClick={() => runAction(row.id, () => approveApplicant(row.id), 'Approve failed')}
                                disabled={isBusy}
                              >
                                <CheckIcon />
                              </ActionBtn>
                            )}

                            {isApproved && (
                              <ActionBtn
                                color="blue"
                                title="Revert"
                                onClick={() => runAction(row.id, () => revertToADA(row.id), 'Revert failed')}
                                disabled={isBusy}
                              >
                                <RevertIcon />
                              </ActionBtn>
                            )}

                            {!isApplicantList && !isApproved && row.status === 'pending' && (
                              <ActionBtn
                                color="orange"
                                title="Reject"
                                onClick={() => runAction(row.id, () => rejectApplicant(row.id), 'Reject failed')}
                                disabled={isBusy}
                              >
                                <XIcon />
                              </ActionBtn>
                            )}

                            {!isApplicantList && (
                              <ActionBtn
                                color="red"
                                title="Delete"
                                onClick={() => setConfirmDelete(row)}
                                disabled={isBusy}
                              >
                                <TrashIcon />
                              </ActionBtn>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {isPagedRoute && list.length > 0 && (
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
              <span>
                Showing <strong>{Math.min(((activeMeta?.currentPage || page) - 1) * (activeMeta?.perPage || list.length || 20) + 1, activeMeta?.totalCount || list.length)}</strong> to{' '}
                <strong>{Math.min((activeMeta?.currentPage || page) * (activeMeta?.perPage || list.length || 20), activeMeta?.totalCount || list.length)}</strong> of{' '}
                <strong>{activeMeta?.totalCount || list.length}</strong> records
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => goPage(1)}
                  disabled={(activeMeta?.currentPage || page) === 1}
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
                      p === (activeMeta?.currentPage || page)
                        ? 'bg-[#3eb0c9] text-white border-[#3eb0c9]'
                        : 'border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                {totalPages > 3 && (activeMeta?.currentPage || page) < totalPages && (
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
                  disabled={(activeMeta?.currentPage || page) === totalPages}
                  className="px-2 py-1 text-xs border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-100"
                >
                  Next
                </button>
                <button
                  type="button"
                  onClick={() => goPage(totalPages)}
                  disabled={(activeMeta?.currentPage || page) === totalPages}
                  className="px-2 py-1 text-xs border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-100"
                >
                  Last
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h4 className="font-bold text-gray-800 text-sm">Confirm Delete</h4>
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="text-gray-400 hover:text-gray-700 text-xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-gray-700 mb-1">
                Are you sure you want to delete this application?
              </p>
              <p className="text-xs text-gray-500 mb-5">
                Ack ID: <strong>{confirmDelete.ackId}</strong> | <strong>{confirmDelete.name}</strong>
              </p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium px-5 py-1.5 rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await runAction(confirmDelete.id, () => deleteApplicant(confirmDelete.id), 'Delete failed');
                    setConfirmDelete(null);
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

function SearchInput({ label, value, onChange, narrow = false }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-600">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`border border-gray-300 rounded px-3 py-1.5 text-sm ${narrow ? 'w-40' : 'w-52'} focus:outline-none focus:border-[#3eb0c9]`}
      />
    </div>
  );
}

function ActionBtn({ color = 'cyan', title, onClick, children, disabled = false }) {
  const colorMap = {
    cyan: 'bg-[#3eb0c9] hover:bg-[#2a9ab0]',
    green: 'bg-green-600 hover:bg-green-700',
    orange: 'bg-orange-500 hover:bg-orange-600',
    blue: 'bg-blue-600 hover:bg-blue-700',
    red: 'bg-red-600 hover:bg-red-700',
  };

  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`${colorMap[color]} text-white p-1.5 rounded transition-colors disabled:opacity-60 disabled:cursor-not-allowed`}
    >
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

const EditIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
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

const RevertIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 14 4 9m0 0 5-5M4 9h10a6 6 0 1 1 0 12h-1" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
