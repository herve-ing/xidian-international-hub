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
export const campusGallery = [
  {
    image: 'campus-street-dance.jpg',
    fr: 'L’énergie de la scène',
    en: 'The energy of the stage',
    source: 'PDF · p. 41',
  },
  {
    image: 'international-stage.jpg',
    fr: 'Se retrouver autour de la culture',
    en: 'Coming together through culture',
    source: 'PPT · slide 32',
  },
  {
    image: 'campus-friends.jpg',
    fr: 'Des amitiés sur le campus',
    en: 'Friendships on campus',
    source: 'PDF · p. 43',
  },
  {
    image: 'campus-exchange.jpg',
    fr: 'Apprendre les uns des autres',
    en: 'Learning from each other',
    source: 'PDF · p. 42',
  },
  {
    image: 'campus-music.jpg',
    fr: 'La musique en partage',
    en: 'Sharing music',
    source: 'PDF · p. 41',
  },
  {
    image: 'campus-outreach.jpg',
    fr: 'À la rencontre de la communauté',
    en: 'Meeting the community',
    source: 'PDF · p. 42',
  },
  {
    image: 'campus-experiencing-china.jpg',
    fr: 'Découvrir la Chine ensemble',
    en: 'Experiencing China together',
    source: 'PDF · p. 42',
  },
  {
    image: 'campus-competition.jpg',
    fr: 'Collaborer et se dépasser',
    en: 'Collaborating and challenging ourselves',
    source: 'PDF · p. 41',
  },
  {
    image: 'international-workshop.jpg',
    fr: 'Des échanges au quotidien',
    en: 'Everyday exchanges',
    source: 'PPT · slide 32',
  },
  {
    image: 'campus-autumn.jpg',
    fr: 'Le campus aux couleurs de l’automne',
    en: 'Autumn on campus',
    source: 'PDF · p. 40',
  },
  {
    image: 'campus-library.jpg',
    fr: 'Un cadre pour apprendre',
    en: 'A place to learn',
    source: 'PDF · p. 40',
  },
  {
    image: 'campus-gardens.jpg',
    fr: 'Une pause dans les jardins',
    en: 'A moment in the gardens',
    source: 'PDF · p. 40',
  },
];
export function recruitmentOpen(now = Date.now()) {
  return now < Date.parse('2026-11-12T00:00:00+08:00');
}
