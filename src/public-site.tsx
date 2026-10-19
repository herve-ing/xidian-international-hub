import React, { useEffect, useState } from 'react';
import { content, languages } from './i18n';
import { currentAccount, signOut, type Account } from './accounts';
import { usePathname } from './navigation';
import AccountPortal from './account-portal';
import Hub from './hub';
import CampusLife from './campus';
import PublicDirectory from './public-directory';
import ApplicantAccess from './applicant-access';
import ApplicationWorkspace, { FacultyWorkspace } from './application-workspace';
import { admissionsSteps, officialPortal, researchAreas } from './admissions-data';
import './public-site.css';
const bits = Array.from({ length: 100 }, (_, i) => ((i * 37 + 19) % 11) % 2).join('');
function BinaryRibbon({
  paused,
  onToggle,
  lang,
}: {
  paused: boolean;
  onToggle: () => void;
  lang: string;
}) {
  const c = (fr: string, en: string) => content(lang, fr, en);
  return (
    <div className="binary-ribbon" data-paused={paused}>
      <div aria-hidden="true" className="binary-track">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i}>
            {bits} <b> XIDIAN / CONNECT · CREATE · BELONG </b> {bits}{' '}
          </span>
        ))}
      </div>
      <button
        aria-pressed={paused}
        onClick={onToggle}
        aria-label={
          paused
            ? c('Reprendre les animations', 'Resume animations')
            : c('Mettre les animations en pause', 'Pause animations')
        }
      >
        {paused ? '▶' : 'Ⅱ'}
      </button>
    </div>
  );
}
function Landing({ lang }: { lang: string }) {
  const c = (fr: string, en: string) => content(lang, fr, en),
    [night, setNight] = useState(false);
  return (
    <>
      <section className="university-hero">
        <img
          className="university-hero-image"
          key={String(night)}
          src={night ? './media/campus-evening.jpg' : './media/campus-aerial.jpg'}
          alt={c(
            'Vue du campus de Xidian extraite de la présentation fournie',
            'Xidian campus view extracted from the supplied presentation',
          )}
        />
        <div className="hero-shade" />
        <div className="university-hero-copy">
          <span className="public-kicker">XI’AN, CHINA · XIDIAN INTERNATIONAL HUB</span>
          <h1>{c('Votre avenir commence à Xidian.', 'Your future begins at Xidian.')}</h1>
          <p>
            {c(
              'Des idées qui voyagent. Des rencontres qui comptent. Un point de départ pour votre parcours international.',
              'Ideas without borders. Connections that matter. Your starting point for an international journey.',
            )}
          </p>
          <div className="hero-actions">
            <a className="public-button light" href="#/supervisors">
              {c('Trouver un superviseur', 'Find a supervisor')} ↗
            </a>
            <a className="public-button outline-light" href="#/admissions">
              {c('Explorer les admissions', 'Explore admissions')} →
            </a>
          </div>
        </div>
        <div className="hero-bottom">
          <span>
            {c(
              'Depuis 1931 · l’information ouvre de nouveaux horizons',
              'Since 1931 · new horizons through information',
            )}
          </span>
          <div className="hero-image-switch" aria-label={c('Vue du campus', 'Campus view')}>
            <button aria-pressed={!night} onClick={() => setNight(false)}>
              {c('Le jour', 'By day')}
            </button>
            <button aria-pressed={night} onClick={() => setNight(true)}>
              {c('À la nuit tombée', 'After dark')}
            </button>
          </div>
        </div>
      </section>
      <section className="audience-paths public-container">
        <a href="#/admissions">
          <small>{c('FUTURS ÉTUDIANTS', 'PROSPECTIVE STUDENTS')}</small>
          <h2>{c('Imaginez la suite.', 'Imagine what’s next.')}</h2>
          <p>
            {c(
              'Programmes, documents et parcours de candidature.',
              'Programmes, documents and your application journey.',
            )}
          </p>
          <span>↗</span>
        </a>
        <a href="#/supervisors">
          <small>{c('RECHERCHE', 'RESEARCH')}</small>
          <h2>{c('Trouvez votre équipe.', 'Find your research community.')}</h2>
          <p>
            {c(
              'Un annuaire public pour préparer votre premier contact.',
              'A public directory to prepare your first connection.',
            )}
          </p>
          <span>↗</span>
        </a>
        <a href="#/clubs">
          <small>{c('VIE DE CAMPUS', 'CAMPUS LIFE')}</small>
          <h2>{c('Trouvez votre place.', 'Find where you belong.')}</h2>
          <p>
            {c(
              'Clubs, créations et rencontres internationales.',
              'Clubs, creativity and international connections.',
            )}
          </p>
          <span>↗</span>
        </a>
      </section>
      <section className="public-research public-container">
        <div className="public-section-title">
          <span className="public-kicker">
            {c('UNE UNIVERSITÉ TOURNÉE VERS DEMAIN', 'A UNIVERSITY LOOKING AHEAD')}
          </span>
          <h2>
            {c(
              'Connecter les savoirs.\nOuvrir les possibles.',
              'Connecting knowledge.\nOpening possibilities.',
            )}
          </h2>
          <p>
            {c(
              'Télécommunications, informatique, électronique : découvrez les domaines présentés dans les documents de Xidian et les équipes qui les font avancer.',
              'Communications, computing and electronics: explore the fields presented in Xidian’s documents and the people moving them forward.',
            )}
          </p>
        </div>
        <div className="research-feature">
          <img
            src="./media/research-lab.jpg"
            alt={c(
              'Équipement de recherche à Xidian, présentation fournie',
              'Research equipment at Xidian, supplied presentation',
            )}
            loading="lazy"
          />
          <div>
            <span className="public-kicker">
              {c('VOTRE PROJET, LE BON ENVIRONNEMENT', 'YOUR PROJECT, THE RIGHT ENVIRONMENT')}
            </span>
            <h3>
              {c('La recherche commence par une rencontre.', 'Research begins with a connection.')}
            </h3>
            <div className="research-links">
              {researchAreas.map(([en, fr, q]) => (
                <a href={'#/supervisors?q=' + encodeURIComponent(q)} key={en}>
                  {lang === 'fr' ? fr : en}
                  <span>↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="public-journey">
        <div className="public-container">
          <div className="public-section-title">
            <span className="public-kicker">
              {c('DE L’ENVIE AU PROJET', 'FROM AMBITION TO APPLICATION')}
            </span>
            <h2>
              {c(
                'Votre prochaine étape,\nen toute clarté.',
                'Your next step,\nwith a clearer view.',
              )}
            </h2>
          </div>
          <div className="journey-preview">
            {admissionsSteps.slice(1).map((s, i) => (
              <article key={s.id}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <h3>{lang === 'fr' ? s.fr : s.en}</h3>
                <p>{lang === 'fr' ? s.descriptionFr : s.descriptionEn}</p>
              </article>
            ))}
          </div>
          <div className="journey-bottom">
            <p>
              {c(
                'Inspiré du parcours présenté par Xidian. Le dépôt officiel reste sur son portail.',
                'Based on the journey presented by Xidian. Official submission remains in its portal.',
              )}
            </p>
            <a className="public-button" href="#/apply">
              {c('Préparer mon dossier', 'Prepare my application')} →
            </a>
          </div>
        </div>
      </section>
      <section className="public-community public-container">
        <img
          src="./media/international-life.jpg"
          alt={c(
            'Étudiants internationaux lors d’une activité à Xidian, présentation fournie',
            'International students taking part in an activity at Xidian, supplied presentation',
          )}
          loading="lazy"
        />
        <div>
          <span className="public-kicker">{c('PLUS QU’UN CAMPUS', 'MORE THAN A CAMPUS')}</span>
          <h2>
            {c(
              'Loin de chez vous.\nAu cœur d’une communauté.',
              'Far from home.\nPart of a community.',
            )}
          </h2>
          <p>
            {c(
              'Du premier échange à votre premier club, construisez des liens qui accompagneront votre parcours à Xi’an.',
              'From your first conversation to your first club, build connections for your journey in Xi’an.',
            )}
          </p>
          <a className="public-button" href="#/clubs">
            {c('Vivre le campus', 'Explore campus life')} ↗
          </a>
        </div>
      </section>
    </>
  );
}
function Admissions({ lang }: { lang: string }) {
  const c = (fr: string, en: string) => content(lang, fr, en);
  return (
    <section className="admissions-public public-container">
      <header className="public-page-title">
        <span className="public-kicker">
          {c('ADMISSIONS INTERNATIONALES', 'INTERNATIONAL ADMISSIONS')}
        </span>
        <h1>{c('Préparez la suite de votre parcours.', 'Prepare your next chapter.')}</h1>
        <p>
          {c(
            'Les repères des guides Master et Doctorat 2026, réunis pour vous aider à préparer votre candidature.',
            'Key information from the 2026 Master and Doctoral guides, brought together to help you prepare.',
          )}
        </p>
      </header>
      <div className="admissions-alert">
        <strong>
          {c('Guides 2026 · calendrier passé', '2026 guides · past application cycle')}
        </strong>
        <p>
          {c(
            'Les trois dates limites indiquées sont le 1er mars, le 17 mai et le 1er juillet 2026. Elles sont passées. Aucune ouverture de candidature 2027 n’est annoncée ici : vérifiez le prochain calendrier auprès de Xidian.',
            'The three listed deadlines are 1 March, 17 May and 1 July 2026. They have passed. No 2027 application opening is announced here: confirm the next schedule with Xidian.',
          )}
        </p>
      </div>
      <div className="programme-grid">
        {[
          ['Master', '3', '30 000', 'master-admissions-2026.pdf'],
          ['PhD', '4', '40 000', 'doctoral-admissions-2026.pdf'],
        ].map(([level, years, tuition, file]) => (
          <article key={level}>
            <span className="public-kicker">
              {c('GUIDE FOURNI · ÉDITION 2026', 'SUPPLIED GUIDE · 2026 EDITION')}
            </span>
            <h2>
              {level === 'PhD' ? c('Doctorat', 'Doctoral study') : c('Master', 'Master’s study')}
            </h2>
            <p>
              <strong>{years}</strong> {c('ans · durée indiquée', 'years · listed duration')}
            </p>
            <p>
              <strong>{tuition}</strong> RMB / {c('année universitaire', 'academic year')}
            </p>
            <small>
              {c(
                'Frais et conditions 2026, à vérifier pour le prochain cycle.',
                '2026 fees and conditions; verify for the next cycle.',
              )}
            </small>
            <a className="public-button" href={'./media/' + file} target="_blank" rel="noreferrer">
              {c('Consulter le guide PDF', 'Read the PDF guide')} ↗
            </a>
          </article>
        ))}
      </div>
      <div className="public-section-title">
        <span className="public-kicker">{c('LE PARCOURS', 'THE JOURNEY')}</span>
        <h2>{c('Une étape après l’autre.', 'One step at a time.')}</h2>
      </div>
      <div className="admission-steps">
        {admissionsSteps.map((s, i) => (
          <article key={s.id}>
            <span>{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h3>{lang === 'fr' ? s.fr : s.en}</h3>
              <p>{lang === 'fr' ? s.descriptionFr : s.descriptionEn}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="admissions-actions">
        <div>
          <h2>{c('Commencez par votre préparation.', 'Start with your preparation.')}</h2>
          <p>
            {c(
              'Le Hub n’est ni un intermédiaire d’admission ni le portail officiel. Les guides fournis précisent que Xidian accepte les candidatures directement des étudiants.',
              'The Hub is neither an admissions agent nor the official portal. The supplied guides state that Xidian accepts applications directly from students.',
            )}
          </p>
        </div>
        <a className="public-button" href="#/apply">
          {c('Créer mon espace candidat', 'Create my applicant space')} →
        </a>
        <a
          className="public-button secondary"
          href={officialPortal}
          target="_blank"
          rel="noreferrer"
        >
          {c('Aller au portail officiel', 'Go to the official portal')} ↗
        </a>
      </div>
      <p className="public-small-note">
        {c(
          'Source : guides Master/Doctorat 2026 fournis et présentation Xidian, diapositive « Application Process ». Les exigences peuvent changer. Contact officiel : sie@xidian.edu.cn.',
          'Sources: supplied 2026 Master/Doctoral guides and Xidian’s “Application Process” slide. Requirements may change. Official contact: sie@xidian.edu.cn.',
        )}
      </p>
    </section>
  );
}
export default function PublicSite() {
  const path = usePathname(),
    [account, setAccount] = useState<Account | null>(currentAccount),
    [lang, setLang] = useState(() => {
      try {
        return localStorage.getItem('xidian-locale') || 'fr';
      } catch {
        return 'fr';
      }
    }),
    [menu, setMenu] = useState(false),
    [paused, setPaused] = useState(false);
  const c = (fr: string, en: string) => content(lang, fr, en);
  useEffect(() => {
    const refresh = () => setAccount(currentAccount());
    window.addEventListener('xidian-auth', refresh);
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('xidian-auth', refresh);
      window.removeEventListener('storage', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = ['ar', 'ary', 'ur'].includes(lang) ? 'rtl' : 'ltr';
    localStorage.setItem('xidian-locale', lang);
  }, [lang]);
  useEffect(() => setMenu(false), [path]);
  function logout() {
    signOut();
    setAccount(null);
    window.location.hash = '/';
  }
  const privatePaths = [
    '/workspace',
    '/visas',
    '/guide',
    '/chat',
    '/club-office',
    '/admin',
    '/settings',
  ];
  if (privatePaths.includes(path) && account && account.role !== 'applicant')
    return <Hub account={account} onSignOut={logout} onAccountChange={setAccount} />;
  if (path === '/login' || (privatePaths.includes(path) && !account)) return <AccountPortal />;
  const isPublic = [
    '/',
    '/supervisors',
    '/admissions',
    '/clubs',
    '/campus',
    '/apply',
    '/applications',
    '/faculty',
  ].includes(path);
  return (
    <div className="university-site" data-motion={paused ? 'paused' : 'active'}>
      <a className="skip-link" href="#public-main">
        {c('Aller au contenu', 'Skip to content')}
      </a>
      <div className="public-utility">
        <span>
          {c(
            'Initiative étudiante indépendante · Xi’an, Chine',
            'Independent student initiative · Xi’an, China',
          )}
        </span>
        <div>
          <a href="https://sie.xidian.edu.cn/" target="_blank" rel="noreferrer">
            {c('Xidian SIE officiel', 'Official Xidian SIE')} ↗
          </a>
          <select
            aria-label={c('Langue', 'Language')}
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            {languages.map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {lang !== 'fr' && lang !== 'en' && (
        <p className="public-language-note" role="status">
          New admissions and applicant pages are currently available in English and French. Other
          sections retain their existing translations.
        </p>
      )}
      <header className="public-header">
        <a href="#/" className="public-logo" aria-label="Xidian International Hub">
          <img src="./media/hub-logo.jpg" alt="Xidian International Hub" />
        </a>
        <button className="public-menu-button" aria-expanded={menu} onClick={() => setMenu(!menu)}>
          {c('Menu', 'Menu')} {menu ? '−' : '+'}
        </button>
        <nav
          className={menu ? 'is-open' : ''}
          aria-label={c('Navigation publique', 'Public navigation')}
        >
          {[
            ['/', c('Découvrir', 'Discover')],
            ['/admissions', c('Admissions', 'Admissions')],
            ['/supervisors', c('Superviseurs', 'Supervisors')],
            ['/clubs', c('Vie de campus', 'Campus life')],
          ].map(([href, label]) => (
            <a href={'#' + href} key={href} aria-current={path === href ? 'page' : undefined}>
              {label}
            </a>
          ))}
          {account?.role === 'professor' && (
            <a href="#/faculty">{c('Espace superviseur', 'Supervisor space')}</a>
          )}
          <a
            className="public-account-link"
            href={
              account
                ? account.role === 'applicant'
                  ? '#/applications'
                  : '#/workspace'
                : '#/apply'
            }
          >
            {account ? c('Mon espace', 'My space') : c('Candidater', 'Apply')} ↗
          </a>
          {account ? (
            <button className="public-login" onClick={logout}>
              {c('Déconnexion', 'Sign out')}
            </button>
          ) : (
            <a className="public-login" href="#/login">
              {c('Connexion', 'Sign in')}
            </a>
          )}
        </nav>
      </header>
      <BinaryRibbon lang={lang} paused={paused} onToggle={() => setPaused(!paused)} />
      <main id="public-main">
        {path === '/' && <Landing lang={lang} />}
        {path === '/supervisors' && <PublicDirectory lang={lang} />}{' '}
        {path === '/admissions' && <Admissions lang={lang} />}
        {['/clubs', '/campus'].includes(path) && (
          <div className="public-container public-campus">
            <CampusLife lang={lang} workspaceId={account?.id || 'public-discovery'} />
          </div>
        )}
        {['/apply', '/applications'].includes(path) &&
          (account ? (
            account.role === 'professor' ? (
              <FacultyWorkspace key={account.id} lang={lang} account={account} />
            ) : (
              <ApplicationWorkspace key={account.id} lang={lang} account={account} />
            )
          ) : (
            <ApplicantAccess lang={lang} />
          ))}
        {path === '/faculty' &&
          (account?.role === 'professor' ? (
            <FacultyWorkspace key={account.id} lang={lang} account={account} />
          ) : (
            <section className="public-container public-page-title">
              <h1>{c('Espace réservé aux superviseurs.', 'Supervisor access required.')}</h1>
              <a className="public-button" href="#/login">
                {c('Connexion professeur', 'Professor sign in')}
              </a>
            </section>
          ))}
        {(!isPublic || (privatePaths.includes(path) && account?.role === 'applicant')) && (
          <section className="public-container public-page-title">
            <h1>{c('Retrouvez votre espace candidat.', 'Open your applicant space.')}</h1>
            <a className="public-button" href="#/applications">
              {c('Mon dossier', 'My application')} →
            </a>
          </section>
        )}
      </main>
      <footer className="public-footer">
        <div className="public-container">
          <div className="footer-top">
            <div>
              <span className="footer-wordmark">
                XIDIAN<span>INTERNATIONAL HUB</span>
              </span>
              <p>
                {c(
                  'Un point de départ.\nTout un monde de possibilités.',
                  'One starting point.\nA world of possibilities.',
                )}
              </p>
            </div>
            <div>
              <h3>{c('Explorer', 'Explore')}</h3>
              <a href="#/supervisors">{c('Trouver un superviseur', 'Find a supervisor')}</a>
              <a href="#/admissions">{c('Préparer ma candidature', 'Prepare my application')}</a>
              <a href="#/clubs">{c('Rejoindre la communauté', 'Join the community')}</a>
            </div>
            <div>
              <h3>{c('Mes espaces', 'My spaces')}</h3>
              <a href="#/applications">{c('Compte candidat', 'Applicant account')}</a>
              <a href="#/login">{c('Étudiants et responsables', 'Students and club leaders')}</a>
              <a href="#/faculty">{c('Superviseurs', 'Supervisors')}</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Xidian International Hub</span>
            <p>
              {c(
                'Prototype indépendant, sans affiliation officielle. Données locales au navigateur. Les décisions d’admission appartiennent exclusivement à Xidian.',
                'Independent prototype, not officially affiliated. Data is local to the browser. Admissions decisions belong exclusively to Xidian.',
              )}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
