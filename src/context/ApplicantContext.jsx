// import React, { createContext, useContext, useState, useCallback } from 'react';
// import { createFarmer, listFarmers, normalizeFarmer, updateFarmerStatus, deleteFarmer, createAgent } from '../api/client';

// const NOOP = () => Promise.resolve();
// const DEFAULT_CTX = {
//   applicants: [],
//   loadFarmers: NOOP,
//   addApplicant: NOOP,
//   updateApplicant: () => { },
//   approveApplicant: NOOP,
//   rejectApplicant: NOOP,
//   deleteApplicant: NOOP,
//   sendToBank: NOOP,
//   revertToADA: NOOP,
//   markProcessed: NOOP,
// };

// const ApplicantContext = createContext(DEFAULT_CTX);

// export function useApplicants() {
//   return useContext(ApplicantContext);
// }

// export function ApplicantProvider({ children }) {
//   const [applicants, setApplicants] = useState([]);

//   /**
//    * Pull the current user's farmer list from the server.
//    * Safe to call on every page mount — silently skips if endpoint isn't live yet.
//    * Memoized to prevent unnecessary re-calls.
//    */
//   const loadFarmers = useCallback(async () => {
//     try {
//       const data = await listFarmers();
//       const arr = Array.isArray(data) ? data : (data?.farmers || data?.data || []);
//       setApplicants(arr.map(normalizeFarmer));
//     } catch (e) {
//       console.warn('[Applicants] listFarmers unavailable:', e.message);
//     }
//   }, []);

//   /**
//    * Quick registration — POST to /api/farmers.
//    * Throws on API error (caller should catch and show message).
//    * @param {{ name, aadhaar, mobile }} form
//    * @param {object} user — from AuthContext (needs user.id + user.working_zone)
//    */
//   const addApplicant = async ({ name, aadhaar, mobile }, user) => {
//     if (!user?.id) throw new Error('User profile not loaded — please log out and log in again.');
//     const farmerBody = {
//       user_id: user.id,
//       aadhar_no: aadhaar,
//       mobile_no: mobile,
//       is_land_less: false,  // not declared yet at quick-reg stage; set during full registration
//       farmer_profile_attributes: { name },
//       farmer_address_attributes: {
//         district_id: user.working_zone?.district_id || undefined,
//         block_id: user.working_zone?.block_id || undefined,
//       },
//     };
//     const result = await createFarmer(farmerBody);
//     const normalized = normalizeFarmer(result);
//     // Server may not echo back all submitted fields — patch with known values
//     const patched = {
//       ...normalized,
//       name: normalized.name || name,
//       aadhaar: normalized.aadhaar || aadhaar,
//       mobile: normalized.mobile || mobile,
//     };
//     setApplicants((prev) => [patched, ...prev]);
//     return patched;
//   };

//   /**
//    * Sync local state after a full-form PATCH (called from FullRegistrationForm
//    * after it has already called updateFarmer() from client.js directly).
//    */
//   const updateApplicant = (id, data) => {
//     setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, ...data } : a)));
//   };

//   // ── Status-change actions — call the API then sync local state ──

//   const approveApplicant = async (id) => {
//     await updateFarmerStatus(id, 'approved');
//     setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'approved' } : a)));
//   };

//   const rejectApplicant = async (id) => {
//     await updateFarmerStatus(id, 'rejected');
//     setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'rejected' } : a)));
//   };

//   const deleteApplicant = async (id) => {
//     await deleteFarmer(id);
//     setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'deleted' } : a)));
//   };

//   const sendToBank = async (id) => {
//     await updateFarmerStatus(id, 'sent_to_bank');
//     setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'sent_to_bank' } : a)));
//   };

//   const revertToADA = async (id) => {
//     await updateFarmerStatus(id, 'pending');
//     setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'pending' } : a)));
//   };

//   const markProcessed = async (id) => {
//     await updateFarmerStatus(id, 'processed');
//     setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'processed' } : a)));
//   };

//   const addAgent = async (payload) => {
//     const res = await createAgent(payload);
//     return res;
//   };

//   return (
//     <ApplicantContext.Provider
//       value={{
//         applicants,
//         loadFarmers,
//         addApplicant,
//         updateApplicant,
//         approveApplicant,
//         rejectApplicant,
//         deleteApplicant,
//         sendToBank,
//         revertToADA,
//         markProcessed,
//         addAgent,
//       }}
//     >
//       {children}
//     </ApplicantContext.Provider>
//   );
// }



// import React, { createContext, useContext, useState, useCallback } from 'react';
// import { createFarmer, listFarmers, normalizeFarmer, updateFarmerStatus, deleteFarmer, createAgent, listAgents } from '../api/client';

// const NOOP = () => Promise.resolve();
// const DEFAULT_CTX = {
//   applicants: [],
//   loadFarmers: NOOP,
//   addApplicant: NOOP,
//   updateApplicant: () => { },
//   approveApplicant: NOOP,
//   rejectApplicant: NOOP,
//   deleteApplicant: NOOP,
//   sendToBank: NOOP,
//   revertToADA: NOOP,
//   markProcessed: NOOP,
// };

// const ApplicantContext = createContext(DEFAULT_CTX);

// export function useApplicants() {
//   return useContext(ApplicantContext);
// }

// export function ApplicantProvider({ children }) {
//   const [applicants, setApplicants] = useState([]);

//   /**
//    * Pull the current user's farmer list from the server.
//    * Safe to call on every page mount — silently skips if endpoint isn't live yet.
//    * Memoized to prevent unnecessary re-calls.
//    */

//   const loadFarmers = useCallback(async () => {
//     try {
//       const data = await listFarmers();
//       const arr = Array.isArray(data) ? data : (data?.farmers || data?.data || []);
//       setApplicants(arr.map(normalizeFarmer));
//     } catch (e) {
//       console.warn('[Applicants] listFarmers unavailable:', e.message);
//     }
//   }, []);

//   // const loadFarmers = useCallback(async () => {
//   //   try {
//   //     const data = await listAgents();

//   //     const arr = Array.isArray(data) ? data : (data?.agents || data?.data || []);

//   //     // ✅ MAP AGENT → UI FORMAT (CRITICAL)
//   //     const normalized = arr.map((u) => ({
//   //       id: u.id,
//   //       name: u.name,
//   //       email: u.email,
//   //       mobile: u.mobile,
//   //       role: u.role_name,
//   //       status: "approved", // default (since API not giving status yet)
//   //     }));

//   //     setApplicants(normalized);

//   //   } catch (e) {
//   //     console.error('[Agents] listAgents error:', e.message);
//   //   }
//   // }, []);

//   /**
//    * Quick registration — POST to /api/farmers.
//    * Throws on API error (caller should catch and show message).
//    * @param {{ name, aadhaar, mobile }} form
//    * @param {object} user — from AuthContext (needs user.id + user.working_zone)
//    */
//   const addApplicant = async ({ name, aadhaar, mobile }, user) => {
//     if (!user?.id) throw new Error('User profile not loaded — please log out and log in again.');
//     const farmerBody = {
//       user_id: user.id,
//       aadhar_no: aadhaar,
//       mobile_no: mobile,
//       is_land_less: false,  // not declared yet at quick-reg stage; set during full registration
//       farmer_profile_attributes: { name },
//       farmer_address_attributes: {
//         district_id: user.working_zone?.district_id || undefined,
//         block_id: user.working_zone?.block_id || undefined,
//       },
//     };
//     const result = await createFarmer(farmerBody);
//     const normalized = normalizeFarmer(result);
//     // Server may not echo back all submitted fields — patch with known values
//     const patched = {
//       ...normalized,
//       name: normalized.name || name,
//       aadhaar: normalized.aadhaar || aadhaar,
//       mobile: normalized.mobile || mobile,
//     };
//     setApplicants((prev) => [patched, ...prev]);
//     return patched;
//   };

//   /**
//    * Sync local state after a full-form PATCH (called from FullRegistrationForm
//    * after it has already called updateFarmer() from client.js directly).
//    */
//   const updateApplicant = (id, data) => {
//     setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, ...data } : a)));
//   };

//   // ── Status-change actions — call the API then sync local state ──

//   const approveApplicant = async (id) => {
//     await updateFarmerStatus(id, 'approved');
//     setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'approved' } : a)));
//   };

//   const rejectApplicant = async (id) => {
//     await updateFarmerStatus(id, 'rejected');
//     setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'rejected' } : a)));
//   };

//   const deleteApplicant = async (id) => {
//     await deleteFarmer(id);
//     setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'deleted' } : a)));
//   };

//   const sendToBank = async (id) => {
//     await updateFarmerStatus(id, 'sent_to_bank');
//     setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'sent_to_bank' } : a)));
//   };

//   const revertToADA = async (id) => {
//     await updateFarmerStatus(id, 'pending');
//     setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'pending' } : a)));
//   };

//   const markProcessed = async (id) => {
//     await updateFarmerStatus(id, 'processed');
//     setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'processed' } : a)));
//   };

//   const addAgent = async (payload) => {
//     const res = await createAgent(payload);
//     return res;
//   };
//   return (
//     <ApplicantContext.Provider
//       value={{
//         applicants,
//         loadFarmers,
//         addApplicant,
//         updateApplicant,
//         approveApplicant,
//         rejectApplicant,
//         deleteApplicant,
//         sendToBank,
//         revertToADA,
//         markProcessed,
//         addAgent,
//       }}
//     >
//       {children}
//     </ApplicantContext.Provider>
//   );
// }


import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  createFarmer,
  listFarmers,
  normalizeFarmer,
  updateFarmerStatus,
  deleteFarmer,
  createAgent
} from '../api/client';

const ApplicantContext = createContext();

export function useApplicants() {
  return useContext(ApplicantContext);
}

// ✅ LOCAL STATUS STORAGE
function saveStatus(id, status) {
  const map = JSON.parse(sessionStorage.getItem("farmerStatusMap") || "{}");
  map[id] = status;
  sessionStorage.setItem("farmerStatusMap", JSON.stringify(map));
}

export function ApplicantProvider({ children }) {
  const [applicants, setApplicants] = useState([]);

  // ✅ LOAD FARMERS
  const loadFarmers = useCallback(async () => {
    try {
      const data = await listFarmers();
      const arr = Array.isArray(data) ? data : (data?.farmers || data?.data || []);

      const normalized = arr.map(normalizeFarmer);

      setApplicants(normalized);
    } catch (e) {
      console.error('[Applicants] listFarmers error:', e.message);
    }
  }, []);

  // ✅ ADD APPLICANT
  const addApplicant = async ({ name, aadhaar, mobile }, user) => {
    if (!user?.id) throw new Error('User not loaded');

    const farmerBody = {
      user_id: user.id,
      aadhar_no: aadhaar,
      mobile_no: mobile,
      is_land_less: false,
      farmer_profile_attributes: { name },
      farmer_address_attributes: {
        district_id: user.working_zone?.district_id,
        block_id: user.working_zone?.block_id,
      },
    };

    const result = await createFarmer(farmerBody);
    const normalized = normalizeFarmer(result);

    setApplicants(prev => [normalized, ...prev]);
  };

  // ✅ UPDATE LOCAL STATE
  const updateApplicant = (id, data) => {
    setApplicants(prev =>
      prev.map(a => (a.id === id ? { ...a, ...data } : a))
    );
  };

  // ✅ STATUS ACTION HANDLER (COMMON)
  const updateStatus = async (id, status) => {
    await updateFarmerStatus(id, status);

    saveStatus(id, status); // 🔥 Persist locally

    setApplicants(prev =>
      prev.map(a =>
        a.id === id ? { ...a, status } : a
      )
    );
  };

  const approveApplicant = (id) => updateStatus(id, 'approved');
  const rejectApplicant = (id) => updateStatus(id, 'rejected');
  const sendToBank = (id) => updateStatus(id, 'sent_to_bank');
  const revertToADA = (id) => updateStatus(id, 'pending');
  const markProcessed = (id) => updateStatus(id, 'processed');

  // ✅ FIXED DELETE
  const deleteApplicant = async (id) => {
    await deleteFarmer(id);

    // remove from UI
    setApplicants(prev => prev.filter(a => a.id !== id));

    // remove from local storage
    const map = JSON.parse(sessionStorage.getItem("farmerStatusMap") || "{}");
    delete map[id];
    sessionStorage.setItem("farmerStatusMap", JSON.stringify(map));
  };

  // ✅ CREATE AGENT
  const addAgent = async (payload) => {
    return await createAgent(payload);
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
        addAgent,
      }}
    >
      {children}
    </ApplicantContext.Provider>
  );
}