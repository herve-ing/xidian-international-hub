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
    [compose, setCompose] = useState<Supervisor | null>(null),
    [notice, setNotice] = useState('');
  const schools = [...new Set(supervisors.map((s) => s.school))].sort();
  const matches = supervisors.filter(
    (s) =>
      (!school || s.school === school) &&
      (!query ||
        [s.name, s.zh, s.school, s.schoolFr, ...s.research, ...s.researchFr]
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
              <option key={s}>{s}</option>
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
            <option>Master</option>
            <option>PhD</option>
          </select>
        </label>
      </div>
      <div className="directory-result-bar">
        <span role="status">
          {matches.length} {c('profils', 'profiles')}
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
            <div className="faculty-card-top">
              <span className="faculty-monogram" style={{ background: s.color }}>
                {s.initials || s.name.slice(0, 2)}
              </span>
              <span className="faculty-degree">
                {s.levels.join(' / ') || c('Niveau à confirmer', 'Degree to confirm')}
              </span>
            </div>
            <p className="faculty-school">{lang === 'fr' ? s.schoolFr : s.school}</p>
            <h2>{s.name}</h2>
            <span className="faculty-name-zh" lang="zh">
              {s.zh}
            </span>
            <p>
              {(lang === 'fr' ? s.researchFr : s.research).join(' · ') ||
                c(
                  'Consulter le document officiel pour les axes de recherche.',
                  'See the official document for research areas.',
                )}
            </p>
            <div className="faculty-card-actions">
              <button onClick={() => setSelected(s)}>
                {c('Voir le profil', 'View profile')} ↗
              </button>
              <button onClick={() => contact(s)}>{c('Contacter', 'Contact')} →</button>
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
          <p>
            {selected.zh} · {lang === 'fr' ? selected.schoolFr : selected.school}
          </p>
          <p>
            {selected.title ||
              c(
                'Titre à vérifier dans le document officiel.',
                'See the official document for the academic title.',
              )}
          </p>
          <a className="button secondary" href={selected.source} target="_blank" rel="noreferrer">
            {c('Ouvrir le profil officiel', 'Open official profile')} ↗
          </a>
          {selected.email && (
            <p>
              {c('Email publié', 'Published email')} :{' '}
              <a href={'mailto:' + selected.email}>{selected.email}</a>
            </p>
          )}
          <p className="info-box">
            {c(
              'Le Hub est indépendant. Un message enregistré dans cette démonstration n’est pas transmis à l’université. Utilisez les coordonnées officielles pour un contact réel.',
              'The Hub is independent. Messages saved in this demo are not delivered to the university. Use official contact details for real correspondence.',
            )}
          </p>
          {selected.profileImages?.map((src, i) => (
            <img
              className="official-profile-document"
              key={src}
              src={src}
              alt={
                c(
                  'Document officiel du superviseur, page ',
                  'Official supervisor document, page ',
                ) +
                (i + 1)
              }
              loading="lazy"
            />
          ))}
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
            {notice && <p role="alert">{notice}</p>}
            <button className="button primary">
              {c('Enregistrer le message dans le Hub', 'Save message in the Hub')}
            </button>
          </form>
        </ClubDialog>
      )}
    </section>
  );
}
