/**
 * Central API client for all backend calls.
 * All paths are relative — the Vite proxy forwards /api/* to http://144.76.19.201:3002/api/*
 */

const BASE = '/api';

/** Read the stored Bearer token from sessionStorage */
function getToken() {
  try {
    const stored = sessionStorage.getItem('portalUser');
    return stored ? JSON.parse(stored)?.access_token : null;
  } catch {
    return null;
  }
}

/** Extract the most useful error string from any API error response shape */
function extractError(data, fallback = 'Request failed') {
  // Rails validation:  { message: '...' }  or  { errors: { field: ['msg'] } }
  // OAuth errors:      { error_description: '...' }  or  { error: '...' }
  if (data?.error_description)                  return data.error_description;
  if (data?.message && typeof data.message === 'string') return data.message;
  if (data?.error   && typeof data.error   === 'string') return data.error;
  if (data?.errors) {
    if (typeof data.errors === 'string') return data.errors;
    if (Array.isArray(data.errors))      return data.errors.join(', ');
    if (typeof data.errors === 'object') {
      const msgs = Object.entries(data.errors)
        .flatMap(([k, v]) => (Array.isArray(v) ? v.map((m) => `${k} ${m}`) : [`${k} ${v}`]));
      if (msgs.length) return msgs.join('; ');
    }
  }
  return fallback;
}

/**
 * Authenticated GET request.
 * @param {string} path  - e.g. '/agent_profiles'
 * @param {object} opts  - { auth: bool }
 */
export async function apiGet(path, { auth = false } = {}) {
  const headers = {};
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}${path}`, { headers });
  // Safely parse — server may return HTML on error routes
  const text = await res.text();
  let data = {};
  try { data = JSON.parse(text); } catch { /* non-JSON body */ }
  if (!res.ok) throw new Error(extractError(data) || `HTTP ${res.status}`);
  return data;
}

/**
 * Authenticated POST request.
 * Pass a FormData or JSON body.
 */
export async function apiPost(path, body, { auth = false } = {}) {
  const headers = {};
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}${path}`, { method: 'POST', headers, body });
  const text = await res.text();
  let data = {};
  try { data = JSON.parse(text); } catch { /* non-JSON body */ }
  if (!res.ok) throw new Error(extractError(data) || `HTTP ${res.status}`);
  return data;
}

/**
 * Authenticated PATCH with JSON body.
 */
export async function apiPatchJSON(path, body, { auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}${path}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data = {};
  try { data = JSON.parse(text); } catch { /* non-JSON body */ }
  if (!res.ok) throw new Error(extractError(data) || `HTTP ${res.status}`);
  return data;
}

/**
 * Authenticated POST with JSON body.
 */
export async function apiPostJSON(path, body, { auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data = {};
  try { data = JSON.parse(text); } catch { /* non-JSON body */ }
  if (!res.ok) throw new Error(extractError(data) || `HTTP ${res.status}`);
  return data;
}

/**
 * IFSC code lookup.
 * GET /api/ifscs/show_ifsc?ifsc=XXXXX
 * Returns { bank_name, branch_name }
 */
export async function lookupIFSC(ifsc) {
  const code = ifsc.trim().toUpperCase();
  const res = await fetch(`${BASE}/ifscs/show_ifsc?ifsc=${encodeURIComponent(code)}`);
  if (!res.ok) throw new Error('IFSC lookup failed');
  return res.json();
}

// ─── Farmer / Registration API ───────────────────────────────────────────────

/** Map server approval_status → internal status key used by the app */
function serverStatusToLocal(s) {
  const map = {
    quick_registration: 'pending',
    approved:           'approved',
    rejected:           'rejected',
    sent_to_bank:       'sent_to_bank',
    processed:          'processed',
  };
  return map[s] ?? 'pending';
}

/**
 * Normalize a server farmer object → local applicant shape.
 * Handles two response shapes:
 *  - Flat  (GET /api/farmer_lists):  name, farmer_image_url, district_id… at top level
 *  - Nested (POST/PATCH /api/farmers): farmer_profile, farmer_address, farmer_bank objects
 */
export function normalizeFarmer(f) {
  return {
    id:     f.id,
    ackId:  f.acknowledgement_no || '',
    // flat (farmer_lists) keeps name at root; nested responses nest it in farmer_profile
    name:   f.farmer_profile?.name || f.name || '',
    aadhaar: f.aadhar_no  || '',
    mobile:  f.mobile_no  || '',
    status:  serverStatusToLocal(f.approval_status),
    // Profile photo — flat list has farmer_image_url at root; nested has it inside farmer_profile
    farmerImageUrl: f.farmer_image_url || f.farmer_profile?.farmer_image_url || '',
    fullForm: f.farmer_profile ? {
      voterCard:   f.voter_card_no || '',
      // Existing upload URLs — used to show "✓ Already uploaded" in FileInput.
      // Try new field names first (aadhaar_image_url, voter_image_url), fall back to old names.
      aadhaarImageUrl:    f.aadhaar_image_url      || f.aadhaar_card_image_url || '',
      voterCardImageUrl:  f.voter_image_url         || f.voter_card_image_url   || '',
      selfDeclarationUrl: f.self_declaration_url    || '',
      applicantImageUrl:  f.farmer_profile?.farmer_image_url || '',
      bankImageUrl:       '',  // bank passbook image URL not returned by API yet
      // Applicant details
      fathersName: f.farmer_profile.father_name             || '',
      relation:    f.farmer_profile.relationship            || '',
      gender:      f.farmer_profile.gender                  || '',
      dob:         f.farmer_profile.date_of_birth           || '',
      age:         f.farmer_profile.age   != null ? String(f.farmer_profile.age)   : '',
      caste:       f.farmer_profile.caste || '',
      // Nominee
      nomineeName:       f.farmer_profile.nominee_name                   || '',
      nomineeRelation:   f.farmer_profile.relation_with_applicant        || '',
      nomineeFatherName: f.farmer_profile.nominee_father_husband_name    || '',
      guardianName:      f.farmer_profile.name_of_gurdian                || '',
      nomineeDob:        f.farmer_profile.nominee_date_of_birth          || '',
      nomineeAge:        f.farmer_profile.nominee_age != null ? String(f.farmer_profile.nominee_age) : '',
      // Address — stored as numeric ID strings so DataDirsContext helpers work
      district:     f.farmer_address?.district_id       != null ? String(f.farmer_address.district_id)       : '',
      block:        f.farmer_address?.block_id           != null ? String(f.farmer_address.block_id)          : '',
      gramPanchayat:f.farmer_address?.gram_panchayat_id != null ? String(f.farmer_address.gram_panchayat_id) : '',
      village:      f.farmer_address?.village_id         != null ? String(f.farmer_address.village_id)        : '',
      mouza:        f.farmer_address?.mouza_id           != null ? String(f.farmer_address.mouza_id)          : '',
      address:      f.farmer_address?.address      || '',
      postOffice:   f.farmer_address?.post_office  || '',
      policeStation:f.farmer_address?.police_station|| '', // server stores as name string
      pinCode:      f.farmer_address?.pincode       || '',
      // Bank
      bankName:          f.farmer_bank?.bank_name           || '',
      branchName:        f.farmer_bank?.branch_name         || '',
      accountNumber:     f.farmer_bank?.account_number      || '',
      ifscCode:          f.farmer_bank?.ifsc_code           || '',
      accountHolderName: f.farmer_bank?.account_holder_name || '',
      accountType:       f.farmer_bank?.account_type        || '',
      bankImageUrl:      f.farmer_bank?.bank_image_url      || '',  // passbook image URL
      noAgriculturalLand: f.is_land_less || false,
    } : null,
  };
}

/**
 * Create a new farmer (quick registration).
 * POST /api/farmers  →  { farmer: { user_id, aadhar_no, mobile_no, ... } }
 */
export async function createFarmer(farmerBody) {
  return apiPostJSON('/farmers', { farmer: farmerBody }, { auth: true });
}

/**
 * Update an existing farmer (full registration) with optional file uploads.
 * Uses multipart/form-data so files can be attached alongside JSON fields.
 * POST /api/farmers/:id  ← confirmed: backend uses POST (not PATCH) for update
 *
 * @param {number} id
 * @param {object} farmerBody  — plain JS object (same shape as JSON body)
 * @param {object} files       — { aadhaar_card_image, voter_card_image, farmer_image, bank_image, self_declaration }
 *                               Each value is a File object or null (omitted if null).
 */
export async function updateFarmerMultipart(id, farmerBody, files = {}) {
  const token = getToken();
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  // DO NOT set Content-Type — browser sets it with the correct boundary for multipart

  const fd = new FormData();

  // Recursively append farmer JSON fields as farmer[key] / farmer[nested][key]
  function appendNested(obj, prefix) {
    Object.entries(obj).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      const key = `${prefix}[${k}]`;
      if (typeof v === 'object' && !(v instanceof File)) {
        appendNested(v, key);
      } else {
        fd.append(key, v);
      }
    });
  }
  appendNested(farmerBody, 'farmer');

  // Attach files under the Rails-expected param names (confirmed from API docs)
  const FILE_FIELDS = {
    aadhaar_card_image: 'farmer[aadhaar_image]',
    voter_card_image:   'farmer[voter_image]',
    farmer_image:       'farmer[farmer_profile_attributes][farmer_image]',
    bank_image:         'farmer[farmer_bank_attributes][bank_image]',
    self_declaration:   'farmer[self_declaration]',
  };
  Object.entries(FILE_FIELDS).forEach(([key, formKey]) => {
    if (files[key] instanceof File) fd.append(formKey, files[key]);
  });

  const res = await fetch(`${BASE}/farmers/${id}`, {
    method: 'POST',  // backend uses POST for both create and update on /api/farmers/:id
    headers,
    body: fd,
  });
  const text = await res.text();
  let data = {};
  try { data = JSON.parse(text); } catch { /* non-JSON body */ }
  if (!res.ok) throw new Error(extractError(data) || `HTTP ${res.status}`);
  return data;
}

/**
 * Update an existing farmer (full registration / re-submission) — JSON only, no files.
 * POST /api/farmers/:id
 */
export async function updateFarmer(id, farmerBody) {
  return apiPost(`/farmers/${id}`, JSON.stringify({ farmer: farmerBody }), { auth: true });
}

/**
 * List farmers visible to the current user.
 * GET /api/farmer_lists  — returns flat shape: id, name, aadhaar, mobile, district, block, farmer_image_url
 */
export async function listFarmers() {
  return apiGet('/farmer_lists', { auth: true });
}

/**
 * Search farmers by acknowledgement no, Aadhaar, name or mobile.
 * GET /api/farmer_lists?query=<term>
 */
export async function searchFarmer(query) {
  const q = encodeURIComponent(query.trim());
  return apiGet(`/farmer_lists?query=${q}`, { auth: true });
}

/**
 * Update a farmer's approval status (approve / reject).
 * PATCH /api/farmers/:id  →  { farmer: { approval_status } }
 */
export async function updateFarmerStatus(id, approvalStatus) {
  return apiPatchJSON(`/farmers/${id}`, { farmer: { approval_status: approvalStatus } }, { auth: true });
}

/**
 * Delete a farmer record.
 * DELETE /api/farmers/:id
 * Rails may return 204 No Content on success.
 */
export async function deleteFarmer(id) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}/farmers/${id}`, { method: 'DELETE', headers });
  if (res.status === 204 || res.status === 200) return;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(extractError(data));
}
