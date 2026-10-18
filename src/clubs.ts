import { validDate } from './domain.ts';
export type Club = {
  id: string;
  name: string;
  zh: string;
  category: 'sport' | 'creative' | 'academic';
  format: 'team' | 'racket' | 'combat' | 'art' | 'music' | 'dance' | 'media' | 'math';
  symbol: string;
  tone: string;
  aliases: string;
  organizer?: string;
  wechat?: string;
  source?: string;
  description: [string, string, string];
  activity: [string, string, string];
  kit: [string, string, string];
};
const seedClubs: Club[] = [
  {
    id: 'basketball',
    organizer: 'Oussama Boumlik',
    wechat: 'lkhawa101',
    source: 'https://freshman-guide-and-clubs.onrender.com/basketball.html',
    name: 'International Basketball Club',
    zh: '国际篮球俱乐部',
    category: 'sport',
    format: 'team',
    symbol: '01',
    tone: 'amber',
    aliases: 'basket basket-ball basketball 篮球',
    description: [
      'Un point de rencontre autour du basket, du jeu collectif et de l’esprit d’équipe.',
      'Connect through basketball, teamwork and a shared love of the game.',
      '以篮球和团队合作为纽带，结识校园伙伴。',
    ],
    activity: [
      'Passes, tirs, jeu collectif',
      'Passing, shooting and team play',
      '传球、投篮与团队配合',
    ],
    kit: [
      'Tenue de sport, chaussures adaptées, eau ; demander si les ballons sont fournis.',
      'Sportswear, suitable shoes and water; ask whether balls are provided.',
      '运动服、合适的鞋和饮水；请确认是否提供篮球。',
    ],
  },
  {
    id: 'badminton',
    name: 'International Badminton Club',
    zh: '国际羽毛球俱乐部',
    category: 'sport',
    format: 'racket',
    symbol: '02',
    tone: 'sage',
    aliases: 'badminton volant 羽毛球',
    description: [
      'Découvrir ou pratiquer le badminton et rencontrer des partenaires de jeu.',
      'Explore badminton and connect with playing partners.',
      '了解羽毛球运动，寻找球友。',
    ],
    activity: [
      'Échanges, déplacements, simple et double',
      'Rallies, footwork, singles and doubles',
      '对打、步法、单打与双打',
    ],
    kit: [
      'Chaussures de salle, eau ; confirmer le prêt de raquette et la fourniture des volants.',
      'Indoor shoes and water; confirm racket loans and shuttle availability.',
      '室内运动鞋和饮水；请确认球拍借用与羽毛球供应。',
    ],
  },
  {
    id: 'volleyball',
    name: 'International Volleyball Club',
    zh: '国际排球俱乐部',
    category: 'sport',
    format: 'team',
    symbol: '03',
    tone: 'blue',
    aliases: 'volley volley-ball volleyball 排球',
    description: [
      'Partager l’énergie du volley et apprendre à jouer ensemble.',
      'Share the energy of volleyball and learn to play as a team.',
      '感受排球活力，学习团队配合。',
    ],
    activity: [
      'Réception, service et coordination d’équipe',
      'Receiving, serving and team coordination',
      '接球、发球与团队协作',
    ],
    kit: [
      'Tenue de sport, chaussures adaptées ; demander conseil sur les protections.',
      'Sportswear and suitable shoes; ask about protective equipment.',
      '运动服和合适的鞋；请咨询护具要求。',
    ],
  },
  {
    id: 'tennis',
    name: 'International Tennis Club',
    zh: '国际网球俱乐部',
    category: 'sport',
    format: 'racket',
    symbol: '04',
    tone: 'sage',
    aliases: 'tennis 网球',
    description: [
      'Explorer le tennis et trouver des partenaires pour progresser.',
      'Explore tennis and find partners to develop your game.',
      '了解网球，寻找共同进步的球友。',
    ],
    activity: [
      'Échanges, service et pratique en simple ou double',
      'Rallies, serves, singles and doubles',
      '对打、发球、单打与双打',
    ],
    kit: [
      'Chaussures adaptées au terrain, eau ; confirmer les raquettes et l’accès aux courts.',
      'Court-appropriate shoes and water; confirm rackets and court access.',
      '适合场地的鞋和饮水；请确认球拍与场地使用方式。',
    ],
  },
  {
    id: 'pickleball',
    name: 'International Pickleball Club',
    zh: '国际匹克球俱乐部',
    category: 'sport',
    format: 'racket',
    symbol: '05',
    tone: 'amber',
    aliases: 'pickleball pickeball pickle ball 匹克球',
    description: [
      'Découvrir le pickleball, ses échanges et sa dimension conviviale.',
      'Discover pickleball, its rallies and social side.',
      '了解匹克球，在运动中结识朋友。',
    ],
    activity: [
      'Prise en main, échanges et double',
      'Getting started, rallies and doubles',
      '基础入门、对打与双打',
    ],
    kit: [
      'Tenue de sport et eau ; vérifier le prêt des palettes et des balles.',
      'Sportswear and water; check paddle and ball availability.',
      '运动服和饮水；请确认球拍与球是否可借用。',
    ],
  },
  {
    id: 'football',
    name: 'International Football Club',
    zh: '国际足球俱乐部',
    category: 'sport',
    format: 'team',
    symbol: '06',
    tone: 'sage',
    aliases: 'football foot soccer 足球',
    description: [
      'Se retrouver autour du football et de la coopération sur le terrain.',
      'Connect through football and teamwork on the pitch.',
      '以足球为纽带，在球场上合作交流。',
    ],
    activity: [
      'Technique, passes et jeu d’équipe',
      'Skills, passing and team play',
      '技术、传球与团队配合',
    ],
    kit: [
      'Tenue et chaussures adaptées au terrain ; confirmer protections et type de surface.',
      'Sportswear and suitable footwear; confirm protection and pitch surface.',
      '运动服与适合场地的鞋；请确认护具和场地类型。',
    ],
  },
  {
    id: 'boxing',
    name: 'International Boxing Club',
    zh: '国际拳击俱乐部',
    category: 'sport',
    format: 'combat',
    symbol: '07',
    tone: 'rose',
    aliases: 'boxing boxe 拳击',
    description: [
      'Explorer la boxe, la technique et la préparation physique dans un cadre à confirmer avec l’encadrement.',
      'Explore boxing technique and conditioning with training arrangements to confirm with the organizers.',
      '了解拳击技术与体能训练，具体安排请向负责人确认。',
    ],
    activity: [
      'Technique, déplacements et préparation physique',
      'Technique, footwork and conditioning',
      '技术、步法与体能',
    ],
    kit: [
      'Confirmer l’encadrement, le niveau requis, les gants et les protections avant toute séance.',
      'Confirm supervision, required experience, gloves and protective equipment before attending.',
      '参加前请确认教练指导、经验要求、拳套及护具。',
    ],
  },
  {
    id: 'open-canvas',
    name: 'Open Canvas',
    zh: 'Open Canvas 艺术社',
    category: 'creative',
    format: 'art',
    symbol: 'OC',
    tone: 'amber',
    aliases: 'open canvas peinture dessin painting drawing art 艺术 绘画',
    description: [
      'Un espace d’intérêt pour le dessin, la peinture et l’expression visuelle.',
      'A place of shared interest in drawing, painting and visual expression.',
      '围绕绘画与视觉表达交流兴趣。',
    ],
    activity: [
      'Dessin, peinture et création visuelle',
      'Drawing, painting and visual creation',
      '素描、绘画与视觉创作',
    ],
    kit: [
      'Carnet ou idées de création ; demander quels supports et matériaux sont disponibles.',
      'A sketchbook or creative ideas; ask which supplies and materials are available.',
      '可准备画册或创作想法；请确认可用材料与工具。',
    ],
  },
  {
    id: 'singing',
    name: 'Singing Club',
    zh: '歌唱俱乐部',
    category: 'creative',
    format: 'music',
    symbol: '♪',
    tone: 'rose',
    aliases: 'singing chant chanson music musique vocal 歌唱 音乐',
    description: [
      'Partager le plaisir de chanter et découvrir différentes sensibilités musicales.',
      'Share the joy of singing and discover different musical perspectives.',
      '分享歌唱乐趣，了解不同音乐风格。',
    ],
    activity: [
      'Voix, chansons et expression musicale',
      'Voice, songs and musical expression',
      '声音、歌曲与音乐表达',
    ],
    kit: [
      'Préparer une chanson ou une idée ; confirmer les langues du répertoire et les éventuelles auditions.',
      'Bring a song or an idea; confirm repertoire languages and any auditions.',
      '可准备一首歌曲或想法；请确认曲目语言及是否需要试唱。',
    ],
  },
  {
    id: 'street-dance',
    name: 'Street Dance Club',
    zh: '街舞俱乐部',
    category: 'creative',
    format: 'dance',
    symbol: 'SD',
    tone: 'blue',
    aliases: 'street dance hip hop hip-hop danse 街舞',
    description: [
      'Explorer les danses urbaines, le rythme et la création chorégraphique.',
      'Explore street dance, rhythm and choreography.',
      '了解街舞、节奏与舞蹈编创。',
    ],
    activity: [
      'Rythme, mouvements et chorégraphie',
      'Rhythm, movement and choreography',
      '节奏、动作与编舞',
    ],
    kit: [
      'Tenue confortable, chaussures propres et eau ; confirmer les styles et niveaux proposés.',
      'Comfortable clothes, clean shoes and water; confirm styles and experience levels.',
      '舒适服装、干净的鞋和饮水；请确认舞种与经验要求。',
    ],
  },
  {
    id: 'chinese-dance',
    name: 'Chinese Dance Club',
    zh: '中国舞俱乐部',
    category: 'creative',
    format: 'dance',
    symbol: 'CD',
    tone: 'rose',
    aliases: 'chinese dance danse chinoise 中国舞 古典舞',
    description: [
      'Découvrir les expressions et les mouvements de la danse chinoise.',
      'Discover movement and expression in Chinese dance.',
      '了解中国舞的动作与表达。',
    ],
    activity: [
      'Expression, mouvements et découverte culturelle',
      'Expression, movement and cultural discovery',
      '表现力、动作与文化体验',
    ],
    kit: [
      'Tenue souple ; confirmer les chaussures, accessoires et modalités d’initiation.',
      'Flexible clothing; confirm shoes, accessories and introductory arrangements.',
      '便于活动的服装；请确认舞鞋、道具与入门安排。',
    ],
  },
  {
    id: 'fox',
    name: 'Filmmaker of Xidian (FOX)',
    zh: '西电电影创作者 FOX',
    category: 'creative',
    format: 'media',
    symbol: 'FOX',
    tone: 'blue',
    aliases:
      'fox filmmaker filmmakers film maker filmmaking cinema cinéma video vidéo montage shooting 电影 视频',
    description: [
      'Un lieu de rencontre autour de l’image, du récit et de la création de films.',
      'Connect around visual storytelling and film creation.',
      '围绕影像叙事与电影创作交流。',
    ],
    activity: ['Écriture, tournage et montage', 'Writing, filming and editing', '写作、拍摄与剪辑'],
    kit: [
      'Une idée de récit ou un portfolio si vous en avez ; confirmer le matériel et les rôles recherchés.',
      'A story idea or a portfolio if you have one; confirm equipment and available roles.',
      '可准备故事想法或已有作品；请确认设备和所需岗位。',
    ],
  },
  {
    id: 'math',
    name: 'Math Club',
    zh: '数学俱乐部',
    category: 'academic',
    format: 'math',
    symbol: '∑',
    tone: 'sage',
    aliases: 'math maths mathematics mathematiques mathématiques 数学',
    description: [
      'Partager des questions, des méthodes et le plaisir de réfléchir ensemble.',
      'Share questions, methods and the enjoyment of thinking together.',
      '分享问题与方法，体验共同思考的乐趣。',
    ],
    activity: [
      'Problèmes, échanges et entraide',
      'Problems, discussion and peer support',
      '问题探讨、交流与互助',
    ],
    kit: [
      'Une question ou un sujet d’intérêt ; confirmer les thèmes et prérequis des rencontres.',
      'A question or topic of interest; confirm meeting topics and prerequisites.',
      '可准备问题或感兴趣的主题；请确认活动主题与先修要求。',
    ],
  },
];
export const customClubsKey = 'xidian-custom-clubs-v1';
function storedClubs(): Club[] {
  try {
    const raw = JSON.parse(localStorage.getItem(customClubsKey) || '[]');
    return Array.isArray(raw)
      ? raw.filter(
          (c: any) =>
            c &&
            typeof c.id === 'string' &&
            c.id.startsWith('custom-') &&
            typeof c.name === 'string' &&
            ['sport', 'creative', 'academic'].includes(c.category) &&
            Array.isArray(c.description) &&
            Array.isArray(c.activity) &&
            Array.isArray(c.kit),
        )
      : [];
  } catch {
    return [];
  }
}
export const clubs: Club[] = [...seedClubs, ...storedClubs()];
export function reloadClubs() {
  clubs.splice(0, clubs.length, ...seedClubs, ...storedClubs());
}
export const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .trim();
export function searchClubs(query: string, category = 'all', format = 'all') {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  return clubs.filter(
    (c) =>
      (category === 'all' || c.category === category) &&
      (format === 'all' || c.format === format) &&
      words.every((w) =>
        normalize([c.name, c.zh, c.aliases, ...c.description, ...c.activity].join(' ')).includes(w),
      ),
  );
}
export type ClubDraft = {
  clubId: string;
  level: string;
  days: string[];
  message: string;
  status: 'draft' | 'contacted';
  updatedAt: string;
};
export type PersonalSession = {
  id: string;
  clubId: string;
  date: string;
  time: string;
  duration: number;
  note: string;
};
export type CampusState = {
  version: 2;
  saved: string[];
  drafts: ClubDraft[];
  sessions: PersonalSession[];
  proposals: { id: string; name: string; description: string }[];
};
export function migrateCampus(raw: unknown): CampusState {
  const s = (raw && typeof raw === 'object' ? raw : {}) as Record<string, any>;
  const known = new Set(clubs.map((c) => c.id));
  return {
    version: 2,
    saved: Array.isArray(s.saved)
      ? [...new Set<string>(s.saved.filter((id: any) => known.has(id)))]
      : [],
    drafts: Array.isArray(s.drafts)
      ? s.drafts.filter(
          (d: any) =>
            known.has(d?.clubId) &&
            ['draft', 'contacted'].includes(d.status) &&
            typeof d.message === 'string' &&
            ['beginner', 'intermediate', 'advanced'].includes(d.level) &&
            Array.isArray(d.days) &&
            d.days.every((v: any) => /^[0-6]$/.test(v)),
        )
      : [],
    sessions: Array.isArray(s.sessions)
      ? s.sessions.filter(
          (e: any) =>
            known.has(e?.clubId) &&
            typeof e.id === 'string' &&
            validDate(e.date) &&
            /^([01]\d|2[0-3]):[0-5]\d$/.test(e.time) &&
            [30, 60, 90, 120].includes(e.duration),
        )
      : [],
    proposals: Array.isArray(s.proposals)
      ? s.proposals.filter(
          (p: any) =>
            typeof p?.id === 'string' &&
            typeof p.name === 'string' &&
            typeof p.description === 'string',
        )
      : [],
  };
}
export function sessionCalendar(
  e: PersonalSession,
  name: string,
  description: string,
  now = new Date(),
) {
  const start = new Date(e.date + 'T' + e.time + ':00+08:00');
  if (
    !validDate(e.date) ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(e.time) ||
    ![30, 60, 90, 120].includes(e.duration) ||
    !Number.isFinite(+start)
  )
    throw new Error('Invalid date');
  const stamp = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '');
  const esc = (s: string) =>
    s
      .replaceAll('\\', '\\\\')
      .replaceAll('\n', '\\n')
      .replaceAll(',', '\\,')
      .replaceAll(';', '\\;');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//XidianHub//Personal club plans//EN',
    'BEGIN:VEVENT',
    'UID:' + e.id + '@xidian-campus.example',
    'DTSTAMP:' + stamp(now),
    'DTSTART:' + stamp(start),
    'DTEND:' + stamp(new Date(+start + e.duration * 60000)),
    'SUMMARY:' + esc(name),
    'DESCRIPTION:' + esc(description + (typeof e.note === 'string' && e.note ? '\n' + e.note : '')),
    'STATUS:TENTATIVE',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    'DESCRIPTION:' + esc(name),
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}
