import React, { useEffect, useState } from 'react';
import { content } from './i18n';
import { clubs, type Club } from './clubs';
import { currentAccount, managedClubIds, studentAccounts } from './accounts';
import {
  createClub,
  editableArticles,
  saveArticle,
  deleteArticle,
  storeMedia,
  type ClubArticle,
  type ArticleMedia,
} from './club-publishing';
import { ArticleMediaView, ArticleReader } from './club-journal';
import { ClubDialog } from './club-dialog';
export default function ClubStudio({ lang, onChange }: { lang: string; onChange: () => void }) {
  const c = (fr: string, en: string, zh?: string) => content(lang, fr, en, zh),
    account = currentAccount(),
    professor = account?.role === 'professor',
    accessible = clubs.filter((x) => managedClubIds(account).includes(x.id));
  const [articles, setArticles] = useState(editableArticles),
    [editing, setEditing] = useState(false),
    [articleId, setArticleId] = useState<string | undefined>(),
    [clubId, setClubId] = useState(accessible[0]?.id || ''),
    [title, setTitle] = useState(''),
    [body, setBody] = useState(''),
    [language, setLanguage] = useState('fr'),
    [media, setMedia] = useState<ArticleMedia[]>([]),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(''),
    [preview, setPreview] = useState<ClubArticle | null>(null),
    [creating, setCreating] = useState(false),
    [remove, setRemove] = useState<ClubArticle | null>(null);
  useEffect(() => {
    const refresh = () => setArticles(editableArticles());
    window.addEventListener('focus', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);
  function edit(article?: ClubArticle) {
    setArticleId(article?.id);
    setClubId(article?.clubId || accessible[0]?.id || '');
    setTitle(article?.title || '');
    setBody(article?.body || '');
    setLanguage(
      article?.language ||
        (['fr', 'en', 'zh', 'ar', 'es', 'ln', 'ru', 'tr', 'ary', 'tk', 'ur'].includes(lang)
          ? lang
          : 'en'),
    );
    setMedia(article?.media || []);
    setNotice('');
    setEditing(true);
  }
  function save(status: 'draft' | 'published') {
    try {
      saveArticle({ id: articleId, clubId, title, body, language, status, media });
      setArticles(editableArticles());
      setEditing(false);
      setNotice(status === 'published' ? 'published' : 'draft');
      onChange();
    } catch {
      setNotice('error');
    }
  }
  async function attach(files: FileList | null) {
    if (!files?.length) return;
    if (media.length + files.length > 6) {
      setNotice('limit');
      return;
    }
    setBusy(true);
    const uploaded: ArticleMedia[] = [];
    try {
      for (const file of Array.from(files)) uploaded.push(await storeMedia(file, clubId));
      setMedia((old) => [...old, ...uploaded]);
      setNotice('');
    } catch {
      setMedia((old) => [...old, ...uploaded]);
      setNotice('media');
    } finally {
      setBusy(false);
    }
  }
  const messages: Record<string, [string, string, string]> = {
    published: [
      'Article publié dans le journal des clubs sur ce navigateur.',
      'Story published to the club journal in this browser.',
      '文章已发布至此浏览器的社团动态。',
    ],
    draft: ['Brouillon enregistré.', 'Draft saved.', '草稿已保存。'],
    created: [
      'Club créé et responsable attribué si sélectionné. Il est maintenant disponible dans l’annuaire.',
      'Club created, with a leader assigned if selected. It is now available in the directory.',
      '社团已创建。如选择了负责人，已完成分配，现可在目录中查看。',
    ],
    deleted: ['Article supprimé.', 'Story deleted.', '文章已删除。'],
    limit: ['Maximum 6 médias par article.', 'Maximum 6 files per story.', '每篇最多6个媒体文件。'],
    media: [
      'Média refusé ou stockage indisponible. Images JPG/PNG/WebP/GIF : 8 Mo ; vidéos MP4/WebM/OGG : 50 Mo.',
      'File rejected or storage unavailable. JPG/PNG/WebP/GIF images: 8 MB; MP4/WebM/OGG videos: 50 MB.',
      '文件不支持或存储不可用。JPG/PNG/WebP/GIF图片不超过8MB，MP4/WebM/OGG视频不超过50MB。',
    ],
    error: [
      'Enregistrement impossible. Vérifiez les champs et vos droits.',
      'Unable to save. Check the fields and your permissions.',
      '无法保存，请检查字段与权限。',
    ],
  };
  return (
    <section className="club-studio">
      <div className="studio-heading">
        <div>
          <span className="eyebrow">
            {c('ATELIER ÉDITORIAL', 'EDITORIAL STUDIO', '内容工作室')}
          </span>
          <h2>
            {c(
              'Faites vivre votre communauté.',
              'Bring your community to life.',
              '让社团充满活力。',
            )}
          </h2>
          <p>
            {c(
              'Une actualité, un reportage, un projet. Partagez ce qui compte pour votre club.',
              'News, a recap or a project. Share what matters to your club.',
              '发布新闻、活动回顾或项目，分享社团的重要时刻。',
            )}
          </p>
        </div>
        <div className="row">
          <button className="button primary" onClick={() => edit()} disabled={!accessible.length}>
            {c('Écrire un article', 'Write a story', '撰写文章')}
          </button>
          {professor && (
            <button
              className="button secondary"
              onClick={() => {
                setNotice('');
                setCreating(true);
              }}
            >
              {c('Créer un club', 'Create a club', '创建社团')}
            </button>
          )}
        </div>
      </div>
      {notice && (
        <p className="info-box" role="status">
          {c(...(messages[notice] || messages.error))}
        </p>
      )}
      <div className="studio-guide">
        <h3>{c('Avant de publier', 'Before publishing', '发布前须知')}</h3>
        <p>
          {c(
            'Vérifiez les informations, demandez l’accord des personnes photographiées et ajoutez une légende descriptive. Les articles publiés sont visibles par tous les visiteurs de ce navigateur.',
            'Verify details, obtain consent from people pictured and add descriptive captions. Published stories are visible to all visitors in this browser.',
            '请核实信息、征得出镜人员同意并添加描述性说明。发布后，此浏览器内的访客均可查看文章。',
          )}
        </p>
      </div>
      <div className="studio-list">
        {articles.map((a) => (
          <article className="studio-row" key={a.id}>
            <div>
              <span className={'status ' + (a.status === 'published' ? 'safe' : 'neutral')}>
                {a.status === 'published'
                  ? c('Publié', 'Published', '已发布')
                  : c('Brouillon', 'Draft', '草稿')}
              </span>
              <h3>{a.title}</h3>
              <p>
                {clubs.find((x) => x.id === a.clubId)?.name} · {a.authorName} ·{' '}
                {a.language.toUpperCase()}
              </p>
            </div>
            <div className="row">
              <button className="text-button" onClick={() => setPreview(a)}>
                {c('Aperçu', 'Preview', '预览')}
              </button>
              <button className="text-button" onClick={() => edit(a)}>
                {c('Modifier', 'Edit', '编辑')}
              </button>
              <button className="text-button" onClick={() => setRemove(a)}>
                {c('Supprimer', 'Delete', '删除')}
              </button>
            </div>
          </article>
        ))}
      </div>
      {!articles.length && (
        <p className="journal-empty">
          {c(
            'Votre première publication commence ici.',
            'Your first story starts here.',
            '从这里发布第一篇文章。',
          )}
        </p>
      )}
      {editing && (
        <ClubDialog
          title={c('Écrire et publier', 'Write and publish', '撰写与发布')}
          onClose={() => {
            if (!busy) setEditing(false);
          }}
        >
          <form
            className="modal-form"
            onSubmit={(e) => {
              e.preventDefault();
              save('published');
            }}
          >
            <div className="two-fields">
              <label className="field">
                <span>{c('Club', 'Club', '社团')}</span>
                <select
                  value={clubId}
                  onChange={(e) => setClubId(e.target.value)}
                  disabled={busy}
                  required
                >
                  {accessible.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>{c('Langue de l’article', 'Story language', '文章语言')}</span>
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                  {[
                    ['fr', 'Français'],
                    ['en', 'English'],
                    ['zh', '中文'],
                    ['ar', 'العربية'],
                    ['es', 'Español'],
                    ['ln', 'Lingála'],
                    ['ru', 'Русский'],
                    ['tr', 'Türkçe'],
                    ['ary', 'الدارجة'],
                    ['tk', 'Türkmençe'],
                    ['ur', 'اردو'],
                  ].map(([id, label]) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="field">
              <span>{c('Titre', 'Title', '标题')}</span>
              <input
                required
                maxLength={150}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label className="field">
              <span>{c('Votre article', 'Your story', '正文')}</span>
              <textarea
                required
                rows={10}
                maxLength={15000}
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </label>
            <label className="field media-drop">
              <span>
                {c('Ajouter des photos ou vidéos', 'Add photos or videos', '添加照片或视频')}
              </span>
              <small>
                {c(
                  '6 fichiers maximum · images 8 Mo · vidéos 50 Mo · stockage local',
                  'Up to 6 files · images 8 MB · videos 50 MB · local storage',
                  '最多6个文件 · 图片8MB · 视频50MB · 本地存储',
                )}
              </small>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/ogg"
                disabled={busy}
                onChange={(e) => {
                  void attach(e.target.files);
                  e.target.value = '';
                }}
              />
            </label>
            <div className="editor-media-grid">
              {media.map((m) => (
                <div key={m.id}>
                  <ArticleMediaView media={m} />
                  <label className="field">
                    <span>
                      {c('Légende / description', 'Caption / description', '图片或视频说明')}
                    </span>
                    <input
                      value={m.caption}
                      maxLength={250}
                      onChange={(e) =>
                        setMedia((old) =>
                          old.map((x) => (x.id === m.id ? { ...x, caption: e.target.value } : x)),
                        )
                      }
                    />
                  </label>
                  <button
                    type="button"
                    className="text-button"
                    disabled={busy}
                    onClick={() => setMedia((old) => old.filter((x) => x.id !== m.id))}
                  >
                    {c('Retirer', 'Remove', '移除')}
                  </button>
                </div>
              ))}
            </div>
            <p className="muted small">
              {c(
                'Le texte reste dans sa langue de rédaction. Aucune traduction automatique n’est appliquée.',
                'Text stays in its original language. No automatic translation is applied.',
                '正文保留原文语言，不进行自动翻译。',
              )}
            </p>
            {notice && (
              <p role="alert" className="info-box">
                {c(...(messages[notice] || messages.error))}
              </p>
            )}
            <div className="club-detail-actions">
              <button className="button primary" disabled={busy}>
                {busy
                  ? c('Importation…', 'Importing…', '导入中…')
                  : c('Publier l’article', 'Publish story', '发布文章')}
              </button>
              <button
                className="button secondary"
                type="button"
                disabled={busy || !title.trim() || !body.trim()}
                onClick={() => save('draft')}
              >
                {c('Enregistrer le brouillon', 'Save draft', '保存草稿')}
              </button>
            </div>
          </form>
        </ClubDialog>
      )}
      {preview && <ArticleReader article={preview} lang={lang} onClose={() => setPreview(null)} />}
      {remove && (
        <ClubDialog
          title={c('Supprimer cet article ?', 'Delete this story?', '删除此文章？')}
          onClose={() => setRemove(null)}
        >
          <p>{remove.title}</p>
          <div className="row">
            <button
              className="button primary"
              onClick={() => {
                try {
                  deleteArticle(remove.id);
                  setRemove(null);
                  setArticles(editableArticles());
                  setNotice('deleted');
                } catch {
                  setNotice('error');
                }
              }}
            >
              {c('Confirmer la suppression', 'Confirm deletion', '确认删除')}
            </button>
            <button className="button secondary" onClick={() => setRemove(null)}>
              {c('Annuler', 'Cancel', '取消')}
            </button>
          </div>
        </ClubDialog>
      )}
      {creating && (
        <ClubDialog
          title={c('Créer un nouveau club', 'Create a new club', '创建新社团')}
          onClose={() => setCreating(false)}
        >
          <form
            className="modal-form"
            onSubmit={(e) => {
              e.preventDefault();
              const d = new FormData(e.currentTarget);
              try {
                createClub({
                  name: String(d.get('name')),
                  zh: String(d.get('zh')),
                  category: String(d.get('category')) as Club['category'],
                  description: String(d.get('description')),
                  activity: String(d.get('activity')),
                  kit: String(d.get('kit')),
                  leaderId: String(d.get('leaderId') || ''),
                });
                setCreating(false);
                setNotice('created');
                onChange();
              } catch {
                setNotice('error');
              }
            }}
          >
            <label className="field">
              <span>{c('Nom du club', 'Club name', '社团名称')}</span>
              <input name="name" maxLength={90} required />
            </label>
            <label className="field">
              <span>
                {c('Nom chinois (facultatif)', 'Chinese name (optional)', '中文名称（选填）')}
              </span>
              <input name="zh" maxLength={90} />
            </label>
            <label className="field">
              <span>{c('Catégorie', 'Category', '类别')}</span>
              <select name="category">
                <option value="sport">{c('Sport', 'Sport', '运动')}</option>
                <option value="creative">
                  {c('Arts et culture', 'Arts and culture', '艺术与文化')}
                </option>
                <option value="academic">{c('Études', 'Studies', '学习')}</option>
              </select>
            </label>
            <label className="field">
              <span>{c('Présentation', 'Description', '简介')}</span>
              <textarea name="description" required maxLength={1200} rows={4} />
            </label>
            <label className="field">
              <span>{c('Activités proposées', 'Activities offered', '活动内容')}</span>
              <input name="activity" required maxLength={500} />
            </label>
            <label className="field">
              <span>{c('Matériel et préparation', 'Equipment and preparation', '器材与准备')}</span>
              <input name="kit" maxLength={500} />
            </label>
            <label className="field">
              <span>{c('Étudiant responsable', 'Student leader', '学生负责人')}</span>
              <select name="leaderId">
                <option value="">{c('Nommer plus tard', 'Appoint later', '稍后任命')}</option>
                {studentAccounts().map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.displayName} · {a.studentId}
                  </option>
                ))}
              </select>
            </label>
            <p className="muted small">
              {c(
                'L’étudiant doit déjà avoir créé son compte. Vous pourrez changer ses attributions dans Responsables. La présentation conserve votre langue de rédaction.',
                'The student must have an account first. You can change assignments under Leaders. The description keeps your original language.',
                '学生须先创建账户，可在负责人页调整分配。简介保留原文语言。',
              )}
            </p>
            {notice === 'error' && <p role="alert">{c(...messages.error)}</p>}
            <button className="button primary">
              {c('Créer le club', 'Create club', '创建社团')}
            </button>
          </form>
        </ClubDialog>
      )}
    </section>
  );
}
