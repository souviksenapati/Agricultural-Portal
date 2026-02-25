import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApplicants } from '../../context/ApplicantContext';
import PortalHeader from '../../components/PortalHeader';
import PortalFooter from '../../components/PortalFooter';
import {
  DISTRICTS, BLOCKS_BY_DISTRICT, GRAM_PANCHAYATS_BY_BLOCK,
  MOUZAS_BY_GP, VILLAGES_BY_MOUZA,
  RELATIONS, GENDERS, CASTES, ACCOUNT_TYPES, NOMINEE_AGES,
  EMPTY_FULL_FORM,
} from '../../data/mockData';

// ─── Shared input style (green border like original) ─────────────────────────
const inp = (err) =>
  `w-full border rounded px-3 py-[7px] text-sm focus:outline-none focus:ring-1 transition-colors ${
    err ? 'border-red-400 focus:ring-red-400' : 'border-[#4caf50] focus:ring-[#4caf50]'
  } bg-white`;

const sel = (err) =>
  `w-full border rounded px-3 py-[7px] text-sm focus:outline-none focus:ring-1 transition-colors appearance-none cursor-pointer ${
    err ? 'border-red-400 focus:ring-red-400' : 'border-[#4caf50] focus:ring-[#4caf50]'
  } bg-white`;

// ─── Section Header ───────────────────────────────────────────────────────────
function Section({ title }) {
  return (
    <div className="mt-8 mb-3">
      <h3 className="text-[#0891b2] font-bold text-base">{title}</h3>
      <hr className="border-gray-300 mt-1" />
    </div>
  );
}

// ─── Label ────────────────────────────────────────────────────────────────────
function Label({ children, required }) {
  return (
    <label className="block text-xs text-gray-600 mb-1">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

// ─── Error msg ────────────────────────────────────────────────────────────────
function Err({ msg }) {
  return msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null;
}

// ─── File Input (styled like original Browse button) ─────────────────────────
function FileInput({ name, onChange, required, err }) {
  return (
    <div>
      <div className={`flex items-center border rounded text-sm overflow-hidden ${err ? 'border-red-400' : 'border-gray-300'}`}>
        <label
          htmlFor={`file_${name}`}
          className="bg-gray-100 border-r border-gray-300 px-3 py-[7px] text-xs font-medium text-gray-700 cursor-pointer hover:bg-gray-200 whitespace-nowrap select-none"
        >
          Browse...
        </label>
        <input
          id={`file_${name}`}
          type="file"
          name={name}
          accept="image/*,.pdf"
          onChange={onChange}
          className="hidden"
        />
        <span className="px-3 text-gray-400 text-xs truncate" id={`label_${name}`}>
          No file selected.
        </span>
      </div>
      <Err msg={err} />
    </div>
  );
}

// ─── Calculate age from DOB ───────────────────────────────────────────────────
function calcAge(dob) {
  if (!dob) return '';
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age > 0 ? String(age) : '';
}

// ═════════════════════════════════════════════════════════════════════════════
export default function FullRegistrationForm() {
  const { user } = useAuth();
  const { applicants, updateApplicant } = useApplicants();
  const navigate = useNavigate();
  const { id } = useParams();

  const record = applicants.find((a) => String(a.id) === String(id));

  // Merge saved data with defaults
  const [form, setForm] = useState(() => ({
    // Pre-fill from quick reg
    aadhaar:          record?.aadhaar          || '',
    mobile:           record?.mobile           || '',
    name:             record?.name             || '',
    // Rest from saved full-form data or empty
    ...EMPTY_FULL_FORM,
    ...(record?.fullForm || {}),
    // Always keep these pre-filled from quick reg
    district:         record?.fullForm?.district   || (user?.blockName?.split('-')[0] || ''),
    block:            record?.fullForm?.block       || user?.blockName || '',
    accountHolderName: record?.fullForm?.accountHolderName || record?.name || '',
  }));

  const [errors, setErrors] = useState({});
  const [fileLabels, setFileLabels] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Auto dependent dropdowns reset
  useEffect(() => {
    setForm((f) => ({ ...f, gramPanchayat: '', mouza: '', village: '' }));
  }, [form.block]);
  useEffect(() => {
    setForm((f) => ({ ...f, mouza: '', village: '' }));
  }, [form.gramPanchayat]);
  useEffect(() => {
    setForm((f) => ({ ...f, village: '' }));
  }, [form.mouza]);

  if (!record) {
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

  const set = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setForm((f) => {
      const next = { ...f, [name]: val };
      if (name === 'dob') next.age = calcAge(value);
      return next;
    });
    setErrors((er) => ({ ...er, [name]: '' }));
  };

  const setFile = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setForm((f) => ({ ...f, [name]: file || null }));
    setFileLabels((l) => ({ ...l, [name]: file ? file.name : 'No file selected.' }));
    // Update visible label
    const span = document.getElementById(`label_${name}`);
    if (span) span.textContent = file ? file.name : 'No file selected.';
  };

  const validate = () => {
    const e = {};
    if (!/^\d{12}$/.test(form.aadhaar))       e.aadhaar = '12-digit Aadhaar required.';
    if (!/^\d{10}$/.test(form.mobile))         e.mobile  = '10-digit mobile required.';
    if (!form.aadhaarImage)                    e.aadhaarImage = 'Aadhaar card image required.';
    if (!form.name.trim())                     e.name = 'Applicant name required.';
    if (!form.fathersName.trim())              e.fathersName = "Father's/Husband's name required.";
    if (!form.relation)                        e.relation = 'Relation required.';
    if (!form.gender)                          e.gender = 'Gender required.';
    if (!form.dob)                             e.dob = 'Date of birth required.';
    if (!form.caste)                           e.caste = 'Caste required.';
    if (!form.applicantImage)                  e.applicantImage = "Applicant's photo required.";
    if (!form.district)                        e.district = 'District required.';
    if (!form.block)                           e.block = 'Block required.';
    if (!form.gramPanchayat)                   e.gramPanchayat = 'Gram Panchayat required.';
    if (!form.mouza)                           e.mouza = 'Mouza required.';
    if (!form.village)                         e.village = 'Village required.';
    if (!form.address.trim())                  e.address = 'Address required.';
    if (!form.postOffice.trim())               e.postOffice = 'Post Office required.';
    if (!form.policeStation.trim())            e.policeStation = 'Police Station required.';
    if (!/^\d{6}$/.test(form.pinCode))         e.pinCode = '6-digit Pin Code required.';
    if (!form.accountHolderName.trim())        e.accountHolderName = 'Account Holder Name required.';
    if (!form.accountNumber.trim())            e.accountNumber = 'Account Number required.';
    if (!form.ifscCode.trim())                 e.ifscCode = 'IFSC Code required.';
    if (!form.bankName.trim())                 e.bankName = 'Bank Name required.';
    if (!form.branchName.trim())               e.branchName = 'Branch Name required.';
    if (!form.accountType)                     e.accountType = 'Account Type required.';
    if (!form.bankImage)                       e.bankImage = 'Bank passbook image required.';
    if (!form.selfDeclarationDoc)              e.selfDeclarationDoc = 'Self declaration document required.';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      // Scroll to first error
      const firstErrEl = document.querySelector('.border-red-400');
      if (firstErrEl) firstErrEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const { aadhaar, mobile, name, ...fullForm } = form;
    updateApplicant(record.id, { name, aadhaar, mobile, fullForm: { ...fullForm }, status: 'pending' });
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const gps     = GRAM_PANCHAYATS_BY_BLOCK[form.block]   || [];
  const mouzas  = MOUZAS_BY_GP[form.gramPanchayat]        || [];
  const villages= VILLAGES_BY_MOUZA[form.mouza]           || [];
  const blocks  = BLOCKS_BY_DISTRICT[form.district]       || [];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PortalHeader />

      <main className="flex-grow w-full max-w-6xl mx-auto px-6 py-6">

        {submitted && (
          <div className="mb-5 bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded text-sm flex items-center justify-between">
            <span>Application updated successfully!</span>
            <div className="flex gap-3">
              <button onClick={() => navigate(`/portal/registration/${id}/view`)}
                className="underline text-green-800 font-medium">View Application</button>
              <button onClick={() => navigate('/portal/quick-registration/list')}
                className="underline text-green-800 font-medium">Back to List</button>
            </div>
          </div>
        )}

        {/* ── SECTION 1: Applicant ID Details ─────────────────────────── */}
        <Section title="Applicant ID Details" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Voter Card Number</Label>
            <input name="voterCard" value={form.voterCard} onChange={set} className={inp('')} />
          </div>
          <div>
            <Label required>Aadhaar Card Number</Label>
            <input name="aadhaar" value={form.aadhaar} onChange={set} maxLength={12}
              placeholder="735036864504" className={inp(errors.aadhaar)} />
            <Err msg={errors.aadhaar} />
          </div>
          <div>
            <Label required>Aadhar linked Mobile No</Label>
            <input name="mobile" value={form.mobile} onChange={set} maxLength={10}
              placeholder="9685434265" className={inp(errors.mobile)} />
            <Err msg={errors.mobile} />
          </div>
          <div>
            <Label>Upload voter Card Image</Label>
            <FileInput name="voterCardImage" onChange={setFile} err={errors.voterCardImage} />
          </div>
          <div>
            <Label required>Upload Aadhar Card Image</Label>
            <FileInput name="aadhaarImage" onChange={setFile} required err={errors.aadhaarImage} />
          </div>
        </div>

        {/* ── SECTION 2: Applicant Details ────────────────────────────── */}
        <Section title="Applicant Details" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label required>Applicant Name (As Per Bank A/C)</Label>
            <input name="name" value={form.name} onChange={set}
              placeholder="Demo Farmer" className={inp(errors.name)} />
            <Err msg={errors.name} />
          </div>
          <div>
            <Label required>Father's / Husband's Name</Label>
            <input name="fathersName" value={form.fathersName} onChange={set} className={inp(errors.fathersName)} />
            <Err msg={errors.fathersName} />
          </div>
          <div>
            <Label required>Relation with Applicant</Label>
            <select name="relation" value={form.relation} onChange={set} className={sel(errors.relation)}>
              <option value="">Select Your Relationship</option>
              {RELATIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <Err msg={errors.relation} />
          </div>
          <div>
            <Label required>Gender</Label>
            <select name="gender" value={form.gender} onChange={set} className={sel(errors.gender)}>
              <option value="">Select Your Gender</option>
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            <Err msg={errors.gender} />
          </div>
          <div>
            <Label required>Date of Birth</Label>
            <input type="date" name="dob" value={form.dob} onChange={set} className={inp(errors.dob)} />
            <Err msg={errors.dob} />
          </div>
          <div>
            <Label required>Age</Label>
            <input type="number" name="age" value={form.age} onChange={set} min={0} max={120}
              className={inp(errors.age)} readOnly={!!form.dob} />
            <Err msg={errors.age} />
          </div>
          <div>
            <Label required>Caste</Label>
            <select name="caste" value={form.caste} onChange={set} className={sel(errors.caste)}>
              <option value="">Select Your Caste</option>
              {CASTES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <Err msg={errors.caste} />
          </div>
          <div>
            <Label required>Upload Applicant's Image</Label>
            <FileInput name="applicantImage" onChange={setFile} required err={errors.applicantImage} />
          </div>
        </div>

        {/* ── SECTION 3: Nominee Details ───────────────────────────────── */}
        <Section title="Nominee Details" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Nominee Name</Label>
            <input name="nomineeName" value={form.nomineeName} onChange={set} className={inp('')} />
          </div>
          <div>
            <Label>Relation with Applicant</Label>
            <input name="nomineeRelation" value={form.nomineeRelation} onChange={set} className={inp('')} />
          </div>
          <div>
            <Label>Nominee's Father / Husband Name</Label>
            <input name="nomineeFatherName" value={form.nomineeFatherName} onChange={set} className={inp('')} />
          </div>
          <div>
            <Label>Name of Gurdian</Label>
            <input name="guardianName" value={form.guardianName} onChange={set} className={inp('')} />
          </div>
          <div>
            <Label>Nominee Date of Birth</Label>
            <input type="date" name="nomineeDob" value={form.nomineeDob} onChange={set} className={inp('')} />
          </div>
          <div>
            <Label>Age</Label>
            <select name="nomineeAge" value={form.nomineeAge} onChange={set} className={sel('')}>
              <option value="">Select Your Age</option>
              {NOMINEE_AGES.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>

        {/* ── SECTION 4: Applicant Address Details ─────────────────────── */}
        <Section title="Applicant Address Details" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label required>District</Label>
            <select name="district" value={form.district} onChange={set} className={sel(errors.district)}>
              <option value="">Select District</option>
              {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <Err msg={errors.district} />
          </div>
          <div>
            <Label required>Block</Label>
            <select name="block" value={form.block} onChange={set} className={sel(errors.block)}>
              <option value="">Select Block</option>
              {blocks.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
            <Err msg={errors.block} />
          </div>
          <div>
            <Label required>Gram Panchayat</Label>
            <select name="gramPanchayat" value={form.gramPanchayat} onChange={set} className={sel(errors.gramPanchayat)}>
              <option value="">Select Gram Panchayat</option>
              {gps.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            <Err msg={errors.gramPanchayat} />
          </div>
          <div>
            <Label required>Mouza</Label>
            <select name="mouza" value={form.mouza} onChange={set} className={sel(errors.mouza)}>
              <option value="">Select Mouza</option>
              {mouzas.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <Err msg={errors.mouza} />
          </div>
          <div>
            <Label required>Village</Label>
            <select name="village" value={form.village} onChange={set} className={sel(errors.village)}>
              <option value="">Select Village</option>
              {villages.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
            <Err msg={errors.village} />
          </div>
          <div>
            <Label required>Address</Label>
            <textarea name="address" value={form.address} onChange={set} rows={2}
              className={`${inp(errors.address)} resize-y`} />
            <Err msg={errors.address} />
          </div>
          <div>
            <Label required>Post Office</Label>
            <input name="postOffice" value={form.postOffice} onChange={set} className={inp(errors.postOffice)} />
            <Err msg={errors.postOffice} />
          </div>
          <div>
            <Label required>Police Station</Label>
            <input name="policeStation" value={form.policeStation} onChange={set} className={inp(errors.policeStation)} />
            <Err msg={errors.policeStation} />
          </div>
          <div>
            <Label required>Pin Code</Label>
            <input name="pinCode" value={form.pinCode} onChange={set} maxLength={6} className={inp(errors.pinCode)} />
            <Err msg={errors.pinCode} />
          </div>
        </div>

        {/* ── SECTION 5: Applicant Bank Details ────────────────────────── */}
        <Section title="Applicant Bank Details" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label required>Account Holder's Name</Label>
            <input name="accountHolderName" value={form.accountHolderName} onChange={set}
              placeholder="Demo Farmer" className={inp(errors.accountHolderName)} />
            <Err msg={errors.accountHolderName} />
          </div>
          <div>
            <Label required>Account Number</Label>
            <input name="accountNumber" value={form.accountNumber} onChange={set} className={inp(errors.accountNumber)} />
            <Err msg={errors.accountNumber} />
          </div>
          <div>
            <Label required>IFSC Code</Label>
            <input name="ifscCode" value={form.ifscCode} onChange={set}
              style={{ textTransform: 'uppercase' }} className={inp(errors.ifscCode)} />
            <Err msg={errors.ifscCode} />
          </div>
          <div>
            <Label required>Bank Name</Label>
            <input name="bankName" value={form.bankName} onChange={set} className={inp(errors.bankName)} />
            <Err msg={errors.bankName} />
          </div>
          <div>
            <Label required>Branch Name</Label>
            <input name="branchName" value={form.branchName} onChange={set} className={inp(errors.branchName)} />
            <Err msg={errors.branchName} />
          </div>
          <div>
            <Label required>Account Type</Label>
            <select name="accountType" value={form.accountType} onChange={set} className={sel(errors.accountType)}>
              <option value="">Select Account Type</option>
              {ACCOUNT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <Err msg={errors.accountType} />
          </div>
          <div className="md:col-span-1">
            <Label required>Upload Bank Image</Label>
            <FileInput name="bankImage" onChange={setFile} required err={errors.bankImage} />
          </div>
        </div>

        {/* ── SECTION 6: Self Declaration ───────────────────────────────── */}
        <Section title="Applicant Self Declaration Details" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-2 pt-1">
            <input
              id="noAgriculturalLand"
              type="checkbox"
              name="noAgriculturalLand"
              checked={form.noAgriculturalLand}
              onChange={set}
              className="mt-0.5 cursor-pointer"
            />
            <label htmlFor="noAgriculturalLand" className="text-sm text-gray-700 cursor-pointer select-none">
              I do not have any Agricultural Land
            </label>
          </div>
          <div>
            <Label required>Upload Self Declaration Document</Label>
            <FileInput name="selfDeclarationDoc" onChange={setFile} required err={errors.selfDeclarationDoc} />
          </div>
        </div>

        {/* ── Submit ─────────────────────────────────────────────────────── */}
        <div className="flex justify-center mt-10 mb-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-[#4caf50] hover:bg-[#388e3c] text-white font-semibold text-sm px-12 py-2.5 rounded transition-colors"
          >
            Submit
          </button>
        </div>
      </main>

      <PortalFooter />
    </div>
  );
}
