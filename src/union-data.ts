export const recruitmentUrl = 'https://www.kdocs.cn/l/cbIRABX4yrUP';
export const recruitmentDeadline = '2026-11-11';
export const unionDepartments = [
  {
    id: 'liaison',
    fr: 'Relations et coordination',
    en: 'Liaison',
    summaryFr: 'Coordination interne, partenariats, conférences et rencontres professionnelles.',
    summaryEn: 'Internal coordination, partnerships, lectures and career events.',
  },
  {
    id: 'study',
    fr: 'Études',
    en: 'Study',
    summaryFr:
      'Entraide académique, concours, connaissance des règles et orientation professionnelle.',
    summaryEn: 'Peer learning, academic competitions, rules education and career guidance.',
  },
  {
    id: 'arts',
    fr: 'Culture et arts',
    en: 'Culture and Arts',
    summaryFr: 'Groupes artistiques, entraînements, spectacles et échanges interculturels.',
    summaryEn: 'Artistic groups, training, performances and intercultural exchange.',
  },
  {
    id: 'sports',
    fr: 'Sports',
    en: 'Sports',
    summaryFr: 'Groupes sportifs, entraînements, rencontres et compétitions universitaires.',
    summaryEn: 'Sports groups, regular training, exchanges and university competitions.',
  },
  {
    id: 'practice',
    fr: 'Pratique sociale',
    en: 'Social Practice',
    summaryFr:
      'Projets de terrain, programme « Experiencing China » et découverte de la société chinoise.',
    summaryEn: 'Field activities, Experiencing China and understanding Chinese society.',
  },
  {
    id: 'publicity',
    fr: 'Communication',
    en: 'Publicity',
    summaryFr: 'Reportages, photographie, vidéo, nouveaux médias et valorisation des activités.',
    summaryEn: 'Reporting, photography, video, new media and showcasing activities.',
  },
  {
    id: 'volunteer',
    fr: 'Bénévolat',
    en: 'Volunteer Services',
    summaryFr:
      'Équipes bénévoles, formations, accueil des nouveaux et soutien au bien-être étudiant.',
    summaryEn: 'Volunteer teams, training, orientation and student well-being support.',
  },
  {
    id: 'life',
    fr: 'Vie étudiante',
    en: 'Student Life',
    summaryFr: 'Vie quotidienne, sécurité, sensibilisation et initiatives dans les résidences.',
    summaryEn: 'Daily life, safety education and residence initiatives.',
  },
];
export function recruitmentOpen(now = Date.now()) {
  return now < Date.parse('2026-11-12T00:00:00+08:00');
}
