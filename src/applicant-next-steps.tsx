import React from 'react';
import { applicationSummary } from './application-summary';
import { studyText as text } from './study-copy';
import { intlLocale } from './locale-config';
import { admissionsSteps, officialPortal } from './admissions-data';
import { content } from './i18n';
import type { ApplicationRecord } from './repositories/application-repository';
export default function ApplicantNextSteps({
  lang,
  record,
}: {
  lang: string;
  record: ApplicationRecord | null;
}) {
  const s = (key: Parameters<typeof text>[1]) => text(lang, key);
  const summary = applicationSummary(record);
  const stage = admissionsSteps.find((step) => step.id === record?.stage);
  return (
    <section className="applicant-next" aria-labelledby="applicant-next-heading">
      <div>
        <span className="public-kicker">{s('owner')}</span>
        <h2 id="applicant-next-heading">{s('next')}</h2>
        <p>
          {summary.next === 'start'
            ? s('start')
            : summary.next === 'documents'
              ? s('prepare')
              : s('officialAction')}
        </p>
        {summary.next === 'official' ? (
          <a href={officialPortal} className="public-button" target="_blank" rel="noreferrer">
            {s('officialAction')}
          </a>
        ) : (
          <button
            type="button"
            className="public-button"
            onClick={() =>
              document
                .getElementById(
                  summary.next === 'start' ? 'application-major' : 'application-documents',
                )
                ?.focus()
            }
          >
            {summary.next === 'start' ? s('start') : s('prepare')}
          </button>
        )}
        {record && (
          <p className="public-small-note">
            <time dateTime={record.updatedAt}>
              {s('updated')} ·{' '}
              {new Intl.DateTimeFormat(intlLocale(lang), {
                dateStyle: 'medium',
                timeZone: 'Asia/Shanghai',
              }).format(new Date(record.updatedAt))}
            </time>
            {stage && <> · {content(lang, stage.fr, stage.en)}</>}
          </p>
        )}
      </div>
      <div>
        <h3>
          {s('prepared')} · {summary.prepared}/{summary.total}
        </h3>
        <progress value={summary.prepared} max={summary.total} aria-label={s('prepared')} />
        <p>{s('notVerified')}</p>
        <details>
          <summary>
            {s('remaining')} · {summary.missing.length}
          </summary>
          <ul>
            {summary.missing.map((d) => (
              <li key={d.id}>{content(lang, d.fr, d.en)}</li>
            ))}
          </ul>
        </details>
      </div>
    </section>
  );
}
