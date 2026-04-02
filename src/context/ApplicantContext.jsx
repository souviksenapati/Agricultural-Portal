import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  createFarmer,
  listFarmers,
  listADAPendings,
  listADAApproved,
  listADARejected,
  listADAReverted,
  normalizeFarmer,
  approveADAPending,
  rejectADAPending,
  revertADAPending,
  updateFarmerStatus,
  deleteFarmer,
  createAgent,
  getDeletedFarmers,
} from '../api/client';

const ApplicantContext = createContext();

export function useApplicants() {
  return useContext(ApplicantContext);
}

function saveStatus(id, status) {
  const map = JSON.parse(sessionStorage.getItem('farmerStatusMap') || '{}');
  map[id] = status;
  sessionStorage.setItem('farmerStatusMap', JSON.stringify(map));
}

function saveDeletedApplicant(applicant) {
  if (!applicant?.id) return;
  const map = JSON.parse(sessionStorage.getItem('deletedFarmersMap') || '{}');
  map[applicant.id] = {
    ...applicant,
    status: 'deleted',
    is_deleted: true,
  };
  sessionStorage.setItem('deletedFarmersMap', JSON.stringify(map));
}

export function ApplicantProvider({ children }) {
  const [applicants, setApplicants] = useState([]);
  const [loadingFarmers, setLoadingFarmers] = useState(false);
  const [farmersError, setFarmersError] = useState('');
  const [farmersMeta, setFarmersMeta] = useState({
    serverCount: 0,
    mergedCount: 0,
    loadedAt: null,
  });

  const loadFarmers = useCallback(async () => {
    setLoadingFarmers(true);
    setFarmersError('');

    try {
      const arr = await listFarmers();
      const normalized = arr.map(normalizeFarmer);
      const deletedApplicants = getDeletedFarmers();
      const existingIds = new Set(normalized.map((app) => app.id));
      const mergedApplicants = [
        ...normalized,
        ...deletedApplicants.filter((app) => !existingIds.has(app.id)),
      ];

      setApplicants(mergedApplicants);
      setFarmersMeta({
        serverCount: normalized.length,
        mergedCount: mergedApplicants.length,
        loadedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error('[Applicants] listFarmers error:', e.message);
      setApplicants([]);
      setFarmersError(e.message || 'Failed to load farmers');
      setFarmersMeta({
        serverCount: 0,
        mergedCount: 0,
        loadedAt: null,
      });
    } finally {
      setLoadingFarmers(false);
    }
  }, []);

  const loadADAPendings = useCallback(async () => {
    setLoadingFarmers(true);
    setFarmersError('');

    try {
      const arr = await listADAPendings();
      const normalized = arr.map(normalizeFarmer);
      const deletedApplicants = getDeletedFarmers();
      const existingIds = new Set(normalized.map((app) => app.id));
      const mergedApplicants = [
        ...normalized,
        ...deletedApplicants.filter((app) => !existingIds.has(app.id)),
      ];

      setApplicants(mergedApplicants);
      setFarmersMeta({
        serverCount: normalized.length,
        mergedCount: mergedApplicants.length,
        loadedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error('[Applicants] listADAPendings error:', e.message);
      setApplicants([]);
      setFarmersError(e.message || 'Failed to load ADA pending list');
      setFarmersMeta({
        serverCount: 0,
        mergedCount: 0,
        loadedAt: null,
      });
    } finally {
      setLoadingFarmers(false);
    }
  }, []);

  const loadADAApproved = useCallback(async () => {
    setLoadingFarmers(true);
    setFarmersError('');

    try {
      const arr = await listADAApproved();
      const normalized = arr.map(normalizeFarmer);
      const deletedApplicants = getDeletedFarmers();
      const existingIds = new Set(normalized.map((app) => app.id));
      const mergedApplicants = [
        ...normalized,
        ...deletedApplicants.filter((app) => !existingIds.has(app.id)),
      ];

      setApplicants(mergedApplicants);
      setFarmersMeta({
        serverCount: normalized.length,
        mergedCount: mergedApplicants.length,
        loadedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error('[Applicants] listADAApproved error:', e.message);
      setApplicants([]);
      setFarmersError(e.message || 'Failed to load ADA approved list');
      setFarmersMeta({
        serverCount: 0,
        mergedCount: 0,
        loadedAt: null,
      });
    } finally {
      setLoadingFarmers(false);
    }
  }, []);

  const loadADARejected = useCallback(async () => {
    setLoadingFarmers(true);
    setFarmersError('');

    try {
      const arr = await listADARejected();
      const normalized = arr.map(normalizeFarmer);
      const deletedApplicants = getDeletedFarmers();
      const existingIds = new Set(normalized.map((app) => app.id));
      const mergedApplicants = [
        ...normalized,
        ...deletedApplicants.filter((app) => !existingIds.has(app.id)),
      ];

      setApplicants(mergedApplicants);
      setFarmersMeta({
        serverCount: normalized.length,
        mergedCount: mergedApplicants.length,
        loadedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error('[Applicants] listADARejected error:', e.message);
      setApplicants([]);
      setFarmersError(e.message || 'Failed to load ADA rejected list');
      setFarmersMeta({
        serverCount: 0,
        mergedCount: 0,
        loadedAt: null,
      });
    } finally {
      setLoadingFarmers(false);
    }
  }, []);

  const loadADAReverted = useCallback(async () => {
    setLoadingFarmers(true);
    setFarmersError('');

    try {
      const arr = await listADAReverted();
      const normalized = arr.map(normalizeFarmer);
      const deletedApplicants = getDeletedFarmers();
      const existingIds = new Set(normalized.map((app) => app.id));
      const mergedApplicants = [
        ...normalized,
        ...deletedApplicants.filter((app) => !existingIds.has(app.id)),
      ];

      setApplicants(mergedApplicants);
      setFarmersMeta({
        serverCount: normalized.length,
        mergedCount: mergedApplicants.length,
        loadedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error('[Applicants] listADAReverted error:', e.message);
      setApplicants([]);
      setFarmersError(e.message || 'Failed to load ADA reverted list');
      setFarmersMeta({
        serverCount: 0,
        mergedCount: 0,
        loadedAt: null,
      });
    } finally {
      setLoadingFarmers(false);
    }
  }, []);

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

    setApplicants((prev) => [normalized, ...prev]);
    return normalized;
  };

  const updateApplicant = (id, data) => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...data } : a))
    );
  };

  const updateStatus = async (id, status, remoteStatus = status) => {
    await updateFarmerStatus(id, remoteStatus);
    saveStatus(id, status);

    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const approveApplicant = async (id) => {
    await approveADAPending(id);
    saveStatus(id, 'approved');

    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'approved' } : a))
    );
  };
  const rejectApplicant = async (id) => {
    await rejectADAPending(id);
    saveStatus(id, 'rejected');

    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'rejected', is_rejected: true } : a))
    );
  };
  const sendToBank = (id) => updateStatus(id, 'sent_to_bank');
  const revertToADA = async (id) => {
    await revertADAPending(id);
    saveStatus(id, 'reverted');

    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'reverted', is_reverted: true } : a))
    );
  };
  const markProcessed = (id) => updateStatus(id, 'processed');

  const deleteApplicant = async (id) => {
    const deletedApplicant = applicants.find((a) => a.id === id);

    await deleteFarmer(id);

    saveStatus(id, 'deleted');
    saveDeletedApplicant(deletedApplicant);

    setApplicants((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: 'deleted', is_deleted: true } : a
      )
    );
  };

  const addAgent = async (payload) => createAgent(payload);

  return (
    <ApplicantContext.Provider
      value={{
        applicants,
        loadingFarmers,
        farmersError,
        farmersMeta,
        loadFarmers,
        loadADAPendings,
        loadADAApproved,
        loadADARejected,
        loadADAReverted,
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
