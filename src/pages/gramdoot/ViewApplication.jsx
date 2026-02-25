import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApplicants } from '../../context/ApplicantContext';
import PortalHeader from '../../components/PortalHeader';
import PortalFooter from '../../components/PortalFooter';

// ─── Section Header (green, with horizontal rule — matches screenshots) ───────
function Section({ title }) {
  return (
    <div className="mt-8 mb-4">
      <h3 className="text-[#4caf50] font-semibold text-lg">{title}</h3>
      <hr className="border-gray-300 mt-1" />
    </div>
  );
}

// ─── Read-only field display ──────────────────────────────────────────────────
function Field({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-sm font-semibold text-gray-800 leading-tight">{label}</p>
      <p className="text-sm text-gray-500 mt-0.5 break-words">{value || <span className="italic text-gray-300">—</span>}</p>
    </div>
  );
}

// ─── 3-column row layout ─────────────────────────────────────────────────────
function Row({ children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5 mb-5">
      {children}
    </div>
  );
}

export default function ViewApplication() {
  const { id } = useParams();
  const { applicants } = useApplicants();
  const navigate = useNavigate();

  const rec = applicants.find((a) => String(a.id) === String(id));
  const f   = rec?.fullForm || {};

  if (!rec) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <PortalHeader />
        <main className="flex-grow max-w-7xl mx-auto px-4 py-12 text-center text-gray-500">
          Application not found.{' '}
          <button onClick={() => navigate(-1)} className="text-[#0891b2] underline">Go back</button>
        </main>
        <PortalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PortalHeader />

      <main className="flex-grow w-full max-w-6xl mx-auto px-6 py-6">

        {/* Back button */}
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-[#0891b2] hover:underline flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to List
          </button>
        </div>

        {/* ── SECTION 1: Applicant Details ──────────────────────────────── */}
        <Section title="Applicant Details" />
        <Row>
          <Field label="Acknowledgement ID" value={rec.ackId} />
          <Field label="Aadhar Number"      value={rec.aadhaar} />
        </Row>

        {/* ── SECTION 2: Applicant Profile Details ──────────────────────── */}
        <Section title="Applicant Profile Details" />
        <Row>
          <Field label="Name (as per Bank Account)"  value={rec.name} />
          <Field label="Father's / Husband's Name"   value={f.fathersName} />
          <Field label="Relation with the Applicant" value={f.relation} />
        </Row>
        <Row>
          <Field label="Age"    value={f.age} />
          <Field label="Gender" value={f.gender} />
          <Field label="Caste"  value={f.caste} />
        </Row>
        <Row>
          <Field label="Mobile No." value={rec.mobile} />
          <Field label="Date of Birth" value={f.dob} />
          <Field label="Voter Card Number" value={f.voterCard} />
        </Row>

        {/* ── SECTION 3: Applicant Address Details ──────────────────────── */}
        <Section title="Applicant Address Details" />
        <Row>
          <Field label="District"        value={f.district} />
          <Field label="Block"           value={f.block} />
          <Field label="Gram Panchayat"  value={f.gramPanchayat} />
        </Row>
        <Row>
          <Field label="Mouza"   value={f.mouza} />
          <Field label="Village" value={f.village} />
          <Field label="Address" value={f.address} />
        </Row>
        <Row>
          <Field label="Post Office"    value={f.postOffice} />
          <Field label="Police Station" value={f.policeStation} />
          <Field label="Pin Code"       value={f.pinCode} />
        </Row>

        {/* ── SECTION 4: Applicant Bank Details ─────────────────────────── */}
        <Section title="Applicant Bank Details" />
        <Row>
          <Field label="Account Holder's Name" value={f.accountHolderName} />
          <Field label="Account Number"        value={f.accountNumber} />
          <Field label="IFSC Code"             value={f.ifscCode} />
        </Row>
        <Row>
          <Field label="Bank Name"    value={f.bankName} />
          <Field label="Branch Name"  value={f.branchName} />
          <Field label="Account Type" value={f.accountType} />
        </Row>

        {/* ── SECTION 5: Nominee Details ────────────────────────────────── */}
        <Section title="Nominee Details" />
        <Row>
          <Field label="Nominee Name"                   value={f.nomineeName} />
          <Field label="Relation with Applicant"        value={f.nomineeRelation} />
          <Field label="Nominee's Father / Husband Name" value={f.nomineeFatherName} />
        </Row>
        <Row>
          <Field label="Name of Guardian"    value={f.guardianName} />
          <Field label="Nominee Date of Birth" value={f.nomineeDob} />
          <Field label="Nominee Age"         value={f.nomineeAge} />
        </Row>

        {/* ── SECTION 6: Self Declaration ───────────────────────────────── */}
        <Section title="Applicant Self Declaration Details" />
        <Row>
          <Field
            label="No Agricultural Land"
            value={f.noAgriculturalLand ? 'Yes — I do not have any Agricultural Land' : 'Not declared'}
          />
        </Row>

        {/* Status badge */}
        <div className="mt-6 flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">Application Status:</span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
            rec.status === 'approved'     ? 'bg-green-100 text-green-800'
            : rec.status === 'rejected'  ? 'bg-red-100 text-red-800'
            : rec.status === 'sent_to_bank' ? 'bg-blue-100 text-blue-800'
            : rec.status === 'processed' ? 'bg-purple-100 text-purple-800'
            : 'bg-yellow-100 text-yellow-800'
          }`}>
            {rec.status.replace('_', ' ')}
          </span>
        </div>

        <div className="mt-8 flex justify-center gap-4 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium px-8 py-2.5 rounded transition-colors"
          >
            Back
          </button>
          {(rec.status === 'pending' || rec.status === 'rejected') && (
            <button
              onClick={() => navigate(`/portal/registration/${rec.id}/edit`)}
              className="bg-[#0891b2] hover:bg-[#0e7490] text-white text-sm font-medium px-8 py-2.5 rounded transition-colors"
            >
              Edit Application
            </button>
          )}
        </div>
      </main>

      <PortalFooter />
    </div>
  );
}
