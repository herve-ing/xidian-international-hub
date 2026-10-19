import { useEffect, type RefObject } from 'react';

/** Scope animations to the current page and discard late imports after navigation. */
export function usePageMotion(page: string, root: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let disposed = false;
    let revert = () => {};
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        if (disposed || !root.current) return;
        gsap.registerPlugin(ScrollTrigger);
        const context = gsap.context(() => {
          gsap.fromTo(
            '.reveal',
            { y: 12, opacity: 0.65 },
            {
              y: 0,
              opacity: 1,
              duration: 0.65,
              stagger: 0.055,
              ease: 'power3.out',
            },
          );
          gsap.utils.toArray<HTMLElement>('.motion-section').forEach((element) => {
            gsap.fromTo(
              element,
              { opacity: 0.6, y: 18 },
              {
                opacity: 1,
                y: 0,
                scrollTrigger: { trigger: element, start: 'top 95%', end: 'top 65%', scrub: 1 },
              },
            );
          });
        }, root);
        revert = () => context.revert();
      })
      .catch(() => {
        /* Content remains usable when the optional motion library fails to load. */
      });
    return () => {
      disposed = true;
      revert();
    };
  }, [page, root]);
}
