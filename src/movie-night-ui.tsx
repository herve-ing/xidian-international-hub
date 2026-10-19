import React, { useEffect, useState } from 'react';
import { content } from './i18n';
import { currentAccount } from './accounts';
import { clubs } from './clubs';
import { ClubRegistration } from './club-registration';
import {
  movieBoard,
  proposeMovie,
  moderateMovie,
  setMoviePhase,
  voteMovie,
  chooseMovie,
  newMovieRound,
  MovieError,
  movieClubId,
} from './movie-night';
export default function MovieNight({
  lang,
  embedded = false,
}: {
  lang: string;
  embedded?: boolean;
}) {
  const c = (fr: string, en: string) => content(lang, fr, en);
  const [board, setBoard] = useState(movieBoard),
    [title, setTitle] = useState(''),
    [year, setYear] = useState(''),
    [reason, setReason] = useState(''),
    [roundName, setRoundName] = useState(''),
    [registration, setRegistration] = useState(false),
    [message, setMessage] = useState('');
  const refresh = () => setBoard(movieBoard());
  useEffect(() => {
    for (const event of ['storage', 'focus', 'xidian-movies'])
      window.addEventListener(event, refresh);
    return () => {
      for (const event of ['storage', 'focus', 'xidian-movies'])
        window.removeEventListener(event, refresh);
    };
  }, []);
  const errors: Record<string, string> = {
    signin: c('Connectez-vous avec votre compte étudiant.', 'Sign in with your student account.'),
    member: c(
      'Une inscription active à Friday Movie Night est nécessaire.',
      'An active Friday Movie Night registration is required.',
    ),
    manager: c(
      'Action réservée au responsable de ce club ou à un professeur.',
      'Only this club’s leader or a professor can do this.',
    ),
    phase: c(
      'Cette action n’est pas disponible à cette étape.',
      'This action is not available at this stage.',
    ),
    duplicate: c(
      'Ce film et cette année ont déjà été proposés.',
      'This film and year have already been suggested.',
    ),
    limit: c(
      'Maximum cinq propositions par membre et cent par séance.',
      'Maximum five suggestions per member and one hundred per session.',
    ),
    invalid: c(
      'Vérifiez le titre, l’année et la longueur du texte.',
      'Check the title, year and text length.',
    ),
    empty: c(
      'Validez au moins un film avant d’ouvrir le vote.',
      'Approve at least one film before opening voting.',
    ),
    proposal: c('Cette proposition n’est pas disponible.', 'This suggestion is unavailable.'),
  };
  function act(fn: () => void, success: string) {
    try {
      fn();
      refresh();
      setMessage(success);
    } catch (e) {
      setMessage(errors[e instanceof MovieError ? e.code : 'invalid'] || errors.invalid);
    }
  }
  const phase =
    board.phase === 'collecting'
      ? c('Propositions ouvertes', 'Suggestions open')
      : board.phase === 'voting'
        ? c('Vote ouvert', 'Voting open')
        : c('Vote clôturé', 'Voting closed');
  const chosen = board.proposals.find((p) => p.id === board.chosenId);
  return (
    <section className="movie-night-space">
      {!embedded && (
        <header className="movie-night-hero">
          <img
            src="./media/friday-movie-night.jpg"
            alt={c(
              'Soirée cinéma du site de référence des nouveaux étudiants',
              'Movie-night photo from the reference freshman site',
            )}
          />
          <div>
            <span className="public-kicker">FRIDAY MOVIE NIGHT</span>
            <h2>
              {c('Le prochain film ?\nÀ vous de choisir.', 'The next movie?\nYou help choose.')}
            </h2>
            <p>
              {c(
                'Rejoignez le club, proposez un film et participez au vote de la prochaine séance.',
                'Join the club, suggest a movie and vote for the next session.',
              )}
            </p>
            <a
              href="https://ghazzali19.github.io/friday-Movie-Night/"
              target="_blank"
              rel="noreferrer"
            >
              {c('Site de référence du club', 'Club reference site')} ↗
            </a>
          </div>
        </header>
      )}
      <p className="info-box">
        {c(
          'Démonstration locale : inscriptions, propositions, votes et résultats restent dans ce navigateur. Une inscription en attente ou approuvée permet de participer ; une inscription annulée ou refusée ne le permet plus. Aucune séance n’est confirmée automatiquement.',
          'Local demo: registrations, suggestions, votes and results stay in this browser. Pending or approved registrations allow participation; cancelled or declined registrations do not. No screening is automatically confirmed.',
        )}
      </p>
      <div className="movie-phase-bar">
        <div>
          <span>{phase}</span>
          <h3>{board.name}</h3>
        </div>
        <strong>
          {board.totalVotes} {c('votes', 'votes')}
        </strong>
        {!board.canParticipate &&
          !board.canManage &&
          (currentAccount()?.role === 'applicant' ? (
            <p>
              {c(
                'Espace réservé aux étudiants inscrits à Xidian.',
                'For enrolled Xidian students.',
              )}
            </p>
          ) : (
            <button className="button primary" onClick={() => setRegistration(true)}>
              {c('M’inscrire au club', 'Register with the club')}
            </button>
          ))}
      </div>
      {message && (
        <p role="status" className="info-box">
          {message}
        </p>
      )}
      {chosen && (
        <div className="movie-chosen">
          <span>{c('CHOIX CONFIRMÉ PAR LE RESPONSABLE', 'CONFIRMED BY THE ORGANIZER')}</span>
          <h3>
            {chosen.title} {chosen.year && '(' + chosen.year + ')'}
          </h3>
          <p>
            {c(
              'Le responsable doit communiquer séparément l’horaire, la salle et les modalités de projection.',
              'The organizer must separately communicate the screening time, venue and arrangements.',
            )}
          </p>
        </div>
      )}
      {board.canManage && (
        <section className="movie-admin">
          <h3>{c('Gestion de la séance', 'Session management')}</h3>
          <p>
            {c(
              '1. Valider les propositions · 2. Ouvrir le vote · 3. Clôturer · 4. Confirmer le film. Les propositions sont figées pendant le vote.',
              '1. Approve suggestions · 2. Open voting · 3. Close voting · 4. Confirm the film. Suggestions are frozen while voting is open.',
            )}
          </p>
          <div className="movie-actions">
            {board.phase === 'collecting' && (
              <button
                className="button primary"
                onClick={() =>
                  act(() => setMoviePhase('voting'), c('Le vote est ouvert.', 'Voting is open.'))
                }
              >
                {c('Ouvrir le vote', 'Open voting')}
              </button>
            )}
            {board.phase !== 'closed' && (
              <button
                className="button secondary"
                onClick={() =>
                  act(
                    () => setMoviePhase('closed'),
                    c(
                      'Séance clôturée. Choisissez le film retenu.',
                      'Round closed. Confirm the chosen film.',
                    ),
                  )
                }
              >
                {c('Clôturer cette séance', 'Close this round')}
              </button>
            )}
          </div>
          {board.phase === 'closed' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                act(
                  () => {
                    newMovieRound(roundName);
                    setRoundName('');
                  },
                  c('Nouvelle séance créée.', 'New round created.'),
                );
              }}
            >
              <label>
                {c('Nom de la prochaine séance', 'Next round name')}
                <input
                  required
                  value={roundName}
                  maxLength={100}
                  onChange={(e) => setRoundName(e.target.value)}
                  placeholder={c('Ex. Séance de novembre', 'E.g. November screening')}
                />
              </label>
              <button className="button secondary">
                {c('Créer la prochaine séance', 'Create next round')}
              </button>
            </form>
          )}
        </section>
      )}
      {board.canParticipate && board.phase === 'collecting' && (
        <form
          className="movie-proposal-form"
          onSubmit={(e) => {
            e.preventDefault();
            act(
              () => {
                proposeMovie({ title, year, reason });
                setTitle('');
                setYear('');
                setReason('');
              },
              c(
                'Proposition envoyée au responsable pour validation.',
                'Suggestion sent to the organizer for approval.',
              ),
            );
          }}
        >
          <h3>{c('Proposer un film', 'Suggest a movie')}</h3>
          <div className="movie-form-row">
            <label>
              {c('Titre du film', 'Movie title')}
              <input
                required
                maxLength={120}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label>
              {c('Année (facultatif)', 'Year (optional)')}
              <input
                inputMode="numeric"
                maxLength={4}
                pattern="(18|19|20|21)[0-9]{2}"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </label>
          </div>
          <label>
            {c(
              'Pourquoi ce film ? Langue et sous-titres souhaités',
              'Why this movie? Preferred language and subtitles',
            )}
            <textarea
              maxLength={800}
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </label>
          <button className="button primary">
            {c('Envoyer la proposition', 'Submit suggestion')}
          </button>
        </form>
      )}
      <div className="movie-proposal-grid">
        {board.proposals.map((p) => (
          <article key={p.id}>
            <span className="public-kicker">
              {p.status === 'pending'
                ? c('À MODÉRER', 'PENDING REVIEW')
                : p.status === 'rejected'
                  ? c('NON RETENU', 'NOT APPROVED')
                  : c('FILM VALIDÉ', 'APPROVED FILM')}
              {p.mine ? ' · ' + c('MA PROPOSITION', 'MY SUGGESTION') : ''}
            </span>
            <h3>{p.title}</h3>
            {p.year && <small>{p.year}</small>}
            <p>{p.reason}</p>
            {p.status === 'approved' && (
              <div className="movie-vote-count">
                <strong>{p.votes}</strong> {c('votes', 'votes')}
                <progress
                  max={Math.max(board.totalVotes, 1)}
                  value={p.votes}
                  aria-label={c('Votes pour ', 'Votes for ') + p.title}
                />
              </div>
            )}
            <div className="movie-actions">
              {board.canParticipate && board.phase === 'voting' && p.status === 'approved' && (
                <button
                  className="button primary"
                  disabled={board.vote === p.id}
                  onClick={() =>
                    act(
                      () => voteMovie(p.id),
                      c(
                        'Vote enregistré. Vous pouvez le modifier tant que le vote est ouvert.',
                        'Vote saved. You can change it while voting is open.',
                      ),
                    )
                  }
                >
                  {board.vote === p.id
                    ? c('Mon vote ✓', 'My vote ✓')
                    : c('Voter pour ce film', 'Vote for this movie')}
                </button>
              )}
              {board.canManage && board.phase === 'collecting' && (
                <>
                  <button
                    className="button secondary"
                    disabled={p.status === 'approved'}
                    onClick={() =>
                      act(
                        () => moderateMovie(p.id, 'approved'),
                        c('Film validé.', 'Movie approved.'),
                      )
                    }
                  >
                    {c('Valider', 'Approve')}
                  </button>
                  <button
                    className="button secondary"
                    disabled={p.status === 'rejected'}
                    onClick={() =>
                      act(
                        () => moderateMovie(p.id, 'rejected'),
                        c('Proposition non retenue.', 'Suggestion not approved.'),
                      )
                    }
                  >
                    {c('Ne pas retenir', 'Reject')}
                  </button>
                </>
              )}
              {board.canManage && board.phase === 'closed' && p.status === 'approved' && (
                <button
                  className="button secondary"
                  onClick={() =>
                    act(
                      () => chooseMovie(p.id),
                      c('Film retenu pour cette séance.', 'Film confirmed for this round.'),
                    )
                  }
                >
                  {c('Retenir ce film', 'Confirm this film')}
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
      {!board.proposals.length && (
        <p className="journal-empty">
          {c(
            'Les propositions apparaîtront ici après validation. Vos propres propositions en attente restent visibles pour vous et les responsables.',
            'Approved suggestions will appear here. Your own pending suggestions remain visible to you and organizers.',
          )}
        </p>
      )}
      <p className="muted small">
        {c(
          'Un seul vote par compte et par séance, modifiable pendant le vote. Les noms des votants ne sont pas affichés. Le choix final est confirmé par le responsable.',
          'One vote per account per round, changeable while voting is open. Voters’ names are not displayed. The organizer confirms the final selection.',
        )}
      </p>
      {board.history.length > 0 && (
        <details>
          <summary>{c('Séances précédentes', 'Previous rounds')}</summary>
          {board.history.map((h) => (
            <p key={h.id}>
              {h.name} · {h.title || c('Aucun film confirmé', 'No film confirmed')}
            </p>
          ))}
        </details>
      )}
      {registration && (
        <ClubRegistration
          club={clubs.find((c) => c.id === movieClubId)!}
          lang={lang}
          onClose={() => setRegistration(false)}
          onSaved={() => {
            setRegistration(false);
            refresh();
          }}
        />
      )}
    </section>
  );
}
