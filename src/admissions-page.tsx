import { localize } from './i18n';
import React, { useState } from 'react';
import { content } from './i18n';
import { admissionsSteps, graduateProgrammes, officialPortal } from './admissions-data';
function SourceVisual({
  file,
  title,
  source,
  lang,
}: {
  file: string;
  title: string;
  source: string;
  lang: string;
}) {
  return (
    <figure className="admissions-source-visual">
      <a href={'./media/' + file + '.jpg'} target="_blank" rel="noreferrer" aria-label={title}>
        <img src={'./media/' + file + '.jpg'} alt={title} loading="lazy" />
      </a>
      <figcaption>
        {source} ·{' '}
        <a href={'./media/' + file + '.jpg'} target="_blank" rel="noreferrer">
          {content(lang, 'Agrandir', 'Enlarge')}
        </a>
      </figcaption>
    </figure>
  );
}
export default function Admissions({ lang }: { lang: string }) {
  const c = (fr: string, en: string) => content(lang, fr, en);
  const [level, setLevel] = useState('Master'),
    [search, setSearch] = useState('');
  const programmes = graduateProgrammes.filter(
    (p) =>
      p.level === level &&
      (p.major + ' ' + p.school + ' ' + localize(lang, p.major) + ' ' + localize(lang, p.school))
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <section className="admissions-public public-container admissions-expanded">
      <header className="admissions-story-hero">
        <div>
          <span className="public-kicker">
            {c('ADMISSIONS INTERNATIONALES', 'INTERNATIONAL ADMISSIONS')}
          </span>
          <h1>{c('Votre prochain chapitre commence ici.', 'Your next chapter starts here.')}</h1>
          <p>
            {c(
              'Un projet de recherche. Une rencontre. Un avenir à construire à Xidian.',
              'A research idea. A connection. A future to build at Xidian.',
            )}
          </p>
          <a className="public-button" href="#/supervisors">
            {c('Rencontrer les superviseurs', 'Explore supervisors')}
          </a>
        </div>
        <img
          src="./media/research-lab.jpg"
          alt={c(
            'Recherche à Xidian · visuel de la présentation fournie',
            'Research at Xidian · supplied presentation image',
          )}
        />
      </header>
      <nav
        className="admissions-section-nav"
        aria-label={c('Rubriques admissions', 'Admissions sections')}
      >
        {[
          ['programmes', c('Programmes', 'Programmes')],
          ['requirements', c('Mon dossier', 'My documents')],
          ['calendar', c('Calendrier', 'Timeline')],
          ['budget', c('Budget & bourses', 'Fees & scholarships')],
          ['research', c('Recherche', 'Research')],
          ['future', c('Partenaires & avenir', 'Partners & future')],
        ].map(([id, label]) => (
          <a
            key={id}
            href={'#/admissions?section=' + id}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('admission-' + id)?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {label}
          </a>
        ))}
      </nav>
      <div className="admissions-alert">
        <strong>
          {c('Guides 2026 · calendrier passé', '2026 guides · past application cycle')}
        </strong>
        <p>
          {c(
            'Les dates limites du 1er mars, du 17 mai et du 1er juillet 2026 sont passées. Cette page explique les documents fournis ; elle n’annonce aucune ouverture 2027. Faites confirmer les exigences du prochain cycle par la SIE.',
            'The 1 March, 17 May and 1 July 2026 deadlines have passed. This page explains the supplied documents; it does not announce a 2027 opening. Confirm next-cycle requirements with SIE.',
          )}
        </p>
      </div>
      <section id="admission-programmes" className="admission-content-section">
        <div className="public-section-title">
          <span className="public-kicker">01 / {c('CHOISIR SA VOIE', 'CHOOSE YOUR PATH')}</span>
          <h2>{c('Quel programme vous ressemble ?', 'Which programme fits your ambitions?')}</h2>
          <p>
            {c(
              '28 entrées Master et 21 entrées Doctorat dans les guides internationaux 2026. Les intitulés sont traduits pour la lecture ; les noms officiels restent consultables dans les guides PDF.',
              '28 Master and 21 doctoral entries in the 2026 international guides. Titles are translated for reading; consult the PDF guides for the official programme names.',
            )}
          </p>
        </div>
        <div className="programme-grid">
          {[
            ['Master', '3', '30 000', 'master-admissions-2026.pdf'],
            ['PhD', '4', '40 000', 'doctoral-admissions-2026.pdf'],
          ].map(([name, years, fee, file]) => (
            <article key={name}>
              <span className="public-kicker">
                {c('GUIDE FOURNI · 2026', 'SUPPLIED GUIDE · 2026')}
              </span>
              <h3>{name === 'PhD' ? c('Doctorat', 'Doctoral study') : 'Master'}</h3>
              <p>
                <strong>{years}</strong> {c('ans', 'years')} · <strong>{fee}</strong> RMB /{' '}
                {c('an', 'year')}
              </p>
              <a
                className="public-button"
                href={'./media/' + file}
                target="_blank"
                rel="noreferrer"
              >
                {c('Lire le guide PDF', 'Read the PDF guide')}
              </a>
            </article>
          ))}
        </div>
        <div className="admissions-programme-tools">
          <label>
            {c('Niveau', 'Degree')}
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="Master">{localize(lang, 'Master')}</option>
              <option value="PhD">{localize(lang, 'PhD')}</option>
            </select>
          </label>
          <label>
            {c('Rechercher une discipline ou une école', 'Search a discipline or school')}
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={localize(lang, 'Communication, Cyber, Physics…')}
            />
          </label>
          <span role="status">
            {programmes.length}{' '}
            {programmes.length === 1 ? c('entrée', 'entry') : c('entrées', 'entries')}
          </span>
        </div>
        <div className="admission-table-scroll">
          <table>
            <caption>
              {c('Offre internationale du guide 2026', '2026 guide international programme list')} ·{' '}
              {level}
            </caption>
            <thead>
              <tr>
                <th>{c('Discipline', 'Discipline')}</th>
                <th>{c('École / institut', 'School / institute')}</th>
                <th>{c('Langue du programme', 'Programme language')}</th>
              </tr>
            </thead>
            <tbody>
              {programmes.map((p) => (
                <tr key={p.school + p.major}>
                  <td>{localize(lang, p.major)}</td>
                  <td>{localize(lang, p.school)}</td>
                  <td>
                    {p.language === 'ZH/EN'
                      ? c('Chinois / anglais', 'Chinese / English')
                      : p.language === 'ZH'
                        ? c('Chinois', 'Chinese')
                        : c('Anglais', 'English')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!programmes.length && (
          <p role="status">
            {c(
              'Aucun programme trouvé. Essayez un autre mot-clé.',
              'No programmes found. Try another keyword.',
            )}
          </p>
        )}
        <p className="public-small-note">
          {c(
            'La langue du programme ne garantit pas celle d’un superviseur ni une place disponible. Source : guides Master et Doctorat 2026, pages 1–2.',
            'Programme language does not guarantee a supervisor’s language or an available place. Source: 2026 Master and Doctoral guides, pp. 1–2.',
          )}
        </p>
      </section>
      <section id="admission-requirements" className="admission-content-section">
        <div className="public-section-title">
          <span className="public-kicker">
            02 / {c('PRÉPARER SON DOSSIER', 'PREPARE YOUR APPLICATION')}
          </span>
          <h2>
            {c(
              'Les pièces qui font avancer votre projet.',
              'The documents that move your project forward.',
            )}
          </h2>
        </div>
        <div className="admission-requirement-grid">
          <div>
            <h3>{c('Admissibilité et langues', 'Eligibility and languages')}</h3>
            <p>
              {c(
                'Les guides demandent la nationalité non chinoise, un âge d’au moins 18 ans, le respect des règles de l’université et des lois chinoises, ainsi que les conditions de santé et de nationalité détaillées dans les PDF (dont JiaoWaiHan [2020] n° 12). Faites vérifier l’équivalence du diplôme et l’admissibilité de votre parcours par la SIE.',
                'The guides require non-Chinese citizenship, age 18 or above, compliance with university rules and Chinese laws, and the health and nationality conditions detailed in the PDFs (including JiaoWaiHan [2020] No. 12). Ask SIE to confirm degree equivalence and eligibility.',
              )}
            </p>
            <dl className="admission-language-list">
              <dt>{c('Cursus en chinois', 'Chinese-taught programmes')}</dt>
              <dd>
                {c(
                  'HSK 5 : au moins 180 pour les cursus chinois concernés. Le HSK 4 / 210 cité dans le tableau concerne une licence spécifique, pas une dispense générale pour les études supérieures.',
                  'HSK 5: at least 180 for the relevant Chinese-taught programmes. The HSK 4 / 210 entry in the table concerns a specific undergraduate programme, not a general graduate exemption.',
                )}
              </dd>
              <dt>{c('Cursus en anglais', 'English-taught programmes')}</dt>
              <dd>
                IELTS Academic ≥ 6.0 ({c('chaque composante ≥ 5.5', 'each band ≥ 5.5')}) · TOEFL ≥
                80 · Duolingo ≥ 110.
              </dd>
              <dt>{c('Autres justificatifs listés', 'Other listed qualifications')}</dt>
              <dd>
                A Level English: A · Cambridge FCE ≥ 169 / CAE ≥ 180 / CPE.{' '}
                {c(
                  'Conditions et justificatifs à confirmer pour votre programme.',
                  'Confirm applicable conditions and evidence for your programme.',
                )}
              </dd>
            </dl>
          </div>
          <SourceVisual
            lang={lang}
            file="smart-learning"
            title={c('Salles et laboratoire intelligents', 'Intelligent classrooms and laboratory')}
            source="260401-XDU Introduction · p. 18"
          />
        </div>
        <div className="admission-documents">
          {[
            [
              c('Diplôme et relevés', 'Diploma and transcripts'),
              c(
                'Diplôme le plus élevé, copie et notarisation pour les diplômes étrangers. Futurs diplômés : attestation de fin d’études prévisionnelle, puis diplôme et copie notariée après admission.',
                'Highest diploma, copy and notarization for overseas qualifications. Prospective graduates: pre-graduation certificate, then diploma and notarized copy after admission.',
              ),
            ],
            [
              c('Passeport', 'Passport'),
              c(
                'Page d’identité et couverture ; au moins deux ans de validité restante.',
                'Information page and cover; at least two years of validity remaining.',
              ),
            ],
            [
              c('Langue', 'Language proficiency'),
              c(
                'Certificat adapté à la langue du programme choisi.',
                'Certificate matching the language of your chosen programme.',
              ),
            ],
            [
              c('Santé et casier judiciaire', 'Health and criminal record'),
              c(
                'Formulaire d’examen médical des étrangers et certificat de non-condamnation : valables six mois à compter de leur émission.',
                'Foreigner Physical Examination Form and non-criminal record certificate: valid for six months from issue.',
              ),
            ],
            [
              c('Projet d’études', 'Study plan'),
              c(
                'Déclaration personnelle ou projet d’études : au moins 800 mots, en chinois ou en anglais.',
                'Personal statement or study plan: at least 800 words, in Chinese or English.',
              ),
            ],
            [
              c('Garantie financière', 'Financial guarantee'),
              c(
                'Justificatif bancaire du candidat ou des parents : solde d’au moins 30 000 RMB, avec cachet de la banque.',
                'Applicant’s or parents’ bank statement: balance of at least RMB 30,000, stamped by the bank.',
              ),
            ],
            [
              c('Vidéo de présentation', 'Introduction video'),
              c(
                '3 à 5 minutes : présentation personnelle, compréhension de la Chine et projet d’études en Chine, selon les guides Master/Doctorat.',
                '3–5 minutes: introduce yourself, your understanding of China and your study plan in China, as specified in the graduate guides.',
              ),
            ],
            [
              c('Préacceptation du superviseur', 'Supervisor pre-acceptance'),
              c(
                'Contacter un enseignant à l’avance pour obtenir la lettre de préacceptation Xidian. Une conversation dans le Hub ne constitue pas cette lettre.',
                'Contact faculty in advance to obtain Xidian’s pre-acceptance letter. A Hub conversation does not constitute this letter.',
              ),
            ],
            [
              c('Pièces complémentaires', 'Supporting documents'),
              c(
                'Relevés, recommandations, prix et publications selon le dossier. Si vous êtes déjà en Chine : pages de visa et de permis de séjour, attestation de scolarité/comportement de l’établissement actuel.',
                'Transcripts, recommendations, awards and publications as applicable. If already in China: visa and residence permit pages, and enrollment/performance certificate from your current institution.',
              ),
            ],
          ].map(([title, text], i) => (
            <article key={title}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="public-small-note">
          {c(
            'Référence : guides Master et Doctorat 2026, rubriques IV–VI, pages 2–3. Le CSCA mentionné dans la présentation générale concerne les candidatures en licence.',
            'Reference: 2026 graduate guides, sections IV–VI, pp. 2–3. The CSCA in the general presentation applies to undergraduate applicants.',
          )}
        </p>
      </section>
      <section id="admission-calendar" className="admission-content-section">
        <div className="public-section-title">
          <span className="public-kicker">03 / {c('LE PARCOURS', 'THE JOURNEY')}</span>
          <h2>{c('Une étape après l’autre.', 'One step at a time.')}</h2>
        </div>
        <div className="admission-steps">
          {admissionsSteps.map((s, i) => (
            <article key={s.id}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3>{c(s.fr, s.en)}</h3>
                <p>{c(s.descriptionFr, s.descriptionEn)}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="admission-table-scroll">
          <table>
            <caption>
              {c(
                'Calendrier historique 2026 · heure de Pékin (UTC+8)',
                'Historical 2026 timeline · Beijing time (UTC+8)',
              )}
            </caption>
            <thead>
              <tr>
                {[
                  c('Vague', 'Round'),
                  c('Clôture', 'Deadline'),
                  c('Entretien', 'Interview'),
                  c('Offre', 'Offer'),
                ].map((t) => (
                  <th key={t}>{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['1', '01.03.2026', '02–07.03.2026', '14.03.2026'],
                ['2', '17.05.2026', '18–22.05.2026', '29.05.2026'],
                ['3', '01.07.2026', '06–10.07.2026', '17.07.2026'],
              ].map((r) => (
                <tr key={r[0]}>
                  {r.map((v) => (
                    <td key={v}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          {c(
            'La bourse du gouvernement chinois est limitée à la première vague dans les guides 2026. La date de juillet de l’offre est normalisée en 2026 : le PDF contient une coquille « 20262 ».',
            'The 2026 guides restrict Chinese Government Scholarship applicants to round one. July’s offer date is normalized to 2026: the PDF has a “20262” typo.',
          )}
        </p>
      </section>
      <section id="admission-budget" className="admission-content-section">
        <div className="public-section-title">
          <span className="public-kicker">04 / {c('ANTICIPER', 'PLAN AHEAD')}</span>
          <h2>{c('Un budget à préparer en amont.', 'Plan your budget early.')}</h2>
        </div>
        <div className="admission-budget-grid">
          {[
            [
              c('Candidature', 'Application'),
              '800 RMB',
              c(
                'Frais de dossier indiqués dans les guides 2026.',
                'Application fee listed in the 2026 guides.',
              ),
            ],
            [
              c('Assurance médicale', 'Medical insurance'),
              '1 000 RMB / ' + c('an', 'year'),
              c('En plus des frais de scolarité.', 'In addition to tuition fees.'),
            ],
            [
              c('Logement', 'Accommodation'),
              '3 600–9 600 RMB / ' + c('an', 'year'),
              c(
                'Fourchette des guides Master/Doctorat. Places limitées, attribution par ordre d’arrivée ; logement extérieur à organiser si nécessaire.',
                'Graduate-guide range. Limited rooms allocated first come, first served; arrange off-campus housing if needed.',
              ),
            ],
            [
              c('Vie quotidienne à Xi’an', 'Living costs in Xi’an'),
              '1 500–2 200 RMB / ' + c('mois', 'month'),
              c(
                'Estimation de la présentation générale, p. 40. Budget personnel, voyage et démarches à prévoir en plus.',
                'General presentation estimate, p. 40. Allow separately for personal costs, travel and administrative procedures.',
              ),
            ],
          ].map(([name, value, desc]) => (
            <article key={name}>
              <h3>{name}</h3>
              <strong>{value}</strong>
              <p>{desc}</p>
            </article>
          ))}
        </div>
        <p className="public-small-note">
          {c(
            'Frais de scolarité : Master 30 000 RMB/an, Doctorat 40 000 RMB/an. Chiffres 2026, pas un devis pour une prochaine rentrée. Pour le logement, les guides de cycle priment ici sur la fourchette différente de la présentation générale.',
            'Tuition: Master RMB 30,000/year; PhD RMB 40,000/year. 2026 figures, not a quote for a future intake. The graduate guides take precedence here over the different general-presentation housing range.',
          )}
        </p>
        <h3>
          {c(
            'Les bourses mentionnées dans vos documents',
            'Scholarships mentioned in the supplied documents',
          )}
        </h3>
        <p>
          {c(
            'La présentation [0128], p. 42, cite la bourse du gouvernement chinois (scolarité, logement, allocation ; date 2026 : 1er mars), la bourse des cinq pays d’Asie centrale (scolarité, logement, allocation), Belt and Road (allocation) et Huashan (scolarité), avec le 1er juillet pour ces trois dernières. L’éligibilité, la couverture réelle et la procédure dépendent du dispositif ; aucune attribution n’est automatique.',
            'The [0128] presentation, p. 42, lists the Chinese Government Scholarship (tuition, accommodation, living allowance; 2026 deadline March 1), Central Asia Five-Nation Scholarship (tuition, accommodation, living allowance), Belt and Road (living allowance) and Huashan (tuition), with July 1 listed for the latter three. Eligibility, actual coverage and procedure vary; awards are never automatic.',
          )}
        </p>
      </section>
      <section id="admission-research" className="admission-content-section">
        <div className="public-section-title">
          <span className="public-kicker">
            05 / {c('APPRENDRE EN EXPLORANT', 'LEARN THROUGH DISCOVERY')}
          </span>
          <h2>{c('Des idées au laboratoire.', 'From ideas to the laboratory.')}</h2>
          <p>
            {c(
              'Télécommunications, microélectronique, détection de l’information, cybersécurité, intelligence artificielle, technologies aérospatiales et couplage antenne-électromécanique : les sept domaines présentés par Xidian.',
              'Telecommunications, microelectronics, information sensing, computer and cyber security, artificial intelligence, aerospace technology and antenna–electromechanical coupling: Xidian’s seven presented research areas.',
            )}
          </p>
        </div>
        <div className="admission-feature-row">
          <SourceVisual
            lang={lang}
            file="laboratory-facilities"
            title={c(
              'Équipements et installations de laboratoire',
              'Laboratory equipment and facilities',
            )}
            source="[0128] XIDIAN UNIVERSITY · p. 30"
          />
          <div>
            <h3>{c('Expérimenter, mesurer, concevoir.', 'Experiment, measure, design.')}</h3>
            <p>
              {c(
                'Les présentations montrent des bancs de mesure, des équipements RF et des espaces de travaux pratiques. Ils illustrent l’environnement scientifique ; l’accès dépend du programme et de l’équipe d’accueil.',
                'The presentations show measurement benches, RF equipment and practical teaching spaces. They illustrate the research environment; access depends on your programme and host team.',
              )}
            </p>
            <a className="public-button secondary" href="#/supervisors">
              {c('Trouver une équipe de recherche', 'Find a research team')}
            </a>
          </div>
        </div>
        <div className="admission-feature-row reverse">
          <SourceVisual
            lang={lang}
            file="research-fields"
            title={c('Les sept grands domaines de recherche', 'Seven major research areas')}
            source="260401-XDU Introduction · p. 24"
          />
          <div>
            <h3>{c('Relier les disciplines.', 'Connect disciplines.')}</h3>
            <p>
              {c(
                'Du signal aux systèmes, rapprochez votre projet des domaines d’un superviseur plutôt que du seul nom d’une école. Consultez son CV original et ses publications avant votre premier message.',
                'From signals to systems, match your project to a supervisor’s research rather than a school name alone. Read their original CV and publications before your first message.',
              )}
            </p>
          </div>
        </div>
        <div className="admission-feature-row">
          <SourceVisual
            lang={lang}
            file="research-centres"
            title={c('Centres de recherche présentés par Xidian', 'Xidian research centres')}
            source="260401-XDU Introduction · p. 25"
          />
          <div>
            <h3>
              {c('Un réseau de plateformes scientifiques.', 'A network of scientific platforms.')}
            </h3>
            <p>
              {c(
                'La présentation 260401 recense 13 centres nationaux, 65 provinciaux et 36 municipaux. Ce sont les chiffres de cette présentation, sans vérification d’un inventaire actualisé.',
                'The 260401 presentation lists 13 national, 65 provincial and 36 municipal research centres. These are the presentation’s figures, not a verified current inventory.',
              )}
            </p>
          </div>
        </div>
      </section>
      <section id="admission-future" className="admission-content-section">
        <div className="public-section-title">
          <span className="public-kicker">
            06 / {c('OUVRIR LES POSSIBLES', 'EXPAND YOUR HORIZONS')}
          </span>
          <h2>
            {c('Des connexions pour construire la suite.', 'Connections to shape what comes next.')}
          </h2>
        </div>
        <div className="admission-feature-row reverse">
          <SourceVisual
            lang={lang}
            file="joint-laboratories"
            title={c(
              'Coopérations scientifiques et laboratoires conjoints',
              'Research cooperation and joint laboratories',
            )}
            source="260401-XDU Introduction · p. 37"
          />
          <div>
            <h3>
              {c('Coopérations et laboratoires conjoints.', 'Cooperation and joint laboratories.')}
            </h3>
            <p>
              {c(
                'La présentation 260401 indique 68 laboratoires internationaux conjoints et 196 universités partenaires (p. 28). Les guides d’admission évoquent 194 universités dans 46 pays : ces périmètres ou dates peuvent différer. Les logos du visuel sont ceux du document, sans promesse d’accès à un partenariat.',
                'The 260401 presentation lists 68 joint international laboratories and 196 partner universities (p. 28). The admission guides mention 194 universities across 46 countries: scope or dates may differ. Logos belong to the supplied document and do not promise access to any partnership.',
              )}
            </p>
          </div>
        </div>
        <div className="admission-feature-row">
          <SourceVisual
            lang={lang}
            file="global-programmes"
            title={c(
              'Exemples de programmes internationaux',
              'Examples of international programmes',
            )}
            source="260401-XDU Introduction · p. 30"
          />
          <div>
            <h3>{c('Étudier au croisement des cultures.', 'Study across cultures.')}</h3>
            <p>
              {c(
                'La présentation illustre des programmes avec Heriot-Watt University, Polytech Nantes et l’Universidad de Guadalajara. Ces exemples ont leurs propres conditions ; ils ne sont pas une admission automatique à un double diplôme pour les candidats Master/Doctorat.',
                'The presentation illustrates programmes with Heriot-Watt University, Polytech Nantes and Universidad de Guadalajara. These examples have their own conditions; they do not automatically grant graduate applicants admission to a dual degree.',
              )}
            </p>
          </div>
        </div>
        <div className="admission-feature-row reverse">
          <SourceVisual
            lang={lang}
            file="joint-institutes"
            title={c(
              'Instituts conjoints UTAR et Xidian–FIAS',
              'UTAR and Xidian–FIAS joint institutes',
            )}
            source="260401-XDU Introduction · p. 33"
          />
          <div>
            <h3>{c('Des projets à l’international.', 'International initiatives.')}</h3>
            <p>
              {c(
                'Le document présente l’institut sino-malaisien avec Universiti Tunku Abdul Rahman, établi en 2024 à Kuala Lumpur, et le centre de recherche Xidian–FIAS avec le Frankfurt Institute for Advanced Studies, établi en 2019.',
                'The document presents the institute with Universiti Tunku Abdul Rahman, established in Kuala Lumpur in 2024, and the Xidian–FIAS research centre with the Frankfurt Institute for Advanced Studies, established in 2019.',
              )}
            </p>
          </div>
        </div>
        <div className="admission-feature-row">
          <SourceVisual
            lang={lang}
            file="xian-industry"
            title={c(
              'Écosystème électronique et numérique de Xi’an',
              'Xi’an electronics and information ecosystem',
            )}
            source="260401-XDU Introduction · p. 5"
          />
          <div>
            <h3>
              {c('Un environnement industriel à découvrir.', 'Explore an industrial ecosystem.')}
            </h3>
            <p>
              {c(
                'Huawei, ZTE, Intel et Samsung figurent dans la diapositive sur les entreprises de Xi’an. Il s’agit d’un contexte industriel, pas d’une liste d’offres d’emploi, de stages ou de partenaires recruteurs garantis.',
                'Huawei, ZTE, Intel and Samsung appear on the Xi’an industry slide. This describes an industrial context, not a list of guaranteed employers, internships or recruiting partners.',
              )}
            </p>
          </div>
        </div>
        <div className="admission-feature-row reverse">
          <SourceVisual
            lang={lang}
            file="career-pathways"
            title={c(
              'Trajectoires professionnelles présentées par Xidian',
              'Career pathways presented by Xidian',
            )}
            source="[0128] XIDIAN UNIVERSITY · p. 27"
          />
          <div>
            <h3>
              {c(
                'Plusieurs façons de mettre vos compétences en action.',
                'Different ways to put your skills to work.',
              )}
            </h3>
            <p>
              {c(
                'La présentation distingue l’application technologique, la recherche, la gestion et les passerelles culturelles. Selon votre spécialité, ces pistes peuvent orienter votre réflexion vers l’ingénierie, la R&D, la conduite de projets ou la coopération internationale.',
                'The presentation highlights technology application, research, management and cultural bridges. Depending on your discipline, these directions can help you explore engineering, R&D, project management or international cooperation.',
              )}
            </p>
          </div>
        </div>
        <SourceVisual
          lang={lang}
          file="graduate-destinations"
          title={c(
            'Entreprises et établissements cités dans les débouchés',
            'Companies and institutions shown under graduation outcomes',
          )}
          source="[0128] XIDIAN UNIVERSITY · p. 28"
        />
        <p className="public-small-note">
          {c(
            'Le visuel « Graduation Outcomes » reproduit les destinations citées dans la présentation ; il ne garantit aucun recrutement. Les taux de 95 % (licence) et 98 % (études supérieures) de la présentation 260401, p. 15, sont globaux : aucune statistique spécifique aux étudiants internationaux n’est fournie.',
            'The “Graduation Outcomes” visual reproduces destinations shown in the presentation; it does not guarantee recruitment. The 95% undergraduate and 98% postgraduate figures in 260401, p. 15, are university-wide: no international-student-specific statistic is provided.',
          )}
        </p>
      </section>
      <div className="admissions-actions">
        <div>
          <h2>{c('Commencez par votre préparation.', 'Start with your preparation.')}</h2>
          <p>
            {c(
              'Xidian accepte les candidatures directement des étudiants. Le Hub est indépendant et ne remplace ni la SIE ni le portail officiel.',
              'Xidian accepts applications directly from students. This independent Hub does not replace SIE or the official portal.',
            )}
          </p>
        </div>
        <a className="public-button" href="#/apply">
          {c('Créer mon espace candidat', 'Create my applicant space')}
        </a>
        <a
          className="public-button secondary"
          href={officialPortal}
          target="_blank"
          rel="noreferrer"
        >
          {c('Portail officiel · lien 2026', 'Official portal · 2026 link')}
        </a>
      </div>
      <p className="public-small-note">
        {c(
          'Sources : guides internationaux Master/Doctorat 2026 fournis (3 pages chacun), 260401-XDU Introduction (44 pages), [0128英文版] XIDIAN UNIVERSITY (43 pages). Images extraites des présentations, légendées à leur emplacement. Contact officiel :',
          'Sources: supplied 2026 Master/Doctoral guides (3 pages each), 260401-XDU Introduction (44 pages), [0128英文版] XIDIAN UNIVERSITY (43 pages). Presentation images are credited where shown. Official contact:',
        )}{' '}
        <a href="mailto:sie@xidian.edu.cn">sie@xidian.edu.cn</a> ·{' '}
        <a href="tel:+862981891038">+86-29-81891038</a>
      </p>
    </section>
  );
}
