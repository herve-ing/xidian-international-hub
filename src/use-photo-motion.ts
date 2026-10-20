import { useEffect, type RefObject } from 'react';

/** One gentle entrance per photograph. CV scans and document illustrations opt out. */
export function usePhotoMotion(page: string, paused: boolean, root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = root.current;
    if (!container || paused || !('IntersectionObserver' in window)) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let disposed = false;
    let stop = () => {};
    let generation = 0;

    function configure() {
      const revision = ++generation;
      stop();
      stop = () => {};
      if (preference.matches || disposed) return;
      import('gsap')
        .then(({ gsap }) => {
          if (disposed || preference.matches || revision !== generation) return;
          const seen = new WeakSet<HTMLImageElement>();
          const waiting = new Map<HTMLImageElement, () => void>();
          const active = new Map<HTMLImageElement, () => void>();
          const observer = new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                const photo = entry.target as HTMLImageElement;
                observer.unobserve(photo);
                if (!photo.isConnected || !photo.naturalWidth || document.hidden) continue;
                const saved = {
                  transform: photo.style.transform,
                  opacity: photo.style.opacity,
                  willChange: photo.style.willChange,
                };
                photo.classList.add('photo-entering');
                const restore = () => {
                  Object.assign(photo.style, saved);
                  photo.classList.remove('photo-entering');
                  active.delete(photo);
                };
                const tween = gsap.fromTo(
                  photo,
                  { opacity: 0.72, y: 10, scale: 1.015, willChange: 'transform, opacity' },
                  {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: 'power2.out',
                    onComplete: restore,
                  },
                );
                active.set(photo, () => {
                  tween.kill();
                  restore();
                });
              }
            },
            { threshold: 0.08 },
          );

          function discover() {
            container!.querySelectorAll<HTMLImageElement>('img[data-photo]').forEach((photo) => {
              if (seen.has(photo)) return;
              seen.add(photo);
              if (photo.complete) {
                if (photo.naturalWidth) observer.observe(photo);
                return;
              }
              const loaded = () => {
                photo.removeEventListener('load', loaded);
                photo.removeEventListener('error', loaded);
                waiting.delete(photo);
                if (photo.isConnected && photo.naturalWidth) observer.observe(photo);
              };
              waiting.set(photo, loaded);
              photo.addEventListener('load', loaded);
              photo.addEventListener('error', loaded);
            });
            // A filtered-out card must not retain a running tween or load listener.
            for (const [photo, cancel] of active) if (!photo.isConnected) cancel();
            for (const [photo, loaded] of waiting) if (!photo.isConnected) loaded();
          }

          const mutations = new MutationObserver(discover);
          mutations.observe(container!, { childList: true, subtree: true });
          const onVisibility = () => {
            // Finish decorative entrances when leaving the tab; never replay them on return.
            if (document.hidden) for (const cancel of [...active.values()]) cancel();
          };
          document.addEventListener('visibilitychange', onVisibility);
          discover();
          stop = () => {
            observer.disconnect();
            mutations.disconnect();
            document.removeEventListener('visibilitychange', onVisibility);
            for (const [photo, loaded] of waiting) {
              photo.removeEventListener('load', loaded);
              photo.removeEventListener('error', loaded);
            }
            waiting.clear();
            for (const cancel of [...active.values()]) cancel();
          };
        })
        .catch(() => {
          /* Photos remain fully visible if the optional animation chunk fails. */
        });
    }

    preference.addEventListener('change', configure);
    configure();
    return () => {
      disposed = true;
      generation++;
      preference.removeEventListener('change', configure);
      stop();
    };
  }, [page, paused, root]);
}
