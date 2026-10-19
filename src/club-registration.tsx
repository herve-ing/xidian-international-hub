import React, { useState } from 'react';
import { content } from './i18n';
import { currentAccount } from './accounts';
import { clubs, type Club } from './clubs';
import { submitEnrollment, enrollmentStatus, type Enrollment } from './club-enrollments';
import { ClubDialog } from './club-dialog';
export function ClubRegistration({
  club,
  lang,
  onClose,
  onSaved,
}: {
  club: Club;
  lang: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const c = (fr: string, en: string, zh?: string) => content(lang, fr, en, zh),
    account = currentAccount();
  const [level, setLevel] = useState('beginner'),
    [message, setMessage] = useState(''),
    [consent, setConsent] = useState(false),
    [sharePhone, setSharePhone] = useState(false),
    [error, setError] = useState(false),
    [busy, setBusy] = useState(false);
  const intro = c(
    'Inscription locale du prototype : elle sera visible aux responsables du même navigateur. Aucun envoi email ou WeChat, ni synchronisation entre appareils.',
    'Local prototype registration: visible to leaders in this browser. No email or WeChat delivery, and no cross-device synchronization.',
    '原型本地报名：同一浏览器内的负责人可查看。不发送邮件或微信，也不跨设备同步。',
  );
  const login = () => {
    sessionStorage.setItem('xidian-club-intent', club.id);
    window.location.hash = '/login';
  };
  return (
    <ClubDialog
      title={c('Inscription au club', 'Club registration', '社团报名') + ' · ' + club.name}
      onClose={onClose}
    >
      {!account ? (
        <>
          <p>
            {c(
              'Connectez-vous ou créez votre compte étudiant pour vous inscrire. Vous retrouverez ensuite ce club.',
              'Sign in or create a student account to register. You will return to this club.',
              '请登录或创建学生账户进行报名，随后将返回此社团。',
            )}
          </p>
          <button className="button primary" onClick={login}>
            {c('Se connecter pour s’inscrire', 'Sign in to register', '登录后报名')}
          </button>
        </>
      ) : account.role === 'club_leader' && account.clubIds?.includes(club.id) ? (
        <p>
          {c(
            'Vous êtes responsable de ce club. Retrouvez ses inscriptions dans Gestion des clubs.',
            'You lead this club. Find its registrations in Club management.',
            '你是该社团负责人，可在社团管理中查看报名。',
          )}
        </p>
      ) : (
        <>
          <p className="info-box">{intro}</p>
          <dl className="registration-profile">
            <div>
              <dt>{c('Nom', 'Name', '姓名')}</dt>
              <dd>{account.displayName}</dd>
            </div>
            <div>
              <dt>{c('Matricule étudiant', 'Student ID', '学号')}</dt>
              <dd>{account.studentId || '—'}</dd>
            </div>
            <div>
              <dt>{c('Spécialité / major', 'Major', '专业')}</dt>
              <dd>
                {account.major} · {account.grade}
              </dd>
            </div>
            <div>
              <dt>{c('Email', 'Email', '电子邮箱')}</dt>
              <dd>{account.email}</dd>
            </div>
          </dl>
          <form
            className="modal-form"
            onSubmit={(e) => {
              e.preventDefault();
              setBusy(true);
              setError(false);
              try {
                submitEnrollment({
                  clubId: club.id,
                  level,
                  days: [],
                  message,
                  sharePhone,
                  consent,
                });
                onSaved();
              } catch {
                setError(true);
              } finally {
                setBusy(false);
              }
            }}
          >
            <label className="field">
              <span>{c('Mon niveau', 'My experience level', '我的经验水平')}</span>
              <select value={level} onChange={(e) => setLevel(e.target.value)}>
                {[
                  ['beginner', c('Débutant', 'Beginner', '初学者')],
                  ['intermediate', c('Intermédiaire', 'Intermediate', '中级')],
                  ['advanced', c('Confirmé', 'Advanced', '进阶')],
                ].map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>
                {c(
                  'Motivation et disponibilités',
                  'Motivation and availability',
                  '报名动机与空闲时间',
                )}
              </span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                maxLength={800}
              />
            </label>
            <label className="club-contact-consent">
              <input
                type="checkbox"
                checked={sharePhone}
                onChange={(e) => setSharePhone(e.target.checked)}
              />
              {c(
                'Partager aussi mon téléphone avec les responsables',
                'Also share my phone with the leaders',
                '同时向负责人提供我的电话',
              )}{' '}
              · {account.phone}
            </label>
            <label className="club-contact-consent">
              <input
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              {c(
                'J’autorise les responsables de ce club et les professeurs à consulter mon nom, matricule, spécialité, niveau, email et ma demande pour traiter cette inscription.',
                'I allow this club’s leaders and professors to view my name, student ID, major, grade, email and application to process this registration.',
                '我同意该社团负责人与教师查看我的姓名、学号、专业、学习层次、邮箱及申请，以处理此报名。',
              )}
            </label>
            {error && (
              <p role="alert" className="error-message">
                {c(
                  'Inscription impossible : vérifiez les champs et vos inscriptions existantes, puis réessayez.',
                  'Unable to register: check the fields and existing registrations, then try again.',
                  '无法报名：请检查所填内容及已有报名后重试。',
                )}
              </p>
            )}
            <button className="button primary" disabled={busy || !consent}>
              {c('Confirmer mon inscription', 'Confirm my registration', '确认报名')}
            </button>
            <p className="muted small">
              {c(
                'Le statut sera « À examiner » jusqu’à la décision du responsable.',
                'Status will remain Pending review until a leader decides.',
                '负责人作出决定前，状态为待审核。',
              )}
            </p>
          </form>
        </>
      )}
    </ClubDialog>
  );
}
export function MyRegistrations({
  lang,
  items,
  onCancel,
  onRegister,
}: {
  lang: string;
  items: Enrollment[];
  onCancel: (id: string) => void;
  onRegister: (club: Club) => void;
}) {
  const c = (fr: string, en: string, zh?: string) => content(lang, fr, en, zh);
  return (
    <section className="my-registrations">
      <h2>{c('Mes inscriptions aux clubs', 'My club registrations', '我的社团报名')}</h2>
      <p className="muted">
        {c(
          'Suivez les décisions et gérez vos inscriptions enregistrées dans ce navigateur.',
          'Track decisions and manage registrations saved in this browser.',
          '跟进决定并管理保存在此浏览器内的报名。',
        )}
      </p>
      {!items.length && (
        <div className="panel empty">
          <p>
            {c(
              'Aucune inscription pour le moment. Ouvrez une fiche de club pour vous inscrire.',
              'No registrations yet. Open a club profile to register.',
              '暂无报名，请打开社团详情进行报名。',
            )}
          </p>
        </div>
      )}
      {[...items]
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .map((e) => {
          const club = clubs.find((c) => c.id === e.clubId)!;
          return (
            <article className="panel registration-card" key={e.id}>
              <div className="section-heading">
                <h3>{club.name}</h3>
                <span
                  className={
                    'status ' +
                    (e.status === 'approved'
                      ? 'safe'
                      : e.status === 'pending'
                        ? 'warning'
                        : 'neutral')
                  }
                >
                  {c(...enrollmentStatus(lang, e.status))}
                </span>
              </div>
              <p className="muted small">
                {new Intl.DateTimeFormat(lang === 'ary' ? 'ar-MA' : lang === 'ln' ? 'fr' : lang, {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                  timeZone: 'Asia/Shanghai',
                }).format(new Date(e.updatedAt))}{' '}
                · {c('Heure de Pékin', 'Beijing time', '北京时间')}
              </p>
              {e.message && <p>{e.message}</p>}
              {e.reviewNote && (
                <div className="info-box">
                  <strong>{c('Réponse du responsable', 'Leader response', '负责人回复')}</strong>
                  <p>{e.reviewNote}</p>
                </div>
              )}
              <details>
                <summary>{c('Historique', 'History', '历史记录')}</summary>
                <ol>
                  {e.history.map((h, i) => (
                    <li key={i}>
                      {c(...enrollmentStatus(lang, h.status))} ·{' '}
                      {new Intl.DateTimeFormat(
                        lang === 'ary' ? 'ar-MA' : lang === 'ln' ? 'fr' : lang,
                        { dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Shanghai' },
                      ).format(new Date(h.at))}
                    </li>
                  ))}
                </ol>
              </details>
              <div className="club-detail-actions">
                {['pending', 'approved'].includes(e.status) ? (
                  <button className="button secondary" onClick={() => onCancel(e.id)}>
                    {e.status === 'approved'
                      ? c('Quitter ce club', 'Leave this club', '退出此社团')
                      : c('Annuler mon inscription', 'Cancel my registration', '取消我的报名')}
                  </button>
                ) : (
                  <button className="button secondary" onClick={() => onRegister(club)}>
                    {c('Me réinscrire', 'Register again', '重新报名')}
                  </button>
                )}
              </div>
            </article>
          );
        })}
    </section>
  );
}
