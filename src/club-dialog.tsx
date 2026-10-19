import MovieNight from './movie-night-ui';
import { clubLeaderNames } from './accounts';
import { ClubVisual } from './club-visual';
import { clubPhotos } from './community-imagery';
import React, { useEffect, useRef, useState } from 'react';
import { Icon } from './icons';
import { content } from './i18n';
import { currentAccount } from './accounts';
import type { Club, ClubDraft } from './clubs';
export function ClubDialog({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      className="club-dialog panel"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="section-heading">
        <h2>{title}</h2>
        <button
          type="button"
          className="icon-button"
          aria-label={content(
            typeof document === 'undefined' ? 'fr' : document.documentElement.lang,
            'Fermer',
            'Close',
            '关闭',
          )}
          onClick={onClose}
        >
          <Icon name="close" />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function ClubDetails({
  club,
  lang,
  saved,
  onSave,
  onApply,
  onPlan,
  onRegister,
  registrationLabel,
  onJournal,
  onClose,
}: {
  club: Club;
  lang: string;
  saved: boolean;
  onSave: () => void;
  onApply: () => void;
  onPlan: () => void;
  onRegister: () => void;
  registrationLabel: string;
  onJournal?: () => void;
  onClose: () => void;
}) {
  const c = (fr: string, en: string, zh?: string) => content(lang, fr, en, zh),
    tr = (v: string[]) => c(v[0], v[1], v[2]);
  const [activityTab, setActivityTab] = useState(() => {
    const params = new URLSearchParams(
      typeof window === 'undefined' ? '' : window.location.hash.split('?')[1],
    );
    return params.get('activity') === 'cinema' || params.get('tab') === 'cinema'
      ? 'cinema'
      : 'about';
  });
  return (
    <ClubDialog title={club.name} onClose={onClose}>
      {club.id === 'friday-movie-night' && (
        <div
          className="club-activity-tabs"
          role="tablist"
          aria-label={c('Activités du club', 'Club activities', '社团活动')}
        >
          <button
            role="tab"
            id="movie-about-tab"
            aria-controls="movie-about-panel"
            aria-selected={activityTab === 'about'}
            onClick={() => setActivityTab('about')}
          >
            {c('Le club', 'About the club', '关于社团')}
          </button>
          <button
            role="tab"
            id="movie-vote-tab"
            aria-controls="movie-vote-panel"
            aria-selected={activityTab === 'cinema'}
            onClick={() => setActivityTab('cinema')}
          >
            {c('Propositions & votes', 'Suggestions & voting', '推荐与投票')}
          </button>
        </div>
      )}
      {club.id === 'friday-movie-night' && activityTab === 'cinema' ? (
        <div id="movie-vote-panel" role="tabpanel" aria-labelledby="movie-vote-tab">
          <MovieNight lang={lang} embedded />
        </div>
      ) : (
        <div
          id={club.id === 'friday-movie-night' ? 'movie-about-panel' : undefined}
          role={club.id === 'friday-movie-night' ? 'tabpanel' : undefined}
          aria-labelledby={club.id === 'friday-movie-night' ? 'movie-about-tab' : undefined}
        >
          <div className={'club-detail-art ' + club.tone}>
            <ClubVisual club={club} />
            <span>{club.zh}</span>
          </div>
          {clubPhotos[club.id] && (
            <p className="muted small">
              {clubPhotos[club.id].context
                ? c(
                    'Photo d’ambiance : illustration de l’activité, sans représentation confirmée de l’équipe actuelle.',
                    'Context photo illustrating the activity, not a confirmed representation of the current team.',
                    '活动配图，不代表当前社团成员。',
                  )
                : c(
                    'Photo extraite du site de référence des nouveaux étudiants. Composition actuelle du club à confirmer.',
                    'Photo from the reference freshman site. Current club membership remains to be confirmed.',
                    '图片来自新生参考网站，当前成员须确认。',
                  )}
            </p>
          )}
          {club.id === 'friday-movie-night' && (
            <button className="button primary" onClick={() => setActivityTab('cinema')}>
              {c('Proposer un film et voter', 'Suggest a film and vote', '推荐影片并投票')} →
            </button>
          )}
          <p className="club-detail-intro">{tr(club.description)}</p>
          <h3>{c('À découvrir', 'What to explore', '活动方向')}</h3>
          <p>{tr(club.activity)}</p>
          <h3>{c('Préparer ma première visite', 'Prepare my first visit', '准备首次参加')}</h3>
          <p>{tr(club.kit)}</p>
          <div className="club-facts">
            {[
              c('Responsable', 'Organizer', '负责人'),
              c('Contact WeChat', 'WeChat contact', '微信联系人'),
              c('Groupe WeChat', 'WeChat group', '微信群'),
              c('Campus et lieu', 'Campus and venue', '校区与地点'),
              c(
                'Créneaux, niveaux et langues',
                'Schedule, levels and languages',
                '时间、水平与语言',
              ),
              c('Cotisation et matériel', 'Fees and equipment', '费用与器材'),
            ].map((label) => (
              <div key={label}>
                <span>{label}</span>
                <strong>
                  {label === c('Responsable', 'Organizer', '负责人') &&
                  (clubLeaderNames(club.id).length || club.organizer)
                    ? clubLeaderNames(club.id).join(' · ') || club.organizer
                    : label === c('Contact WeChat', 'WeChat contact', '微信联系人') && club.wechat
                      ? club.wechat
                      : c('À confirmer', 'To confirm', '待确认')}
                </strong>
              </div>
            ))}
          </div>
          {club.source && (
            <a className="text-button" href={club.source} target="_blank" rel="noreferrer">
              {c(
                'Source communautaire · vérifier les mises à jour',
                'Community source · check for updates',
                '社区来源 · 请核验更新',
              )}
              <Icon name="external" size={15} />
            </a>
          )}
          <p className="muted small">
            {c(
              'Club communiqué par la communauté. Présentation indicative ; modalités à valider avec les responsables.',
              'Club supplied by the community. Introductory content is indicative; confirm arrangements with organizers.',
              '社团名单由社区提供，简介仅供了解；具体安排请向负责人确认。',
            )}
          </p>
          <div className="club-detail-actions">
            {onJournal && (
              <button className="button secondary" onClick={onJournal}>
                {c('Voir les articles du club', 'View club stories', '查看社团文章')}
              </button>
            )}
            <button className="button primary" onClick={onRegister}>
              {registrationLabel}
              <Icon name="users" size={16} />
            </button>
            <button className="button secondary" onClick={onApply}>
              {c('Préparer ma demande', 'Prepare my request', '准备申请')}
              <Icon name="arrow" size={16} />
            </button>
            <button className="button secondary" onClick={onPlan}>
              {c('Planifier une visite', 'Plan a visit', '规划参加时间')}
            </button>
            <button className="text-button" onClick={onSave} aria-pressed={saved}>
              <Icon name={saved ? 'check' : 'bookmark'} size={16} />
              {saved ? c('Enregistré', 'Saved', '已收藏') : c('Enregistrer', 'Save', '收藏')}
            </button>
          </div>
        </div>
      )}
    </ClubDialog>
  );
}
export function ClubApplication({
  club,
  lang,
  draft,
  onSave,
  onClose,
}: {
  club: Club;
  lang: string;
  draft?: ClubDraft;
  onSave: (d: ClubDraft) => void;
  onClose: () => void;
}) {
  const c = (fr: string, en: string, zh?: string) => content(lang, fr, en, zh),
    account = currentAccount();
  const [level, setLevel] = useState(draft?.level || 'beginner'),
    [days, setDays] = useState<string[]>(draft?.days || []),
    [message, setMessage] = useState(draft?.message || ''),
    [includeContact, setIncludeContact] = useState(false),
    [copied, setCopied] = useState(false);
  const levels = [
    ['beginner', c('Débutant', 'Beginner', '初学者')],
    ['intermediate', c('Intermédiaire', 'Intermediate', '中级')],
    ['advanced', c('Confirmé', 'Advanced', '进阶')],
  ];
  const dayNames = [
    c('Lundi', 'Monday', '周一'),
    c('Mardi', 'Tuesday', '周二'),
    c('Mercredi', 'Wednesday', '周三'),
    c('Jeudi', 'Thursday', '周四'),
    c('Vendredi', 'Friday', '周五'),
    c('Samedi', 'Saturday', '周六'),
    c('Dimanche', 'Sunday', '周日'),
  ];
  const text = [
    c(
      'Bonjour, je souhaite en savoir plus sur votre club :',
      'Hello, I would like to learn more about your club:',
      '你好，我希望进一步了解贵社团：',
    ) +
      ' ' +
      club.name,
    account ? c('Nom', 'Name', '姓名') + ': ' + account.displayName : '',
    c('Niveau', 'Level', '水平') + ': ' + levels.find(([id]) => id === level)?.[1],
    days.length
      ? c('Disponibilités', 'Availability', '空闲时间') +
        ': ' +
        days.map((d) => dayNames[Number(d)]).join(', ')
      : '',
    message.trim(),
    c(
      'Pouvez-vous confirmer le lieu, les horaires, les modalités d’inscription, les frais éventuels et le matériel nécessaire ?',
      'Could you confirm the venue, schedule, registration process, any fees and required equipment?',
      '请问可否确认地点、时间、报名方式、可能的费用及所需器材？',
    ),
    includeContact && account
      ? c('Email', 'Email', '电子邮箱') +
        ': ' +
        account.email +
        '\n' +
        c('Téléphone', 'Phone', '电话') +
        ': ' +
        account.phone
      : '',
  ]
    .filter(Boolean)
    .join('\n\n');
  useEffect(() => setCopied(false), [text]);
  const save = () =>
    onSave({
      clubId: club.id,
      level,
      days,
      message: message.trim(),
      status: draft?.status || 'draft',
      updatedAt: new Date().toISOString(),
    });
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
      document.getElementById('club-message-preview')?.focus();
    }
  }
  return (
    <ClubDialog
      title={c('Ma demande', 'My request', '我的申请') + ' · ' + club.name}
      onClose={onClose}
    >
      <p className="info-box">
        {c(
          'Brouillon personnel : rien n’est envoyé au club et aucune adhésion n’est validée.',
          'Personal draft: nothing is sent to the club and no membership is confirmed.',
          '个人草稿：不会发送给社团，也不代表已获准加入。',
        )}
      </p>
      <form
        className="modal-form"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <label className="field">
          <span>{c('Mon niveau', 'My experience level', '我的经验水平')}</span>
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            {levels.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <fieldset className="club-day-options">
          <legend>{c('Mes disponibilités', 'My availability', '我的空闲时间')}</legend>
          {dayNames.map((name, i) => (
            <label key={i}>
              <input
                type="checkbox"
                checked={days.includes(String(i))}
                onChange={(e) =>
                  setDays(
                    e.target.checked
                      ? [...days, String(i)].sort()
                      : days.filter((d) => d !== String(i)),
                  )
                }
              />
              {name}
            </label>
          ))}
        </fieldset>
        <label className="field">
          <span>{c('Mes envies ou questions', 'My interests or questions', '我的兴趣或问题')}</span>
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setCopied(false);
            }}
            maxLength={800}
            rows={3}
          />
        </label>
        {account && (
          <label className="club-contact-consent">
            <input
              type="checkbox"
              checked={includeContact}
              onChange={(e) => setIncludeContact(e.target.checked)}
            />
            {c(
              'Inclure mon email et mon téléphone dans le message à copier',
              'Include my email and phone in the message to copy',
              '在复制的消息中包含我的邮箱和电话',
            )}
          </label>
        )}
        <label className="field">
          <span>{c('Message prêt à copier', 'Message ready to copy', '可复制的消息')}</span>
          <textarea id="club-message-preview" readOnly value={text} rows={7} />
        </label>
        <div className="club-detail-actions">
          <button className="button primary" type="submit">
            {c('Enregistrer mon brouillon', 'Save my draft', '保存草稿')}
          </button>
          <button className="button secondary" type="button" onClick={copy}>
            <Icon name={copied ? 'check' : 'file'} size={16} />
            {copied
              ? c('Copié', 'Copied', '已复制')
              : c('Copier le message', 'Copy message', '复制消息')}
          </button>
        </div>
        <p className="muted small">
          {c(
            'Si la copie automatique échoue, sélectionnez le texte ci-dessus. Vos coordonnées restent exclues par défaut.',
            'If automatic copying fails, select the text above. Contact details are excluded by default.',
            '如自动复制失败，请选择上方文字。默认不包含联系方式。',
          )}
        </p>
      </form>
    </ClubDialog>
  );
}
