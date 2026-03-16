import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApplicants } from '../../context/ApplicantContext';
import { useDataDirs } from '../../context/DataDirsContext';

export default function RegistrationForm() {
  const { user } = useAuth();
  const { addApplicant } = useApplicants();
  const { blockName, districtName } = useDataDirs();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', aadhaar: '', mobile: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Applicant Name is required.';
    if (!/^\d{12}$/.test(form.aadhaar))
      e.aadhaar = 'Aadhaar must be 12 digits.';
    if (!/^\d{10}$/.test(form.mobile))
      e.mobile = 'Mobile must be 10 digits.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Only allow numbers for Aadhaar & Mobile
    if (name === 'aadhaar' || name === 'mobile') {
      if (!/^\d*$/.test(value)) return;
    }

    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: '' });
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      const newEntry = await addApplicant(form, user);
      setSuccess(`Application submitted! Acknowledgement ID: ${newEntry.ackId}`);
      setForm({ name: '', aadhaar: '', mobile: '' });
    } catch (err) {
      setErrors({ _form: err.message || 'Submission failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${errors[field]
      ? 'border-red-400 focus:ring-red-400'
      : 'border-[#4caf50] focus:ring-[#4caf50]'
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* <PortalHeader /> */}

      <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* User Info */}
        <div className="flex justify-end mb-6">
          <div className="text-xs sm:text-sm text-gray-700 text-right space-y-1">
            <div>
              <span className="font-semibold">User Email:</span>{' '}
              {user?.email}{' '}
              <span className="text-gray-500">
                ({user?.role === 'gramdoot'
                  ? 'Gramdoot'
                  : user?.role})
              </span>
            </div>
            <div>
              <span className="font-semibold">Block Name:</span>{' '}
              {blockName(user?.working_zone?.block_id)}
              {user?.working_zone?.district_id ? ` (${districtName(user.working_zone.district_id)})` : ''}
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-5 sm:p-8">
          <h3 className="text-[#0891b2] font-bold text-base sm:text-lg mb-2">
            Applicant Registration Form
          </h3>

          <hr className="border-gray-200 mb-6" />

          {success && (
            <div className="mb-6 bg-green-50 border border-green-300 text-green-700 text-sm px-4 py-3 rounded-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <span>{success}</span>

              <button
                  onClick={() => navigate('/portal/quick-registration/list')}
                  className="underline text-green-800 font-medium text-sm"
                >
                  View List
                </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Name */}
              <div>
                <label className="block text-xs sm:text-sm text-gray-600 mb-1">
                  Applicant Name (as per Bank Account){' '}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass('name')}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Aadhaar */}
              <div>
                <label className="block text-xs sm:text-sm text-gray-600 mb-1">
                  Aadhaar Card Number{' '}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="aadhaar"
                  value={form.aadhaar}
                  onChange={handleChange}
                  maxLength={12}
                  className={inputClass('aadhaar')}
                />
                {errors.aadhaar && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.aadhaar}
                  </p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-xs sm:text-sm text-gray-600 mb-1">
                  Bank Account Linked Mobile Number{' '}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  maxLength={10}
                  className={inputClass('mobile')}
                />
                {errors.mobile && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.mobile}
                  </p>
                )}
              </div>
            </div>

            {/* API-level error */}
            {errors._form && (
              <p className="text-red-600 text-sm text-center">{errors._form}</p>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto bg-[#4caf50] hover:bg-[#388e3c] disabled:opacity-60 text-white font-semibold text-sm px-10 py-2.5 rounded-md transition-all duration-200"
              >
                {submitting ? 'Submitting…' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* <PortalFooter /> */}
    </div>
  );
}