import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  listFarmers,
  listADAPendings,
  listADAApproved,
  listADARejected,
  listADAReverted,
  normalizeFarmer,
} from '../api/client';

const ROLE_HOME = {
  gramdoot: '/portal/dashboard',
  ada: '/portal/ada/dashboard',
  dda: '/portal/dda/dashboard',
  sno: '/portal/sno/dashboard',
  bank: '/portal/bank/dashboard',
};

const ROLE_LABELS = {
  gramdoot: 'Gramdoot',
  ada: 'ADA',
  dda: 'DDA',
  sno: 'SNO',
  bank: 'Bank',
};

export default function Header() {
  const { user } = useAuth();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [quickRegOpen, setQuickRegOpen] = useState(false);
  const [adaMenuOpen, setAdaMenuOpen] = useState(false);
  const [misMenuOpen, setMisMenuOpen] = useState(false);
  const [memberMenuOpen, setMemberMenuOpen] = useState(false);
  const [snoReportOpen, setSnoReportOpen] = useState(false);
  const [snoApplicantOpen, setSnoApplicantOpen] = useState(false);
  const [snoMemberOpen, setSnoMemberOpen] = useState(false);
  const [snoDbtOpen, setSnoDbtOpen] = useState(false);
  const [ddaReportOpen, setDdaReportOpen] = useState(false);
  const [ddaApplicantOpen, setDdaApplicantOpen] = useState(false);
  const [ddaMemberOpen, setDdaMemberOpen] = useState(false);
  const [misDownloading, setMisDownloading] = useState('');
  const [snoReportDownloading, setSnoReportDownloading] = useState(false);
  const [ddaReportDownloading, setDdaReportDownloading] = useState(false);

  const quickRef = useRef(null);
  const adaRef = useRef(null);
  const misRef = useRef(null);
  const memberRef = useRef(null);
  const snoReportRef = useRef(null);
  const snoApplicantRef = useRef(null);
  const snoMemberRef = useRef(null);
  const snoDbtRef = useRef(null);
  const ddaReportRef = useRef(null);
  const ddaApplicantRef = useRef(null);
  const ddaMemberRef = useRef(null);

  const dashboardPath = ROLE_HOME[user?.role] || '/';
  const isExactActive = (path) => location.pathname === path;
  const isPathActive = (prefix) => location.pathname.startsWith(prefix);

  const closeAllDropdowns = () => {
    setQuickRegOpen(false);
    setAdaMenuOpen(false);
    setMisMenuOpen(false);
    setMemberMenuOpen(false);
    setSnoReportOpen(false);
    setSnoApplicantOpen(false);
    setSnoMemberOpen(false);
    setSnoDbtOpen(false);
    setDdaReportOpen(false);
    setDdaApplicantOpen(false);
    setDdaMemberOpen(false);
  };

  useEffect(() => {
    const handler = (event) => {
      const refs = [
        quickRef,
        adaRef,
        misRef,
        memberRef,
        snoReportRef,
        snoApplicantRef,
        snoMemberRef,
        snoDbtRef,
        ddaReportRef,
        ddaApplicantRef,
        ddaMemberRef,
      ];

      const clickedInside = refs.some((ref) => ref.current?.contains(event.target));
      if (!clickedInside) closeAllDropdowns();
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    closeAllDropdowns();
  }, [location.pathname]);

  const csvEscape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

  const downloadApplicantsCsv = (label, rows) => {
    const header = [
      'Sl No',
      'Acknowledgement ID',
      'Applicant Name',
      'Aadhaar No',
      'Mobile No',
      'Status',
      'Bank Name',
      'Branch Name',
      'Account Number',
      'IFSC',
    ];

    const body = rows.map((app, index) => [
      index + 1,
      app.ackId,
      app.name,
      app.aadhaar,
      app.mobile,
      app.status,
      app.bank_name || app.fullForm?.bankName || app.bankName || '',
      app.branch_name || app.fullForm?.branchName || app.branchName || '',
      app.account_number || app.fullForm?.accountNumber || app.accountNumber || '',
      app.ifsc || app.fullForm?.ifscCode || '',
    ]);

    const csv = [header, ...body]
      .map((row) => row.map(csvEscape).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${label.toLowerCase().replace(/\s+/g, '_')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const fetchPagedStatusList = async (loader, forcedStatus) => {
    const firstPage = await loader(1);
    const firstItems = (firstPage.items || []).map((item) => ({
      ...normalizeFarmer(item),
      ...(forcedStatus ? { status: forcedStatus } : {}),
    }));
    const totalPages = Math.max(1, firstPage.meta?.total_pages || 1);

    if (totalPages === 1) return firstItems;

    const remaining = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, index) => loader(index + 2))
    );

    const remainingItems = remaining.flatMap((pageData) =>
      (pageData.items || []).map((item) => ({
        ...normalizeFarmer(item),
        ...(forcedStatus ? { status: forcedStatus } : {}),
      }))
    );

    return [...firstItems, ...remainingItems];
  };

  const fetchMisRows = async (type) => {
    switch (type) {
      case 'approved':
        return fetchPagedStatusList(listADAApproved, 'approved');
      case 'pending':
        return fetchPagedStatusList(listADAPendings, 'pending');
      case 'rejected':
        return fetchPagedStatusList(listADARejected, 'rejected');
      case 'reverted':
        return fetchPagedStatusList(listADAReverted, 'reverted');
      case 'submitted': {
        const rows = await listFarmers();
        return rows.map(normalizeFarmer).filter((app) => app.status !== 'deleted');
      }
      case 'sent_to_bank': {
        const rows = await listFarmers();
        return rows.map(normalizeFarmer).filter((app) => app.status === 'sent_to_bank');
      }
      default:
        return [];
    }
  };

  const handleMisDownload = async (type) => {
    const labels = {
      submitted: 'submitted_list',
      approved: 'approved_list',
      rejected: 'rejected_list',
      pending: 'pending_list',
      reverted: 'reverted_list',
      sent_to_bank: 'send_to_bank_list',
    };

    try {
      setMisDownloading(type);
      const rows = await fetchMisRows(type);
      downloadApplicantsCsv(labels[type], rows);
    } catch (error) {
      window.alert(error.message || 'CSV download failed');
    } finally {
      setMisDownloading('');
    }

    closeAllDropdowns();
    setIsMenuOpen(false);
  };

  const handleSnoReportDownload = async () => {
    try {
      setSnoReportDownloading(true);
      const rows = await listFarmers();
      const normalized = rows
        .map(normalizeFarmer)
        .filter((app) => app.status !== 'deleted');
      downloadApplicantsCsv('sno_report', normalized);
    } catch (error) {
      window.alert(error.message || 'Report download failed');
    } finally {
      setSnoReportDownloading(false);
    }

    closeAllDropdowns();
    setIsMenuOpen(false);
  };

  const handleDdaReportDownload = async () => {
    try {
      setDdaReportDownloading(true);
      const rows = await listFarmers();
      const normalized = rows
        .map(normalizeFarmer)
        .filter((app) => app.status !== 'deleted');
      downloadApplicantsCsv('dda_report', normalized);
    } catch (error) {
      window.alert(error.message || 'Report download failed');
    } finally {
      setDdaReportDownloading(false);
    }

    closeAllDropdowns();
    setIsMenuOpen(false);
  };

  const toggleDropdown = (key) => {
    const nextState = {
      quick: key === 'quick' ? !quickRegOpen : false,
      ada: key === 'ada' ? !adaMenuOpen : false,
      mis: key === 'mis' ? !misMenuOpen : false,
      member: key === 'member' ? !memberMenuOpen : false,
      snoReport: key === 'snoReport' ? !snoReportOpen : false,
      snoApplicant: key === 'snoApplicant' ? !snoApplicantOpen : false,
      snoMember: key === 'snoMember' ? !snoMemberOpen : false,
      snoDbt: key === 'snoDbt' ? !snoDbtOpen : false,
      ddaReport: key === 'ddaReport' ? !ddaReportOpen : false,
      ddaApplicant: key === 'ddaApplicant' ? !ddaApplicantOpen : false,
      ddaMember: key === 'ddaMember' ? !ddaMemberOpen : false,
    };

    setQuickRegOpen(nextState.quick);
    setAdaMenuOpen(nextState.ada);
    setMisMenuOpen(nextState.mis);
    setMemberMenuOpen(nextState.member);
    setSnoReportOpen(nextState.snoReport);
    setSnoApplicantOpen(nextState.snoApplicant);
    setSnoMemberOpen(nextState.snoMember);
    setSnoDbtOpen(nextState.snoDbt);
    setDdaReportOpen(nextState.ddaReport);
    setDdaApplicantOpen(nextState.ddaApplicant);
    setDdaMemberOpen(nextState.ddaMember);
  };

  const DropdownIcon = () => (
    <svg className="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );

  if (user) {
    return (
      <>
        <header className="bg-white border-b border-gray-200 shadow-sm relative z-50">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-[72px]">
            <Link to={dashboardPath}>
              <img src="/image/logo_bsb.png" alt="WB Govt" className="h-14" />
            </Link>

            <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-700">
              <Link
                to={dashboardPath}
                className={`hover:text-[#0891b2] ${isExactActive(dashboardPath) ? 'text-[#0891b2] font-semibold' : ''}`}
              >
                Dashboard
              </Link>

              {user.role === 'gramdoot' && (
                <div className="relative" ref={quickRef}>
                  <button type="button" onClick={() => toggleDropdown('quick')} className="flex items-center gap-1 hover:text-[#0891b2]">
                    Quick Registration
                    <DropdownIcon />
                  </button>

                  {quickRegOpen && (
                    <div className="absolute mt-2 w-52 bg-white border rounded shadow-lg z-50">
                      <Link to="/portal/quick-registration/new" className="block px-4 py-2 hover:bg-gray-50">Registration Form</Link>
                      <Link to="/portal/quick-registration/list" className="block px-4 py-2 hover:bg-gray-50">Registered Applicant List</Link>
                    </div>
                  )}
                </div>
              )}

              {user.role === 'ada' && (
                <>
                  <div className="relative" ref={adaRef}>
                    <button
                      type="button"
                      onClick={() => toggleDropdown('ada')}
                      className={`flex items-center gap-1 hover:text-[#0891b2] ${isPathActive('/portal/ada/') && !isExactActive('/portal/ada/dashboard') ? 'text-[#0891b2] font-semibold' : ''}`}
                    >
                      Applicant List
                      <DropdownIcon />
                    </button>

                    {adaMenuOpen && (
                      <div className="absolute mt-2 w-52 bg-white border rounded shadow-lg z-50">
                        <Link to="/portal/ada/applications" className="block px-4 py-2 hover:bg-gray-50">Applicant List</Link>
                        <Link to="/portal/ada/pending" className="block px-4 py-2 hover:bg-gray-50">Pending List</Link>
                        <Link to="/portal/ada/approved" className="block px-4 py-2 hover:bg-gray-50">Approved List</Link>
                        <Link to="/portal/ada/send_to_bank" className="block px-4 py-2 hover:bg-gray-50">Send to Bank List</Link>
                        <Link to="/portal/ada/rejected_list" className="block px-4 py-2 hover:bg-gray-50">Rejected List</Link>
                        <Link to="/portal/ada/reverted_list" className="block px-4 py-2 hover:bg-gray-50">Reverted List</Link>
                        <Link to="/portal/ada/deleted_list" className="block px-4 py-2 hover:bg-gray-50">Deleted List</Link>
                      </div>
                    )}
                  </div>

                  <div className="relative" ref={misRef}>
                    <button
                      type="button"
                      onClick={() => toggleDropdown('mis')}
                      className="flex items-center gap-1 hover:text-[#0891b2]"
                    >
                      MIS
                      <DropdownIcon />
                    </button>

                    {misMenuOpen && (
                      <div className="absolute mt-2 w-56 bg-white border rounded shadow-lg z-50">
                        <button type="button" onClick={() => handleMisDownload('submitted')} disabled={Boolean(misDownloading)} className="block w-full text-left px-4 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">{misDownloading === 'submitted' ? 'Downloading Submitted List...' : 'Download Submitted List'}</button>
                        <button type="button" onClick={() => handleMisDownload('approved')} disabled={Boolean(misDownloading)} className="block w-full text-left px-4 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">{misDownloading === 'approved' ? 'Downloading Approved List...' : 'Download Approved List'}</button>
                        <button type="button" onClick={() => handleMisDownload('rejected')} disabled={Boolean(misDownloading)} className="block w-full text-left px-4 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">{misDownloading === 'rejected' ? 'Downloading Rejected List...' : 'Download Rejected List'}</button>
                        <button type="button" onClick={() => handleMisDownload('pending')} disabled={Boolean(misDownloading)} className="block w-full text-left px-4 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">{misDownloading === 'pending' ? 'Downloading Pending List...' : 'Download Pending List'}</button>
                        <button type="button" onClick={() => handleMisDownload('reverted')} disabled={Boolean(misDownloading)} className="block w-full text-left px-4 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">{misDownloading === 'reverted' ? 'Downloading Reverted List...' : 'Download Reverted List'}</button>
                        <button type="button" onClick={() => handleMisDownload('sent_to_bank')} disabled={Boolean(misDownloading)} className="block w-full text-left px-4 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">{misDownloading === 'sent_to_bank' ? 'Downloading Send to Bank List...' : 'Download Send to Bank List'}</button>
                      </div>
                    )}
                  </div>

                  <div className="relative" ref={memberRef}>
                    <button
                      type="button"
                      onClick={() => toggleDropdown('member')}
                      className={`flex items-center gap-1 hover:text-[#0891b2] ${isPathActive('/portal/ada/members') ? 'text-[#0891b2] font-semibold' : ''}`}
                    >
                      Members
                      <DropdownIcon />
                    </button>

                    {memberMenuOpen && (
                      <div className="absolute mt-2 w-52 bg-white border rounded shadow-lg z-50">
                        <Link to="/portal/ada/members/new" className="block px-4 py-2 hover:bg-gray-50">New Member</Link>
                        <Link to="/portal/ada/members" className="block px-4 py-2 hover:bg-gray-50">Member List</Link>
                      </div>
                    )}
                  </div>
                </>
              )}

              {user.role === 'sno' && (
                <>
                  <div className="relative" ref={snoReportRef}>
                    <button
                      type="button"
                      onClick={() => toggleDropdown('snoReport')}
                      className="flex items-center gap-1 hover:text-[#0891b2]"
                    >
                      Report
                      <DropdownIcon />
                    </button>

                    {snoReportOpen && (
                      <div className="absolute mt-2 w-52 bg-white border rounded shadow-lg z-50">
                        <button
                          type="button"
                          onClick={handleSnoReportDownload}
                          disabled={snoReportDownloading}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {snoReportDownloading ? 'Downloading Report...' : 'Download Report'}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="relative" ref={snoApplicantRef}>
                    <button
                      type="button"
                      onClick={() => toggleDropdown('snoApplicant')}
                      className={`flex items-center gap-1 hover:text-[#0891b2] ${isPathActive('/portal/sno/approved') || isPathActive('/portal/sno/sno_approved_list') || isPathActive('/portal/sno/send_to_bank') || isPathActive('/portal/sno/rejected_list') ? 'text-[#0891b2] font-semibold' : ''}`}
                    >
                      Applicant List
                      <DropdownIcon />
                    </button>

                    {snoApplicantOpen && (
                      <div className="absolute mt-2 w-56 bg-white border rounded shadow-lg z-50">
                        <Link to="/portal/sno/approved" className="block px-4 py-2 hover:bg-gray-50">DDA Approved List</Link>
                        <Link to="/portal/sno/sno_approved_list" className="block px-4 py-2 hover:bg-gray-50">SNO Approved List</Link>
                        <Link to="/portal/sno/send_to_bank" className="block px-4 py-2 hover:bg-gray-50">Send to Bank List</Link>
                        <Link to="/portal/sno/rejected_list" className="block px-4 py-2 hover:bg-gray-50">Rejected List</Link>
                      </div>
                    )}
                  </div>

                  <div className="relative" ref={snoMemberRef}>
                    <button
                      type="button"
                      onClick={() => toggleDropdown('snoMember')}
                      className={`flex items-center gap-1 hover:text-[#0891b2] ${isPathActive('/portal/sno/members') ? 'text-[#0891b2] font-semibold' : ''}`}
                    >
                      Members
                      <DropdownIcon />
                    </button>

                    {snoMemberOpen && (
                      <div className="absolute mt-2 w-52 bg-white border rounded shadow-lg z-50">
                        <Link to="/portal/sno/members/new" className="block px-4 py-2 hover:bg-gray-50">New Member</Link>
                        <Link to="/portal/sno/members" className="block px-4 py-2 hover:bg-gray-50">Member List</Link>
                      </div>
                    )}
                  </div>

                  <div className="relative" ref={snoDbtRef}>
                    <button
                      type="button"
                      onClick={() => toggleDropdown('snoDbt')}
                      className={`flex items-center gap-1 hover:text-[#0891b2] ${isPathActive('/portal/sno/payment_file_list') ? 'text-[#0891b2] font-semibold' : ''}`}
                    >
                      DBT
                      <DropdownIcon />
                    </button>

                    {snoDbtOpen && (
                      <div className="absolute mt-2 w-52 bg-white border rounded shadow-lg z-50">
                        <Link to="/portal/sno/payment_file_list" className="block px-4 py-2 hover:bg-gray-50">Payment File List</Link>
                      </div>
                    )}
                  </div>
                </>
              )}

              {user.role === 'dda' && (
                <>
                  <div className="relative" ref={ddaReportRef}>
                    <button
                      type="button"
                      onClick={() => toggleDropdown('ddaReport')}
                      className="flex items-center gap-1 hover:text-[#0891b2]"
                    >
                      Report
                      <DropdownIcon />
                    </button>

                    {ddaReportOpen && (
                      <div className="absolute mt-2 w-52 bg-white border rounded shadow-lg z-50">
                        <button
                          type="button"
                          onClick={handleDdaReportDownload}
                          disabled={ddaReportDownloading}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {ddaReportDownloading ? 'Downloading Report...' : 'Download Report'}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="relative" ref={ddaApplicantRef}>
                    <button
                      type="button"
                      onClick={() => toggleDropdown('ddaApplicant')}
                      className={`flex items-center gap-1 hover:text-[#0891b2] ${isPathActive('/portal/dda/approved') || isPathActive('/portal/dda/send_to_bank') || isPathActive('/portal/dda/rejected_list') ? 'text-[#0891b2] font-semibold' : ''}`}
                    >
                      Applicant List
                      <DropdownIcon />
                    </button>

                    {ddaApplicantOpen && (
                      <div className="absolute mt-2 w-56 bg-white border rounded shadow-lg z-50">
                        <Link to="/portal/dda/approved" className="block px-4 py-2 hover:bg-gray-50">ADA Approved List</Link>
                        <Link to="/portal/dda/send_to_bank" className="block px-4 py-2 hover:bg-gray-50">Send to Bank List</Link>
                        <Link to="/portal/dda/rejected_list" className="block px-4 py-2 hover:bg-gray-50">Rejected List</Link>
                      </div>
                    )}
                  </div>

                  <div className="relative" ref={ddaMemberRef}>
                    <button
                      type="button"
                      onClick={() => toggleDropdown('ddaMember')}
                      className={`flex items-center gap-1 hover:text-[#0891b2] ${isPathActive('/portal/dda/members') ? 'text-[#0891b2] font-semibold' : ''}`}
                    >
                      Members
                      <DropdownIcon />
                    </button>

                    {ddaMemberOpen && (
                      <div className="absolute mt-2 w-52 bg-white border rounded shadow-lg z-50">
                        <Link to="/portal/dda/members/new" className="block px-4 py-2 hover:bg-gray-50">New Member</Link>
                        <Link to="/portal/dda/members" className="block px-4 py-2 hover:bg-gray-50">Member List</Link>
                      </div>
                    )}
                  </div>
                </>
              )}
            </nav>

            <div className="sm:hidden">
              <button type="button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </header>

        {isMenuOpen && (
          <div className="sm:hidden bg-white border-b border-gray-200 shadow-sm px-4 py-4 space-y-3 text-sm font-medium text-gray-700">
            <Link to={dashboardPath} className="block">
              Dashboard
            </Link>

            {user.role === 'gramdoot' && (
              <div>
                <p className="font-semibold">Quick Registration</p>
                <Link to="/portal/quick-registration/new" className="block pl-3 py-1">Registration Form</Link>
                <Link to="/portal/quick-registration/list" className="block pl-3 py-1">Registered Applicant List</Link>
              </div>
            )}

            {user.role === 'ada' && (
              <>
                <div>
                  <p className="font-semibold">Applicant List</p>
                  <Link to="/portal/ada/applications" className="block pl-3 py-1">Applicant List</Link>
                  <Link to="/portal/ada/pending" className="block pl-3 py-1">Pending List</Link>
                  <Link to="/portal/ada/approved" className="block pl-3 py-1">Approved List</Link>
                  <Link to="/portal/ada/send_to_bank" className="block pl-3 py-1">Send to Bank List</Link>
                  <Link to="/portal/ada/rejected_list" className="block pl-3 py-1">Rejected List</Link>
                  <Link to="/portal/ada/reverted_list" className="block pl-3 py-1">Reverted List</Link>
                  <Link to="/portal/ada/deleted_list" className="block pl-3 py-1">Deleted List</Link>
                </div>

                <div>
                  <p className="font-semibold">MIS</p>
                  <button type="button" onClick={() => handleMisDownload('submitted')} disabled={Boolean(misDownloading)} className="block pl-3 py-1 text-left disabled:opacity-50 disabled:cursor-not-allowed">{misDownloading === 'submitted' ? 'Downloading Submitted List...' : 'Download Submitted List'}</button>
                  <button type="button" onClick={() => handleMisDownload('approved')} disabled={Boolean(misDownloading)} className="block pl-3 py-1 text-left disabled:opacity-50 disabled:cursor-not-allowed">{misDownloading === 'approved' ? 'Downloading Approved List...' : 'Download Approved List'}</button>
                  <button type="button" onClick={() => handleMisDownload('rejected')} disabled={Boolean(misDownloading)} className="block pl-3 py-1 text-left disabled:opacity-50 disabled:cursor-not-allowed">{misDownloading === 'rejected' ? 'Downloading Rejected List...' : 'Download Rejected List'}</button>
                  <button type="button" onClick={() => handleMisDownload('pending')} disabled={Boolean(misDownloading)} className="block pl-3 py-1 text-left disabled:opacity-50 disabled:cursor-not-allowed">{misDownloading === 'pending' ? 'Downloading Pending List...' : 'Download Pending List'}</button>
                  <button type="button" onClick={() => handleMisDownload('reverted')} disabled={Boolean(misDownloading)} className="block pl-3 py-1 text-left disabled:opacity-50 disabled:cursor-not-allowed">{misDownloading === 'reverted' ? 'Downloading Reverted List...' : 'Download Reverted List'}</button>
                  <button type="button" onClick={() => handleMisDownload('sent_to_bank')} disabled={Boolean(misDownloading)} className="block pl-3 py-1 text-left disabled:opacity-50 disabled:cursor-not-allowed">{misDownloading === 'sent_to_bank' ? 'Downloading Send to Bank List...' : 'Download Send to Bank List'}</button>
                </div>

                <div>
                  <p className="font-semibold">Members</p>
                  <Link to="/portal/ada/members/new" className="block pl-3 py-1">New Member</Link>
                  <Link to="/portal/ada/members" className="block pl-3 py-1">Member List</Link>
                </div>
              </>
            )}

            {user.role === 'sno' && (
              <>
                <div>
                  <p className="font-semibold">Report</p>
                  <button type="button" onClick={handleSnoReportDownload} disabled={snoReportDownloading} className="block pl-3 py-1 text-left disabled:opacity-50 disabled:cursor-not-allowed">
                    {snoReportDownloading ? 'Downloading Report...' : 'Download Report'}
                  </button>
                </div>

                <div>
                  <p className="font-semibold">Applicant List</p>
                  <Link to="/portal/sno/approved" className="block pl-3 py-1">DDA Approved List</Link>
                  <Link to="/portal/sno/sno_approved_list" className="block pl-3 py-1">SNO Approved List</Link>
                  <Link to="/portal/sno/send_to_bank" className="block pl-3 py-1">Send to Bank List</Link>
                  <Link to="/portal/sno/rejected_list" className="block pl-3 py-1">Rejected List</Link>
                </div>

                <div>
                  <p className="font-semibold">Members</p>
                  <Link to="/portal/sno/members/new" className="block pl-3 py-1">New Member</Link>
                  <Link to="/portal/sno/members" className="block pl-3 py-1">Member List</Link>
                </div>

                <div>
                  <p className="font-semibold">DBT</p>
                  <Link to="/portal/sno/payment_file_list" className="block pl-3 py-1">Payment File List</Link>
                </div>
              </>
            )}

            {user.role === 'dda' && (
              <>
                <div>
                  <p className="font-semibold">Report</p>
                  <button type="button" onClick={handleDdaReportDownload} disabled={ddaReportDownloading} className="block pl-3 py-1 text-left disabled:opacity-50 disabled:cursor-not-allowed">
                    {ddaReportDownloading ? 'Downloading Report...' : 'Download Report'}
                  </button>
                </div>

                <div>
                  <p className="font-semibold">Applicant List</p>
                  <Link to="/portal/dda/approved" className="block pl-3 py-1">ADA Approved List</Link>
                  <Link to="/portal/dda/send_to_bank" className="block pl-3 py-1">Send to Bank List</Link>
                  <Link to="/portal/dda/rejected_list" className="block pl-3 py-1">Rejected List</Link>
                </div>

                <div>
                  <p className="font-semibold">Members</p>
                  <Link to="/portal/dda/members/new" className="block pl-3 py-1">New Member</Link>
                  <Link to="/portal/dda/members" className="block pl-3 py-1">Member List</Link>
                </div>
              </>
            )}
          </div>
        )}

        <div className="bg-[#1565c0] h-11 flex items-center justify-center text-white">
          Welcome to {ROLE_LABELS[user.role]} Portal Agricultural Labour Scheme
        </div>
      </>
    );
  }

  return (
    <>
      <header className="bg-white border-b shadow-sm relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/">
            <img src="/image/logo_bsb.png" alt="Govt Logo" className="h-16 w-auto" />
          </Link>

          <div className="hidden sm:flex gap-2">
            <Link to="/status" className="bg-[#00ACED] text-white px-4 py-2 rounded">Check Application</Link>
            <button className="bg-[#00ACED] text-white px-4 py-2 rounded">New Application Form</button>
            <button className="bg-[#00ACED] text-white px-4 py-2 rounded">Faq</button>
          </div>

          <div className="sm:hidden">
            <button type="button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="sm:hidden px-4 pb-4 flex flex-col gap-2 bg-white border-t">
            <Link to="/status" className="bg-[#00ACED] text-center text-white px-4 py-2 rounded">Check Application</Link>
            <button className="bg-[#00ACED] text-center text-white px-4 py-2 rounded">New Application Form</button>
            <button className="bg-[#00ACED] text-center text-white px-4 py-2 rounded">Faq</button>
          </div>
        )}
      </header>

      <div className="bg-[#0648b3] text-white py-2 text-center font-medium">
        Welcome to Agricultural Labour Portal
      </div>
    </>
  );
}
