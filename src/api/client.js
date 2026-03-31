// /**
//  * Central API client for all backend calls.
//  * All paths are relative — the Vite proxy forwards /api/* to http://144.76.19.201:3002/api/*
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
//   // Rails validation:  { message: '...' }  or  { errors: { field: ['msg'] } }
//   // OAuth errors:      { error_description: '...' }  or  { error: '...' }
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
//  * @param {string} path  - e.g. '/agent_profiles'
//  * @param {object} opts  - { auth: bool }
//  */
// export async function apiGet(path, { auth = false } = {}) {
//   const headers = {};
//   if (auth) {
//     const token = getToken();
//     if (token) headers['Authorization'] = `Bearer ${token}`;
//   }
//   const res = await fetch(`${BASE}${path}`, { headers });
//   // Safely parse — server may return HTML on error routes
//   const text = await res.text();
//   let data = {};
//   try { data = JSON.parse(text); } catch { /* non-JSON body */ }
//   if (!res.ok) throw new Error(extractError(data) || `HTTP ${res.status}`);
//   return data;
// }

// /**
//  * Authenticated POST request.
//  * Pass a FormData or JSON body.
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
//   try { data = JSON.parse(text); } catch { /* non-JSON body */ }
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
//   try { data = JSON.parse(text); } catch { /* non-JSON body */ }
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
//   try { data = JSON.parse(text); } catch { /* non-JSON body */ }
//   if (!res.ok) throw new Error(extractError(data) || `HTTP ${res.status}`);
//   return data;
// }

// /**
//  * IFSC code lookup.
//  * GET /api/ifscs/show_ifsc?ifsc=XXXXX
//  * Returns { bank_name, branch_name }
//  */
// export async function lookupIFSC(ifsc) {
//   const code = ifsc.trim().toUpperCase();
//   const res = await fetch(`${BASE}/ifscs/show_ifsc?ifsc=${encodeURIComponent(code)}`);
//   if (!res.ok) throw new Error('IFSC lookup failed');
//   return res.json();
// }

// // ─── Farmer / Registration API ───────────────────────────────────────────────

// /** Map server approval_status → internal status key used by the app */
// function serverStatusToLocal(s) {
//   const normalized = String(s ?? '').trim().toLowerCase();
//   const map = {
//     '': 'pending',
//     quick_registration: 'pending',
//     pending: 'pending',
//     submitted: 'pending',
//     approved: 'approved',
//     rejected: 'rejected',
//     sent_to_bank: 'sent_to_bank',
//     processed: 'processed',
//   };
//   if (normalized === '1' || normalized === 'true') return 'approved';
//   if (normalized === '0' || normalized === 'false') return 'pending';
//   return map[normalized] ?? 'pending';
// }

// /**
//  * Normalize a server farmer object → local applicant shape.
//  * Handles two response shapes:
//  *  - Flat  (GET /api/farmer_lists):  name, farmer_image_url, district_id… at top level
//  *  - Nested (POST/PATCH /api/farmers): farmer_profile, farmer_address, farmer_bank objects
//  */

// export function normalizeFarmer(f) {
//   const approvalStatusRaw = f.approval_status ?? f.status ?? f.status_name ?? f.state ?? null;
//   const status = serverStatusToLocal(approvalStatusRaw);

//   return {
//     id: f.id,
//     ackId: f.acknowledgement_no || '',
//     // flat (farmer_lists) keeps name at root; nested responses nest it in farmer_profile
//     name: f.farmer_profile?.name || f.name || '',
//     aadhaar: f.aadhar_no || '',
//     mobile: f.mobile_no || '',
//     status,
//     // raw status for debugging and accurate mapping
//     _rawApprovalStatus: approvalStatusRaw,
//     _rawStatus: f.status,
//     _rawApprovalStatusField: f.approval_status,
//     // Profile photo — flat list has farmer_image_url at root; nested has it inside farmer_profile
//     farmerImageUrl: f.farmer_image_url || f.farmer_profile?.farmer_image_url || '',
//     fullForm: {
//       // Use nested objects if they exist, otherwise fall back to top-level fields
//       voterCard: f.voter_card_no || '',
//       aadhaarImageUrl: f.aadhaar_image_url || f.aadhaar_card_image_url || '',
//       voterCardImageUrl: f.voter_image_url || f.voter_card_image_url || '',
//       selfDeclarationUrl: f.self_declaration_url || '',
//       applicantImageUrl: f.farmer_profile?.farmer_image_url || f.farmer_image_url || '',
//       fathersName: f.farmer_profile?.father_name || f.father_name || '',
//       relation: f.farmer_profile?.relationship || f.relationship || '',
//       gender: f.farmer_profile?.gender || f.gender || '',
//       dob: f.farmer_profile?.date_of_birth || f.date_of_birth || '',
//       age: (f.farmer_profile?.age ?? f.age) != null ? String(f.farmer_profile?.age ?? f.age) : '',
//       caste: f.farmer_profile?.caste || f.caste || '',
//       nomineeName: f.farmer_profile?.nominee_name || '',
//       nomineeRelation: f.farmer_profile?.relation_with_applicant || '',
//       nomineeFatherName: f.farmer_profile?.nominee_father_husband_name || '',
//       guardianName: f.farmer_profile?.name_of_gurdian || '',
//       nomineeDob: f.farmer_profile?.nominee_date_of_birth || '',
//       nomineeAge: f.farmer_profile?.nominee_age != null ? String(f.farmer_profile.nominee_age) : '',
//       district: (f.farmer_address?.district_id ?? f.district_id) != null ? String(f.farmer_address?.district_id ?? f.district_id) : '',
//       block: (f.farmer_address?.block_id ?? f.block_id) != null ? String(f.farmer_address?.block_id ?? f.block_id) : '',
//       gramPanchayat: (f.farmer_address?.gram_panchayat_id ?? f.gram_panchayat_id) != null ? String(f.farmer_address?.gram_panchayat_id ?? f.gram_panchayat_id) : '',
//       village: (f.farmer_address?.village_id ?? f.village_id) != null ? String(f.farmer_address?.village_id ?? f.village_id) : '',
//       mouza: (f.farmer_address?.mouza_id ?? f.mouza_id) != null ? String(f.farmer_address?.mouza_id ?? f.mouza_id) : '',
//       address: f.farmer_address?.address || f.address || '',
//       postOffice: f.farmer_address?.post_office || f.post_office || '',
//       policeStation: f.farmer_address?.police_station || f.police_station || '',
//       pinCode: f.farmer_address?.pincode || f.pincode || '',
//       bankName: f.farmer_bank?.bank_name || f.bank_name || '',
//       branchName: f.farmer_bank?.branch_name || f.branch_name || '',
//       accountNumber: f.farmer_bank?.account_number || f.account_number || '',
//       ifscCode: f.farmer_bank?.ifsc_code || f.ifsc_code || '',
//       accountHolderName: f.farmer_bank?.account_holder_name || f.account_holder_name || '',
//       accountType: f.farmer_bank?.account_type || f.account_type || '',
//       bankImageUrl: f.farmer_bank?.bank_image_url || f.bank_image_url || '',
//       noAgriculturalLand: f.is_land_less || false,
//     },
//   };
// }

// /**
//  * Create a new farmer (quick registration).
//  * POST /api/farmers  →  { farmer: { user_id, aadhar_no, mobile_no, ... } }
//  */
// export async function createFarmer(farmerBody) {
//   return apiPostJSON('/farmers', { farmer: farmerBody }, { auth: true });
// }

// /**
//  * Update an existing farmer (full registration) with optional file uploads.
//  * Uses multipart/form-data so files can be attached alongside JSON fields.
//  * POST /api/farmers/:id  ← confirmed: backend uses POST (not PATCH) for update
//  *
//  * @param {number} id
//  * @param {object} farmerBody  — plain JS object (same shape as JSON body)
//  * @param {object} files       — { aadhaar_card_image, voter_card_image, farmer_image, bank_image, self_declaration }
//  *                               Each value is a File object or null (omitted if null).
//  */
// export async function updateFarmerMultipart(id, farmerBody, files = {}) {
//   const token = getToken();
//   const headers = {};
//   if (token) headers['Authorization'] = `Bearer ${token}`;
//   // DO NOT set Content-Type — browser sets it with the correct boundary for multipart

//   const fd = new FormData();

//   // Recursively append farmer JSON fields as farmer[key] / farmer[nested][key]
//   function appendNested(obj, prefix) {
//     Object.entries(obj).forEach(([k, v]) => {
//       if (v === undefined || v === null) return;
//       const key = `${prefix}[${k}]`;
//       if (typeof v === 'object' && !(v instanceof File)) {
//         appendNested(v, key);
//       } else {
//         fd.append(key, v);
//       }
//     });
//   }
//   appendNested(farmerBody, 'farmer');

//   // Attach files under the Rails-expected param names (confirmed from API docs)
//   const FILE_FIELDS = {
//     aadhaar_card_image: 'farmer[aadhaar_image]',
//     voter_card_image: 'farmer[voter_image]',
//     farmer_image: 'farmer[farmer_profile_attributes][farmer_image]',
//     bank_image: 'farmer[farmer_bank_attributes][bank_image]',
//     self_declaration: 'farmer[self_declaration]',
//   };
//   Object.entries(FILE_FIELDS).forEach(([key, formKey]) => {
//     if (files[key] instanceof File) fd.append(formKey, files[key]);
//   });

//   const res = await fetch(`${BASE}/farmers/${id}`, {
//     method: 'POST',  // backend uses POST for both create and update on /api/farmers/:id
//     headers,
//     body: fd,
//   });
//   const text = await res.text();
//   let data = {};
//   try { data = JSON.parse(text); } catch { /* non-JSON body */ }
//   if (!res.ok) throw new Error(extractError(data) || `HTTP ${res.status}`);
//   return data;
// }

// /**
//  * Update an existing farmer (full registration / re-submission) — JSON only, no files.
//  * POST /api/farmers/:id
//  */
// export async function updateFarmer(id, farmerBody) {
//   return apiPost(`/farmers/${id}`, JSON.stringify({ farmer: farmerBody }), { auth: true });
// }

// /**
//  * List farmers visible to the current user.
//  * GET /api/farmer_lists  — returns flat shape: id, name, aadhaar, mobile, district, block, farmer_image_url
//  */
// export async function listFarmers() {
//   return apiGet('/farmer_lists', { auth: true });
// }

// /**
//  * Search farmers by acknowledgement no, Aadhaar, name or mobile.
//  * GET /api/farmer_lists?query=<term>
//  */
// export async function searchFarmer(query) {
//   const q = encodeURIComponent(query.trim());
//   return apiGet(`/farmer_lists?query=${q}`, { auth: true });
// }

// /**
//  * Update a farmer's approval status (approve / reject).
//  * The backend currently expects a POST to /api/farmers/:id (same endpoint as updateFarmer).
//  * This avoids 404s when PATCH is not supported by the server.
//  */
// export async function updateFarmerStatus(id, approvalStatus) {
//   return apiPostJSON(`/farmers/${id}`, { farmer: { approval_status: approvalStatus } }, { auth: true });
// }

// /**
//  * Delete a farmer record.
//  * DELETE /api/farmers/:id
//  * Rails may return 204 No Content on success.
//  */
// export async function deleteFarmer(id) {
//   const headers = { 'Content-Type': 'application/json' };
//   const token = getToken();
//   if (token) headers['Authorization'] = `Bearer ${token}`;
//   const res = await fetch(`${BASE}/farmers/${id}`, { method: 'DELETE', headers });
//   if (res.status === 204 || res.status === 200) return;
//   const data = await res.json().catch(() => ({}));
//   if (!res.ok) throw new Error(extractError(data));
// }



// /**
//  * Create Agent (User)
//  * POST /api/agents
//  * Uses multipart/form-data
//  */
// export async function createAgent(agentData) {
//   const token = getToken();

//   const headers = {};
//   if (token) headers['Authorization'] = `Bearer ${token}`;

//   const fd = new FormData();

//   // Basic
//   fd.append("user[email]", agentData.email);
//   fd.append("user[password]", agentData.password);
//   fd.append("user[mobile]", agentData.mobile);
//   fd.append("user[role_id]", agentData.role_id);

//   // Profile
//   fd.append("user[profile_attributes][first_name]", agentData.firstName);
//   fd.append("user[profile_attributes][last_name]", agentData.lastName);
//   fd.append("user[profile_attributes][gender]", agentData.gender);

//   // Working zone (important)
//   fd.append("user[working_zones_attributes][0][district_id]", agentData.district_id);
//   fd.append("user[working_zones_attributes][0][block_id]", agentData.block_id);

//   const res = await fetch(`${BASE}/agents`, {
//     method: "POST",
//     headers,
//     body: fd,
//   });

//   const text = await res.text();
//   let data = {};
//   try { data = JSON.parse(text); } catch { }

//   if (!res.ok) throw new Error(extractError(data));
//   return data;
// }

// /**
//  * List Agents (Users)
//  * GET /api/agents
//  */
// export async function listAgents() {
//   return apiGet('/agents', { auth: true });
// }


//new 


/**
 * Central API client for all backend calls.
 */

const BASE = '/api';

/** ─────────────────────────────────────────────
 * 🔐 TOKEN HANDLING
 * ───────────────────────────────────────────── */
function getToken() {
  try {
    const stored = sessionStorage.getItem('portalUser');
    return stored ? JSON.parse(stored)?.access_token : null;
  } catch {
    return null;
  }
}

function getRefreshToken() {
  try {
    const stored = sessionStorage.getItem('portalUser');
    return stored ? JSON.parse(stored)?.refresh_token : null;
  } catch {
    return null;
  }
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${BASE}/v1/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken })
    });

    if (!res.ok) return false;

    const data = await res.json();
    if (!data?.data?.access_token) return false;

    // Update portalUser in sessionStorage
    const stored = sessionStorage.getItem('portalUser');
    if (stored) {
      const user = JSON.parse(stored);
      user.access_token = data.data.access_token;

      // If the backend returns a new refresh token, we can also store it
      if (data.data.refresh_token) {
        user.refresh_token = data.data.refresh_token;
      }

      try {
        const payload = JSON.parse(atob(user.access_token.split('.')[1]));
        if (payload.exp) user.token_expires_at = payload.exp * 1000;
      } catch (e) { }

      sessionStorage.setItem('portalUser', JSON.stringify(user));
    }

    return data.data.access_token;
  } catch (err) {
    return false;
  }
}

/** ─────────────────────────────────────────────
 * ❌ ERROR HANDLING
 * ───────────────────────────────────────────── */
function extractError(data, fallback = 'Request failed') {
  if (data?.error_description) return data.error_description;
  if (data?.message) return data.message;
  if (data?.error) return data.error;

  if (data?.errors) {
    if (typeof data.errors === 'string') return data.errors;
    if (Array.isArray(data.errors)) return data.errors.join(', ');
    if (typeof data.errors === 'object') {
      return Object.entries(data.errors)
        .flatMap(([k, v]) => (Array.isArray(v) ? v.map(m => `${k} ${m}`) : [`${k} ${v}`]))
        .join('; ');
    }
  }
  return fallback;
}

/** ─────────────────────────────────────────────
 * 🌐 GENERIC API METHODS
 * ───────────────────────────────────────────── */

export async function apiGet(path, { auth = false } = {}) {
  let headers = {};
  let token = null;

  if (auth) {
    token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  let res = await fetch(`${BASE}${path}`, { headers });

  // Try refreshing token if 401 Unauthorized
  if (res.status === 401 && auth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`;
      res = await fetch(`${BASE}${path}`, { headers });
    } else {
      // Refresh failed, clear session and let app gracefully redirect to login
      sessionStorage.removeItem('portalUser');
      window.location.href = '/';
    }
  }

  const text = await res.text();

  let data = {};
  try { data = JSON.parse(text); } catch { }

  if (!res.ok) throw new Error(extractError(data) || `HTTP ${res.status}`);
  return data;
}

export async function apiPost(path, body, { auth = false } = {}) {
  let headers = {};
  let token = null;

  if (auth) {
    token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  let res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers,
    body,
  });

  // Try refreshing token if 401 Unauthorized
  if (res.status === 401 && auth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`;
      res = await fetch(`${BASE}${path}`, {
        method: 'POST',
        headers,
        body,
      });
    } else {
      sessionStorage.removeItem('portalUser');
      window.location.href = '/';
    }
  }

  const text = await res.text();
  let data = {};
  try { data = JSON.parse(text); } catch { }

  if (!res.ok) throw new Error(extractError(data));
  return data;
}

export async function apiPostJSON(path, body, { auth = false } = {}) {
  let headers = { 'Content-Type': 'application/json' };
  let token = null;

  if (auth) {
    token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  let res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  // Try refreshing token if 401 Unauthorized
  if (res.status === 401 && auth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`;
      res = await fetch(`${BASE}${path}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
    } else {
      sessionStorage.removeItem('portalUser');
      window.location.href = '/';
    }
  }

  const text = await res.text();
  let data = {};
  try { data = JSON.parse(text); } catch { }

  if (!res.ok) throw new Error(extractError(data));
  return data;
}

export async function apiPatchJSON(path, body, { auth = false } = {}) {
  let headers = { 'Content-Type': 'application/json' };
  let token = null;

  if (auth) {
    token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  let res = await fetch(`${BASE}${path}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  });

  // Try refreshing token if 401 Unauthorized
  if (res.status === 401 && auth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`;
      res = await fetch(`${BASE}${path}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(body),
      });
    } else {
      sessionStorage.removeItem('portalUser');
      window.location.href = '/';
    }
  }

  const text = await res.text();
  let data = {};
  try { data = JSON.parse(text); } catch { }

  if (!res.ok) throw new Error(extractError(data));
  return data;
}

/** ─────────────────────────────────────────────
 * 🧠 LOCAL STATUS STORAGE (🔥 MAIN FIX)
 * ───────────────────────────────────────────── */

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

/** ─────────────────────────────────────────────
 * 🔄 STATUS MAPPING
 * ───────────────────────────────────────────── */

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

/** ─────────────────────────────────────────────
 * 🔥 NORMALIZER (FIXED)
 * ───────────────────────────────────────────── */

export function normalizeFarmer(f) {
  const apiStatus = serverStatusToLocal(
    f.approval_status ?? f.status ?? f.state
  );

  const localStatus = getLocalStatus(f.id);

  const status = localStatus || apiStatus || 'pending';

  return {
    id: f.id,
    ackId: f.acknowledgement_no || '',
    acknowledgement_id: f.acknowledgement_no || '',
    name: f.farmer_profile?.name || f.name || '',
    aadhaar: f.aadhar_no || '',
    mobile: f.mobile_no || '',
    status,
    gram_panchayat:
      (f.farmer_address?.gram_panchayat_id ?? f.gram_panchayat_id) != null
        ? String(f.farmer_address?.gram_panchayat_id ?? f.gram_panchayat_id)
        : '',
    bank_name: f.farmer_bank?.bank_name || f.bank_name || '',
    branch_name: f.farmer_bank?.branch_name || f.branch_name || '',
    account_number: f.farmer_bank?.account_number || f.account_number || '',
    ifsc: f.farmer_bank?.ifsc_code || f.ifsc_code || '',
    present_in_kbn: f.present_in_kbn ?? f.present_in_kb_n ?? false,
    present_in_kb_n: f.present_in_kb_n ?? f.present_in_kbn ?? false,
    applied_yuvasathi: f.applied_yuvasathi ?? f.applied_for_yuvasathi ?? false,
    applied_for_yuvasathi: f.applied_for_yuvasathi ?? f.applied_yuvasathi ?? false,
    remarks: f.remarks || '',
    revert_remarks: f.revert_remarks || '',
    is_rejected: f.is_rejected ?? status === 'rejected',
    is_deleted: f.is_deleted ?? status === 'deleted',
    is_reverted: f.is_reverted ?? status === 'reverted',

    farmerImageUrl:
      f.farmer_image_url ||
      f.farmer_profile?.farmer_image_url ||
      '',

    fullForm: {
      fathersName: f.farmer_profile?.father_name || '',
      gender: f.farmer_profile?.gender || '',
      dob: f.farmer_profile?.date_of_birth || '',
      district: (f.farmer_address?.district_id ?? f.district_id ?? '')?.toString?.() || '',
      block: (f.farmer_address?.block_id ?? f.block_id ?? '')?.toString?.() || '',
      gramPanchayat:
        (f.farmer_address?.gram_panchayat_id ?? f.gram_panchayat_id ?? '')?.toString?.() || '',
      village: (f.farmer_address?.village_id ?? f.village_id ?? '')?.toString?.() || '',
      bankName: f.farmer_bank?.bank_name || '',
      branchName: f.farmer_bank?.branch_name || '',
      accountNumber: f.farmer_bank?.account_number || '',
      ifscCode: f.farmer_bank?.ifsc_code || '',
    },
  };
}

/** ─────────────────────────────────────────────
 * 👨‍🌾 FARMER APIs
 * ───────────────────────────────────────────── */

export async function listFarmers() {
  const data = await apiGet('/v1/farmers', { auth: true });
  // Handle various api structures safely
  return Array.isArray(data) ? data : (data?.data || data?.farmers || []);
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

  if (token) headers['Authorization'] = `Bearer ${token}`;

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
  try { data = JSON.parse(text); } catch { }

  if (!res.ok) throw new Error(extractError(data) || `HTTP ${res.status}`);
  return data?.data || data?.farmer || data;
}

export async function updateFarmerStatus(id, status) {
  return apiPatchJSON(`/v1/farmers/${id}`, {
    farmer: { approval_status: status },
  }, { auth: true });
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

/** ─────────────────────────────────────────────
 * 🏦 IFSC
 * ───────────────────────────────────────────── */

export async function lookupIFSC(ifsc) {
  return apiGet(`/ifscs/show_ifsc?ifsc=${ifsc}`);
}

/** ─────────────────────────────────────────────
 * 👤 AGENTS
 * ───────────────────────────────────────────── */

export async function createAgent(data) {
  const token = getToken();

  const fd = new FormData();
  fd.append("user[email]", data.email);
  fd.append("user[password]", data.password);
  fd.append("user[mobile]", data.mobile);
  fd.append("user[role_id]", data.role_id);
  fd.append("user[profile_attributes][first_name]", data.firstName);
  fd.append("user[profile_attributes][last_name]", data.lastName);
  fd.append("user[profile_attributes][gender]", data.gender);
  fd.append("user[working_zones_attributes][0][district_id]", data.district_id);
  fd.append("user[working_zones_attributes][0][block_id]", data.block_id);

  const res = await fetch(`${BASE}/agents`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });

  const text = await res.text();
  let json = {};
  try { json = JSON.parse(text); } catch { }

  if (!res.ok) throw new Error(extractError(json));
  return json;
}

export async function listAgents() {
  return apiGet('/agents', { auth: true });
}
