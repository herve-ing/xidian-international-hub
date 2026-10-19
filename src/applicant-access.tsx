import { localize } from './i18n';
import React, { useState } from 'react';
import { registerApplicant, loginStudent } from './accounts';
import { authErrorCode } from './auth-errors';
import { content } from './i18n';
export default function ApplicantAccess({ lang }: { lang: string }) {
  const c = (fr: string, en: string) => content(lang, fr, en),
    [register, setRegister] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  return (
    <section className="applicant-access public-container">
      <div className="applicant-intro">
        <span className="public-kicker">{c('VOTRE PROCHAIN CHAPITRE', 'YOUR NEXT CHAPTER')}</span>
        <h1>
          {c(
            'Un projet. Un dossier. Un espace à vous.',
            'One ambition. One application. Your own space.',
          )}
        </h1>
        <p>
          {c(
            'Aucun matricule Xidian nécessaire pour commencer. Retrouvez votre préparation, vos étapes et vos échanges avec les superviseurs.',
            'No Xidian student ID is needed to start. Keep your preparation, progress and supervisor conversations together.',
          )}
        </p>
        <img
          src="./media/classroom.jpg"
          alt={c(
            'Enseignement à Xidian, image du document fourni',
            'Teaching at Xidian, from the supplied presentation',
          )}
        />
        <p className="public-small-note">
          {c(
            'Prototype local indépendant. Ce compte ne crée pas de compte sur le portail officiel de Xidian. Utilisez des informations de démonstration.',
            'Independent local prototype. This does not create an account on Xidian’s official portal. Use demonstration details.',
          )}
        </p>
      </div>
      <div className="applicant-form-card">
        <div className="access-switch">
          <button
            aria-pressed={register}
            onClick={() => {
              setRegister(true);
              setError('');
            }}
          >
            {c('Créer mon compte', 'Create account')}
          </button>
          <button
            aria-pressed={!register}
            onClick={() => {
              setRegister(false);
              setError('');
            }}
          >
            {c('Me connecter', 'Sign in')}
          </button>
        </div>
        <h2>
          {register
            ? c('Mon compte candidat', 'My applicant account')
            : c('Reprendre mon dossier', 'Continue my application')}
        </h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError('');
            const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
            try {
              if (register) {
                if (d.password !== d.confirm) {
                  setError(c('Les mots de passe diffèrent.', 'Passwords do not match.'));
                  return;
                }
                await registerApplicant(
                  {
                    displayName: d.name,
                    email: d.email,
                    studentId: '',
                    nationality: d.nationality,
                    major: d.major,
                    grade: d.grade,
                    phone: d.phone,
                  },
                  d.password,
                );
              } else await loginStudent(d.email, d.password);
              window.dispatchEvent(new Event('xidian-auth'));
              window.location.hash = '/applications';
            } catch (err) {
              const code = authErrorCode(err);
              setError(
                code === 'duplicate'
                  ? c(
                      'Cet email possède déjà un compte. Connectez-vous.',
                      'This email already has an account. Sign in.',
                    )
                  : code === 'credentials'
                    ? c('Email ou mot de passe incorrect.', 'Incorrect email or password.')
                    : c(
                        'Vérifiez les champs et utilisez un mot de passe d’au moins 8 caractères.',
                        'Check the fields and use a password of at least 8 characters.',
                      ),
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          {register && (
            <>
              <label>
                <span>{c('Nom complet', 'Full name')}</span>
                <input name="name" required autoComplete="name" maxLength={120} />
              </label>
              <label>
                <span>{c('Nationalité', 'Nationality')}</span>
                <input name="nationality" required maxLength={80} />
              </label>
              <div className="two-fields">
                <label>
                  <span>{c('Niveau visé', 'Target degree')}</span>
                  <select name="grade">
                    <option value="Master">{localize(lang, 'Master')}</option>
                    <option value="PhD">{localize(lang, 'PhD')}</option>
                  </select>
                </label>
                <label>
                  <span>{c('Domaine souhaité', 'Intended major')}</span>
                  <input name="major" required maxLength={120} />
                </label>
              </div>
              <label>
                <span>{c('Téléphone avec indicatif', 'Phone with country code')}</span>
                <input name="phone" type="tel" required placeholder="+86 …" maxLength={26} />
              </label>
            </>
          )}
          <label>
            <span>{localize(lang, 'Email')}</span>
            <input name="email" required type="email" autoComplete="email" maxLength={160} />
          </label>
          <label>
            <span>{c('Mot de passe', 'Password')}</span>
            <input
              name="password"
              required
              type="password"
              minLength={8}
              autoComplete={register ? 'new-password' : 'current-password'}
              maxLength={128}
            />
          </label>
          {register && (
            <label>
              <span>{c('Confirmer le mot de passe', 'Confirm password')}</span>
              <input
                name="confirm"
                required
                type="password"
                minLength={8}
                autoComplete="new-password"
                maxLength={128}
              />
            </label>
          )}
          {error && (
            <p className="error-message" role="alert">
              {localize(lang, error)}
            </p>
          )}
          <button className="public-button" disabled={busy}>
            {busy
              ? c('Patientez…', 'Please wait…')
              : register
                ? c('Créer mon espace candidat', 'Create my applicant space')
                : c('Ouvrir mon dossier', 'Open my application')}{' '}
          </button>
        </form>
        <a href="#/login">
          {c(
            'Déjà étudiant, responsable de club ou professeur ?',
            'Current student, club leader or professor?',
          )}
        </a>
      </div>
    </section>
  );
}
