import React, { createContext, useContext, useState } from 'react';
import { createFarmer, listFarmers, normalizeFarmer, updateFarmerStatus, deleteFarmer } from '../api/client';

const NOOP = () => Promise.resolve();
const DEFAULT_CTX = {
  applicants: [],
  loadFarmers: NOOP,
  addApplicant: NOOP,
  updateApplicant: () => {},
  approveApplicant: NOOP,
  rejectApplicant: NOOP,
  deleteApplicant: NOOP,
  sendToBank: NOOP,
  revertToADA: NOOP,
  markProcessed: NOOP,
};

const ApplicantContext = createContext(DEFAULT_CTX);

export function useApplicants() {
  return useContext(ApplicantContext);
}

export function ApplicantProvider({ children }) {
  const [applicants, setApplicants] = useState([]);

  /**
   * Pull the current user's farmer list from the server.
   * Safe to call on every page mount — silently skips if endpoint isn't live yet.
   */
  const loadFarmers = async () => {
    try {
      const data = await listFarmers();
      const arr = Array.isArray(data) ? data : (data?.farmers || data?.data || []);
      setApplicants(arr.map(normalizeFarmer));
    } catch (e) {
      // GET /api/farmers may not be implemented yet on the backend.
      // Log a warning but don't wipe any applicants that are already in state.
      console.warn('[Applicants] listFarmers unavailable:', e.message);
    }
  };

  /**
   * Quick registration — POST to /api/farmers.
   * Throws on API error (caller should catch and show message).
   * @param {{ name, aadhaar, mobile }} form
   * @param {object} user — from AuthContext (needs user.id + user.working_zone)
   */
  const addApplicant = async ({ name, aadhaar, mobile }, user) => {
    if (!user?.id) throw new Error('User profile not loaded — please log out and log in again.');
    const farmerBody = {
      user_id:      user.id,
      aadhar_no:    aadhaar,
      mobile_no:    mobile,
      is_land_less: false,  // not declared yet at quick-reg stage; set during full registration
      farmer_profile_attributes: { name },
      farmer_address_attributes: {
        district_id: user.working_zone?.district_id || undefined,
        block_id:    user.working_zone?.block_id    || undefined,
      },
    };
    const result     = await createFarmer(farmerBody);
    const normalized = normalizeFarmer(result);
    // Server may not echo back all submitted fields — patch with known values
    const patched = {
      ...normalized,
      name:    normalized.name    || name,
      aadhaar: normalized.aadhaar || aadhaar,
      mobile:  normalized.mobile  || mobile,
    };
    setApplicants((prev) => [patched, ...prev]);
    return patched;
  };

  /**
   * Sync local state after a full-form PATCH (called from FullRegistrationForm
   * after it has already called updateFarmer() from client.js directly).
   */
  const updateApplicant = (id, data) => {
    setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, ...data } : a)));
  };

  // ── Status-change actions — call the API then sync local state ──

  const approveApplicant = async (id) => {
    await updateFarmerStatus(id, 'approved');
    setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'approved' } : a)));
  };

  const rejectApplicant = async (id) => {
    await updateFarmerStatus(id, 'rejected');
    setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'rejected' } : a)));
  };

  const deleteApplicant = async (id) => {
    await deleteFarmer(id);
    setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'deleted' } : a)));
  };

  const sendToBank = async (id) => {
    await updateFarmerStatus(id, 'sent_to_bank');
    setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'sent_to_bank' } : a)));
  };

  const revertToADA = async (id) => {
    await updateFarmerStatus(id, 'pending');
    setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'pending' }     : a)));
  };

  const markProcessed = async (id) => {
    await updateFarmerStatus(id, 'processed');
    setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'processed' }   : a)));
  };

  return (
    <ApplicantContext.Provider
      value={{
        applicants,
        loadFarmers,
        addApplicant,
        updateApplicant,
        approveApplicant,
        rejectApplicant,
        deleteApplicant,
        sendToBank,
        revertToADA,
        markProcessed,
      }}
    >
      {children}
    </ApplicantContext.Provider>
  );
}
