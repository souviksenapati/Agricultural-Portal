import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApplicants } from '../../context/ApplicantContext';
import PortalHeader from '../../components/PortalHeader';
import PortalFooter from '../../components/PortalFooter';

const STATUS_BADGE = {
  pending:      'bg-yellow-100 text-yellow-800',
  approved:     'bg-green-100 text-green-800',
  rejected:     'bg-red-100 text-red-800',
  deleted:      'bg-gray-200 text-gray-500',
  sent_to_bank: 'bg-blue-100 text-blue-800',
  processed:    'bg-purple-100 text-purple-800',
};

export default function ADADashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { applicants, approveApplicant, rejectApplicant, deleteApplicant, updateApplicant } = useApplicants();
  const [confirmDelete, setConfirmDelete] = useState(null);

  // ADA sees all non-deleted applicants
  const list = applicants.filter((a) => a.status !== 'deleted');
  const counts = {
    total:    list.length,
    pending:  list.filter((a) => a.status === 'pending').length,
    approved: list.filter((a) => a.status === 'approved').length,
    rejected: list.filter((a) => a.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PortalHeader />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8">
        <h2 className="text-base font-bold text-gray-800 text-center tracking-widest mb-6">
          ADA DASHBOARD
        </h2>
        <p className="text-center text-sm text-gray-500 mb-8">
          Block: <strong>{user?.blockName}</strong>
        </p>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Applications', value: counts.total,    color: 'border-gray-400 text-gray-700' },
            { label: 'Pending',            value: counts.pending,  color: 'border-yellow-400 text-yellow-700' },
            { label: 'Approved',           value: counts.approved, color: 'border-green-500 text-green-700' },
            { label: 'Rejected',           value: counts.rejected, color: 'border-red-400 text-red-700' },
          ].map((c) => (
            <div key={c.label} className={`border-l-4 ${c.color} bg-white shadow-sm rounded p-4`}>
              <div className={`text-2xl font-bold ${c.color.split(' ')[1]}`}>{c.value}</div>
              <div className="text-xs text-gray-500 mt-1">{c.label}</div>
            </div>
          ))}
        </div>

        {/* Applications table */}
        <div className="overflow-x-auto border border-gray-200 rounded">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-xs uppercase tracking-wide">
                <th className="px-3 py-2.5 text-center w-10">#</th>
                <th className="px-3 py-2.5 text-center">Ack ID</th>
                <th className="px-3 py-2.5 text-center">Applicant Name</th>
                <th className="px-3 py-2.5 text-center">Aadhaar</th>
                <th className="px-3 py-2.5 text-center">Mobile</th>
                <th className="px-3 py-2.5 text-center">Status</th>
                <th className="px-3 py-2.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((row, idx) => (
                <tr key={row.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-2 text-center text-gray-500 text-xs">{idx + 1}</td>
                  <td className="px-3 py-2 text-center font-mono text-xs text-[#0891b2]">{row.ackId}</td>
                  <td className="px-3 py-2 text-center text-gray-700">{row.name}</td>
                  <td className="px-3 py-2 text-center font-mono text-xs text-gray-600">{row.aadhaar}</td>
                  <td className="px-3 py-2 text-center font-mono text-xs text-gray-600">{row.mobile}</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_BADGE[row.status] || ''}`}>
                      {row.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <div className="flex items-center justify-center gap-1 flex-wrap">
                      {/* View */}
                      <Btn color="cyan" title="View Full Application" onClick={() => navigate(`/portal/ada/registration/${row.id}/view`)}>
                        <EyeIcon />
                      </Btn>
                      {/* Approve: pending or rejected */}
                      {(row.status === 'pending' || row.status === 'rejected') && (
                        <Btn color="green" title="Approve" onClick={() => approveApplicant(row.id)}>
                          <CheckIcon />
                        </Btn>
                      )}
                      {/* Reject: pending or approved */}
                      {(row.status === 'pending' || row.status === 'approved') && (
                        <Btn color="orange" title="Reject" onClick={() => rejectApplicant(row.id)}>
                          <XIcon />
                        </Btn>
                      )}
                      {/* Delete: any non-deleted */}
                      <Btn color="red" title="Delete (permanent)" onClick={() => setConfirmDelete(row)}>
                        <TrashIcon />
                      </Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <PortalFooter />

      {/* Delete Confirmation */}
      {confirmDelete && (
        <Modal title="Confirm Delete" onClose={() => setConfirmDelete(null)}>
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
              onClick={() => { deleteApplicant(confirmDelete.id); setConfirmDelete(null); }}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-5 py-1.5 rounded"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Shared sub-components ──────────────────────────────────────────────────
function Btn({ color, title, onClick, children }) {
  const colorMap = {
    cyan:   'bg-[#0891b2] hover:bg-[#0e7490]',
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

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h4 className="font-bold text-gray-800 text-sm">{title}</h4>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">&times;</button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
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
