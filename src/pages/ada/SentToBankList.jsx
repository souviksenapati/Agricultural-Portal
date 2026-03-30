
import React, { useState, useMemo, useEffect } from 'react';
import { useApplicants } from '../../context/ApplicantContext';
import { useDataDirs } from '../../context/DataDirsContext';

export default function SentToBankList() {
    const { applicants, loadFarmers } = useApplicants();
    const { districtName, blockName } = useDataDirs();

    useEffect(() => { loadFarmers(); }, []);

    // Search field states (applied only on Search click)
    const [ackInput, setAckInput] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [aadhaarInput, setAadhaarInput] = useState('');
    const [mobileInput, setMobileInput] = useState('');
    const [applied, setApplied] = useState({ ack: '', name: '', aadhaar: '', mobile: '' });

    const handleSearch = () => setApplied({ ack: ackInput, name: nameInput, aadhaar: aadhaarInput, mobile: mobileInput });
    const handleReset = () => {
        setAckInput(''); setNameInput(''); setAadhaarInput(''); setMobileInput('');
        setApplied({ ack: '', name: '', aadhaar: '', mobile: '' });
    };

    // Filtered list: status === 'sent_to_bank' (adjust as per your API)
    const list = useMemo(() => {
        let arr = applicants.filter((a) => a.status === 'sent_to_bank');
        if (applied.ack) arr = arr.filter((a) => a.acknowledgementId?.toLowerCase().includes(applied.ack.toLowerCase()));
        if (applied.name) arr = arr.filter((a) => a.name?.toLowerCase().includes(applied.name.toLowerCase()));
        if (applied.aadhaar) arr = arr.filter((a) => a.aadhaar?.includes(applied.aadhaar));
        if (applied.mobile) arr = arr.filter((a) => a.mobile?.includes(applied.mobile));
        return arr;
    }, [applicants, applied]);

    return (
        <>
            <main className="grow w-full px-4 py-8">
                <div className="max-w-7xl mx-auto">

                    {/* Page heading */}
                    <h2 className="text-base font-bold text-gray-700 tracking-widest uppercase mb-4">
                        Send to Bank Search Application
                    </h2>

                    {/* Search form */}
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-3 items-end">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-600">Acknowledgement ID</label>
                                <input
                                    value={ackInput}
                                    onChange={(e) => setAckInput(e.target.value)}
                                    placeholder="Search by acknowledgement ID"
                                    className="border border-gray-300 rounded px-3 py-1.5 text-sm w-52 focus:outline-none focus:border-[#3eb0c9]"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-600">Applicant Name</label>
                                <input
                                    value={nameInput}
                                    onChange={(e) => setNameInput(e.target.value)}
                                    placeholder="Search by name"
                                    className="border border-gray-300 rounded px-3 py-1.5 text-sm w-48 focus:outline-none focus:border-[#3eb0c9]"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-600">Aadhar No</label>
                                <input
                                    value={aadhaarInput}
                                    onChange={(e) => setAadhaarInput(e.target.value)}
                                    placeholder="Search by Aadhaar"
                                    className="border border-gray-300 rounded px-3 py-1.5 text-sm w-40 focus:outline-none focus:border-[#3eb0c9]"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-600">Mobile No</label>
                                <input
                                    value={mobileInput}
                                    onChange={(e) => setMobileInput(e.target.value)}
                                    placeholder="Search by mobile"
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
                                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium px-5 py-1.5 rounded transition-colors"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* List heading */}
                    <p className="text-[#0891b2] font-bold text-sm mb-2">Send to Bank Applicant List</p>

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
                                    <th className="px-3 py-2.5 text-center border-r border-gray-200">Bank Name</th>
                                    <th className="px-3 py-2.5 text-center border-r border-gray-200">Branch Name</th>
                                    <th className="px-3 py-2.5 text-center border-r border-gray-200">Account Number</th>
                                    <th className="px-3 py-2.5 text-center border-r border-gray-200">IFSC</th>
                                    <th className="px-3 py-2.5 text-center border-r border-gray-200">Present in KB(N)</th>
                                    <th className="px-3 py-2.5 text-center border-r border-gray-200">Applied for Yuvasathi</th>
                                    <th className="px-3 py-2.5 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.length === 0 ? (
                                    <tr>
                                        <td colSpan={12} className="text-center py-10 text-gray-400 text-sm">
                                            No applications found.
                                        </td>
                                    </tr>
                                ) : (
                                    list.map((a, idx) => (
                                        <tr key={a.id || idx} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="px-3 py-2 text-center text-gray-500 border-r border-gray-100 text-xs">{idx + 1}</td>
                                            <td className="px-3 py-2 text-center font-mono text-xs text-[#0891b2] border-r border-gray-100">{a.acknowledgementId}</td>
                                            <td className="px-3 py-2 text-center text-gray-700 text-xs border-r border-gray-100">{a.name}</td>
                                            <td className="px-3 py-2 text-center font-mono text-xs text-gray-600 border-r border-gray-100">{a.aadhaar}</td>
                                            <td className="px-3 py-2 text-center font-mono text-xs text-gray-600 border-r border-gray-100">{a.mobile}</td>
                                            <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">{a.bankName}</td>
                                            <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">{a.branchName}</td>
                                            <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">{a.accountNumber}</td>
                                            <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">{a.ifsc}</td>
                                            <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">{a.presentInKb ? 'Yes' : 'No'}</td>
                                            <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">{a.appliedForYuvasathi ? 'Yes' : 'No'}</td>
                                            <td className="px-3 py-2 text-center">
                                                <button className="text-blue-600 hover:underline">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </main>
        </>
    );
}
