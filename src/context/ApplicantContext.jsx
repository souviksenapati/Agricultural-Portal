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
  const [pendingMeta, setPendingMeta] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    perPage: 20,
  });
  const [approvedMeta, setApprovedMeta] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    perPage: 20,
  });
  const [rejectedMeta, setRejectedMeta] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    perPage: 20,
  });
  const [revertedMeta, setRevertedMeta] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    perPage: 20,
  });

  const applyApplicants = useCallback((normalized) => {
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
  }, []);

  const loadFarmers = useCallback(async () => {
    setLoadingFarmers(true);
    setFarmersError('');

    try {
      const arr = await listFarmers();
      const normalized = arr.map(normalizeFarmer);
      applyApplicants(normalized);
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
  }, [applyApplicants]);

  const loadADAPendings = useCallback(async (page = 1) => {
    setLoadingFarmers(true);
    setFarmersError('');

    try {
      const { items, meta } = await listADAPendings(page);
      const normalized = items.map((item) => ({
        ...normalizeFarmer(item),
        status: 'pending',
      }));
      applyApplicants(normalized);
      setPendingMeta({
        currentPage: meta?.current_page || page,
        totalPages: meta?.total_pages || 1,
        totalCount: meta?.total_count || normalized.length,
        perPage: meta?.per_page || 20,
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
      setPendingMeta({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        perPage: 20,
      });
    } finally {
      setLoadingFarmers(false);
    }
  }, [applyApplicants]);

  const loadADAApproved = useCallback(async (page = 1) => {
    setLoadingFarmers(true);
    setFarmersError('');

    try {
      const { items, meta } = await listADAApproved(page);
      const normalized = items.map((item) => ({
        ...normalizeFarmer(item),
        status: 'approved',
      }));
      applyApplicants(normalized);
      setApprovedMeta({
        currentPage: meta?.current_page || page,
        totalPages: meta?.total_pages || 1,
        totalCount: meta?.total_count || normalized.length,
        perPage: meta?.per_page || 20,
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
      setApprovedMeta({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        perPage: 20,
      });
    } finally {
      setLoadingFarmers(false);
    }
  }, [applyApplicants]);

  const loadADARejected = useCallback(async (page = 1) => {
    setLoadingFarmers(true);
    setFarmersError('');

    try {
      const { items, meta } = await listADARejected(page);
      const normalized = items.map((item) => ({
        ...normalizeFarmer(item),
        status: 'rejected',
        is_rejected: true,
      }));
      applyApplicants(normalized);
      setRejectedMeta({
        currentPage: meta?.current_page || page,
        totalPages: meta?.total_pages || 1,
        totalCount: meta?.total_count || normalized.length,
        perPage: meta?.per_page || 20,
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
      setRejectedMeta({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        perPage: 20,
      });
    } finally {
      setLoadingFarmers(false);
    }
  }, [applyApplicants]);

  const loadADAReverted = useCallback(async (page = 1) => {
    setLoadingFarmers(true);
    setFarmersError('');

    try {
      const { items, meta } = await listADAReverted(page);
      const normalized = items.map((item) => ({
        ...normalizeFarmer(item),
        status: 'reverted',
        is_reverted: true,
      }));
      applyApplicants(normalized);
      setRevertedMeta({
        currentPage: meta?.current_page || page,
        totalPages: meta?.total_pages || 1,
        totalCount: meta?.total_count || normalized.length,
        perPage: meta?.per_page || 20,
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
      setRevertedMeta({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        perPage: 20,
      });
    } finally {
      setLoadingFarmers(false);
    }
  }, [applyApplicants]);

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
        pendingMeta,
        approvedMeta,
        rejectedMeta,
        revertedMeta,
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
