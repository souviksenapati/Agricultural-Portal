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

// ─── Dummy Users (4 roles) ──────────────────────────────────────────────────
export const DUMMY_USERS = [
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

// ─── Mock Applicants (45 records) ───────────────────────────────────────────
// status: 'pending' | 'approved' | 'rejected' | 'deleted' | 'sent_to_bank' | 'processed'
export const INITIAL_APPLICANTS = [
  { id: 1,  ackId: 'AL010017869176', name: 'Demo Farmer',          aadhaar: '735030864504', mobile: '9685434265', status: 'pending' },
  { id: 2,  ackId: 'AL010010810275', name: 'SULAGNA TEST SIX',     aadhaar: '305504093058', mobile: '9686865898', status: 'pending' },
  { id: 3,  ackId: 'AL010015869485', name: 'SULAGNA TEST FIVE',    aadhaar: '356417178969', mobile: '9868686838', status: 'approved' },
  { id: 4,  ackId: 'AL010010616395', name: 'SULAGNA TEST FOUR',    aadhaar: '660875928402', mobile: '8668535356', status: 'pending' },
  { id: 5,  ackId: 'AL010019247444', name: 'SULAGNA TEST THREE',   aadhaar: '610041642734', mobile: '9568686886', status: 'rejected' },
  { id: 6,  ackId: 'AL010018520983', name: 'SULAGNA TEST TWO',     aadhaar: '263203737309', mobile: '6565899856', status: 'pending' },
  { id: 7,  ackId: 'AL010010606407', name: 'SULAGNA TEST ONE',     aadhaar: '953400255319', mobile: '8688656865', status: 'approved' },
  { id: 8,  ackId: 'AL010011662273', name: 'Sulagna Sulagna',      aadhaar: '813322435010', mobile: '6320145203', status: 'pending' },
  { id: 9,  ackId: 'AL010014901700', name: 'Test Sulagna Now',     aadhaar: '828619163136', mobile: '6321438975', status: 'pending' },
  { id: 10, ackId: 'AL010017790549', name: 'Sulagna Portal',       aadhaar: '445336550382', mobile: '6314585200', status: 'approved' },
  { id: 11, ackId: 'AL010012707986', name: 'SULAGNA SUNDAY THREE', aadhaar: '726683970037', mobile: '6464649794', status: 'pending' },
  { id: 12, ackId: 'AL010011383354', name: 'SULAGNA SUNDAY THREE', aadhaar: '490843735137', mobile: '9767694999', status: 'rejected' },
  { id: 13, ackId: 'AL010017540866', name: 'SULAGNA SUNDAY TWO',   aadhaar: '629919374648', mobile: '4893479189', status: 'pending' },
  { id: 14, ackId: 'AL010019514042', name: 'SULAGNA SUNDAY ONE',   aadhaar: '503706558925', mobile: '9464664994', status: 'pending' },
  { id: 15, ackId: 'AL010019515160', name: 'TEST SUNDAY',          aadhaar: '882665946382', mobile: '7895465566', status: 'approved' },
  { id: 16, ackId: 'AL010016337881', name: 'SUMAN PANDA',          aadhaar: '810382891166', mobile: '9733032374', status: 'pending' },
  { id: 17, ackId: 'AL010017035814', name: 'TEST TEST TEST',       aadhaar: '841615903267', mobile: '6764669499', status: 'pending' },
  { id: 18, ackId: 'AL010010719529', name: 'Test Sulagna Das',     aadhaar: '552261164533', mobile: '6868686886', status: 'pending' },
  { id: 19, ackId: 'AL010015813227', name: 'SULAGNA DAS',          aadhaar: '596753450087', mobile: '5555555552', status: 'approved' },
  { id: 20, ackId: 'AL010010400311', name: 'TEST PANDA',           aadhaar: '574027116714', mobile: '9735032374', status: 'pending' },
  { id: 21, ackId: 'AL010013456789', name: 'AMIT KUMAR',           aadhaar: '123456789012', mobile: '9876543210', status: 'pending' },
  { id: 22, ackId: 'AL010014567890', name: 'SUNITA DEVI',          aadhaar: '234567890123', mobile: '8765432109', status: 'approved' },
  { id: 23, ackId: 'AL010015678901', name: 'RAJESH SHARMA',        aadhaar: '345678901234', mobile: '7654321098', status: 'pending' },
  { id: 24, ackId: 'AL010016789012', name: 'PRIYA GHOSH',          aadhaar: '456789012345', mobile: '6543210987', status: 'rejected' },
  { id: 25, ackId: 'AL010017890123', name: 'MOHAN DAS',            aadhaar: '567890123456', mobile: '9432109876', status: 'pending' },
  { id: 26, ackId: 'AL010018901234', name: 'LAKSHMI BAI',          aadhaar: '678901234567', mobile: '8321098765', status: 'approved' },
  { id: 27, ackId: 'AL010019012345', name: 'SURESH MONDAL',        aadhaar: '789012345678', mobile: '7210987654', status: 'pending' },
  { id: 28, ackId: 'AL010020123456', name: 'REKHA PAUL',           aadhaar: '890123456789', mobile: '6109876543', status: 'pending' },
  { id: 29, ackId: 'AL010021234567', name: 'DIPAK ROY',            aadhaar: '901234567890', mobile: '9098765432', status: 'approved' },
  { id: 30, ackId: 'AL010022345678', name: 'ANJALI SINGH',         aadhaar: '012345678901', mobile: '8987654321', status: 'pending' },
  { id: 31, ackId: 'AL010023456789', name: 'BIKASH DUTTA',         aadhaar: '112233445566', mobile: '9876541234', status: 'pending' },
  { id: 32, ackId: 'AL010024567890', name: 'CHAMPA BISWAS',        aadhaar: '223344556677', mobile: '8765430123', status: 'rejected' },
  { id: 33, ackId: 'AL010025678901', name: 'DULAL HALDER',         aadhaar: '334455667788', mobile: '7654329012', status: 'pending' },
  { id: 34, ackId: 'AL010026789012', name: 'ENA MITRA',            aadhaar: '445566778899', mobile: '6543218901', status: 'approved' },
  { id: 35, ackId: 'AL010027890123', name: 'GOPAL BOSE',           aadhaar: '556677889900', mobile: '9432107890', status: 'pending' },
  { id: 36, ackId: 'AL010028901234', name: 'HENA CHATTERJEE',      aadhaar: '667788990011', mobile: '8321096789', status: 'pending' },
  { id: 37, ackId: 'AL010029012345', name: 'INDRA MANDAL',         aadhaar: '778899001122', mobile: '7210985678', status: 'approved' },
  { id: 38, ackId: 'AL010030123456', name: 'JHARNA NANDI',         aadhaar: '889900112233', mobile: '6109874567', status: 'pending' },
  { id: 39, ackId: 'AL010031234567', name: 'KIRAN SAHA',           aadhaar: '990011223344', mobile: '9098763456', status: 'pending' },
  { id: 40, ackId: 'AL010032345678', name: 'LILA BANERJEE',        aadhaar: '100122334455', mobile: '8987652345', status: 'rejected' },
  { id: 41, ackId: 'AL010033456789', name: 'MADAN KARMAKAR',       aadhaar: '211233445566', mobile: '9876541230', status: 'pending' },
  { id: 42, ackId: 'AL010034567890', name: 'NITA SARKAR',          aadhaar: '322344556677', mobile: '8765430129', status: 'approved' },
  { id: 43, ackId: 'AL010035678901', name: 'OLLOLIN PATRA',        aadhaar: '433455667788', mobile: '7654329018', status: 'pending' },
  { id: 44, ackId: 'AL010036789012', name: 'PABAN GHOSH',          aadhaar: '544566778899', mobile: '6543218907', status: 'pending' },
  { id: 45, ackId: 'AL010037890123', name: 'QUEEN MONDAL',         aadhaar: '655677889900', mobile: '9432107896', status: 'pending' },
];

// Helper: generate a unique acknowledgement ID
export const generateAckId = () => {
  const num = Math.floor(10000000000 + Math.random() * 90000000000);
  return `AL0100${num.toString().slice(0, 8)}`;
};
