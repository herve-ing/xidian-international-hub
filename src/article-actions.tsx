import React, { useEffect, useState } from 'react';
import { content } from './i18n';
import { articleReaction, toggleArticleLike, articleShare } from './club-interactions';
export default function ArticleActions({ id, lang }: { id: string; lang: string }) {
  const c = (fr: string, en: string) => content(lang, fr, en),
    [reaction, setReaction] = useState(() => articleReaction(id)),
    [notice, setNotice] = useState('');
  useEffect(() => {
    const refresh = () => setReaction(articleReaction(id));
    refresh();
    for (const event of ['storage', 'focus', 'xidian-article-reactions'])
      window.addEventListener(event, refresh);
    return () => {
      for (const event of ['storage', 'focus', 'xidian-article-reactions'])
        window.removeEventListener(event, refresh);
    };
  }, [id]);
  return (
    <div className="article-social">
      <div>
        <button
          type="button"
          aria-pressed={reaction.liked}
          onClick={() => {
            try {
              setReaction(toggleArticleLike(id));
              setNotice('');
            } catch {
              setNotice(
                c(
                  'Connectez-vous avec un compte étudiant pour aimer cet article.',
                  'Sign in with a student account to like this article.',
                ),
              );
            }
          }}
        >
          {reaction.liked ? '♥' : '♡'} {c('J’aime', 'Like')} · {reaction.count}
        </button>
        <button
          type="button"
          onClick={async () => {
            try {
              const data = articleShare(id, window.location.href);
              if (navigator.share) {
                await navigator.share(data);
                setNotice(c('Partage effectué.', 'Shared.'));
              } else {
                await navigator.clipboard.writeText(data.text + '\n\n' + data.url);
                setNotice(
                  c(
                    'Texte et lien copiés. Le lien du prototype reste local au navigateur.',
                    'Text and link copied. The prototype link remains browser-local.',
                  ),
                );
              }
            } catch (e) {
              if ((e as Error).name !== 'AbortError')
                setNotice(
                  c(
                    'Partage indisponible : sélectionnez et copiez le texte de l’article.',
                    'Sharing unavailable: select and copy the article text.',
                  ),
                );
            }
          }}
        >
          ↗ {c('Partager', 'Share')}
        </button>
      </div>
      {notice && <p role="status">{notice}</p>}
    </div>
  );
}
