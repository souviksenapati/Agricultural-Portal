import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApplicants } from '../../context/ApplicantContext';
import PortalHeader from '../../components/Header';
import PortalFooter from '../../components/Footer';
import {
  DISTRICTS, BLOCKS_BY_DISTRICT, GRAM_PANCHAYATS_BY_BLOCK,
  MOUZAS_BY_GP, VILLAGES_BY_MOUZA,
  RELATIONS, GENDERS, CASTES, ACCOUNT_TYPES, NOMINEE_AGES,
  EMPTY_FULL_FORM,
} from '../../data/mockData';

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

function FileInput({ name, onChange, err }) {
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
          onChange={onChange}
          className="hidden"
        />
        <span className="px-3 text-gray-400 text-xs truncate w-full sm:w-auto" id={`label_${name}`}>
          No file selected.
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
  const navigate = useNavigate();
  const { id } = useParams();

  const record = applicants.find((a) => String(a.id) === String(id));

  const [form, setForm] = useState(() => ({
    aadhaar: record?.aadhaar || '',
    mobile: record?.mobile || '',
    name: record?.name || '',
    ...EMPTY_FULL_FORM,
    ...(record?.fullForm || {}),
    district: record?.fullForm?.district || (user?.blockName?.split('-')[0] || ''),
    block: record?.fullForm?.block || user?.blockName || '',
    accountHolderName: record?.fullForm?.accountHolderName || record?.name || '',
  }));

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

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
        {/* <PortalHeader /> */}
        <main className="flex-grow max-w-7xl mx-auto px-4 py-12 text-center text-gray-500">
          Application not found.
        </main>
        {/* <PortalFooter /> */}
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

  const validate = () => {
    const e = {};
    if (!/^\d{12}$/.test(form.aadhaar)) e.aadhaar = '12-digit Aadhaar required.';
    if (!/^\d{10}$/.test(form.mobile)) e.mobile = '10-digit mobile required.';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    const { aadhaar, mobile, name, ...fullForm } = form;
    updateApplicant(record.id, { name, aadhaar, mobile, fullForm: { ...fullForm }, status: 'pending' });
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const blocks = BLOCKS_BY_DISTRICT[form.district] || [];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* <PortalHeader /> */}

      <main className="flex-grow w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-5 sm:py-6">

        {submitted && (
          <div className="mb-5 bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded text-sm flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <span>Application updated successfully!</span>
            <button onClick={() => navigate(-1)} className="underline text-green-800 font-medium">
              Go Back
            </button>
          </div>
        )}

        <Section title="Applicant ID Details" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label required>Aadhaar Card Number</Label>
            <input name="aadhaar" value={form.aadhaar} onChange={set} className={inp(errors.aadhaar)} />
            <Err msg={errors.aadhaar} />
          </div>

          <div>
            <Label required>Mobile No</Label>
            <input name="mobile" value={form.mobile} onChange={set} className={inp(errors.mobile)} />
            <Err msg={errors.mobile} />
          </div>

          <div>
            <Label required>Applicant Name</Label>
            <input name="name" value={form.name} onChange={set} className={inp(errors.name)} />
            <Err msg={errors.name} />
          </div>
        </div>

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

      {/* <PortalFooter /> */}
    </div>
  );
}