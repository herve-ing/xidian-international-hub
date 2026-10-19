import React, { useEffect, useState } from 'react';
import { content } from './i18n';
import { departmentPhotos, xidianNews } from './community-imagery';
import { currentAccount } from './accounts';
import CampusLife from './campus';
import { clubs } from './clubs';
import { ClubJournal } from './club-journal';
import { unionDepartments, recruitmentUrl, recruitmentOpen } from './union-data';
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
            src="./media/community-culture.jpg"
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
      <div className="union-sie-news">
        <div className="union-section-heading">
          <h3>{c('Du côté de Xidian', 'From Xidian')}</h3>
          <span>
            {c(
              'Sélection SIE · mise à jour du 19 octobre 2026',
              'SIE selection · updated October 19, 2026',
            )}
          </span>
        </div>
        <div className="union-official-news-grid">
          {xidianNews.map((n) => (
            <article key={n.source}>
              <a href={n.source} target="_blank" rel="noreferrer">
                <img src={'./media/' + n.image} alt={c(n.fr, n.en)} loading="lazy" />
                <div>
                  <time dateTime={n.date}>
                    {n.date.split('-').reverse().join('.')} · XIDIAN SIE
                  </time>
                  <h3>{c(n.fr, n.en)}</h3>
                  <p>{c(n.summaryFr, n.summaryEn)}</p>
                  <span>{c('Lire la source officielle', 'Read the official source')} ↗</span>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export default function StudentUnion({ lang, workspaceId }: { lang: string; workspaceId: string }) {
  const c = (fr: string, en: string) => content(lang, fr, en);
  const readTab = () =>
    new URLSearchParams(window.location.hash.split('?')[1]).get('tab') ||
    (window.location.hash.startsWith('#/clubs') ||
    new URLSearchParams(window.location.hash.split('?')[1]).has('enroll')
      ? 'clubs'
      : 'actu');
  const [requested, setRequested] = useState(readTab);
  useEffect(() => {
    const update = () => setRequested(readTab());
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  const tab = ['actu', 'departments', 'clubs', 'recruitment'].includes(requested)
    ? requested
    : requested === 'photos' || requested === 'cinema'
      ? 'clubs'
      : 'actu';
  const open = recruitmentOpen();
  return (
    <div
      className={
        'public-container student-union union-editorial ' + (tab !== 'actu' ? 'union-subpage' : '')
      }
    >
      <section className="union-hero union-editorial-hero">
        <div className="union-hero-copy">
          <span className="public-kicker">XIDIAN · INTERNATIONAL STUDENT UNION</span>
          <h1>
            {c(
              'Votre campus.\nVos rencontres.\nVotre place.',
              'Your campus.\nYour people.\nYour place.',
            )}
          </h1>
          <p>
            {c(
              'Bouger, créer, apprendre et s’engager : trouvez ce qui vous rassemble.',
              'Play, create, learn and contribute: find what brings you together.',
            )}
          </p>
          <div className="union-hero-actions">
            <a className="public-button" href="#/union?tab=clubs">
              {c('Trouver mon club', 'Find my club')} ↗
            </a>
            <a href="#/union?tab=departments">{c('Découvrir l’Union', 'Discover the Union')} →</a>
          </div>
        </div>
        <div
          className="union-hero-mosaic"
          aria-label={c('La communauté de Xidian en action', 'The Xidian community in action')}
        >
          <img
            src="./media/club-basketball.jpg"
            alt={c('Basketball : photo du site de référence', 'Basketball: reference-site photo')}
          />
          <img
            src="./media/community-fan-dance.jpg"
            alt={c(
              'Danse culturelle : archive du site de référence',
              'Cultural dance: reference-site archive',
            )}
          />
          <img
            src="./media/community-friends.jpg"
            alt={c(
              'Rencontres sur le campus : archive du site de référence',
              'Campus encounters: reference-site archive',
            )}
          />
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
          ['recruitment', c('Recrutement', 'Recruitment')],
        ].map(([id, label]) => (
          <a key={id} href={'#/union?tab=' + id} aria-current={tab === id ? 'page' : undefined}>
            {label}
          </a>
        ))}
      </nav>
      <p className="union-source-note">
        {c(
          'Espace indépendant du Hub, structuré d’après le communiqué de recrutement que vous avez transmis. Il ne remplace pas les canaux officiels de l’ISU. Les photos proviennent du site de référence, des présentations fournies et de la SIE ; elles illustrent les activités.',
          'Independent Hub space based on the supplied recruitment notice. It does not replace official ISU channels. Photos come from the reference site, supplied presentations and SIE, and illustrate the activities.',
        )}
      </p>
      {tab === 'actu' && (
        <>
          <section
            className="union-pathways"
            aria-label={c('Choisir mon parcours', 'Choose a pathway')}
          >
            <a href="#/union?tab=clubs">
              <img src="./media/club-volleyball.jpg" alt="" loading="lazy" />
              <div>
                <span>01 / {c('PARTICIPER', 'TAKE PART')}</span>
                <h2>{c('Un club pour chaque énergie.', 'A club for every interest.')}</h2>
                <p>
                  {c(
                    clubs.length +
                      ' clubs, des activités à découvrir et votre inscription au même endroit.',
                    clubs.length + ' clubs, activities to explore and registration in one place.',
                  )}{' '}
                  ↗
                </p>
              </div>
            </a>
            <a href="#/union?tab=departments">
              <img src="./media/community-workshop.jpg" alt="" loading="lazy" />
              <div>
                <span>02 / {c('S’ENGAGER', 'CONTRIBUTE')}</span>
                <h2>{c('Apportez votre idée.', 'Bring your ideas.')}</h2>
                <p>
                  {c(
                    'Huit départements au service de la communauté internationale.',
                    'Eight departments serving the international community.',
                  )}{' '}
                  ↗
                </p>
              </div>
            </a>
            <a
              href={
                currentAccount() && currentAccount()?.role !== 'applicant'
                  ? '#/club-office'
                  : '#/login'
              }
            >
              <img src="./media/club-film.jpg" alt="" loading="lazy" />
              <div>
                <span>03 / {c('ORGANISER', 'LEAD')}</span>
                <h2>{c('Faites vivre votre club.', 'Help your club thrive.')}</h2>
                <p>
                  {c(
                    'Responsables : inscriptions, articles, photos et vidéos.',
                    'Club leaders: registrations, articles, photos and videos.',
                  )}{' '}
                  ↗
                </p>
              </div>
            </a>
          </section>
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
                <img
                  src={'./media/' + departmentPhotos[d.id]}
                  alt={c('Illustration de la mission : ', 'Mission illustration: ') + c(d.fr, d.en)}
                  loading="lazy"
                />
                <div>
                  <span className="union-department-number">0{i + 1}</span>
                  <h3>{c(d.fr, d.en)}</h3>
                  <p>{c(d.summaryFr, d.summaryEn)}</p>
                  <a href="#/union?tab=recruitment">{c('M’engager', 'Get involved')} ↗</a>
                </div>
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
          <div className="union-clubs-banner">
            <img
              src="./media/community-sports.jpg"
              alt={c(
                'Sport et communauté à Xidian · archive',
                'Sport and community at Xidian · archive',
              )}
              loading="lazy"
            />
            <div>
              <span className="public-kicker">{c('TROUVEZ VOTRE ÉQUIPE', 'FIND YOUR PEOPLE')}</span>
              <h2>{c('Le prochain lien commence ici.', 'Your next connection starts here.')}</h2>
              <p>
                {c(
                  'Sur le terrain, sur scène ou autour d’une idée : explorez les clubs et préparez votre première visite.',
                  'On the court, on stage or around an idea: explore clubs and plan your first visit.',
                )}
              </p>
            </div>
          </div>
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
      <details className="union-visual-credits">
        <summary>
          {c('Sources des visuels et informations', 'Visual and information sources')}
        </summary>
        <p>
          {c(
            'Photographies du site de référence des nouveaux étudiants, des documents Xidian fournis et des pages officielles SIE liées aux actualités. Les images des départements et photos d’ambiance illustrent leurs missions, sans confirmer l’affiliation d’un groupe ou sa composition actuelle.',
            'Photographs from the reference freshman site, supplied Xidian documents and official SIE news pages. Department and context photos illustrate their missions without confirming a group’s affiliation or current membership.',
          )}
        </p>
        <a href="https://freshman-guide-and-clubs.onrender.com/" target="_blank" rel="noreferrer">
          {c('Site de référence des nouveaux étudiants', 'Reference freshman site')} ↗
        </a>
      </details>
    </div>
  );
}
