import React, { useEffect, useRef, useState } from 'react';
import type { Account } from './accounts';
import { localize } from './i18n';
import { studyText as text } from './study-copy';
import {
  emptyStudyPlan,
  normalizeStudyPlan,
  resources,
  roadmapIds,
  studyStorageKey,
  type StudyPlan,
} from './study-model';
import './study-pathways.css';

const tabs = ['explore', 'roadmap', 'session', 'exchange'] as const;
type Tab = (typeof tabs)[number];
function readTab(): Tab {
  const value = new URLSearchParams(window.location.hash.split('?')[1]).get('tab');
  return tabs.includes(value as Tab) ? (value as Tab) : 'explore';
}
function loadPlan(account: Account | null) {
  if (!account) return emptyStudyPlan();
  try {
    return normalizeStudyPlan(
      JSON.parse(localStorage.getItem(studyStorageKey(account.id)) || 'null'),
    );
  } catch {
    return emptyStudyPlan();
  }
}
export default function StudyPathways({
  lang,
  account,
}: {
  lang: string;
  account: Account | null;
}) {
  const s = (key: Parameters<typeof text>[1]) => text(lang, key);
  const [tab, setTab] = useState<Tab>(readTab);
  const navRef = useRef<HTMLElement>(null);
  const previousTab = useRef(tab);
  const [plan, setPlan] = useState<StudyPlan>(() => loadPlan(account));
  const [notice, setNotice] = useState<'saved' | 'failed' | ''>('');
  useEffect(() => {
    if (previousTab.current === tab) return;
    previousTab.current = tab;
    navRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }, [tab]);
  useEffect(() => {
    const sync = () => setTab(readTab());
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);
  function change(next: StudyPlan) {
    setPlan(next);
    setNotice('');
  }
  function save() {
    if (!account) return;
    try {
      localStorage.setItem(studyStorageKey(account.id), JSON.stringify(normalizeStudyPlan(plan)));
      setNotice('saved');
    } catch {
      setNotice('failed');
    }
  }
  function download() {
    const lines = [
      s('nav'),
      s(plan.field),
      '',
      s('roadmap'),
      ...roadmapIds.map(
        (id, i) =>
          `${plan.completed.includes(id) ? '[x]' : '[ ]'} ${s((['language', 'debug', 'gitTask', 'projectTask'] as const)[i])}`,
      ),
      '',
      s('notes'),
      plan.notes,
      '',
      s('question'),
      plan.question,
      '',
      s('local'),
    ];
    const url = URL.createObjectURL(
      new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' }),
    );
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'xidian-study-notes.txt';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const fieldName = s(plan.field);
  const titleId = 'study-' + tab + '-title';
  return (
    <section className="study-space public-container">
      <header className="study-hero">
        <div>
          <span className="public-kicker">XIDIAN GLOBAL CLASSROOM</span>
          <h1>{s('title')}</h1>
          <p>{s('intro')}</p>
          <a className="public-button" href="#/study?tab=session" onClick={() => setTab('session')}>
            {s('session')}
          </a>
        </div>
        <figure>
          <img
            data-photo=""
            decoding="async"
            src="./media/classroom.jpg"
            alt={localize(lang, 'Teaching at Xidian, from the supplied presentation')}
          />
          <figcaption>{s('nav')} · CS / ICS</figcaption>
        </figure>
      </header>
      <nav ref={navRef} className="study-nav" aria-label={s('nav')}>
        {tabs.map((id) => (
          <a
            key={id}
            href={'#/study?tab=' + id}
            onClick={() => setTab(id)}
            aria-current={tab === id ? 'page' : undefined}
          >
            {s(id)}
          </a>
        ))}
      </nav>
      <section className="study-body" aria-labelledby={titleId}>
        <h2 id={titleId}>{s(tab)}</h2>
        {(tab === 'explore' || tab === 'roadmap') && (
          <div className="study-field-choice" role="group" aria-label={s('explore')}>
            {(['cs', 'ics'] as const).map((id) => (
              <button
                key={id}
                className="study-choice"
                aria-pressed={plan.field === id}
                onClick={() => change({ ...plan, field: id })}
              >
                {s(id)}
              </button>
            ))}
          </div>
        )}
        {tab === 'explore' && (
          <>
            <div className="study-field-heading">
              <span className="public-kicker">{plan.field.toUpperCase()}</span>
              <h3>{fieldName}</h3>
            </div>
            <div className="study-explainer">
              <article>
                <span>01</span>
                <h4>{s('about')}</h4>
                <p>{s(plan.field === 'cs' ? 'csAbout' : 'icsAbout')}</p>
              </article>
              <article>
                <span>02</span>
                <h4>{s('uses')}</h4>
                <p>{s(plan.field === 'cs' ? 'csUses' : 'icsUses')}</p>
              </article>
              <article>
                <span>03</span>
                <h4>{s('project')}</h4>
                <p>{s(plan.field === 'cs' ? 'csProject' : 'icsProject')}</p>
              </article>
            </div>
            <aside className="study-source-note">
              <h3>{s('other')}</h3>
              <p>{s('confirm')}</p>
              <a href="#/admissions" className="text-button">
                {s('official')}
              </a>
            </aside>
            <div className="study-resource-section">
              <h3>{s('resources')}</h3>
              <ul className="study-resources">
                {resources.map((r) => (
                  <li key={r.name}>
                    <a href={r.href} target="_blank" rel="noreferrer">
                      <strong>{r.name}</strong>
                      <span>{s(r.key)}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
        {tab === 'roadmap' && (
          <>
            <p>{s('roadIntro')}</p>
            <div className="study-progress">
              <label htmlFor="study-progress">
                {s('prepared')} · {plan.completed.length}/{roadmapIds.length}
              </label>
              <progress id="study-progress" value={plan.completed.length} max={roadmapIds.length} />
            </div>
            <fieldset className="study-checklist">
              <legend>{fieldName}</legend>
              {roadmapIds.map((id, i) => (
                <label key={id}>
                  <input
                    type="checkbox"
                    checked={plan.completed.includes(id)}
                    onChange={(e) =>
                      change({
                        ...plan,
                        completed: e.target.checked
                          ? [...plan.completed, id]
                          : plan.completed.filter((v) => v !== id),
                      })
                    }
                  />
                  <span>{s((['language', 'debug', 'gitTask', 'projectTask'] as const)[i])}</span>
                </label>
              ))}
            </fieldset>
            <label className="study-text-field">
              <span>{s('notes')}</span>
              <textarea
                dir="auto"
                rows={5}
                maxLength={4000}
                value={plan.notes}
                onChange={(e) => change({ ...plan, notes: e.target.value })}
              />
            </label>
          </>
        )}
        {tab === 'session' && (
          <>
            <div className="study-session">
              <div>
                <span className="public-kicker">
                  CS / ICS · {localize(lang, 'Bachelor')} / {localize(lang, 'Master')}
                </span>
                <h3>{s('sessionTitle')}</h3>
                <p>{s('proposed')}</p>
                <ol>
                  {(['agenda1', 'agenda2', 'agenda3', 'agenda4'] as const).map((key) => (
                    <li key={key}>{s(key)}</li>
                  ))}
                </ol>
              </div>
              <img
                data-photo=""
                src="./media/community-academic.jpg"
                alt={s('sessionTitle')}
                loading="lazy"
                decoding="async"
              />
            </div>
            <label className="study-text-field">
              <span>{s('question')}</span>
              <textarea
                dir="auto"
                rows={3}
                maxLength={1200}
                value={plan.question}
                onChange={(e) => change({ ...plan, question: e.target.value })}
              />
            </label>
            <details className="study-brief">
              <summary>{s('media')}</summary>
              <p>{s('mediaNote')}</p>
              <h3>{s('brief')}</h3>
              <ul>
                {(['brief1', 'brief2', 'brief3'] as const).map((key) => (
                  <li key={key}>{s(key)}</li>
                ))}
              </ul>
              <a
                href={
                  account && (account.role === 'professor' || account.role === 'club_leader')
                    ? '#/club-office'
                    : '#/union?tab=clubs'
                }
              >
                {localize(lang, 'Student Union')}
              </a>
            </details>
          </>
        )}
        {tab === 'exchange' && (
          <>
            <h3>{s('share')}</h3>
            <p>{s('shareNote')}</p>
            <label className="study-text-field">
              <span>{s('question')}</span>
              <textarea
                dir="auto"
                maxLength={1200}
                rows={3}
                value={plan.question}
                onChange={(e) => change({ ...plan, question: e.target.value })}
              />
            </label>
            <label className="study-text-field">
              <span>{s('notes')}</span>
              <textarea
                dir="auto"
                maxLength={4000}
                rows={6}
                value={plan.notes}
                onChange={(e) => change({ ...plan, notes: e.target.value })}
              />
            </label>
            <a className="text-button" href="#/union?tab=clubs">
              {localize(lang, 'Explore clubs')}
            </a>
          </>
        )}
        {tab !== 'explore' && (
          <div className="study-save-area">
            <p>{s('local')}</p>
            <div>
              {account ? (
                <button type="button" className="public-button" onClick={save}>
                  {s('save')}
                </button>
              ) : (
                <a href="#/apply?mode=login" className="public-button">
                  {s('signin')}
                </a>
              )}
              <button type="button" className="study-download" onClick={download}>
                {s('download')}
              </button>
            </div>
            {notice && <p role={notice === 'failed' ? 'alert' : 'status'}>{s(notice)}</p>}
          </div>
        )}
      </section>
      <aside className="study-beta">
        <h2>{s('beta')}</h2>
        <p>{s('planned')}</p>
        <ul>
          <li>Xidian Global Classroom</li>
          <li>Online International Summer / Winter Courses</li>
          <li>Xidian Global Connect</li>
          <li>Inside Xidian: Research Without Borders</li>
        </ul>
      </aside>
    </section>
  );
}
