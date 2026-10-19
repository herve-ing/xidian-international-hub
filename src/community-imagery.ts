export const clubPhotos: Record<string, { image: string; context: boolean }> = {
  calisthenics: { image: 'community-sports.jpg', context: true },
  'friday-movie-night': { image: 'friday-movie-night.jpg', context: false },
  football: { image: 'club-football.jpg', context: false },
  basketball: { image: 'club-basketball.jpg', context: false },
  badminton: { image: 'club-badminton.jpg', context: false },
  volleyball: { image: 'club-volleyball.jpg', context: false },
  tennis: { image: 'club-tennis.jpg', context: false },
  pickleball: { image: 'club-tennis.jpg', context: true },
  boxing: { image: 'community-sports.jpg', context: true },
  'open-canvas': { image: 'community-workshop.jpg', context: true },
  singing: { image: 'community-performance.jpg', context: true },
  'street-dance': { image: 'campus-street-dance.jpg', context: true },
  'chinese-dance': { image: 'community-fan-dance.jpg', context: true },
  fox: { image: 'club-film.jpg', context: true },
  math: { image: 'community-academic.jpg', context: true },
};
export const departmentPhotos: Record<string, string> = {
  liaison: 'community-youth.jpg',
  study: 'community-academic.jpg',
  arts: 'community-fan-dance.jpg',
  sports: 'club-volleyball.jpg',
  practice: 'campus-experiencing-china.jpg',
  publicity: 'club-film.jpg',
  volunteer: 'community-team.jpg',
  life: 'sie-safety.jpg',
};
export const xidianNews = [
  {
    date: '2026-10-14',
    fr: 'Les nouveaux étudiants internationaux prennent leurs marques.',
    en: 'A new international cohort arrives at Xidian.',
    summaryFr:
      'Une vidéo de bienvenue publiée par la SIE accompagne la rentrée de la promotion 2026.',
    summaryEn: 'A welcome video published by SIE introduces the 2026 international intake.',
    image: 'sie-welcome-2026.jpg',
    source: 'https://sie.xidian.edu.cn/info/1131/7755.htm',
  },
  {
    date: '2026-10-10',
    fr: 'Sécurité au quotidien : apprendre ensemble.',
    en: 'Learning everyday safety together.',
    summaryFr:
      'La SIE présente une formation à la sécurité incendie et à la prévention des fraudes pour les étudiants internationaux.',
    summaryEn:
      'SIE reports fire-safety training and fraud-prevention education for international students.',
    image: 'sie-safety.jpg',
    source: 'https://sie.xidian.edu.cn/info/1129/7695.htm',
  },
  {
    date: '2026-05-22',
    fr: 'Le sport rassemble le campus.',
    en: 'Sport brings the campus together.',
    summaryFr:
      'Retour en vidéo sur la 46e rencontre sportive universitaire, publiée dans la médiathèque de la SIE.',
    summaryEn:
      'A video retrospective of the 46th university sports meet, published in the SIE media library.',
    image: 'sie-sports-2026.jpg',
    source: 'https://sie.xidian.edu.cn/info/1131/7465.htm',
  },
];
