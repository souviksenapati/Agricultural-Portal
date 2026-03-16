import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApplicants } from '../../context/ApplicantContext';
import { useDataDirs } from '../../context/DataDirsContext';
import { lookupIFSC, updateFarmerMultipart, normalizeFarmer } from '../../api/client';
// ─── UI dropdown constants ────────────────────────────────────────────────────
const RELATIONS    = ['Son', 'Daughter', 'Wife', 'Husband', 'Mother', 'Father', 'Brother', 'Sister', 'Other'];
const GENDERS      = ['Male', 'Female', 'Other'];
const CASTES       = ['General', 'OBC-A', 'OBC-B', 'SC', 'ST'];
const ACCOUNT_TYPES = ['Savings', 'Current'];
const NOMINEE_AGES = Array.from({ length: 100 }, (_, i) => String(i + 1));

const EMPTY_FULL_FORM = {
  voterCard: '',
  // File objects (new uploads set by user) — null means no new file selected
  aadhaarImage: null, voterCardImage: null, applicantImage: null, bankImage: null, selfDeclarationDoc: null,
  // Existing server URLs (shown as "already uploaded" when re-editing)
  aadhaarImageUrl: '', voterCardImageUrl: '', applicantImageUrl: '', bankImageUrl: '', selfDeclarationUrl: '',
  fathersName: '', relation: '', gender: '', dob: '', age: '', caste: '',
  nomineeName: '', nomineeRelation: '', nomineeFatherName: '', guardianName: '', nomineeDob: '', nomineeAge: '',
  district: '', block: '', gramPanchayat: '', mouza: '', village: '', address: '', postOffice: '', policeStation: '', pinCode: '',
  accountHolderName: '', accountNumber: '', ifscCode: '', bankName: '', branchName: '', accountType: '',
  noAgriculturalLand: false,
};

const inp = (err) =>
  `w-full border rounded px-3 py-[7px] text-sm focus:outline-none focus:ring-1 transition-colors ${err ? 'border-red-400 focus:ring-red-400' : 'border-[#4caf50] focus:ring-[#4caf50]'
  } bg-white`;

const sel = (err) =>
  `w-full border rounded px-3 py-[7px] text-sm focus:outline-none focus:ring-1 transition-colors appearance-none cursor-pointer ${err ? 'border-red-400 focus:ring-red-400' : 'border-[#4caf50] focus:ring-[#4caf50]'
  } bg-white`;

function Section({ title }) {
  return (
    <div className="mt-8 mb-4 sm:mb-3">
      <h3 className="text-[#0891b2] font-bold text-sm sm:text-base">{title}</h3>
      <hr className="border-gray-300 mt-1" />
    </div>
  );
}

function Label({ children, required }) {
  return (
    <label className="block text-xs text-gray-600 mb-1">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function Err({ msg }) {
  return msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null;
}

function FileInput({ name, onFile, err, existingUrl }) {
  const [label, setLabel] = React.useState('');
  const handleChange = (e) => {
    const file = e.target.files?.[0] || null;
    setLabel(file ? file.name : '');
    onFile(name, file);
  };
  return (
    <div>
      <div className={`flex flex-wrap sm:flex-nowrap items-center border rounded text-sm overflow-hidden ${err ? 'border-red-400' : 'border-gray-300'}`}>
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
          onChange={handleChange}
          className="hidden"
        />
        <span className="px-3 text-gray-400 text-xs truncate w-full sm:w-auto">
          {label || (existingUrl ? '✓ Already uploaded' : 'No file selected.')}
        </span>
      </div>
      <Err msg={err} />
    </div>
  );
}

function calcAge(dob) {
  if (!dob) return '';
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age > 0 ? String(age) : '';
}

export default function FullRegistrationForm() {
  const { user } = useAuth();
  const { applicants, updateApplicant } = useApplicants();
  const {
    districts,
    blocksByDistrict, gpsByBlock, villagesByGP, mouzasByBlock, policeStationsByDistrict,
  } = useDataDirs();
  const navigate = useNavigate();
  const { id } = useParams();

  const record = applicants.find((a) => String(a.id) === String(id));

  const [form, setForm] = useState(() => ({
    aadhaar: record?.aadhaar || '',
    mobile: record?.mobile || '',
    name: record?.name || '',
    ...EMPTY_FULL_FORM,
    ...(record?.fullForm || {}),
    // Pre-fill district & block from the gramdoot's working zone (numeric IDs)
    district: record?.fullForm?.district || String(user?.working_zone?.district_id || ''),
    block:    record?.fullForm?.block    || String(user?.working_zone?.block_id    || ''),
    accountHolderName: record?.fullForm?.accountHolderName || record?.name || '',
  }));

  const [errors, setErrors]         = useState({});
  const [submitted, setSubmitted]   = useState(false);
  const [ifscLoading, setIfscLoading] = useState(false);

  // Skip clearing dependent fields on first render (preserve saved values)
  const districtMounted = useRef(false);
  const blockMounted    = useRef(false);
  const gpMounted       = useRef(false);

  // District changed → clear everything below it
  useEffect(() => {
    if (!districtMounted.current) { districtMounted.current = true; return; }
    setForm((f) => ({ ...f, block: '', gramPanchayat: '', mouza: '', village: '', policeStation: '' }));
  }, [form.district]);

  // Block changed → clear GP, mouza, village
  useEffect(() => {
    if (!blockMounted.current) { blockMounted.current = true; return; }
    setForm((f) => ({ ...f, gramPanchayat: '', mouza: '', village: '' }));
  }, [form.block]);

  // GP changed → clear village (mouzas are block-level, not GP-level)
  useEffect(() => {
    if (!gpMounted.current) { gpMounted.current = true; return; }
    setForm((f) => ({ ...f, village: '' }));
  }, [form.gramPanchayat]);

  if (!record) {
    return (
      <main className="flex-grow max-w-7xl mx-auto px-4 py-12 text-center text-gray-500">
        Application not found.
      </main>
    );
  }

  // Text / select / checkbox fields
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

  // File inputs — stores the actual File object in state
  const setFile = (name, file) => {
    setForm((f) => ({ ...f, [name]: file }));
  };

  const validate = () => {
    const e = {};
    if (!/^\d{12}$/.test(form.aadhaar)) e.aadhaar = '12-digit Aadhaar required.';
    if (!/^\d{10}$/.test(form.mobile)) e.mobile = '10-digit mobile required.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const { aadhaar, mobile, name, ...formData } = form;

    // Build server payload
    const farmerBody = {
      voter_card_no: formData.voterCard   || undefined,
      aadhar_no:     aadhaar,
      mobile_no:     mobile,
      is_land_less:  formData.noAgriculturalLand || false,
      farmer_profile_attributes: {
        name,
        father_name:                  formData.fathersName      || undefined,
        relationship:                 formData.relation         || undefined,
        date_of_birth:                formData.dob              || undefined,
        age:                          formData.age ? Number(formData.age) : undefined,
        gender:                       formData.gender           || undefined,
        caste:                        formData.caste            || undefined,
        nominee_name:                 formData.nomineeName      || undefined,
        relation_with_applicant:      formData.nomineeRelation  || undefined,
        nominee_father_husband_name:  formData.nomineeFatherName|| undefined,
        name_of_gurdian:              formData.guardianName     || undefined,
        nominee_date_of_birth:        formData.nomineeDob       || undefined,
        nominee_age: formData.nomineeAge ? Number(formData.nomineeAge) : undefined,
      },
      farmer_address_attributes: {
        address:           formData.address      || undefined,
        district_id:       formData.district     ? Number(formData.district)      : undefined,
        block_id:          formData.block        ? Number(formData.block)         : undefined,
        gram_panchayat_id: formData.gramPanchayat? Number(formData.gramPanchayat) : undefined,
        village_id:        formData.village      ? Number(formData.village)       : undefined,
        mouza_id:          formData.mouza        ? Number(formData.mouza)         : undefined,
        pincode:           formData.pinCode      || undefined,
        post_office:       formData.postOffice   || undefined,
        // API expects name string, DataDirs stores IDs — look up name; fall back to raw value
        police_station:    formData.policeStation || undefined,
      },
    };

    // Include bank details only when account number is filled
    if (formData.accountNumber) {
      farmerBody.farmer_bank_attributes = {
        bank_name:           formData.bankName          || undefined,
        account_number:      formData.accountNumber,
        ifsc_code:           formData.ifscCode          || undefined,
        branch_name:         formData.branchName        || undefined,
        account_holder_name: formData.accountHolderName || undefined,
        account_type:        formData.accountType       || undefined,
      };
    }

    try {
      const result     = await updateFarmerMultipart(record.id, farmerBody, {
        aadhaar_card_image: form.aadhaarImage     || null,
        voter_card_image:   form.voterCardImage   || null,
        farmer_image:       form.applicantImage   || null,
        bank_image:         form.bankImage        || null,
        self_declaration:   form.selfDeclarationDoc || null,
      });
      const normalized = normalizeFarmer(result);
      // Sync local state so applicant list / dashboard reflect the update
      updateApplicant(record.id, normalized);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErrors((prev) => ({ ...prev, _form: err.message || 'Submission failed. Please try again.' }));
    }
  };

  // IFSC auto-lookup on blur — fills bank name and branch name automatically
  const handleIfscBlur = async (e) => {
    const ifsc = e.target.value.trim();
    if (ifsc.length !== 11) return;
    setIfscLoading(true);
    try {
      const data = await lookupIFSC(ifsc);
      if (data?.bank_name) {
        setForm((f) => ({
          ...f,
          bankName:   data.bank_name   || f.bankName,
          branchName: data.branch_name || f.branchName,
        }));
      }
    } catch {
      // silent — user can fill manually if lookup fails
    } finally {
      setIfscLoading(false);
    }
  };

  // Filtered dropdown data from real API
  const filteredBlocks   = blocksByDistrict(form.district);
  const filteredGPs      = gpsByBlock(form.block);
  const filteredVillages = villagesByGP(form.gramPanchayat);
  const filteredMouzas   = mouzasByBlock(form.block);
  const filteredPS       = policeStationsByDistrict(form.district);

  return (
    <main className="flex-grow w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-5 sm:py-6">

      {submitted && (
        <div className="mb-5 bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded text-sm flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <span>Application updated and submitted to server successfully.</span>
          <button onClick={() => navigate(-1)} className="underline text-green-800 font-medium">Go Back</button>
        </div>
      )}

      {errors._form && (
        <div className="mb-5 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded text-sm">
          {errors._form}
        </div>
      )}

      {/* ── 1. ID Details ── */}
      <Section title="Applicant ID Details" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label>Voter Card Number</Label>
          <input name="voterCard" value={form.voterCard} onChange={set} className={inp(false)} />
        </div>
        <div>
          <Label required>Aadhaar Card Number</Label>
          <input name="aadhaar" value={form.aadhaar} onChange={set} maxLength={12} className={inp(errors.aadhaar)} />
          <Err msg={errors.aadhaar} />
        </div>
        <div>
          <Label required>Aadhar linked Mobile No</Label>
          <input name="mobile" value={form.mobile} onChange={set} maxLength={10} className={inp(errors.mobile)} />
          <Err msg={errors.mobile} />
        </div>
        <div>
          <Label>Upload Voter Card Image</Label>
          <FileInput name="voterCardImage" onFile={setFile} err={errors.voterCardImage} existingUrl={form.voterCardImageUrl} />
        </div>
        <div>
          <Label required>Upload Aadhaar Card Image</Label>
          <FileInput name="aadhaarImage" onFile={setFile} err={errors.aadhaarImage} existingUrl={form.aadhaarImageUrl} />
        </div>
      </div>

      {/* ── 2. Applicant Details ── */}
      <Section title="Applicant Details" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label required>Applicant Name (As Per Bank A/C)</Label>
          <input name="name" value={form.name} onChange={set} placeholder={form.name} className={inp(errors.name)} />
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
          <Label>Age (Auto)</Label>
          <input name="age" value={form.age} readOnly className="w-full border border-gray-200 rounded px-3 py-[7px] text-sm bg-gray-50 text-gray-500 cursor-not-allowed" />
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
          <FileInput name="applicantImage" onFile={setFile} err={errors.applicantImage} existingUrl={form.applicantImageUrl} />
        </div>
      </div>

      {/* ── 3. Nominee Details ── */}
      <Section title="Nominee Details" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label>Nominee Name</Label>
          <input name="nomineeName" value={form.nomineeName} onChange={set} className={inp(false)} />
        </div>
        <div>
          <Label>Relation with Applicant</Label>
          <select name="nomineeRelation" value={form.nomineeRelation} onChange={set} className={sel(false)}>
            <option value="">-- Select --</option>
            {RELATIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <Label>Nominee's Father / Husband Name</Label>
          <input name="nomineeFatherName" value={form.nomineeFatherName} onChange={set} className={inp(false)} />
        </div>
        <div>
          <Label>Name of Guardian</Label>
          <input name="guardianName" value={form.guardianName} onChange={set} className={inp(false)} />
        </div>
        <div>
          <Label>Nominee Date of Birth</Label>
          <input type="date" name="nomineeDob" value={form.nomineeDob} onChange={set} className={inp(false)} />
        </div>
        <div>
          <Label>Nominee Age</Label>
          <select name="nomineeAge" value={form.nomineeAge} onChange={set} className={sel(false)}>
            <option value="">Select Your Age</option>
            {NOMINEE_AGES.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      {/* ── 4. Address Details ── */}
      <Section title="Applicant Address Details" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label required>District</Label>
          <select name="district" value={form.district} onChange={set} className={sel(errors.district)}>
            <option value="">-- Select --</option>
            {districts.map((d) => <option key={d.id} value={String(d.id)}>{d.name}</option>)}
          </select>
          <Err msg={errors.district} />
        </div>
        <div>
          <Label required>Block</Label>
          <select name="block" value={form.block} onChange={set} className={sel(errors.block)}>
            <option value="">-- Select --</option>
            {filteredBlocks.map((b) => <option key={b.id} value={String(b.id)}>{b.name}</option>)}
          </select>
          <Err msg={errors.block} />
        </div>
        <div>
          <Label required>Gram Panchayat</Label>
          <select name="gramPanchayat" value={form.gramPanchayat} onChange={set} className={sel(errors.gramPanchayat)}>
            <option value="">Select Gram Panchayat</option>
            {filteredGPs.map((g) => <option key={g.id} value={String(g.id)}>{g.name}</option>)}
          </select>
          <Err msg={errors.gramPanchayat} />
        </div>
        <div>
          <Label>Mouza</Label>
          <select name="mouza" value={form.mouza} onChange={set} className={sel(false)}>
            <option value="">Select Mouza</option>
            {filteredMouzas.map((m) => <option key={m.id} value={String(m.id)}>{m.name}</option>)}
          </select>
        </div>
        <div>
          <Label>Village</Label>
          <select name="village" value={form.village} onChange={set} className={sel(false)}>
            <option value="">Select Village</option>
            {filteredVillages.map((v) => <option key={v.id} value={String(v.id)}>{v.name}</option>)}
          </select>
        </div>
        <div>
          <Label required>Address</Label>
          <textarea name="address" value={form.address} onChange={set} rows={2} className={`${inp(errors.address)} resize-y`} />
          <Err msg={errors.address} />
        </div>
        <div>
          <Label>Post Office</Label>
          <input name="postOffice" value={form.postOffice} onChange={set} className={inp(false)} />
        </div>
        <div>
          <Label>Police Station</Label>
          <select name="policeStation" value={form.policeStation} onChange={set} className={sel(false)}>
            <option value="">Select Police Station</option>
            {filteredPS.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <Label>PIN Code</Label>
          <input name="pinCode" value={form.pinCode} onChange={set} maxLength={6} className={inp(errors.pinCode)} />
          <Err msg={errors.pinCode} />
        </div>
      </div>

      {/* ── 5. Bank Account Details ── */}
      <Section title="Applicant Bank Details" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label required>Account Holder Name</Label>
          <input name="accountHolderName" value={form.accountHolderName} onChange={set} className={inp(errors.accountHolderName)} />
          <Err msg={errors.accountHolderName} />
        </div>
        <div>
          <Label required>Account Number</Label>
          <input name="accountNumber" value={form.accountNumber} onChange={set} className={inp(errors.accountNumber)} />
          <Err msg={errors.accountNumber} />
        </div>
        <div>
          <Label required>IFSC Code</Label>
          <input
            name="ifscCode"
            value={form.ifscCode}
            onChange={set}
            onBlur={handleIfscBlur}
            maxLength={11}
            placeholder="e.g. SBIN0001234"
            className={inp(errors.ifscCode)}
          />
          {ifscLoading && <p className="text-xs text-blue-500 mt-1">Looking up IFSC…</p>}
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
        <div className="sm:col-span-2 lg:col-span-1">
          <Label required>Upload Bank Image</Label>
          <FileInput name="bankImage" onFile={setFile} err={errors.bankImage} existingUrl={form.bankImageUrl} />
        </div>
      </div>

      {/* ── 6. Self Declaration ── */}
      <Section title="Applicant Self Declaration Details" />
      <div className="space-y-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="noAgriculturalLand"
            checked={form.noAgriculturalLand}
            onChange={set}
            className="mt-0.5 w-4 h-4 accent-[#4caf50] cursor-pointer"
          />
          <span className="text-sm text-gray-700">I do not have any Agricultural Land</span>
        </label>
        <div className="max-w-xs">
          <Label required>Upload Self Declaration Document</Label>
          <FileInput name="selfDeclarationDoc" onFile={setFile} err={errors.selfDeclarationDoc} existingUrl={form.selfDeclarationUrl} />
        </div>
      </div>

      {/* ── Submit ── */}
      <div className="flex justify-center mt-10 mb-6 px-2">
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full sm:w-auto bg-[#4caf50] hover:bg-[#388e3c] text-white font-semibold text-sm px-10 sm:px-12 py-2.5 rounded transition-colors"
        >
          Submit
        </button>
      </div>

    </main>
  );
}