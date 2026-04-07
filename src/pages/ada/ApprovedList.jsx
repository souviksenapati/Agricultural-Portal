import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApplicants } from '../../context/ApplicantContext';
import { useDataDirs } from '../../context/DataDirsContext';

export default function ADAApprovedApplicantList() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const gpFilter = params.get('gp') || '';

    const { applicants, deleteApplicant, loadFarmers } = useApplicants();
    const { districtName, blockName } = useDataDirs();

    useEffect(() => {
        loadFarmers();
    }, []);


    const [ackInput, setAckInput] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [aadhaarInput, setAadhaarInput] = useState('');
    const [mobileInput, setMobileInput] = useState('');
    const [applied, setApplied] = useState({ ack: '', name: '', aadhaar: '', mobile: '' });

    const [confirmDelete, setConfirmDelete] = useState(null);
    const [actionError, setActionError] = useState('');

    const handleSearch = () => {
        setApplied({
            ack: ackInput,
            name: nameInput,
            aadhaar: aadhaarInput,
            mobile: mobileInput,
        });
    };

    const handleReset = () => {
        setAckInput('');
        setNameInput('');
        setAadhaarInput('');
        setMobileInput('');
        setApplied({ ack: '', name: '', aadhaar: '', mobile: '' });
    };

    const list = useMemo(() => {
        let arr = applicants
            .filter((a) => a.status !== 'deleted')
            .filter((a) => a.status === 'approved');

        if (gpFilter) {
            arr = arr.filter(
                (a) => (a.fullForm?.gramPanchayat || '-') === gpFilter
            );
        }

        if (applied.ack) {
            arr = arr.filter((a) =>
                a.ackId?.toLowerCase().includes(applied.ack.toLowerCase())
            );
        }

        if (applied.name) {
            arr = arr.filter((a) =>
                a.name?.toLowerCase().includes(applied.name.toLowerCase())
            );
        }

        if (applied.aadhaar) {
            arr = arr.filter((a) =>
                a.aadhaar?.includes(applied.aadhaar)
            );
        }

        if (applied.mobile) {
            arr = arr.filter((a) =>
                a.mobile?.includes(applied.mobile)
            );
        }

        return arr;
    }, [applicants, gpFilter, applied]);

    return (
        <>
            <main className="flex-grow w-full px-4 py-8">
                <div className="max-w-7xl mx-auto">

                    <h2 className="text-base font-bold text-gray-700 tracking-widest uppercase mb-4">
                        Search Approved Applicant
                    </h2>

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
                                    className="bg-[#3eb0c9] hover:bg-[#2a9ab0] text-white text-sm font-medium px-5 py-1.5 rounded"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>

                    {actionError && (
                        <div className="mb-3 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
                            {actionError}
                        </div>
                    )}


                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[#0891b2] font-bold text-sm">
                            Approved Applicant List ({list.length})
                        </p>
                        <button
                            onClick={loadFarmers}
                            className="bg-[#3eb0c9] hover:bg-[#2a9ab0] text-white text-xs font-medium px-4 py-1.5 rounded"
                            title="Reload latest data"
                        >
                            Refresh
                        </button>
                    </div>

                    <div className="overflow-x-auto border border-gray-200">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-700 text-xs font-semibold border-b border-gray-200">
                                    <th className="px-3 py-2.5 text-center border-r border-gray-200 w-10">#</th>
                                    <th className="px-3 py-2.5 text-center border-r border-gray-200">Acknowledgement ID</th>
                                    <th className="px-3 py-2.5 text-center border-r border-gray-200">Khetmajur ID</th>
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
                                        <td colSpan={13} className="text-center py-10 text-gray-400 text-sm">
                                            No approved applications found.
                                        </td>
                                    </tr>
                                ) : (
                                    list.map((row, idx) => {
                                        const khetmajurId = row.khetmajurId || row.khetmajur_id || row.id;
                                        const yesNo = (value) => {
                                            if ([true, 'true', 1, '1'].includes(value)) return 'Yes';
                                            if ([false, 'false', 0, '0'].includes(value)) return 'No';
                                            return '-';
                                        };
                                        return (
                                            <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="px-3 py-2 text-center text-gray-500 border-r border-gray-100 text-xs">{idx + 1}</td>
                                                <td className="px-3 py-2 text-center font-mono text-xs text-[#0891b2] border-r border-gray-100">{row.ackId}</td>
                                                <td className="px-3 py-2 text-center text-gray-700 text-xs border-r border-gray-100">{khetmajurId}</td>
                                                <td className="px-3 py-2 text-center text-gray-700 text-xs border-r border-gray-100">{row.name}</td>
                                                <td className="px-3 py-2 text-center font-mono text-xs text-gray-600 border-r border-gray-100">{row.aadhaar}</td>
                                                <td className="px-3 py-2 text-center font-mono text-xs text-gray-600 border-r border-gray-100">{row.mobile}</td>
                                                <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">{row.fullForm?.bankName || '-'}</td>
                                                <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">{row.fullForm?.branchName || '-'}</td>
                                                <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">{row.fullForm?.accountNumber || '-'}</td>
                                                <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">{row.fullForm?.ifscCode || '-'}</td>
                                                <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">{yesNo(row.present_in_kb_n)}</td>
                                                <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">{yesNo(row.applied_for_yuvasathi)}</td>
                                                <td className="px-3 py-2 text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <ActionBtn onClick={() => navigate(`/portal/ada/registration/${row.id}/view`)}>
                                                            👁
                                                        </ActionBtn>
                                                        <ActionBtn color="red" onClick={() => setConfirmDelete(row)}>
                                                            🗑
                                                        </ActionBtn>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </main>

            {confirmDelete && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white p-5 rounded">
                        <p className="mb-4 text-sm">
                            Delete <b>{confirmDelete.name}</b>?
                        </p>

                        <div className="flex gap-2 justify-end">
                            <button onClick={() => setConfirmDelete(null)}>Cancel</button>
                            <button
                                onClick={async () => {
                                    try {
                                        await deleteApplicant(confirmDelete.id);
                                        setConfirmDelete(null);
                                    } catch (e) {
                                        setActionError(e.message);
                                    }
                                }}
                                className="bg-red-600 text-white px-4 py-1 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function Input({ label, value, setValue }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs">{label}</label>
            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="border px-3 py-1.5 text-sm w-44 rounded"
            />
        </div>
    );
}

function ActionBtn({ children, onClick, color = "cyan" }) {
    const colors = {
        cyan: "bg-[#3eb0c9]",
        red: "bg-red-600",
    };

    return (
        <button onClick={onClick} className={`${colors[color]} text-white px-2 py-1 rounded`}>
            {children}
        </button>
    );
}
