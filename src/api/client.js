// /**
//  * Central API client for all backend calls.
//  * All paths are relative - the Vite proxy forwards /api/* to http://144.76.19.201:3002/api/*
//  */

// const BASE = '/api';

// /** Read the stored Bearer token from sessionStorage */
// function getToken() {
//   try {
//     const stored = sessionStorage.getItem('portalUser');
//     return stored ? JSON.parse(stored)?.access_token : null;
//   } catch {
//     return null;
//   }
// }

// /** Extract the most useful error string from any API error response shape */
// function extractError(data, fallback = 'Request failed') {
//   if (data?.error_description) return data.error_description;
//   if (data?.message && typeof data.message === 'string') return data.message;
//   if (data?.error && typeof data.error === 'string') return data.error;
//   if (data?.errors) {
//     if (typeof data.errors === 'string') return data.errors;
//     if (Array.isArray(data.errors)) return data.errors.join(', ');
//     if (typeof data.errors === 'object') {
//       const msgs = Object.entries(data.errors)
//         .flatMap(([k, v]) => (Array.isArray(v) ? v.map((m) => `${k} ${m}`) : [`${k} ${v}`]));
//       if (msgs.length) return msgs.join('; ');
//     }
//   }
//   return fallback;
// }

// /**
//  * Authenticated GET request.
//  * @param {string} path
//  * @param {object} opts
//  */
// export async function apiGet(path, { auth = false } = {}) {
//   const headers = {};
//   if (auth) {
//     const token = getToken();
//     if (token) headers['Authorization'] = `Bearer ${token}`;
//   }
//   const res = await fetch(`${BASE}${path}`, { headers });
//   const text = await res.text();
//   let data = {};
//   try { data = JSON.parse(text); } catch {}
//   if (!res.ok) throw new Error(extractError(data) || `HTTP ${res.status}`);
//   return data;
// }

// /**
//  * Authenticated POST request.
//  */
// export async function apiPost(path, body, { auth = false } = {}) {
//   const headers = {};
//   if (auth) {
//     const token = getToken();
//     if (token) headers['Authorization'] = `Bearer ${token}`;
//   }
//   const res = await fetch(`${BASE}${path}`, { method: 'POST', headers, body });
//   const text = await res.text();
//   let data = {};
//   try { data = JSON.parse(text); } catch {}
//   if (!res.ok) throw new Error(extractError(data) || `HTTP ${res.status}`);
//   return data;
// }

// /**
//  * Authenticated PATCH with JSON body.
//  */
// export async function apiPatchJSON(path, body, { auth = false } = {}) {
//   const headers = { 'Content-Type': 'application/json' };
//   if (auth) {
//     const token = getToken();
//     if (token) headers['Authorization'] = `Bearer ${token}`;
//   }
//   const res = await fetch(`${BASE}${path}`, {
//     method: 'PATCH',
//     headers,
//     body: JSON.stringify(body),
//   });
//   const text = await res.text();
//   let data = {};
//   try { data = JSON.parse(text); } catch {}
//   if (!res.ok) throw new Error(extractError(data) || `HTTP ${res.status}`);
//   return data;
// }

// /**
//  * Authenticated POST with JSON body.
//  */
// export async function apiPostJSON(path, body, { auth = false } = {}) {
//   const headers = { 'Content-Type': 'application/json' };
//   if (auth) {
//     const token = getToken();
//     if (token) headers['Authorization'] = `Bearer ${token}`;
//   }
//   const res = await fetch(`${BASE}${path}`, {
//     method: 'POST',
//     headers,
//     body: JSON.stringify(body),
//   });
//   const text = await res.text();
//   let data = {};
//   try { data = JSON.parse(text); } catch {}
//   if (!res.ok) throw new Error(extractError(data) || `HTTP ${res.status}`);
//   return data;
// }

// /**
//  * IFSC code lookup.
//  */
// export async function lookupIFSC(ifsc) {
//   const code = ifsc.trim().toUpperCase();
//   const res = await fetch(`${BASE}/ifscs/show_ifsc?ifsc=${encodeURIComponent(code)}`);
//   if (!res.ok) throw new Error('IFSC lookup failed');
//   return res.json();
// }

// export function normalizeFarmer(f) {}
// export async function createFarmer(farmerBody) {}
// export async function updateFarmerMultipart(id, farmerBody, files = {}) {}
// export async function updateFarmer(id, farmerBody) {}
// export async function listFarmers() {}
// export async function searchFarmer(query) {}
// export async function updateFarmerStatus(id, approvalStatus) {}
// export async function deleteFarmer(id) {}
// export async function createAgent(agentData) {}
// export async function listAgents() {}

/**
 * Central API client for all backend calls.
 */

const BASE = '/api';
let memoryAccessToken = null;
let memoryRefreshToken = null;

export function setAuthTokens({ accessToken = null, refreshToken = null } = {}) {
  memoryAccessToken = accessToken;
  memoryRefreshToken = refreshToken;
}

export function clearAuthTokens() {
  memoryAccessToken = null;
  memoryRefreshToken = null;
}

export function getAccessToken() {
  return getToken();
}

function getToken() {
  if (memoryAccessToken) return memoryAccessToken;
  try {
    const stored = sessionStorage.getItem('portalUser');
    return stored ? JSON.parse(stored)?.access_token || null : null;
  } catch {
    return null;
  }
}

function getRefreshToken() {
  if (memoryRefreshToken) return memoryRefreshToken;
  try {
    const stored = sessionStorage.getItem('portalUser');
    return stored ? JSON.parse(stored)?.refresh_token || null : null;
  } catch {
    return null;
  }
}

function storeUpdatedToken(accessToken, refreshToken, tokenExpiresAt = null) {
  setAuthTokens({ accessToken, refreshToken: refreshToken ?? memoryRefreshToken });

  const stored = sessionStorage.getItem('portalUser');
  if (!stored) return;

  const user = JSON.parse(stored);
  if (accessToken) user.access_token = accessToken;
  if (refreshToken) user.refresh_token = refreshToken;
  user.token_expires_at = tokenExpiresAt;

  sessionStorage.setItem('portalUser', JSON.stringify(user));
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    console.warn('[AUTH] Refresh skipped: no refresh token in sessionStorage.');
    return null;
  }

  const payloads = [
    { refresh_token: refreshToken },
    { auth: { refresh_token: refreshToken } },
    { token: refreshToken },
    { auth: { token: refreshToken } },
  ];

  for (const payload of payloads) {
    try {
      const res = await fetch(`${BASE}/v1/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data = {};
      try { data = JSON.parse(text); } catch {}

      if (!res.ok) {
        console.warn('[AUTH] Refresh attempt failed:', res.status, payload, data);
        continue;
      }

      const newAccessToken = data?.data?.access_token || data?.access_token;
      const newRefreshToken = data?.data?.refresh_token || data?.refresh_token;
      if (!newAccessToken) {
        console.warn('[AUTH] Refresh succeeded without access token:', data);
        continue;
      }

      let tokenExpiresAt = null;
      try {
        const payload = JSON.parse(atob(newAccessToken.split('.')[1]));
        if (payload.exp) tokenExpiresAt = payload.exp * 1000;
      } catch {}

      storeUpdatedToken(newAccessToken, newRefreshToken, tokenExpiresAt);
      console.info('[AUTH] Refresh succeeded.');
      return newAccessToken;
    } catch (error) {
      console.warn('[AUTH] Refresh request error:', error);
    }
  }

  return null;
}

async function fetchWithAuthRetry(path, options = {}, auth = false) {
  const headers = { ...(options.headers || {}) };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res = await fetch(`${BASE}${path}`, { ...options, headers });

  if ((res.status === 401 || res.status === 403) && auth) {
    console.warn('[AUTH] Protected request failed, attempting refresh:', res.status, path);
    const newToken = await refreshAccessToken();

    if (newToken) {
      const retryHeaders = { ...headers, Authorization: `Bearer ${newToken}` };
      res = await fetch(`${BASE}${path}`, { ...options, headers: retryHeaders });
      console.warn('[AUTH] Retried protected request:', res.status, path);
    } else {
      console.warn('[AUTH] Refresh failed. Clearing session and redirecting to home.');
      clearAuthTokens();
      sessionStorage.removeItem('portalUser');
      window.location.href = '/';
    }
  }

  return res;
}

function extractFilenameFromDisposition(disposition, fallback = 'download.csv') {
  if (!disposition) return fallback;

  const utfMatch = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utfMatch?.[1]) {
    return decodeURIComponent(utfMatch[1]);
  }

  const plainMatch = disposition.match(/filename="?([^"]+)"?/i);
  if (plainMatch?.[1]) {
    return plainMatch[1];
  }

  return fallback;
}

function extractError(data, fallback = 'Request failed') {
  if (data?.error_description) return data.error_description;
  if (data?.message) return data.message;
  if (data?.error) return data.error;

  if (data?.errors) {
    if (typeof data.errors === 'string') return data.errors;
    if (Array.isArray(data.errors)) return data.errors.join(', ');
    if (typeof data.errors === 'object') {
      return Object.entries(data.errors)
        .flatMap(([k, v]) => (Array.isArray(v) ? v.map((m) => `${k} ${m}`) : [`${k} ${v}`]))
        .join('; ');
    }
  }
  return fallback;
}

export async function apiGet(path, { auth = false } = {}) {
  const res = await fetchWithAuthRetry(path, {}, auth);

  const text = await res.text();
  let data = {};
  try { data = JSON.parse(text); } catch {}

  if (!res.ok) throw new Error(extractError(data) || `HTTP ${res.status}`);
  return data;
}

export async function apiPost(path, body, { auth = false } = {}) {
  const res = await fetchWithAuthRetry(path, {
    method: 'POST',
    body,
  }, auth);

  const text = await res.text();
  let data = {};
  try { data = JSON.parse(text); } catch {}

  if (!res.ok) throw new Error(extractError(data));
  return data;
}

export async function apiPostJSON(path, body, { auth = false } = {}) {
  const res = await fetchWithAuthRetry(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }, auth);

  const text = await res.text();
  let data = {};
  try { data = JSON.parse(text); } catch {}

  if (!res.ok) throw new Error(extractError(data));
  return data;
}

export async function apiPatchJSON(path, body, { auth = false } = {}) {
  const res = await fetchWithAuthRetry(path, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }, auth);

  const text = await res.text();
  let data = {};
  try { data = JSON.parse(text); } catch {}

  if (!res.ok) throw new Error(extractError(data));
  return data;
}

export async function apiPatch(path, { auth = false } = {}) {
  const res = await fetchWithAuthRetry(path, {
    method: 'PATCH',
  }, auth);

  const text = await res.text();
  let data = {};
  try { data = JSON.parse(text); } catch {}

  if (!res.ok) throw new Error(extractError(data));
  return data;
}

function extractCollection(data, keys = []) {
  if (Array.isArray(data)) return data;

  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }

  if (Array.isArray(data?.data)) return data.data;

  for (const key of keys) {
    if (Array.isArray(data?.data?.[key])) return data.data[key];
  }

  return [];
}

function unwrapFarmerRecord(record) {
  if (!record || typeof record !== 'object') return record;

  return (
    record.farmer ||
    record.farmer_detail ||
    record.farmer_details ||
    record.application ||
    record.applicant ||
    record
  );
}

function getStatusMap() {
  try {
    return JSON.parse(sessionStorage.getItem('farmerStatusMap') || '{}');
  } catch {
    return {};
  }
}

function getLocalStatus(id) {
  return getStatusMap()[id] || null;
}

function getDeletedFarmersMap() {
  try {
    return JSON.parse(sessionStorage.getItem('deletedFarmersMap') || '{}');
  } catch {
    return {};
  }
}

export function getDeletedFarmers() {
  return Object.values(getDeletedFarmersMap());
}

function serverStatusToLocal(s) {
  const normalized = String(s ?? '').toLowerCase();

  const map = {
    '': 'pending',
    quick_registration: 'pending',
    pending: 'pending',
    submitted: 'pending',
    approved: 'approved',
    rejected: 'rejected',
    reverted: 'reverted',
    deleted: 'deleted',
    sent_to_bank: 'sent_to_bank',
    processed: 'processed',
  };

  if (normalized === '1' || normalized === 'true') return 'approved';
  if (normalized === '0' || normalized === 'false') return 'pending';

  return map[normalized] || null;
}

export function normalizeFarmer(f) {
  const source = unwrapFarmerRecord(f) || {};
  const apiStatus = serverStatusToLocal(
    source.approval_status ?? source.status ?? source.state
  );

  const localStatus = getLocalStatus(source.id);
  const status = localStatus || apiStatus || 'pending';

  return {
    id: source.id,
    ackId: source.acknowledgement_no || source.acknowledgement_id || source.ack_id || '',
    acknowledgement_id: source.acknowledgement_no || source.acknowledgement_id || source.ack_id || '',
    name: source.farmer_profile?.name || source.name || '',
    aadhaar: source.aadhar_no || source.aadhaar_no || '',
    mobile: source.mobile_no || source.mobile || '',
    status,
    gram_panchayat:
      (source.farmer_address?.gram_panchayat_id ?? source.gram_panchayat_id) != null
        ? String(source.farmer_address?.gram_panchayat_id ?? source.gram_panchayat_id)
        : '',
    bank_name: source.farmer_bank?.bank_name || source.bank_name || '',
    branch_name: source.farmer_bank?.branch_name || source.branch_name || '',
    account_number: source.farmer_bank?.account_number || source.account_number || '',
    ifsc: source.farmer_bank?.ifsc_code || source.ifsc_code || '',
    present_in_kbn: source.present_in_kbn ?? source.present_in_kb_n ?? false,
    present_in_kb_n: source.present_in_kb_n ?? source.present_in_kbn ?? false,
    applied_yuvasathi: source.applied_yuvasathi ?? source.applied_for_yuvasathi ?? false,
    applied_for_yuvasathi: source.applied_for_yuvasathi ?? source.applied_yuvasathi ?? false,
    remarks: source.remarks || '',
    revert_remarks: source.revert_remarks || '',
    is_rejected: source.is_rejected ?? status === 'rejected',
    is_deleted: source.is_deleted ?? status === 'deleted',
    is_reverted: source.is_reverted ?? status === 'reverted',
    farmerImageUrl: source.farmer_image_url || source.farmer_profile?.farmer_image_url || '',
    fullForm: {
      fathersName: source.farmer_profile?.father_name || '',
      gender: source.farmer_profile?.gender || '',
      dob: source.farmer_profile?.date_of_birth || '',
      district: (source.farmer_address?.district_id ?? source.district_id ?? '')?.toString?.() || '',
      block: (source.farmer_address?.block_id ?? source.block_id ?? '')?.toString?.() || '',
      gramPanchayat: (source.farmer_address?.gram_panchayat_id ?? source.gram_panchayat_id ?? '')?.toString?.() || '',
      village: (source.farmer_address?.village_id ?? source.village_id ?? '')?.toString?.() || '',
      bankName: source.farmer_bank?.bank_name || '',
      branchName: source.farmer_bank?.branch_name || '',
      accountNumber: source.farmer_bank?.account_number || '',
      ifscCode: source.farmer_bank?.ifsc_code || '',
    },
  };
}

export async function listFarmers() {
  const getItems = (payload) => extractCollection(payload, ['farmer_lists', 'farmers', 'items', 'records']);
  const getMeta = (payload) => payload?.meta || payload?.data?.meta || {};

  const firstPage = await apiGet('/v1/farmers?page=1', { auth: true });
  const firstItems = getItems(firstPage);
  const firstMeta = getMeta(firstPage);
  const totalPages = Math.max(1, Number(firstMeta?.total_pages) || 1);

  if (totalPages === 1) {
    return firstItems;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      apiGet(`/v1/farmers?page=${index + 2}`, { auth: true })
    )
  );

  return [
    ...firstItems,
    ...remainingPages.flatMap((pageData) => getItems(pageData)),
  ];
}

export async function listDistricts() {
  const data = await apiGet('/v1/districts', { auth: true });
  return extractCollection(data, ['districts', 'items', 'records', 'data']);
}

export async function listBlocks(districtId) {
  if (!districtId) return [];
  const data = await apiGet(`/v1/blocks?district_id=${encodeURIComponent(districtId)}`, { auth: true });
  return extractCollection(data, ['blocks', 'items', 'records', 'data']);
}

export async function listGramPanchayats(blockId) {
  if (!blockId) return [];
  const data = await apiGet(`/v1/gram_panchayats?block_id=${encodeURIComponent(blockId)}`, { auth: true });
  return extractCollection(data, ['gram_panchayats', 'items', 'records', 'data']);
}

export async function listADAPendings(page = 1) {
  const data = await apiGet(`/v1/ada_pendings?page=${page}`, { auth: true });
  const items = extractCollection(data, [
    'ada_pendings',
    'pending_lists',
    'pending_list',
    'farmers',
    'farmer_lists',
    'items',
    'records',
  ]);

  return {
    items,
    meta: data?.meta || data?.data?.meta || {},
  };
}

export async function listADAApproved(page = 1) {
  const data = await apiGet(`/v1/ada_pendings/approved?page=${page}`, { auth: true });
  const items = extractCollection(data, [
    'ada_pendings',
    'approved_lists',
    'approved_list',
    'farmers',
    'farmer_lists',
    'items',
    'records',
  ]);

  return {
    items,
    meta: data?.meta || data?.data?.meta || {},
  };
}

export async function listADARejected(page = 1) {
  const data = await apiGet(`/v1/ada_pendings/rejected?page=${page}`, { auth: true });
  const items = extractCollection(data, [
    'ada_pendings',
    'rejected_lists',
    'rejected_list',
    'farmers',
    'farmer_lists',
    'items',
    'records',
  ]);

  return {
    items,
    meta: data?.meta || data?.data?.meta || {},
  };
}

export async function listADAReverted(page = 1) {
  const data = await apiGet(`/v1/ada_pendings/reverted?page=${page}`, { auth: true });
  const items = extractCollection(data, [
    'ada_pendings',
    'reverted_lists',
    'reverted_list',
    'farmers',
    'farmer_lists',
    'items',
    'records',
  ]);

  return {
    items,
    meta: data?.meta || data?.data?.meta || {},
  };
}

export async function listADASentToBank(page = 1) {
  const data = await apiGet(`/v1/ada_pendings/send_to_bank_list?page=${page}`, { auth: true });
  const items = extractCollection(data, [
    'ada_pendings',
    'send_to_bank_lists',
    'send_to_bank_list',
    'farmers',
    'farmer_lists',
    'items',
    'records',
  ]);

  return {
    items,
    meta: data?.meta || data?.data?.meta || {},
  };
}

export async function downloadADABulkApproveCsvTemplate() {
  const res = await fetchWithAuthRetry('/v1/ada_pendings/download_block_approve_csv', {}, true);

  if (!res.ok) {
    const text = await res.text();
    let json = {};
    try { json = JSON.parse(text); } catch {}
    throw new Error(extractError(json, `HTTP ${res.status}`));
  }

  const blob = await res.blob();
  const filename = extractFilenameFromDisposition(
    res.headers.get('content-disposition'),
    'bulk_approve_template.csv'
  );

  return { blob, filename };
}

export async function snoBulkApprove() {
  const res = await fetchWithAuthRetry('/v1/ada_pendings/sno_bulk_approve', {
    method: 'POST',
  }, true);

  const text = await res.text();
  let data = {};
  try { data = JSON.parse(text); } catch {}

  if (!res.ok) throw new Error(extractError(data, `HTTP ${res.status}`));
  return data;
}

export async function generateADAPaymentFile() {
  const res = await fetchWithAuthRetry('/v1/ada_pendings/generate_payment_file', {
    method: 'POST',
  }, true);

  if (!res.ok) {
    const text = await res.text();
    let json = {};
    try { json = JSON.parse(text); } catch {}
    throw new Error(extractError(json, `HTTP ${res.status}`));
  }

  const disposition = res.headers.get('content-disposition');
  const contentType = res.headers.get('content-type') || '';

  if (disposition || !contentType.includes('application/json')) {
    const blob = await res.blob();
    const filename = extractFilenameFromDisposition(disposition, 'payment_file.csv');
    return { blob, filename };
  }

  return res.json();
}

export async function getFarmer(id) {
  const data = await apiGet(`/v1/farmers/${id}`, { auth: true });
  return data?.data || data?.farmer || data;
}

export async function createFarmer(body) {
  const data = await apiPostJSON('/v1/farmers', { farmer: body }, { auth: true });
  return data?.data || data?.farmer || data;
}

export async function updateFarmerMultipart(id, farmerBody, files = {}) {
  const token = getToken();
  const headers = {};

  if (token) headers.Authorization = `Bearer ${token}`;

  const fd = new FormData();

  function appendNested(obj, prefix) {
    Object.entries(obj).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      const formKey = `${prefix}[${key}]`;

      if (typeof value === 'object' && !(value instanceof File)) {
        appendNested(value, formKey);
      } else {
        fd.append(formKey, value);
      }
    });
  }

  appendNested(farmerBody, 'farmer');

  const fileFields = {
    aadhaar_card_image: 'farmer[aadhaar_image]',
    voter_card_image: 'farmer[voter_image]',
    farmer_image: 'farmer[farmer_profile_attributes][farmer_image]',
    bank_image: 'farmer[farmer_bank_attributes][bank_image]',
    self_declaration: 'farmer[self_declaration]',
  };

  Object.entries(fileFields).forEach(([key, formKey]) => {
    if (files[key] instanceof File) {
      fd.append(formKey, files[key]);
    }
  });

  const res = await fetch(`${BASE}/v1/farmers/${id}`, {
    method: 'PATCH',
    headers,
    body: fd,
  });

  const text = await res.text();
  let data = {};
  try { data = JSON.parse(text); } catch {}

  if (!res.ok) throw new Error(extractError(data) || `HTTP ${res.status}`);
  return data?.data || data?.farmer || data;
}

export async function updateFarmerStatus(id, status) {
  return apiPatchJSON(`/v1/farmers/${id}`, {
    farmer: { approval_status: status },
  }, { auth: true });
}

export async function approveADAPending(id) {
  return apiPatch(`/v1/ada_pendings/${id}/approve`, { auth: true });
}

export async function rejectADAPending(id) {
  return apiPatch(`/v1/ada_pendings/${id}/reject`, { auth: true });
}

export async function revertADAPending(id) {
  return apiPatch(`/v1/ada_pendings/${id}/revert`, { auth: true });
}

export async function deleteFarmer(id) {
  const token = getToken();

  const res = await fetch(`${BASE}/farmers/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Delete failed');
}

export async function lookupIFSC(ifsc) {
  return apiGet(`/ifscs/show_ifsc?ifsc=${ifsc}`);
}

export async function createAgent(data) {
  const token = getToken();

  const fd = new FormData();
  fd.append('user[email]', data.email);
  fd.append('user[password]', data.password);
  fd.append('user[mobile]', data.mobile);
  fd.append('user[role_id]', data.role_id);
  fd.append('user[profile_attributes][first_name]', data.firstName);
  fd.append('user[profile_attributes][last_name]', data.lastName);
  fd.append('user[profile_attributes][gender]', data.gender);
  fd.append('user[working_zones_attributes][0][district_id]', data.district_id);
  fd.append('user[working_zones_attributes][0][block_id]', data.block_id);

  const res = await fetch(`${BASE}/agents`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });

  const text = await res.text();
  let json = {};
  try { json = JSON.parse(text); } catch {}

  if (!res.ok) throw new Error(extractError(json));
  return json;
}

export function normalizeMember(member) {
  const source = member?.member || member?.user || member || {};
  const profile = source.profile || source.profile_attributes || {};
  const roleSource = source.role || source.user_role || source.member_role || {};
  const rawStatus =
    source.status ??
    source.state ??
    source.approval_status ??
    source.active_status ??
    source.member_status ??
    source.current_status ??
    source.active ??
    source.is_active ??
    source.enabled ??
    source.is_enabled ??
    source.toggle_active ??
    source.user?.status ??
    source.user?.state ??
    source.user?.active ??
    source.user?.is_active ??
    source.user?.enabled ??
    source.user?.is_enabled;

  const normalizedStatus = String(rawStatus ?? '').toLowerCase();
  const active =
    rawStatus === true ||
    rawStatus === 1 ||
    rawStatus === '1' ||
    normalizedStatus === 'true' ||
    normalizedStatus === 'active' ||
    normalizedStatus === 'approved' ||
    normalizedStatus === 'enabled' ||
    normalizedStatus === 'yes';

  return {
    id: source.id || source.member_id || source.user_id,
    name:
      source.name ||
      [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim() ||
      [source.first_name, source.last_name].filter(Boolean).join(' ').trim() ||
      source.email ||
      '',
    email: source.email || '',
    mobile: source.mobile || source.mobile_no || '',
    role:
      source.role_name ||
      roleSource.name ||
      roleSource.role_name ||
      (typeof source.role === 'string' ? source.role : '') ||
      '',
    status: active ? 'active' : 'inactive',
    active,
  };
}

export async function listMembers() {
  const data = await apiGet('/v1/members', { auth: true });
  return extractCollection(data, ['members', 'member_lists', 'items', 'records']);
}

export async function toggleMemberActive(id) {
  const data = await apiPatchJSON(`/v1/members/${id}/toggle_active`, {}, { auth: true });
  return data?.data || data?.member || data;
}

export async function fetchMemberSubRoles() {
  const data = await apiGet('/v1/members/sub_roles', { auth: true });
  const payload = data?.data || data || {};
  return {
    roles: Array.isArray(payload.roles) ? payload.roles : [],
    districts: Array.isArray(payload.districts) ? payload.districts : [],
    blocks: Array.isArray(payload.blocks) ? payload.blocks : [],
    gram_panchayats: Array.isArray(payload.gram_panchayats) ? payload.gram_panchayats : [],
  };
}

export async function listAgents() {
  return apiGet('/agents', { auth: true });
}
