// ─── Address Reference Data ──────────────────────────────────────────────────
export const DISTRICTS = ['BANKURA', 'PURULIA', 'BIRBHUM', 'MURSHIDABAD', 'NADIA'];
export const BLOCKS_BY_DISTRICT = {
  BANKURA: ['BANKURA-1', 'BANKURA-2', 'ONDA', 'SIMLAPAL', 'INDPUR', 'TALDANGRA', 'BARJORA'],
  PURULIA: ['PURULIA-1', 'PURULIA-2', 'MANBAZAR-1', 'MANBAZAR-2'],
  BIRBHUM: ['SURI-1', 'SURI-2', 'BOLPUR', 'ILLAMBAZAR'],
  MURSHIDABAD: ['MURSHIDABAD', 'BERHAMPORE', 'KANDI'],
  NADIA: ['KRISHNAGAR-1', 'KRISHNAGAR-2', 'RANAGHAT-1'],
};
export const GRAM_PANCHAYATS_BY_BLOCK = {
  'BANKURA-1': ['BANKURA-I GP', 'KENJAKURA GP', 'SALTORA GP', 'MACHANTORE GP'],
  'BANKURA-2': ['BANKURA-II GP', 'BELIATORE GP', 'GANGAJALGHATI GP'],
  ONDA: ['ONDA-I GP', 'ONDA-II GP', 'SARENGA GP'],
};
export const MOUZAS_BY_GP = {
  'BANKURA-I GP': ['MOUZA-A', 'MOUZA-B', 'MOUZA-C'],
  'KENJAKURA GP': ['MOUZA-D', 'MOUZA-E'],
  'SALTORA GP':   ['MOUZA-F', 'MOUZA-G'],
};
export const VILLAGES_BY_MOUZA = {
  'MOUZA-A': ['VILLAGE-1', 'VILLAGE-2', 'VILLAGE-3'],
  'MOUZA-B': ['VILLAGE-4', 'VILLAGE-5'],
  'MOUZA-C': ['VILLAGE-6', 'VILLAGE-7'],
  'MOUZA-D': ['VILLAGE-8', 'VILLAGE-9'],
  'MOUZA-E': ['VILLAGE-10'],
  'MOUZA-F': ['VILLAGE-11', 'VILLAGE-12'],
  'MOUZA-G': ['VILLAGE-13'],
};
export const RELATIONS      = ['Son', 'Daughter', 'Wife', 'Husband', 'Mother', 'Father', 'Brother', 'Sister', 'Other'];
export const GENDERS         = ['Male', 'Female', 'Other'];
export const CASTES          = ['General', 'OBC-A', 'OBC-B', 'SC', 'ST'];
export const ACCOUNT_TYPES   = ['Savings', 'Current'];
export const NOMINEE_AGES    = Array.from({ length: 100 }, (_, i) => String(i + 1));

// ─── Empty full-form fields template ────────────────────────────────────────
export const EMPTY_FULL_FORM = {
  // ID Details
  voterCard: '', aadhaarImage: null, voterCardImage: null,
  // Applicant Details
  fathersName: '', relation: '', gender: '', dob: '', age: '', caste: '', applicantImage: null,
  // Nominee
  nomineeName: '', nomineeRelation: '', nomineeFatherName: '', guardianName: '', nomineeDob: '', nomineeAge: '',
  // Address
  district: '', block: '', gramPanchayat: '', mouza: '', village: '', address: '', postOffice: '', policeStation: '', pinCode: '',
  // Bank
  accountHolderName: '', accountNumber: '', ifscCode: '', bankName: '', branchName: '', accountType: '', bankImage: null,
  // Self Declaration
  noAgriculturalLand: false, selfDeclarationDoc: null,
};

// Dummy users removed — authentication is handled via the real OAuth2 API.
// See src/context/AuthContext.jsx → POST /oauth/token

// Keep this block only to avoid a JS parse error — delete entire section when safe
const _UNUSED_DUMMY_USERS = [
  {
    id: 1,
    email: 'gramdoot1@khetmojur.in',
    password: 'Gramdoot@123',
    role: 'gramdoot',
    name: 'Ravi Kumar',
    blockName: 'BANKURA-1',
  },
  {
    id: 2,
    email: 'ada1@khetmojur.in',
    password: 'ADA@123',
    role: 'ada',
    name: 'Suresh Singh',
    blockName: 'BANKURA-1',
  },
  {
    id: 3,
    email: 'sno1@khetmojur.in',
    password: 'SNO@123',
    role: 'sno',
    name: 'Anita Ghosh',
    blockName: 'STATE LEVEL',
  },
  {
    id: 4,
    email: 'bank1@khetmojur.in',
    password: 'Bank@123',
    role: 'bank',
    name: 'Priya Das',
    blockName: 'BANK LEVEL',
  },
];

// All applicant data is now fetched from the server (POST/PATCH /api/farmers).
// No static mock records — they caused count mismatches and data never reached the DB.
