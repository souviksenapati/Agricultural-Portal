import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApplicants } from '../../context/ApplicantContext';
import PortalHeader from '../../components/PortalHeader';
import PortalFooter from '../../components/PortalFooter';

export default function RegistrationForm() {
  const { user } = useAuth();
  const { applicants, addApplicant, updateApplicant } = useApplicants();
  const navigate = useNavigate();
  const { id } = useParams(); // present when editing

  const editRecord = id ? applicants.find((a) => String(a.id) === String(id)) : null;

  const [form, setForm] = useState({ name: '', aadhaar: '', mobile: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (editRecord) {
      setForm({ name: editRecord.name, aadhaar: editRecord.aadhaar, mobile: editRecord.mobile });
    }
  }, [editRecord]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Applicant Name is required.';
    if (!/^\d{12}$/.test(form.aadhaar)) e.aadhaar = 'Aadhaar must be 12 digits.';
    if (!/^\d{10}$/.test(form.mobile)) e.mobile = 'Mobile must be 10 digits.';
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    if (editRecord) {
      updateApplicant(editRecord.id, { name: form.name, aadhaar: form.aadhaar, mobile: form.mobile });
      setSuccess(`Record updated successfully (Ack ID: ${editRecord.ackId})`);
    } else {
      const newEntry = addApplicant(form);
      setSuccess(`Application submitted! Acknowledgement ID: ${newEntry.ackId}`);
      setForm({ name: '', aadhaar: '', mobile: '' });
    }
  };

  const inputClass = (field) =>
    `w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 transition-colors ${
      errors[field]
        ? 'border-red-400 focus:ring-red-400'
        : 'border-[#4caf50] focus:ring-[#4caf50]'
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PortalHeader />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8">
        {/* User info top-right */}
        <div className="flex justify-end text-sm text-gray-700 mb-6 space-y-0.5">
          <div className="text-right">
            <div>
              <span className="font-bold">User Email:</span> {user?.email}{' '}
              <span className="text-gray-500">({user?.role === 'gramdoot' ? 'Gramdoot' : user?.role})</span>
            </div>
            <div>
              <span className="font-bold">Block Name:</span> {user?.blockName}
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="max-w-5xl mx-auto">
          <h3 className="text-[#0891b2] font-bold text-lg mb-1">
            {editRecord ? 'Edit Applicant Record' : 'Applicant Registration Form'}
          </h3>
          <hr className="border-gray-300 mb-6" />

          {success && (
            <div className="mb-5 bg-green-50 border border-green-300 text-green-700 text-sm px-4 py-3 rounded">
              {success}
              {!editRecord && (
                <button
                  onClick={() => navigate('/portal/quick-registration/list')}
                  className="ml-4 underline text-green-800 font-medium"
                >
                  View List
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Applicant Name */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Applicant Name (as per Bank Account){' '}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass('name')}
                  placeholder=""
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Aadhaar */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Aadhaar Card Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="aadhaar"
                  value={form.aadhaar}
                  onChange={handleChange}
                  maxLength={12}
                  className={inputClass('aadhaar')}
                  placeholder=""
                />
                {errors.aadhaar && <p className="text-red-500 text-xs mt-1">{errors.aadhaar}</p>}
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Bank Account Linked Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  maxLength={10}
                  className={inputClass('mobile')}
                  placeholder=""
                />
                {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-[#4caf50] hover:bg-[#388e3c] text-white font-semibold text-sm px-10 py-2.5 rounded transition-colors"
              >
                {editRecord ? 'Update' : 'Submit'}
              </button>
              {editRecord && (
                <button
                  type="button"
                  onClick={() => navigate('/portal/quick-registration/list')}
                  className="ml-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold text-sm px-6 py-2.5 rounded transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </main>

      <PortalFooter />
    </div>
  );
}
