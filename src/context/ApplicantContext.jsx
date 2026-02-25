import React, { createContext, useContext, useState } from 'react';
import { INITIAL_APPLICANTS, generateAckId } from '../data/mockData';

const ApplicantContext = createContext(null);

export function useApplicants() {
  return useContext(ApplicantContext);
}

export function ApplicantProvider({ children }) {
  const [applicants, setApplicants] = useState(() => {
    try {
      const stored = localStorage.getItem('km_applicants');
      return stored ? JSON.parse(stored) : INITIAL_APPLICANTS;
    } catch {
      return INITIAL_APPLICANTS;
    }
  });

  const persist = (list) => {
    setApplicants(list);
    localStorage.setItem('km_applicants', JSON.stringify(list));
  };

  // Gramdoot: add new applicant
  const addApplicant = ({ name, aadhaar, mobile }) => {
    const newEntry = {
      id: Date.now(),
      ackId: generateAckId(),
      name,
      aadhaar,
      mobile,
      status: 'pending',
    };
    persist([newEntry, ...applicants]);
    return newEntry;
  };

  // Gramdoot: update own applicant (only pending/rejected)
  const updateApplicant = (id, data) => {
    persist(applicants.map((a) => (a.id === id ? { ...a, ...data } : a)));
  };

  // ADA: approve
  const approveApplicant = (id) => {
    persist(applicants.map((a) => (a.id === id ? { ...a, status: 'approved' } : a)));
  };

  // ADA: reject (still editable, not deleted)
  const rejectApplicant = (id) => {
    persist(applicants.map((a) => (a.id === id ? { ...a, status: 'rejected' } : a)));
  };

  // ADA: delete (permanent end)
  const deleteApplicant = (id) => {
    persist(applicants.map((a) => (a.id === id ? { ...a, status: 'deleted' } : a)));
  };

  // SNO: send to bank
  const sendToBank = (id) => {
    persist(applicants.map((a) => (a.id === id ? { ...a, status: 'sent_to_bank' } : a)));
  };

  // SNO: revert to ADA
  const revertToADA = (id) => {
    persist(applicants.map((a) => (a.id === id ? { ...a, status: 'pending' } : a)));
  };

  // Bank: mark as processed (DBT done)
  const markProcessed = (id) => {
    persist(applicants.map((a) => (a.id === id ? { ...a, status: 'processed' } : a)));
  };

  return (
    <ApplicantContext.Provider
      value={{
        applicants,
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
