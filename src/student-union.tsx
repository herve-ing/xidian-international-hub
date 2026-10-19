import React, { useEffect, useState } from 'react';
import { content } from './i18n';
import CampusLife from './campus';
import { ClubJournal } from './club-journal';
import { ClubDialog } from './club-dialog';
import { campusGallery, unionDepartments, recruitmentUrl, recruitmentOpen } from './union-data';
export function CampusGallery({ lang, compact = false }: { lang: string; compact?: boolean }) {
  const c = (fr: string, en: string) => content(lang, fr, en);
  const [photo, setPhoto] = useState<(typeof campusGallery)[number] | null>(null);
  return (
    <section className="union-gallery-section">
      <div className="union-section-heading">
        <div>
          <span className="public-kicker">{c('LE CAMPUS EN IMAGES', 'CAMPUS IN PICTURES')}</span>
          <h2>{c('Vivre. Créer. Partager.', 'Live. Create. Share.')}</h2>
        </div>
        {compact && <a href="#/union?tab=photos">{c('Toute la galerie', 'View gallery')} ↗</a>}
      </div>
      <p className="muted">
        {c(
          'Photos d’archives de vos présentations Xidian. Elles illustrent la vie universitaire et ne constituent pas des annonces d’événements actuels de l’ISU.',
          'Archive photos from the supplied Xidian presentations. They illustrate university life and are not announcements of current ISU events.',
        )}
      </p>
      <div className="union-photo-grid">
        {campusGallery.slice(0, compact ? 6 : undefined).map((p) => (
          <button
            className="union-photo"
            key={p.image}
            onClick={() => setPhoto(p)}
            aria-label={c('Agrandir : ', 'Enlarge: ') + c(p.fr, p.en)}
          >
            <img src={'./media/' + p.image} alt={c(p.fr, p.en)} loading="lazy" />
            <span>
              {c(p.fr, p.en)} <small>{p.source}</small>
            </span>
          </button>
        ))}
      </div>
      {photo && (
        <ClubDialog title={c(photo.fr, photo.en)} onClose={() => setPhoto(null)}>
          <img
            className="union-lightbox"
            src={'./media/' + photo.image}
            alt={c(photo.fr, photo.en)}
          />
          <p>
            {c('Présentation fournie · archive · ', 'Supplied presentation · archive · ')}
            {photo.source}
          </p>
        </ClubDialog>
      )}
    </section>
  );
}
export function UnionNews({ lang }: { lang: string }) {
  const c = (fr: string, en: string) => content(lang, fr, en);
  return (
    <section className="union-news-section">
      <div className="union-section-heading">
        <div>
          <span className="public-kicker">{c('À LA UNE', 'IN FOCUS')}</span>
          <h2>{c('La vie étudiante prend la parole.', 'Student life has a voice.')}</h2>
        </div>
        <a href="#/union?tab=actu">{c('L’espace de l’Union', 'Union hub')} ↗</a>
      </div>
      <div className="union-news-grid">
        <article className="union-feature-news">
          <img
            src="./media/campus-friends.jpg"
            alt={c(
              'Étudiants sur le campus · photo d’archive',
              'Students on campus · archive photo',
            )}
            loading="lazy"
          />
          <div>
            <span className="public-kicker">
              {c('COMMUNIQUÉ TRANSMIS · RECRUTEMENT', 'SUPPLIED NOTICE · RECRUITMENT')}
            </span>
            <h3>
              {c(
                'Rejoignez l’Union des étudiants internationaux.',
                'Join the International Student Union.',
              )}
            </h3>
            <p>
              {c(
                'Huit départements, trois types de postes et une même envie : faire vivre une communauté ouverte et solidaire.',
                'Eight departments, three types of positions and a shared ambition: building an open, supportive community.',
              )}
            </p>
            <p>
              {c(
                'Date limite annoncée : 11 novembre 2026.',
                'Announced deadline: November 11, 2026.',
              )}
            </p>
            <a href="#/union?tab=recruitment">
              {c('Lire l’appel et les conditions', 'Read the notice and requirements')} →
            </a>
          </div>
        </article>
        <article className="union-news-note">
          <span className="public-kicker">{c('ORGANISATION', 'ORGANIZATION')}</span>
          <h3>
            {c('Huit départements pour vous accompagner.', 'Eight departments to support you.')}
          </h3>
          <p>
            {c(
              'Culture, sport, études, bénévolat, communication et vie quotidienne : découvrez les missions de chacun.',
              'Culture, sports, study, volunteering, communication and everyday life: discover each department’s responsibilities.',
            )}
          </p>
          <a href="#/union?tab=departments">
            {c('Découvrir les départements', 'Explore departments')} →
          </a>
          <hr />
          <span className="public-kicker">{c('CLUBS & CRÉATIONS', 'CLUBS & CREATIVITY')}</span>
          <h3>{c('Votre club a aussi son journal.', 'Your club has a journal too.')}</h3>
          <p>
            {c(
              'Retrouvez les articles publiés par les responsables et les professeurs dans cette démonstration locale.',
              'Find articles published by club leaders and professors in this local demo.',
            )}
          </p>
          <a href="#/union?tab=clubs">{c('Explorer les clubs', 'Explore clubs')} →</a>
        </article>
      </div>
    </section>
  );
}
export default function StudentUnion({ lang, workspaceId }: { lang: string; workspaceId: string }) {
  const c = (fr: string, en: string) => content(lang, fr, en);
  const readTab = () =>
    new URLSearchParams(window.location.hash.split('?')[1]).get('tab') ||
    (window.location.hash.startsWith('#/clubs') ? 'clubs' : 'actu');
  const [requested, setRequested] = useState(readTab);
  useEffect(() => {
    const update = () => setRequested(readTab());
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  const tab = ['actu', 'departments', 'clubs', 'photos', 'recruitment'].includes(requested)
    ? requested
    : 'actu';
  const open = recruitmentOpen();
  return (
    <div className="public-container student-union">
      <section className="union-hero">
        <img
          src="./media/international-stage.jpg"
          alt={c(
            'Scène culturelle de Xidian · photographie d’archive du PPT',
            'Xidian cultural stage · archive photo from the PPT',
          )}
        />
        <div>
          <span className="public-kicker">INTERNATIONAL STUDENT UNION · XIDIAN</span>
          <h1>
            {c('Une communauté.\nToutes vos énergies.', 'One community.\nAll your possibilities.')}
          </h1>
          <p>
            {c(
              'Servir les étudiants, enrichir la vie du campus et rapprocher les cultures.',
              'Serving students, enriching campus life and connecting cultures.',
            )}
          </p>
          <a className="public-button" href="#/union?tab=recruitment">
            {c('Rejoindre l’Union', 'Join the Union')} ↗
          </a>
        </div>
      </section>
      <nav
        className="union-tabs"
        aria-label={c('Espace Union étudiante', 'Student Union sections')}
      >
        {[
          ['actu', c('Actualités', 'News')],
          ['departments', c('Les 8 départements', '8 departments')],
          ['clubs', c('Clubs & inscriptions', 'Clubs & registration')],
          ['photos', c('Vie du campus en images', 'Campus gallery')],
          ['recruitment', c('Recrutement', 'Recruitment')],
        ].map(([id, label]) => (
          <a key={id} href={'#/union?tab=' + id} aria-current={tab === id ? 'page' : undefined}>
            {label}
          </a>
        ))}
      </nav>
      <p className="union-source-note">
        {c(
          'Espace indépendant du Hub, structuré d’après le communiqué de recrutement que vous avez transmis. Il ne remplace pas les canaux officiels de l’ISU. Les photos sont des archives des présentations fournies.',
          'Independent Hub space based on the supplied recruitment notice. It does not replace official ISU channels. Photos are archives from the supplied presentations.',
        )}
      </p>
      {tab === 'actu' && (
        <>
          <UnionNews lang={lang} />
          <section className="union-community-journal">
            <h2>{c('Le journal des clubs', 'Club journal')}</h2>
            <p>
              {c(
                'Publications locales : seuls les articles publiés sur ce navigateur sont visibles. Aucun faux événement n’est ajouté.',
                'Local publications: only articles published in this browser are shown. No invented events are added.',
              )}
            </p>
            <ClubJournal lang={lang} />
          </section>
          <CampusGallery lang={lang} compact />
        </>
      )}
      {tab === 'departments' && (
        <section className="union-departments">
          <span className="public-kicker">
            {c('ORGANISATION & MISSIONS', 'STRUCTURE & RESPONSIBILITIES')}
          </span>
          <h2>{c('Huit façons de s’engager.', 'Eight ways to contribute.')}</h2>
          <p>
            {c(
              'Chaque département comprend un ministre, un vice-ministre et des membres. Tous encadrent leurs groupes et clubs affiliés.',
              'Each department has a Minister, Deputy Minister and Officers. All departments guide their affiliated groups and clubs.',
            )}
          </p>
          <div className="union-department-grid">
            {unionDepartments.map((d, i) => (
              <article key={d.id}>
                <span>0{i + 1}</span>
                <h3>{c(d.fr, d.en)}</h3>
                <p>{c(d.summaryFr, d.summaryEn)}</p>
                <a href="#/union?tab=recruitment">{c('M’engager', 'Get involved')} ↗</a>
              </article>
            ))}
          </div>
          <p className="info-box">
            {c(
              'Les rattachements individuels des clubs aux départements restent à confirmer par l’ISU : aucun organigramme de clubs n’est présenté comme officiel ici.',
              'Individual club-to-department assignments remain to be confirmed by the ISU; this Hub does not claim an official club organizational chart.',
            )}
          </p>
        </section>
      )}
      {tab === 'clubs' && (
        <>
          <div className="union-section-heading">
            <div>
              <h2>
                {c('Les clubs, au cœur de la communauté.', 'Clubs at the heart of the community.')}
              </h2>
              <p>
                {c(
                  'Explorez les activités, les inscriptions et les publications des responsables.',
                  'Explore activities, registration and club leaders’ publications.',
                )}
              </p>
            </div>
          </div>
          <CampusLife lang={lang} workspaceId={workspaceId} />
        </>
      )}
      {tab === 'photos' && <CampusGallery lang={lang} />}
      {tab === 'recruitment' && (
        <section className="union-recruitment">
          <div>
            <span className="public-kicker">
              {c('APPEL À CANDIDATURES · COMMUNIQUÉ TRANSMIS', 'RECRUITMENT · SUPPLIED NOTICE')}
            </span>
            <h2>
              {c('Votre engagement fait la différence.', 'Your contribution makes a difference.')}
            </h2>
            <p>
              {c(
                'Pour les étudiants internationaux actuellement inscrits à Xidian. Un seul poste dans un seul département par personne.',
                'For international students currently enrolled at Xidian. One position in one department per applicant.',
              )}
            </p>
            <ul>
              {[
                c(
                  'Motivation à servir les étudiants, responsabilité et esprit d’équipe.',
                  'Willingness to serve students, responsibility and teamwork.',
                ),
                c(
                  'Organisation, coordination et communication.',
                  'Organizational, coordination and communication skills.',
                ),
                c(
                  'Équilibre entre études et responsabilités associatives.',
                  'Balance studies with Student Union responsibilities.',
                ),
                c(
                  'Comprendre les missions du département choisi.',
                  'Understand the chosen department’s responsibilities.',
                ),
                c(
                  'Chinois et anglais, organisation d’événements, photo, vidéo, design ou outils bureautiques appréciés.',
                  'Chinese and English skills, event planning, photography, video, design or office software experience are preferred.',
                ),
              ].map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <p>
              {c(
                'L’Union travaille sous la direction et la supervision des enseignants de l’ISO. Le communiqué cite M. Li (Li Feng).',
                'The Union operates under ISO teachers’ guidance and supervision. The notice names Mr. Li (Li Feng).',
              )}
            </p>
          </div>
          <aside>
            <span className="union-recruitment-status">
              {open
                ? c(
                    'Échéance à venir · selon le communiqué',
                    'Upcoming deadline · per supplied notice',
                  )
                : c('Échéance annoncée dépassée', 'Announced deadline has passed')}
            </span>
            <h3>11.11.2026</h3>
            <p>
              {c(
                'L’heure limite n’est pas précisée dans le communiqué. Vérifiez les modalités sur le formulaire.',
                'The notice does not specify a closing time. Check the form for details.',
              )}
            </p>
            <a className="public-button" href={recruitmentUrl} target="_blank" rel="noreferrer">
              {c('Ouvrir le formulaire indiqué', 'Open the supplied registration form')} ↗
            </a>
            <p className="small">
              {c(
                'Lien externe fourni dans le communiqué ; disponibilité non vérifiée. Aucune inscription n’est envoyée depuis le Hub.',
                'External link supplied in the notice; availability not verified. No registration is submitted through the Hub.',
              )}
            </p>
            <ol>
              <li>
                {c(
                  'Inscription en ligne sur le formulaire indiqué.',
                  'Register online using the supplied form.',
                )}
              </li>
              <li>
                {c(
                  'Entretien : date et heure communiquées par groupe WeChat ou email.',
                  'Interview: date and time communicated via WeChat group or email.',
                )}
              </li>
              <li>
                {c(
                  'Résultats : affichage aux bureaux de la SIE sur les campus.',
                  'Results: SIE office bulletin boards on the campuses.',
                )}
              </li>
            </ol>
          </aside>
          <p className="union-notice-credit">
            {c(
              'Source : communiqué de recrutement transmis par l’utilisateur. Texte et images : présidence de l’ISU, SHAFIQUE IRZUM. Relecture mentionnée : Li Feng, Guo Rong, Zhang Yang. Date de publication non fournie. Les images du communiqué ne sont pas présentes dans le texte collé.',
              'Source: recruitment notice supplied by the user. Text and images credited to the ISU presidium, SHAFIQUE IRZUM; reviews attributed to Li Feng, Guo Rong and Zhang Yang. Publication date not supplied. The notice images were not included in the pasted text.',
            )}
          </p>
        </section>
      )}
    </div>
  );
}
