import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApplicants } from '../../context/ApplicantContext';
import PortalHeader from '../../components/PortalHeader';
import PortalFooter from '../../components/PortalFooter';

export default function BankDashboard() {
  const { user } = useAuth();
  const { applicants, markProcessed } = useApplicants();
  const [viewRecord, setViewRecord] = useState(null);

  // Bank sees only sent_to_bank and processed
  const list = applicants.filter((a) => a.status === 'sent_to_bank' || a.status === 'processed');

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PortalHeader />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8">
        <h2 className="text-base font-bold text-gray-800 text-center tracking-widest mb-6">
          BANK DASHBOARD
        </h2>
        <p className="text-center text-sm text-gray-500 mb-8">
          Logged in as: <strong>{user?.email}</strong>
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8 max-w-xs">
          <div className="border-l-4 border-blue-500 text-blue-700 bg-white shadow-sm rounded p-4">
            <div className="text-2xl font-bold">{list.filter(a => a.status === 'sent_to_bank').length}</div>
            <div className="text-xs text-gray-500 mt-1">Pending DBT</div>
          </div>
          <div className="border-l-4 border-purple-500 text-purple-700 bg-white shadow-sm rounded p-4">
            <div className="text-2xl font-bold">{list.filter(a => a.status === 'processed').length}</div>
            <div className="text-xs text-gray-500 mt-1">DBT Processed</div>
          </div>
        </div>

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
              {list.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-gray-400">No applications received from SNO yet.</td></tr>
              ) : list.map((row, idx) => (
                <tr key={row.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-2 text-center text-gray-500 text-xs">{idx + 1}</td>
                  <td className="px-3 py-2 text-center font-mono text-xs text-[#0891b2]">{row.ackId}</td>
                  <td className="px-3 py-2 text-center text-gray-700">{row.name}</td>
                  <td className="px-3 py-2 text-center font-mono text-xs">{row.aadhaar}</td>
                  <td className="px-3 py-2 text-center font-mono text-xs">{row.mobile}</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      row.status === 'sent_to_bank' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {row.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button onClick={() => setViewRecord(row)} title="View"
                        className="bg-[#0891b2] hover:bg-[#0e7490] text-white p-1.5 rounded">
                        <EyeIcon />
                      </button>
                      {row.status === 'sent_to_bank' && (
                        <button onClick={() => markProcessed(row.id)} title="Mark DBT Processed"
                          className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium px-2.5 py-1.5 rounded whitespace-nowrap">
                          ✓ DBT Done
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <PortalFooter />

      {viewRecord && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h4 className="font-bold text-gray-800 text-sm">Applicant Details</h4>
              <button onClick={() => setViewRecord(null)} className="text-gray-400 hover:text-gray-700 text-xl">&times;</button>
            </div>
            <div className="px-5 py-4 space-y-3 text-sm">
              {[['Ack ID', viewRecord.ackId], ['Name', viewRecord.name], ['Aadhaar', viewRecord.aadhaar], ['Mobile', viewRecord.mobile], ['Status', viewRecord.status.replace('_', ' ')]].map(([l, v]) => (
                <div key={l} className="flex gap-3">
                  <span className="text-gray-500 w-24 shrink-0 font-medium">{l}</span>
                  <span className="text-gray-800 font-mono">{v}</span>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t flex justify-end">
              <button onClick={() => setViewRecord(null)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium px-5 py-1.5 rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const EyeIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
