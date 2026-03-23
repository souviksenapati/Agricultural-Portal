import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplicants } from '../../context/ApplicantContext';
import { useDataDirs } from '../../context/DataDirsContext';

export default function ADARevertedApplicantList() {
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
    }, []);

    // 🔵 FILTER ONLY REVERTED APPLICANTS
    const revertedApplicants = useMemo(() => {
        return applicants
            ?.filter(app => app.status === 'reverted' || app.is_reverted === true)
            ?.filter(app => {
                return (
                    (!filters.ack || app.acknowledgement_id?.toLowerCase().includes(filters.ack.toLowerCase())) &&
                    (!filters.name || app.name?.toLowerCase().includes(filters.name.toLowerCase())) &&
                    (!filters.aadhaar || app.aadhaar?.includes(filters.aadhaar)) &&
                    (!filters.mobile || app.mobile?.includes(filters.mobile)) &&
                    (!filters.gp || app.gram_panchayat === filters.gp)
                );
            });
    }, [applicants, filters]);

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleReset = () => {
        setFilters({
            ack: '',
            name: '',
            aadhaar: '',
            mobile: '',
            gp: '',
        });
    };

    return (
        <>
            <main className="grow w-full px-4 py-8">
                <div className="max-w-7xl mx-auto">

                    {/* Page heading */}
                    <h2 className="text-base font-bold text-gray-700 tracking-widest uppercase mb-4">
                        Reverted Search Application
                    </h2>

                    {/* Search form */}
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-3 items-end">

                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-600">Acknowledgement ID</label>
                                <input
                                    type="text"
                                    name="ack"
                                    value={filters.ack}
                                    onChange={handleChange}
                                    placeholder="Search by acknowledgement ID"
                                    className="border border-gray-300 rounded px-3 py-1.5 text-sm w-52 focus:outline-none focus:border-[#3eb0c9]"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-600">Applicant Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={filters.name}
                                    onChange={handleChange}
                                    placeholder="Search by name"
                                    className="border border-gray-300 rounded px-3 py-1.5 text-sm w-48 focus:outline-none focus:border-[#3eb0c9]"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-600">Aadhar No</label>
                                <input
                                    type="text"
                                    name="aadhaar"
                                    value={filters.aadhaar}
                                    onChange={handleChange}
                                    placeholder="Search by Aadhaar"
                                    className="border border-gray-300 rounded px-3 py-1.5 text-sm w-40 focus:outline-none focus:border-[#3eb0c9]"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-600">Mobile No</label>
                                <input
                                    type="text"
                                    name="mobile"
                                    value={filters.mobile}
                                    onChange={handleChange}
                                    placeholder="Search by mobile"
                                    className="border border-gray-300 rounded px-3 py-1.5 text-sm w-36 focus:outline-none focus:border-[#3eb0c9]"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-600">Gram Panchayat</label>
                                <select
                                    name="gp"
                                    value={filters.gp}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded px-3 py-1.5 text-sm w-52 focus:outline-none focus:border-[#3eb0c9]"
                                >
                                    <option value="">Select Gram Panchayat</option>
                                    {gramPanchayats?.map((gp, i) => (
                                        <option key={i} value={gp.name}>{gp.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-2 pb-0.5">
                                <button className="bg-[#3eb0c9] hover:bg-[#2a9ab0] text-white text-sm font-medium px-5 py-1.5 rounded">
                                    Search
                                </button>
                                <button className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-5 py-1.5 rounded">
                                    Download
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

                    {/* List heading */}
                    <p className="text-[#0891b2] font-bold text-sm mb-2">
                        Reverted Applicant List
                    </p>

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
                                    <th className="px-3 py-2.5 text-center border-r border-gray-200">Revert Remarks</th>
                                    <th className="px-3 py-2.5 text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {revertedApplicants?.length > 0 ? (
                                    revertedApplicants.map((app, index) => (
                                        <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">

                                            <td className="px-3 py-2 text-center text-gray-500 border-r border-gray-100 text-xs">
                                                {index + 1}
                                            </td>

                                            <td className="px-3 py-2 text-center font-mono text-xs text-[#0891b2] border-r border-gray-100">
                                                {app.acknowledgement_id}
                                            </td>

                                            <td className="px-3 py-2 text-center text-gray-700 text-xs border-r border-gray-100">
                                                {app.name}
                                            </td>

                                            <td className="px-3 py-2 text-center font-mono text-xs text-gray-600 border-r border-gray-100">
                                                {app.aadhaar}
                                            </td>

                                            <td className="px-3 py-2 text-center font-mono text-xs text-gray-600 border-r border-gray-100">
                                                {app.mobile}
                                            </td>

                                            <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">
                                                {app.bank_name}
                                            </td>

                                            <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">
                                                {app.branch_name}
                                            </td>

                                            <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">
                                                {app.account_number}
                                            </td>

                                            <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">
                                                {app.ifsc}
                                            </td>

                                            <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">
                                                {app.present_in_kbn ? 'Yes' : 'No'}
                                            </td>

                                            <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">
                                                {app.applied_yuvasathi ? 'Yes' : 'No'}
                                            </td>

                                            <td className="px-3 py-2 text-center text-xs text-red-600 border-r border-gray-100">
                                                {app.revert_remarks || 'Reverted'}
                                            </td>

                                            <td className="px-3 py-2 text-center">
                                                <button
                                                    onClick={() => navigate(`/portal/ada/registration/${app.id}/view`)}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    👁
                                                </button>
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="13" className="text-center py-10 text-gray-400 text-sm">
                                            No reverted applicants found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </main>
        </>
    );
}