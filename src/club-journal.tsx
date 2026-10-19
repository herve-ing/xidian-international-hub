import React, { useEffect, useState } from 'react';
import { content } from './i18n';
import { clubs } from './clubs';
import { ClubDialog } from './club-dialog';
import { ClubVisual } from './club-visual';
import ArticleActions from './article-actions';
import { publicArticles, readMedia, type ArticleMedia, type ClubArticle } from './club-publishing';
export function ArticleMediaView({ media }: { media: ArticleMedia }) {
  const [url, setUrl] = useState(''),
    [missing, setMissing] = useState(false);
  useEffect(() => {
    let active = true,
      objectUrl = '';
    readMedia(media.id)
      .then((blob) => {
        if (!active) return;
        if (blob) {
          objectUrl = URL.createObjectURL(blob);
          setUrl(objectUrl);
        } else setMissing(true);
      })
      .catch(() => {
        if (active) setMissing(true);
      });
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [media.id]);
  return (
    <figure className="article-media">
      {url ? (
        media.kind === 'image' ? (
          <img src={url} alt={media.caption || media.name} loading="lazy" />
        ) : (
          <video
            src={url}
            controls
            preload="metadata"
            playsInline
            aria-label={media.caption || media.name}
          />
        )
      ) : (
        <p className="muted">{missing ? media.name + ' · —' : '…'}</p>
      )}
      {media.caption && <figcaption>{media.caption}</figcaption>}
    </figure>
  );
}
export function ArticleReader({
  article,
  lang,
  onClose,
}: {
  article: ClubArticle;
  lang: string;
  onClose: () => void;
}) {
  const c = (fr: string, en: string, zh?: string) => content(lang, fr, en, zh),
    club = clubs.find((x) => x.id === article.clubId);
  return (
    <ClubDialog title={article.title} onClose={onClose}>
      <p className="journal-byline">
        {club?.name} · {article.authorName} · {article.language.toUpperCase()}
      </p>
      <time>{new Date(article.publishedAt || article.updatedAt).toLocaleDateString()}</time>
      {article.status === 'draft' && (
        <p className="info-box">
          {c(
            'Aperçu du brouillon · non publié',
            'Draft preview · not published',
            '草稿预览 · 未发布',
          )}
        </p>
      )}
      <div className="article-prose">
        {article.body.split(/\n\n+/).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {article.status === 'published' && <ArticleActions id={article.id} lang={lang} />}
      <div className="article-gallery">
        {article.media.map((m) => (
          <ArticleMediaView key={m.id} media={m} />
        ))}
      </div>
    </ClubDialog>
  );
}
export function ClubJournal({
  lang,
  clubId = '',
  compact = false,
}: {
  lang: string;
  clubId?: string;
  compact?: boolean;
}) {
  const c = (fr: string, en: string, zh?: string) => content(lang, fr, en, zh);
  const [articles, setArticles] = useState(() => publicArticles()),
    [query, setQuery] = useState(''),
    [filter, setFilter] = useState(clubId),
    [selected, setSelected] = useState<ClubArticle | null>(
      () =>
        publicArticles().find(
          (a) =>
            a.id ===
            new URLSearchParams(
              typeof window === 'undefined' ? '' : window.location.hash.split('?')[1],
            ).get('article'),
        ) || null,
    );
  useEffect(() => {
    const refresh = () => setArticles(publicArticles());
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    const openShared = () => {
      const id = new URLSearchParams(
        typeof window === 'undefined' ? '' : window.location.hash.split('?')[1],
      ).get('article');
      if (id) setSelected(publicArticles().find((a) => a.id === id) || null);
    };
    window.addEventListener('hashchange', openShared);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('focus', refresh);
      window.removeEventListener('hashchange', openShared);
    };
  }, [clubId]);
  const visible = articles.filter(
    (a) =>
      (!filter || a.clubId === filter) &&
      [a.title, a.body, a.authorName]
        .join(' ')
        .toLocaleLowerCase()
        .includes(query.toLocaleLowerCase()),
  );
  return (
    <section className="club-journal">
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            {c('LA COMMUNAUTÉ RACONTE', 'COMMUNITY STORIES', '社团故事')}
          </span>
          <h2>
            {compact
              ? c('Le journal de ce club', 'This club’s journal', '本社团动态')
              : c('Au cœur des clubs', 'Inside the clubs', '走进社团')}
          </h2>
        </div>
        <span className="subtle-badge">
          {visible.length} {c('articles', 'stories', '篇文章')}
        </span>
      </div>
      {!compact && (
        <>
          <p className="muted">
            {c(
              'Rencontres, créations, annonces : les nouvelles publiées par vos responsables et professeurs.',
              'Meetups, creations and announcements from your club leaders and professors.',
              '由社团负责人和教师发布的聚会、作品与通知。',
            )}
          </p>
          <div className="journal-filters">
            <label className="field">
              <span>{c('Club', 'Club', '社团')}</span>
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="">{c('Tous les clubs', 'All clubs', '所有社团')}</option>
                {clubs.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>{c('Rechercher un article', 'Search stories', '搜索文章')}</span>
              <input value={query} onChange={(e) => setQuery(e.target.value)} />
            </label>
          </div>
        </>
      )}
      <div className="journal-grid">
        {visible.map((a) => {
          const club = clubs.find((x) => x.id === a.clubId)!;
          return (
            <article className="journal-card" key={a.id}>
              {a.media[0] ? <ArticleMediaView media={a.media[0]} /> : <ClubVisual club={club} />}
              <div>
                <span className="journal-byline">
                  {club.name} · {a.language.toUpperCase()}
                </span>
                <h3>{a.title}</h3>
                <p>
                  {a.body.slice(0, 150)}
                  {a.body.length > 150 ? '…' : ''}
                </p>
                <small>
                  {a.authorName} · {new Date(a.publishedAt || a.updatedAt).toLocaleDateString()}
                </small>
                <button className="text-button" onClick={() => setSelected(a)}>
                  {c('Lire l’article', 'Read story', '阅读文章')}
                </button>
                <ArticleActions id={a.id} lang={lang} />
              </div>
            </article>
          );
        })}
      </div>
      {!visible.length && (
        <div className="journal-empty">
          <h3>
            {c(
              'Les prochaines histoires s’écrivent ici.',
              'The next stories start here.',
              '新的故事从这里开始。',
            )}
          </h3>
          <p>
            {c(
              'Aucun article publié pour cette sélection. Les responsables peuvent préparer leur première publication dans Gestion des clubs.',
              'No published stories in this selection. Leaders can prepare their first post in Club management.',
              '此分类暂无已发布文章，负责人可在社团管理中撰写首篇文章。',
            )}
          </p>
        </div>
      )}
      {selected && (
        <ArticleReader article={selected} lang={lang} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
