import React, { useState } from 'react';
import { content } from './i18n';
import type { Supervisor } from './supervisors';
export function SupervisorCV({ supervisor, lang }: { supervisor: Supervisor; lang: string }) {
  const c = (fr: string, en: string) => content(lang, fr, en);
  const [zoom, setZoom] = useState(false);
  const [failed, setFailed] = useState<string[]>([]);
  const pages = supervisor.profileImages || [];
  return (
    <section className={'supervisor-cv ' + (zoom ? 'cv-zoomed' : '')}>
      <div className="cv-toolbar">
        <div>
          <span className="public-kicker">{c('FICHE SIE ORIGINALE', 'ORIGINAL SIE PROFILE')}</span>
          <h3>
            {c('Parcours, recherches et publications', 'Background, research and publications')}
          </h3>
        </div>
        {!!pages.length && (
          <button className="button secondary" aria-pressed={zoom} onClick={() => setZoom(!zoom)}>
            {zoom
              ? c('Ajuster à la largeur', 'Fit to width')
              : c('Agrandir la lecture', 'Enlarge for reading')}
          </button>
        )}
      </div>
      <p>
        {c(
          'Consultez toutes les pages disponibles de la fiche d’origine. Elles présentent le CV tel que publié par la SIE ; son actualité et les disponibilités du professeur sont à confirmer.',
          'Read every available page of the original profile. This is the CV as published by SIE; its currency and supervision availability require confirmation.',
        )}
      </p>
      {!pages.length && (
        <p className="info-box">
          {c(
            'Aucune fiche image n’est référencée pour ce profil. Consultez son site officiel pour le CV complet.',
            'No image profile is indexed for this person. Consult their official website for the complete CV.',
          )}
        </p>
      )}
      {pages.map((src, i) => (
        <figure className="cv-page" key={src}>
          <figcaption>
            {c('Page', 'Page')} {i + 1} / {pages.length} · {supervisor.name}{' '}
            <a href={src} target="_blank" rel="noreferrer">
              {c('Ouvrir en taille réelle', 'Open full size')}
            </a>
          </figcaption>
          {failed.includes(src) ? (
            <p role="status">
              {c(
                'L’image ne se charge pas. Ouvrez la fiche officielle ci-dessous.',
                'Image could not load. Open the official profile below.',
              )}
            </p>
          ) : (
            <div className="cv-page-scroll">
              <a href={src} target="_blank" rel="noreferrer">
                <img
                  className="official-profile-document"
                  src={src}
                  alt={
                    c('CV officiel de ', 'Official CV of ') +
                    supervisor.name +
                    ' · ' +
                    c('page ', 'page ') +
                    (i + 1)
                  }
                  loading={i === 0 ? 'eager' : 'lazy'}
                  referrerPolicy="no-referrer"
                  onError={() => setFailed((v) => [...v, src])}
                />
              </a>
            </div>
          )}
        </figure>
      ))}
      <a className="button secondary" href={supervisor.source} target="_blank" rel="noreferrer">
        {c('Consulter la source officielle', 'Read the official source')}
      </a>
    </section>
  );
}
