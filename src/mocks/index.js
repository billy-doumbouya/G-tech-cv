// ─────────────────────────────────────────────────────────────────────────────
// src/mocks/index.js
// Toutes les données fictives centralisées ici.
// À remplacer par les vraies réponses API côté backend.
// ─────────────────────────────────────────────────────────────────────────────

// ── Utilisateurs ─────────────────────────────────────────
export const MOCK_USER = {
  _id:       'u_001',
  name:      'Mamadou Diallo',
  email:     'mamadou.diallo@gmail.com',
  phone:     '+224 620 00 00 00',
  role:      'user',          // 'user' | 'admin'
  plan:      'premium',       // 'free' | 'premium' | 'enterprise'
  avatar:    null,
  createdAt: '2024-01-15T10:00:00.000Z',
}

export const MOCK_ADMIN = {
  _id:       'u_admin_001',
  name:      'Alpha Diallo',
  email:     'alpha.diallo@gtech-cv.gn',
  phone:     '+224 621 00 00 00',
  role:      'admin',
  plan:      'enterprise',
  avatar:    null,
  createdAt: '2023-06-01T08:00:00.000Z',
}

export const MOCK_USERS = [
  MOCK_USER,
  { _id: 'u_002', name: 'Fatoumata Traoré', email: 'f.traore@outlook.com',   phone: '+224 655 00 00 00', role: 'user', plan: 'free',      avatar: null, createdAt: '2024-08-10T09:00:00.000Z' },
  { _id: 'u_003', name: 'Amadou Sow',       email: 'amadou.sow@orange.gn',   phone: '+224 664 00 00 00', role: 'user', plan: 'premium',   avatar: null, createdAt: '2024-08-08T14:00:00.000Z' },
  { _id: 'u_004', name: 'Aissatou Barry',   email: 'a.barry@gmail.com',       phone: '+224 628 00 00 00', role: 'user', plan: 'free',      avatar: null, createdAt: '2024-07-22T11:00:00.000Z' },
  { _id: 'u_005', name: 'Ibrahim Sylla',    email: 'i.sylla@conakry.biz',     phone: '+224 666 00 00 00', role: 'user', plan: 'enterprise',avatar: null, createdAt: '2024-07-01T16:00:00.000Z' },
]

// ── Session MongoDB (pas de JWT) ──────────────────────────
// Le backend renvoie la session sous cette forme après login.
// connect-mongo stocke l'objet en base, le cookie est httpOnly.
export const MOCK_SESSION = {
  user: MOCK_USER,
  isAuthenticated: true,
}

// ── CV ────────────────────────────────────────────────────
export const MOCK_CVS = [
  {
    _id:          'cv_001',
    userId:       'u_001',
    title:        'CV Développeur Fullstack',
    templateId:   'modern-tech',
    templateName: 'Moderne Tech',
    status:       'paid',           // 'draft' | 'paid' | 'downloadable'
    updatedAt:    '2024-10-12T08:30:00.000Z',
    personalInfo: {
      firstName: 'Mamadou',
      lastName:  'Diallo',
      jobTitle:  'Développeur Fullstack',
      email:     'mamadou.d@g-tech.gn',
      phone:     '+224 620 00 00 00',
      address:   'Conakry, Guinée',
      summary:   'Développeur passionné avec 3 ans d\'expérience en React et Node.js. Orienté performance et UX.',
      photo:     null,
    },
    experiences: [
      {
        _id:         'exp_001',
        title:       'Développeur Junior',
        company:     'Star-Tech Guinea',
        location:    'Conakry',
        startDate:   '2022-01',
        endDate:     '',
        current:     true,
        description: 'Développement d\'interfaces web dynamiques en React et intégration d\'APIs REST. Optimisation des performances front-end.',
      },
      {
        _id:         'exp_002',
        title:       'Stagiaire Web',
        company:     'Conakry Digital',
        location:    'Conakry',
        startDate:   '2021-06',
        endDate:     '2021-12',
        current:     false,
        description: 'Maintenance de sites WordPress et création de newsletters responsives.',
      },
    ],
    educations: [
      {
        _id:    'edu_001',
        degree: 'Licence en Informatique',
        school: 'Université Gamal Abdel Nasser de Conakry',
        year:   '2021',
      },
    ],
    skills:    ['React.js', 'Node.js', 'Tailwind CSS', 'PostgreSQL', 'Docker'],
    languages: [
      { _id: 'lang_001', name: 'Français', level: 'Natal',  percent: 100 },
      { _id: 'lang_002', name: 'Anglais',  level: 'Avancé', percent: 80  },
      { _id: 'lang_003', name: 'Soussou',  level: 'Natal',  percent: 100 },
    ],
  },
  {
    _id:          'cv_002',
    userId:       'u_001',
    title:        'Candidature Chef de Projet',
    templateId:   'corporate',
    templateName: 'Corporate',
    status:       'draft',
    updatedAt:    '2024-10-05T15:00:00.000Z',
    personalInfo: { firstName: 'Mamadou', lastName: 'Diallo', jobTitle: 'Chef de Projet', email: 'mamadou.d@g-tech.gn', phone: '+224 620 00 00 00', address: '', summary: '', photo: null },
    experiences:  [],
    educations:   [],
    skills:       [],
    languages:    [],
  },
  {
    _id:          'cv_003',
    userId:       'u_001',
    title:        'CV Consultant RH',
    templateId:   'minimal',
    templateName: 'Minimaliste',
    status:       'downloadable',
    updatedAt:    '2024-09-28T10:00:00.000Z',
    personalInfo: { firstName: 'Mamadou', lastName: 'Diallo', jobTitle: 'Consultant RH', email: 'mamadou.d@g-tech.gn', phone: '+224 620 00 00 00', address: '', summary: '', photo: null },
    experiences:  [],
    educations:   [],
    skills:       [],
    languages:    [],
  },
]

// ── Paiements ─────────────────────────────────────────────
export const MOCK_PAYMENTS = [
  {
    _id:      'pay_001',
    userId:   'u_001',
    cvId:     'cv_001',
    cvTitle:  'CV Développeur Fullstack',
    amount:   5000,
    currency: 'GNF',
    method:   'orange_money',   // 'orange_money' | 'mtn_momo'
    status:   'confirmed',      // 'pending' | 'confirmed' | 'failed'
    phone:    '+224 620 00 00 00',
    reference:'OM-2024-001',
    createdAt:'2024-10-12T08:00:00.000Z',
  },
  {
    _id:      'pay_002',
    userId:   'u_001',
    cvId:     'cv_003',
    cvTitle:  'CV Consultant RH',
    amount:   5000,
    currency: 'GNF',
    method:   'mtn_momo',
    status:   'confirmed',
    phone:    '+224 620 00 00 00',
    reference:'MTN-2024-002',
    createdAt:'2024-09-28T10:00:00.000Z',
  },
  {
    _id:      'pay_003',
    userId:   'u_001',
    cvId:     'cv_002',
    cvTitle:  'Candidature Chef de Projet',
    amount:   5000,
    currency: 'GNF',
    method:   'orange_money',
    status:   'pending',
    phone:    '+224 620 00 00 00',
    reference:'OM-2024-003',
    createdAt:'2024-10-05T15:00:00.000Z',
  },
]

// ── Stats Admin ───────────────────────────────────────────
export const MOCK_STATS = {
  totalUsers:       1284,
  totalCVs:         3542,
  revenue:          12500000,
  pendingPayments:  12,
  newUsersToday:    23,
  newCVsToday:      47,
  userGrowth:       [40, 55, 45, 70, 60, 85, 75],   // 7 derniers jours
  revenueGrowth:    [1200000, 1450000, 1100000, 1800000, 1600000, 2100000, 1950000],
  planDistribution: { free: 65, premium: 30, enterprise: 5 },
  paymentMethods:   { orange_money: 62, mtn_momo: 38 },
}

// ── Templates ─────────────────────────────────────────────
export const MOCK_TEMPLATES = [
  { id: 'modern-tech', name: 'Moderne Tech',  desc: 'Design épuré avec barre latérale bleue.',         bg: 'bg-slate-100',  popular: true  },
  { id: 'corporate',   name: 'Corporate',      desc: 'Le standard classique des grandes entreprises.',  bg: 'bg-slate-50',   popular: false },
  { id: 'minimal',     name: 'Minimaliste',    desc: 'L\'élégance par la simplicité et l\'espace.',     bg: 'bg-white',      popular: false },
  { id: 'creative',    name: 'Créatif',        desc: 'Idéal pour les designers et profils marketing.',  bg: 'bg-slate-900',  popular: true  },
]

// ── Témoignages (Landing page) ────────────────────────────
export const MOCK_TESTIMONIALS = [
  {
    id: 1,
    name:   'Mariama Camara',
    role:   'Assistante RH – Conakry',
    text:   'J\'ai décroché mon poste en moins de 2 semaines après avoir utilisé G-Tech CV. Le design professionnel a vraiment fait la différence.',
    avatar: 'MC',
    stars:  5,
  },
  {
    id: 2,
    name:   'Ousmane Baldé',
    role:   'Ingénieur informatique – Labé',
    text:   'Interface simple, résultat impressionnant. Le paiement avec Orange Money est super pratique. Je recommande à tous mes collègues.',
    avatar: 'OB',
    stars:  5,
  },
  {
    id: 3,
    name:   'Fatoumata Sylla',
    role:   'Comptable – Kindia',
    text:   'En 15 minutes, j\'avais un CV digne d\'une grande entreprise. Merci G-Tech CV pour ce service adapté à la Guinée.',
    avatar: 'FS',
    stars:  5,
  },
]
