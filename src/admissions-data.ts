export const officialPortal = 'https://xdgjxs.xidian.edu.cn/internationalEducationStudent/2026/1';
export const admissionsSteps = [
  {
    id: 'preparing',
    fr: 'Préparer le dossier',
    en: 'Prepare your application',
    descriptionFr:
      'Choisir le programme, contacter un superviseur et préparer les pièces demandées.',
    descriptionEn: 'Choose a programme, contact a supervisor and prepare the required documents.',
  },
  {
    id: 'submitted',
    fr: 'Déposer la candidature',
    en: 'Submit the application',
    descriptionFr: 'Déposer personnellement le dossier sur le portail officiel de Xidian.',
    descriptionEn: 'Submit your application yourself through Xidian’s official portal.',
  },
  {
    id: 'interview',
    fr: 'Passer l’entretien',
    en: 'Attend the interview',
    descriptionFr: 'Suivre les instructions d’entretien en ligne communiquées par Xidian.',
    descriptionEn: 'Follow the online interview instructions provided by Xidian.',
  },
  {
    id: 'supplementary',
    fr: 'Compléter les pièces',
    en: 'Provide additional documents',
    descriptionFr: 'Ajouter les documents complémentaires demandés sur le portail officiel.',
    descriptionEn: 'Provide any additional materials requested in the official portal.',
  },
  {
    id: 'offer',
    fr: 'Confirmer l’offre',
    en: 'Confirm the offer',
    descriptionFr: 'Consulter la décision officielle et confirmer l’offre selon ses instructions.',
    descriptionEn: 'Read the official decision and follow the offer confirmation instructions.',
  },
];
export const researchAreas = [
  ['Information & communication', 'Télécommunications et information', 'Communication Engineering'],
  ['Computer science & AI', 'Informatique et intelligence artificielle', 'Computer Science'],
  [
    'Electronics & integrated circuits',
    'Électronique et circuits intégrés',
    'Electronic Engineering',
  ],
  ['Cybersecurity', 'Cybersécurité', 'Cyber'],
];

// Transcribed from the supplied 2026 graduate guides, programme tables pp. 1–2.
// Languages describe programmes, never a supervisor's confirmed availability.
export const graduateProgrammes: {
  level: 'Master' | 'PhD';
  school: string;
  major: string;
  language: 'ZH/EN' | 'ZH' | 'EN';
}[] = [
  ...(
    [
      ['Telecommunications Engineering', 'Information and Communication Engineering', 'ZH/EN'],
      ['Electronic Engineering', 'Electronic Science and Technology', 'ZH/EN'],
      ['Computer Science and Technology', 'Computer Science and Technology', 'ZH/EN'],
      ['Computer Science and Technology', 'Software Engineering', 'ZH'],
      ['Mechano-electronic Engineering', 'Mechanical Engineering', 'ZH/EN'],
      ['Mechano-electronic Engineering', 'Control Science and Engineering', 'ZH/EN'],
      ['Mechano-electronic Engineering', 'Instrument Science and Technology', 'ZH/EN'],
      ['Optoelectronic Engineering', 'Optical Engineering', 'ZH/EN'],
      ['Physics', 'Physics', 'ZH/EN'],
      ['Economics and Management', 'Business Administration (Professional Degree)', 'EN'],
      ['Mathematics and Statistics', 'Applied Mathematics', 'ZH'],
      ['Humanities and Arts', 'Philosophy', 'EN'],
      ['Foreign Languages', 'Foreign Languages and Literatures', 'ZH'],
      ['Foreign Languages', 'Area Studies', 'ZH'],
      ['Integrated Circuits', 'Electronic Science and Technology', 'ZH/EN'],
      ['Integrated Circuits', 'Integrated Circuit Engineering (Professional Degree)', 'ZH'],
      ['Life Science and Technology', 'Biomedical Engineering', 'EN'],
      [
        'Life Science and Technology',
        'Biological and Pharmaceutical Engineering (Professional Degree)',
        'EN',
      ],
      ['Aerospace Science and Technology', 'Instrument Science and Technology', 'ZH/EN'],
      ['Aerospace Science and Technology', 'Control Science and Engineering', 'ZH/EN'],
      ['Advanced Materials and Nanotechnology', 'Materials Science and Engineering', 'ZH'],
      ['Advanced Materials and Nanotechnology', 'Materials and Chemical Engineering', 'ZH'],
      ['Cyber Engineering', 'Cyberspace Security', 'ZH/EN'],
      ['Artificial Intelligence', 'Intelligent Science and Technology', 'ZH/EN'],
      ['Guangzhou Institute of Technology', 'Computer Science and Technology', 'ZH'],
      ['Guangzhou Institute of Technology', 'Optical Engineering', 'ZH'],
      ['Information Mechanics and Sensing Engineering', 'Mechanics', 'EN'],
      [
        'Information Mechanics and Sensing Engineering',
        'Remote Sensing Science and Technology',
        'EN',
      ],
    ] as const
  ).map(([school, major, language]) => ({ level: 'Master' as const, school, major, language })),
  ...(
    [
      ['Telecommunications Engineering', 'Information and Communication Engineering', 'ZH/EN'],
      ['Electronic Engineering', 'Electronic Science and Technology', 'ZH/EN'],
      ['Computer Science and Technology', 'Electronic Science and Technology', 'ZH/EN'],
      ['Computer Science and Technology', 'Computer Science and Technology', 'ZH'],
      ['Mechano-electronic Engineering', 'Mechanical Engineering', 'ZH/EN'],
      ['Mechano-electronic Engineering', 'Control Science and Engineering', 'ZH/EN'],
      ['Mechano-electronic Engineering', 'Instrument Science and Technology', 'ZH/EN'],
      ['Optoelectronic Engineering', 'Optical Engineering', 'ZH/EN'],
      ['Physics', 'Physics', 'ZH/EN'],
      ['Economics and Management', 'Management Science and Engineering', 'EN'],
      ['Mathematics and Statistics', 'Mathematics', 'ZH'],
      ['Integrated Circuits', 'Electronic Science and Technology', 'ZH/EN'],
      ['Integrated Circuits', 'Integrated Circuit Science and Engineering', 'ZH/EN'],
      ['Life Science and Technology', 'Biomedical Engineering', 'EN'],
      ['Aerospace Science and Technology', 'Instrument Science and Technology', 'ZH/EN'],
      ['Aerospace Science and Technology', 'Control Science and Engineering', 'ZH/EN'],
      ['Advanced Materials and Nanotechnology', 'Materials Science and Engineering', 'ZH/EN'],
      ['Cyber Engineering', 'Cyberspace Security', 'ZH/EN'],
      ['Artificial Intelligence', 'Intelligent Science and Technology', 'ZH/EN'],
      ['Information Mechanics and Sensing Engineering', 'Mechanics', 'EN'],
      [
        'Information Mechanics and Sensing Engineering',
        'Remote Sensing Science and Technology',
        'EN',
      ],
    ] as const
  ).map(([school, major, language]) => ({ level: 'PhD' as const, school, major, language })),
];
