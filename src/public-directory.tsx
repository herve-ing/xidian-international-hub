import { localize } from './i18n';
import { SupervisorCV } from './supervisor-cv';
import React, { useState } from 'react';
import { supervisors, type Supervisor } from './supervisors';
import { content } from './i18n';
import { ClubDialog } from './club-dialog';
import { currentAccount } from './accounts';
import { startThread } from './repositories/application-repository';
export default function PublicDirectory({ lang }: { lang: string }) {
  const c = (fr: string, en: string) => content(lang, fr, en),
    [query, setQuery] = useState(
      () => new URLSearchParams(window.location.hash.split('?')[1]).get('q') || '',
    ),
    [school, setSchool] = useState(''),
    [level, setLevel] = useState(''),
    [unknown, setUnknown] = useState(true),
    [page, setPage] = useState(1),
    [selected, setSelected] = useState<Supervisor | null>(null),
    [profileTab, setProfileTab] = useState('cv'),
    [compose, setCompose] = useState<Supervisor | null>(null),
    [notice, setNotice] = useState(''),
    [copied, setCopied] = useState(false);
  const emailText = selected
    ? `Subject: Prospective ${level || 'Master / PhD'} student — Research supervision inquiry\n\nDear Professor ${selected.name},\n\nMy name is [your name], and I am studying [degree / major] at [university]. I am interested in applying to Xidian University for [intake].\n\nMy proposed research concerns [topic], which relates to your work on ${selected.research[0] || '[research area from the official profile]'}. Are you accepting international students? Could you confirm the language of supervision and requirements?\n\nI can provide my CV, transcripts and research proposal on request.\n\nThank you for your time.\nBest regards,\n[your name]\n[email]`
    : '';
  const schools = [...new Set(supervisors.map((s) => s.school))].sort();
  const matches = supervisors.filter(
    (s) =>
      (!school || s.school === school) &&
      (!query ||
        [
          s.name,
          s.zh,
          s.school,
          s.schoolFr,
          localize(lang, s.school),
          ...s.research,
          ...s.researchFr,
          ...s.research.map((value) => localize(lang, value)),
        ]
          .join(' ')
          .toLocaleLowerCase()
          .includes(query.toLocaleLowerCase())) &&
      (!level || s.levels.includes(level) || (unknown && !s.levels.length)),
  );
  const pages = Math.max(1, Math.ceil(matches.length / 18));
  const current = Math.min(page, pages);
  function contact(s: Supervisor) {
    const a = currentAccount();
    if (!a) {
      sessionStorage.setItem('xidian-supervisor-intent', s.id);
      window.location.hash = '/apply';
      return;
    }
    if (a.role === 'professor') {
      window.location.hash = '/faculty';
      return;
    }
    setSelected(null);
    setCompose(s);
  }
  return (
    <section className="public-directory public-container">
      <header className="public-page-title">
        <span className="public-kicker">
          {c('RECHERCHE & RENCONTRES', 'RESEARCH & CONNECTIONS')}
        </span>
        <h1>{c('Trouvez votre superviseur.', 'Find your supervisor.')}</h1>
        <p>
          {c(
            'Explorez les profils publics. Créez un compte candidat seulement lorsque vous souhaitez commencer un échange.',
            'Explore public profiles. Create an applicant account when you are ready to start a conversation.',
          )}
        </p>
      </header>
      <div className="directory-search-panel">
        <label>
          <span>{c('Nom ou domaine de recherche', 'Name or research area')}</span>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder={c('Nom, école, mot-clé…', 'Name, school, keyword…')}
          />
        </label>
        <label>
          <span>{c('École', 'School')}</span>
          <select
            value={school}
            onChange={(e) => {
              setSchool(e.target.value);
              setPage(1);
            }}
          >
            <option value="">{c('Toutes les écoles', 'All schools')}</option>
            {schools.map((s) => (
              <option key={s} value={s}>
                {localize(lang, s)}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{c('Niveau recherché', 'Degree')}</span>
          <select
            value={level}
            onChange={(e) => {
              setLevel(e.target.value);
              setPage(1);
            }}
          >
            <option value="">{c('Master et doctorat', 'Master and PhD')}</option>
            <option value="Master">{localize(lang, 'Master')}</option>
            <option value="PhD">{localize(lang, 'PhD')}</option>
          </select>
        </label>
      </div>
      <div className="directory-result-bar">
        <span role="status">
          {matches.length}{' '}
          {matches.length === 1 ? c('profil', 'profile') : c('profils', 'profiles')}
        </span>
        <label>
          <input
            type="checkbox"
            checked={unknown}
            onChange={(e) => {
              setUnknown(e.target.checked);
              setPage(1);
            }}
          />
          {c('Inclure les niveaux non renseignés', 'Include unspecified degree levels')}
        </label>
        <button
          onClick={() => {
            setQuery('');
            setSchool('');
            setLevel('');
            setUnknown(true);
            setPage(1);
          }}
        >
          {c('Réinitialiser', 'Reset')}
        </button>
      </div>
      <p className="public-small-note">
        {c(
          'Les fiches SIE sont souvent des documents en images. Un niveau non renseigné ne constitue pas une correspondance confirmée. Les places et langues de supervision restent à vérifier.',
          'Many SIE profiles are image documents. An unspecified level is not a confirmed match. Supervision availability and languages must be verified.',
        )}
      </p>
      <div className="public-faculty-grid">
        {matches.slice((current - 1) * 18, current * 18).map((s) => (
          <article className="public-faculty-card" key={s.id}>
            {s.profileImages?.[0] && (
              <button
                className="faculty-cv-preview"
                aria-label={c('Lire le CV complet de ', 'Read the full CV of ') + s.name}
                onClick={() => {
                  setProfileTab('cv');
                  setSelected(s);
                }}
              >
                <img
                  src={s.profileImages[0]}
                  alt={c('Aperçu de la fiche SIE de ', 'SIE profile preview for ') + s.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <span>{c('CV & fiche officielle', 'CV & official profile')} </span>
              </button>
            )}
            <div className="faculty-card-top">
              <span className="faculty-monogram" style={{ background: s.color }}>
                {s.initials || s.name.slice(0, 2)}
              </span>
              <span className="faculty-degree">
                {s.levels.join(' / ') || c('Niveau à confirmer', 'Degree to confirm')}
              </span>
            </div>
            <p className="faculty-school">{c(s.schoolFr, s.school)}</p>
            <h2>{s.name}</h2>
            <span className="faculty-name-zh" lang="zh">
              {s.zh}
            </span>
            <p>
              {s.research.map((value, i) => c(s.researchFr[i] || value, value)).join(' · ') ||
                c(
                  'Consulter le document officiel pour les axes de recherche.',
                  'See the official document for research areas.',
                )}
            </p>
            <div className="faculty-card-actions">
              <button
                onClick={() => {
                  setCopied(false);
                  setProfileTab('cv');
                  setSelected(s);
                }}
              >
                {c('Lire le CV complet', 'Read the full CV')}
              </button>
              <button
                onClick={() => {
                  setCopied(false);
                  setProfileTab('contact');
                  setSelected(s);
                }}
              >
                {c('Fiche de contact', 'Contact card')}
              </button>
            </div>
          </article>
        ))}
      </div>
      {!matches.length && (
        <div className="journal-empty">
          {c(
            'Aucun profil trouvé. Essayez un autre nom ou incluez les niveaux non renseignés.',
            'No profiles found. Try another name or include unspecified levels.',
          )}
        </div>
      )}
      <nav
        className="directory-pagination"
        aria-label={c('Pagination des superviseurs', 'Supervisor pagination')}
      >
        <button
          disabled={current === 1}
          onClick={() => {
            setPage(current - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          {c('Précédent', 'Previous')}
        </button>
        <span>
          {current} / {pages}
        </span>
        <button
          disabled={current === pages}
          onClick={() => {
            setPage(current + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          {c('Suivant', 'Next')}
        </button>
      </nav>
      {selected && (
        <ClubDialog title={selected.name} onClose={() => setSelected(null)}>
          <p>{[selected.zh, c(selected.schoolFr, selected.school)].filter(Boolean).join(' · ')}</p>
          <p>
            {selected.title ||
              c(
                'Titre à vérifier dans le document officiel.',
                'See the official document for the academic title.',
              )}
          </p>
          <div
            className="club-activity-tabs"
            role="tablist"
            aria-label={c('Fiche du superviseur', 'Supervisor profile')}
          >
            <button
              role="tab"
              id="supervisor-cv-tab"
              aria-controls="supervisor-cv-panel"
              aria-selected={profileTab === 'cv'}
              onClick={() => setProfileTab('cv')}
            >
              {c('CV complet', 'Full CV')}
            </button>
            <button
              role="tab"
              id="supervisor-contact-tab"
              aria-controls="supervisor-contact-panel"
              aria-selected={profileTab === 'contact'}
              onClick={() => setProfileTab('contact')}
            >
              {c('Contact & email', 'Contact & email')}
            </button>
          </div>
          {profileTab === 'cv' ? (
            <div id="supervisor-cv-panel" role="tabpanel" aria-labelledby="supervisor-cv-tab">
              <SupervisorCV key={selected.id} supervisor={selected} lang={lang} />
            </div>
          ) : (
            <div
              id="supervisor-contact-panel"
              role="tabpanel"
              aria-labelledby="supervisor-contact-tab"
            >
              <section className="supervisor-contact-card">
                <a
                  className="button secondary"
                  href={selected.source}
                  target="_blank"
                  rel="noreferrer"
                >
                  {c('Ouvrir le profil officiel', 'Open official profile')}
                </a>
                <h3>
                  {c('Coordonnées et premier contact', 'Contact details and first introduction')}
                </h3>
                <p>
                  {c('Niveau', 'Degree')} :{' '}
                  {selected.levels.join(' / ') || c('À confirmer', 'To confirm')}
                </p>
                <p>
                  {selected.research
                    .map((value, i) => c(selected.researchFr[i] || value, value))
                    .join(' · ')}
                </p>
                {selected.email ? (
                  <p>
                    {c('Email publié', 'Published email')} :{' '}
                    <a href={'mailto:' + selected.email}>{selected.email}</a>
                  </p>
                ) : (
                  <p>
                    {c(
                      'Email non retranscrit : consultez l’onglet CV complet ou le profil officiel. Aucune adresse n’est inventée.',
                      'Email not transcribed: consult the Full CV tab or official profile. No address is invented.',
                    )}
                  </p>
                )}
                <h3>{c('Modèle d’email à personnaliser', 'Email template to personalize')}</h3>
                <p>
                  {c(
                    'Modèle en anglais : remplacez les champs entre crochets.',
                    'English template: replace the bracketed fields.',
                  )}
                </p>
                <textarea
                  aria-label={c('Modèle d’email', 'Email template')}
                  readOnly
                  value={emailText}
                  rows={10}
                />
                <div className="faculty-card-actions">
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(emailText);
                        setCopied(true);
                      } catch {
                        setNotice(
                          c(
                            'Copie indisponible : sélectionnez le texte ou téléchargez le modèle.',
                            'Clipboard unavailable: select the text or download the template.',
                          ),
                        );
                      }
                    }}
                  >
                    {copied ? c('Copié', 'Copied') : c('Copier le modèle', 'Copy template')}
                  </button>
                  <a
                    download="supervisor-email.txt"
                    href={'data:text/plain;charset=utf-8,' + encodeURIComponent(emailText)}
                  >
                    {c('Télécharger le modèle', 'Download template')}
                  </a>
                </div>
                <button className="button primary" onClick={() => contact(selected)}>
                  {c('Échanger dans le Hub', 'Chat in the Hub')}
                </button>
                <p>
                  {c(
                    'La fiche et les coordonnées sont publiques. Un compte est demandé uniquement pour la conversation locale dans le Hub.',
                    'The contact card is public. Only the local Hub conversation requires an account.',
                  )}
                </p>
              </section>
              <p className="info-box">
                {c(
                  'Le Hub est indépendant. Un message enregistré dans cette démonstration n’est pas transmis à l’université. Utilisez les coordonnées officielles pour un contact réel.',
                  'The Hub is independent. Messages saved in this demo are not delivered to the university. Use official contact details for real correspondence.',
                )}
              </p>
            </div>
          )}
          <button className="button primary" onClick={() => contact(selected)}>
            {c('Commencer un échange dans le Hub', 'Start a conversation in the Hub')}
          </button>
        </ClubDialog>
      )}
      {compose && (
        <ClubDialog
          title={c('Écrire à ', 'Write to ') + compose.name}
          onClose={() => setCompose(null)}
        >
          <p className="info-box">
            {c(
              'Démonstration locale : le message reste sur ce navigateur. Aucun email ne sera envoyé.',
              'Local demo: the message stays in this browser. No email will be sent.',
            )}
          </p>
          <form
            className="modal-form"
            onSubmit={(e) => {
              e.preventDefault();
              const d = new FormData(e.currentTarget);
              try {
                startThread(compose.id, String(d.get('subject')), String(d.get('body')));
                setCompose(null);
                window.location.hash = '/applications?tab=messages';
              } catch {
                setNotice(c('Vérifiez le sujet et le message.', 'Check the subject and message.'));
              }
            }}
          >
            <label className="field">
              <span>{c('Sujet', 'Subject')}</span>
              <input
                required
                name="subject"
                maxLength={150}
                defaultValue={c(
                  'Projet de recherche · candidature Xidian',
                  'Research project · Xidian application',
                )}
              />
            </label>
            <label className="field">
              <span>
                {c(
                  'Présentez votre parcours et votre projet',
                  'Introduce your background and project',
                )}
              </span>
              <textarea required name="body" maxLength={4000} rows={8} />
            </label>
            {notice && <p role="alert">{localize(lang, notice)}</p>}
            <button className="button primary">
              {c('Enregistrer le message dans le Hub', 'Save message in the Hub')}
            </button>
          </form>
        </ClubDialog>
      )}
    </section>
  );
}
