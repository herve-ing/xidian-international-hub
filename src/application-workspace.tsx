import { intlLocale } from './locale-config';
import { localize } from './i18n';
import React, { useEffect, useState } from 'react';
import { content } from './i18n';
import type { Account } from './accounts';
import { supervisors } from './supervisors';
import { admissionsSteps, officialPortal } from './admissions-data';
import {
  myApplication,
  saveApplication,
  ownThreads,
  startThread,
  replyToThread,
  documentChecklist,
  facultyLink,
  linkFacultyProfile,
  applicantOverview,
  type ApplicationRecord,
  type SupervisorThread,
  type ApplicationStage,
} from './repositories/application-repository';
import { ClubDialog } from './club-dialog';
function localDate(at: string, lang: string) {
  return new Intl.DateTimeFormat(intlLocale(lang), {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Shanghai',
  }).format(new Date(at));
}
export function ThreadInbox({ lang, account }: { lang: string; account: Account }) {
  const c = (fr: string, en: string) => content(lang, fr, en),
    [threads, setThreads] = useState<SupervisorThread[]>(ownThreads),
    [selectedId, setSelectedId] = useState(''),
    [error, setError] = useState('');
  const selected = threads.find((t) => t.id === selectedId) || threads[0];
  function refresh() {
    try {
      setThreads(ownThreads());
    } catch {
      setThreads([]);
    }
  }
  useEffect(() => {
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, [account.id]);
  return (
    <section className="inbox-panel">
      <div className="section-heading">
        <h2>{c('Mes échanges', 'My conversations')}</h2>
        <button className="text-button" onClick={refresh}>
          {c('Actualiser', 'Refresh')}
        </button>
      </div>
      <p className="public-small-note">
        {c(
          'Messages locaux à ce navigateur. Aucun message n’est transmis à un superviseur réel. Les horaires utilisent l’heure de Pékin.',
          'Messages are local to this browser. No message is delivered to a real supervisor. Times use Beijing time.',
        )}
      </p>
      {!threads.length ? (
        <div className="journal-empty">
          <h3>
            {c(
              'La première rencontre commence par un message.',
              'A first connection starts with a message.',
            )}
          </h3>
          <p>
            {c(
              'Choisissez un profil dans l’annuaire pour présenter votre projet.',
              'Choose a profile from the directory to introduce your project.',
            )}
          </p>
          <a className="public-button" href="#/supervisors">
            {c('Explorer les superviseurs', 'Explore supervisors')}
          </a>
        </div>
      ) : (
        <div className="inbox-layout">
          <nav aria-label={c('Conversations', 'Conversations')}>
            {threads.map((t) => (
              <button
                key={t.id}
                aria-pressed={selected?.id === t.id}
                onClick={() => setSelectedId(t.id)}
              >
                <strong>{supervisors.find((s) => s.id === t.supervisorId)?.name}</strong>
                <span>{t.subject}</span>
                <small>
                  {t.messages.length} {c('messages', 'messages')}
                </small>
              </button>
            ))}
          </nav>
          {selected && (
            <div className="thread-reader">
              <h3>{selected.subject}</h3>
              <div className="thread-messages">
                {selected.messages.map((m) => (
                  <article className={m.senderId === account.id ? 'message-mine' : ''} key={m.id}>
                    <header>
                      <strong>{m.name}</strong>
                      <time>{localDate(m.at, lang)}</time>
                    </header>
                    <p>{m.body}</p>
                  </article>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget,
                    data = new FormData(form);
                  try {
                    replyToThread(selected.id, String(data.get('reply')));
                    form.reset();
                    refresh();
                    setError('');
                  } catch {
                    setError(
                      c(
                        'Impossible d’enregistrer ce message. Vérifiez votre accès et le texte.',
                        'Unable to save the message. Check your access and the text.',
                      ),
                    );
                  }
                }}
              >
                <label className="field">
                  <span>{c('Votre réponse', 'Your reply')}</span>
                  <textarea name="reply" required rows={4} maxLength={4000} />
                </label>
                {error && <p role="alert">{localize(lang, error)}</p>}
                <button className="public-button">
                  {c('Enregistrer la réponse', 'Save reply')}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
export default function ApplicationWorkspace({
  lang,
  account,
}: {
  lang: string;
  account: Account;
}) {
  const c = (fr: string, en: string) => content(lang, fr, en),
    [stored, setStored] = useState(myApplication),
    [tab, setTab] = useState(() =>
      new URLSearchParams(window.location.hash.split('?')[1]).get('tab') === 'messages'
        ? 'messages'
        : 'application',
    ),
    [notice, setNotice] = useState(''),
    [intent, setIntent] = useState(() => sessionStorage.getItem('xidian-supervisor-intent') || '');
  const [form, setForm] = useState(() => {
    const old = myApplication();
    return {
      level: old?.level || ((account.grade === 'PhD' ? 'PhD' : 'Master') as 'Master' | 'PhD'),
      major: old?.major || account.major,
      language: old?.language || 'English',
      topic: old?.topic || '',
      reference: old?.reference || '',
      stage: old?.stage || ('preparing' as ApplicationStage),
      documents: old?.documents || [],
    };
  });
  const intended = supervisors.find((s) => s.id === intent),
    index = admissionsSteps.findIndex((s) => s.id === (stored?.stage || 'preparing'));
  function save(e: React.FormEvent) {
    e.preventDefault();
    try {
      const next = saveApplication(form);
      setStored(next);
      setNotice(
        c(
          'Suivi personnel enregistré. Aucune candidature n’a été transmise à Xidian.',
          'Personal tracker saved. No application was submitted to Xidian.',
        ),
      );
    } catch {
      setNotice(
        c(
          'Renseignez le programme et vérifiez les champs.',
          'Enter the programme and check the fields.',
        ),
      );
    }
  }
  return (
    <section className="application-space public-container">
      <header className="public-page-title">
        <span className="public-kicker">{c('ESPACE CANDIDAT', 'APPLICANT SPACE')}</span>
        <h1>{c('Votre projet prend forme.', 'Your future takes shape.')}</h1>
        <p>
          {account.displayName} ·{' '}
          {c(
            'Un suivi personnel, du premier contact à l’offre.',
            'A personal tracker, from first contact to offer.',
          )}
        </p>
      </header>
      <div className="application-disclaimer">
        {c(
          'Hub indépendant · suivi déclaré par vous. Les décisions et dépôts officiels restent exclusivement sur le portail de Xidian. Cette démonstration conserve les données sur ce navigateur.',
          'Independent Hub · self-reported progress. Official decisions and submissions remain exclusively in Xidian’s portal. This demo stores data in this browser.',
        )}
      </div>
      <div
        className="application-tabs"
        role="tablist"
        aria-label={c('Mon dossier', 'My application')}
      >
        {[
          ['application', c('Mon dossier', 'My application')],
          ['messages', c('Mes échanges', 'My conversations')],
        ].map(([id, label]) => (
          <button role="tab" key={id} aria-selected={tab === id} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>
      {tab === 'messages' ? (
        <ThreadInbox lang={lang} account={account} />
      ) : (
        <>
          <div className="application-progress">
            {admissionsSteps.map((s, i) => (
              <div key={s.id} data-state={i < index ? 'done' : i === index ? 'current' : 'next'}>
                <span>{i < index ? '✓' : String(i + 1).padStart(2, '0')}</span>
                <strong>{c(s.fr, s.en)}</strong>
                <small>
                  {i < index
                    ? c('Étape déclarée passée', 'Reported complete')
                    : i === index
                      ? c('Étape déclarée actuelle', 'Reported current step')
                      : c('À venir', 'Upcoming')}
                </small>
              </div>
            ))}
          </div>
          <div className="application-columns">
            <form className="application-form" onSubmit={save}>
              <h2>{c('Mon projet de candidature', 'My application plan')}</h2>
              <div className="two-fields">
                <label>
                  <span>{c('Niveau', 'Degree')}</span>
                  <select
                    value={form.level}
                    onChange={(e) =>
                      setForm({ ...form, level: e.target.value as 'Master' | 'PhD' })
                    }
                  >
                    <option value="Master">{localize(lang, 'Master')}</option>
                    <option value="PhD">{localize(lang, 'PhD')}</option>
                  </select>
                </label>
                <label>
                  <span>{c('Langue du programme', 'Programme language')}</span>
                  <select
                    value={form.language}
                    onChange={(e) => setForm({ ...form, language: e.target.value })}
                  >
                    <option value="English">{localize(lang, 'English')}</option>
                    <option value="Chinese">{localize(lang, 'Chinese')}</option>
                  </select>
                </label>
              </div>
              <label>
                <span>{c('Programme ou spécialité', 'Programme or major')}</span>
                <input
                  required
                  maxLength={150}
                  value={form.major}
                  onChange={(e) => setForm({ ...form, major: e.target.value })}
                />
              </label>
              <label>
                <span>{c('Mon projet de recherche', 'My research proposal')}</span>
                <textarea
                  maxLength={2000}
                  rows={5}
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                />
              </label>
              <label>
                <span>
                  {c(
                    'Référence du dossier officiel (facultatif)',
                    'Official application reference (optional)',
                  )}
                </span>
                <input
                  maxLength={100}
                  value={form.reference}
                  onChange={(e) => setForm({ ...form, reference: e.target.value })}
                />
              </label>
              <label>
                <span>
                  {c(
                    'Mon étape actuelle · déclaration personnelle',
                    'My current step · self-reported',
                  )}
                </span>
                <select
                  value={form.stage}
                  onChange={(e) => setForm({ ...form, stage: e.target.value as ApplicationStage })}
                >
                  {admissionsSteps.map((s) => (
                    <option key={s.id} value={s.id}>
                      {c(s.fr, s.en)}
                    </option>
                  ))}
                </select>
              </label>
              <h3>{c('Mes pièces à préparer', 'My document checklist')}</h3>
              <p className="public-small-note">
                {c(
                  'Checklist issue des guides 2026. Cochez ce que vous avez préparé ; aucun document personnel n’est téléversé ici.',
                  'Checklist based on the 2026 guides. Check what you have prepared; no personal document is uploaded here.',
                )}
              </p>
              <fieldset className="application-checklist">
                <legend>
                  {c('Pièces préparées', 'Prepared documents')} · {form.documents.length}/
                  {documentChecklist.length}
                </legend>
                {documentChecklist.map((d) => (
                  <label key={d.id}>
                    <input
                      type="checkbox"
                      checked={form.documents.includes(d.id)}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          documents: e.target.checked
                            ? [...form.documents, d.id]
                            : form.documents.filter((x) => x !== d.id),
                        })
                      }
                    />
                    <span>{c(d.fr, d.en)}</span>
                  </label>
                ))}
              </fieldset>
              {notice && (
                <p className="info-box" role="status">
                  {localize(lang, notice)}
                </p>
              )}
              <button className="public-button">
                {c('Enregistrer mon suivi', 'Save my tracker')}
              </button>
            </form>
            <aside className="application-side">
              <div>
                <h2>
                  {c('Le dépôt officiel se fait chez Xidian.', 'Submit officially through Xidian.')}
                </h2>
                <p>
                  {c(
                    'Le Hub vous aide à vous préparer. Il ne dépose pas de dossier et ne délivre aucune décision d’admission.',
                    'The Hub helps you prepare. It does not submit applications or issue admissions decisions.',
                  )}
                </p>
                <a href={officialPortal} className="public-button" target="_blank" rel="noreferrer">
                  {c('Portail officiel', 'Official portal')}
                </a>
                <a href="#/admissions">
                  {c('Lire le guide de candidature', 'Read the application guide')}
                </a>
              </div>
              <div>
                <h3>{c('Mon historique', 'My history')}</h3>
                {stored?.history
                  .slice()
                  .reverse()
                  .map((h, i) => (
                    <p key={i}>
                      <strong>
                        {localize(lang, admissionsSteps.find((s) => s.id === h.stage)?.en || '')}
                      </strong>
                      <br />
                      <small>
                        {localDate(h.at, lang)} · {c('déclaré par moi', 'self-reported')}
                      </small>
                    </p>
                  ))}
                {!stored && (
                  <p>
                    {c(
                      'Enregistrez votre suivi pour démarrer l’historique.',
                      'Save your tracker to start its history.',
                    )}
                  </p>
                )}
              </div>
            </aside>
          </div>
        </>
      )}
      {intended && (
        <ClubDialog
          title={c('Présenter mon projet à ', 'Introduce my project to ') + intended.name}
          onClose={() => {
            setIntent('');
            sessionStorage.removeItem('xidian-supervisor-intent');
          }}
        >
          <p className="info-box">
            {c(
              'Conversation de démonstration locale, sans envoi externe.',
              'Local demo conversation; no external delivery.',
            )}
          </p>
          <form
            className="modal-form"
            onSubmit={(e) => {
              e.preventDefault();
              const d = new FormData(e.currentTarget);
              try {
                startThread(intended.id, String(d.get('subject')), String(d.get('body')));
                setIntent('');
                sessionStorage.removeItem('xidian-supervisor-intent');
                setTab('messages');
              } catch {
                setNotice(c('Vérifiez le contenu du message.', 'Check the message.'));
              }
            }}
          >
            <label className="field">
              <span>{c('Sujet', 'Subject')}</span>
              <input
                name="subject"
                required
                maxLength={150}
                defaultValue={c(
                  'Candidature Master/PhD · projet de recherche',
                  'Master/PhD application · research project',
                )}
              />
            </label>
            <label className="field">
              <span>{c('Votre présentation', 'Your introduction')}</span>
              <textarea required name="body" rows={7} maxLength={4000} />
            </label>
            <button className="public-button">
              {c('Enregistrer et ouvrir la conversation', 'Save and open conversation')}
            </button>
          </form>
        </ClubDialog>
      )}
    </section>
  );
}
export function FacultyWorkspace({ lang, account }: { lang: string; account: Account }) {
  const c = (fr: string, en: string) => content(lang, fr, en),
    [linked, setLinked] = useState(facultyLink),
    [selected, setSelected] = useState(facultyLink),
    [query, setQuery] = useState(''),
    [notice, setNotice] = useState(''),
    [overview, setOverview] = useState(applicantOverview);
  if (account.role !== 'professor')
    return <p>{c('Accès professeur requis.', 'Professor access required.')}</p>;
  return (
    <section className="public-container faculty-office">
      <header className="public-page-title">
        <span className="public-kicker">{c('ESPACE SUPERVISEUR', 'SUPERVISOR SPACE')}</span>
        <h1>{c('Les projets de demain commencent ici.', 'Tomorrow’s research starts here.')}</h1>
        <p>
          {c(
            'Échanges de préparation et aperçu des dossiers déclarés dans le Hub.',
            'Preparation conversations and an overview of applications reported in the Hub.',
          )}
        </p>
      </header>
      <p className="application-disclaimer">
        {c(
          'Association de profil en démonstration uniquement. L’identité d’un véritable superviseur devra être vérifiée par l’université sur le futur serveur. Ces échanges et dossiers ne sont pas synchronisés avec l’admission officielle.',
          'Demo profile association only. Real supervisor identity must be verified by the university on the future server. These conversations and records are not synced with official admissions.',
        )}
      </p>
      <form
        className="faculty-bind"
        onSubmit={(e) => {
          e.preventDefault();
          try {
            linkFacultyProfile(selected);
            setLinked(selected);
            setNotice(
              c(
                'Profil associé pour cette démonstration locale.',
                'Profile linked for this local demonstration.',
              ),
            );
          } catch {
            setNotice(
              c(
                'Profil indisponible ou déjà associé sur ce navigateur.',
                'Profile unavailable or already linked in this browser.',
              ),
            );
          }
        }}
      >
        <label>
          <span>{c('Rechercher mon profil', 'Find my profile')}</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <label>
          <span>{c('Profil de superviseur · démonstration', 'Supervisor profile · demo')}</span>
          <select required value={selected} onChange={(e) => setSelected(e.target.value)}>
            <option value="">{c('Choisir un profil', 'Choose a profile')}</option>
            {supervisors
              .filter(
                (s) =>
                  !query ||
                  s.id === selected ||
                  [s.name, s.zh].join(' ').toLowerCase().includes(query.toLowerCase()),
              )
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} · {s.zh}
                </option>
              ))}
          </select>
        </label>
        <button className="public-button">{c('Associer ce profil', 'Link this profile')}</button>
      </form>
      {notice && (
        <p role="status" className="info-box">
          {localize(lang, notice)}
        </p>
      )}
      {linked && <ThreadInbox key={linked} lang={lang} account={account} />}
      <section className="faculty-applications">
        <div className="section-heading">
          <h2>
            {c(
              'Suivi des candidatures · déclarations locales',
              'Application overview · local self-reports',
            )}
          </h2>
          <button className="text-button" onClick={() => setOverview(applicantOverview())}>
            {c('Actualiser', 'Refresh')}
          </button>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>{c('Candidat', 'Applicant')}</th>
                <th>{c('Programme', 'Programme')}</th>
                <th>{c('Étape déclarée', 'Reported step')}</th>
                <th>{c('Mise à jour', 'Updated')}</th>
              </tr>
            </thead>
            <tbody>
              {overview.map((a) => (
                <tr key={a.id}>
                  <td>
                    <strong>{a.displayName}</strong>
                  </td>
                  <td>
                    {localize(lang, a.level)} · {localize(lang, a.major)}
                  </td>
                  <td>{localize(lang, admissionsSteps.find((s) => s.id === a.stage)?.en || '')}</td>
                  <td>{localDate(a.updatedAt, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!overview.length && (
          <p className="journal-empty">
            {c(
              'Aucun dossier préparé sur ce navigateur.',
              'No applications prepared in this browser.',
            )}
          </p>
        )}
      </section>
    </section>
  );
}
