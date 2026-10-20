import React, { useState, useEffect, useRef } from 'react';
function currentPath() {
  return (window.location.hash.slice(1) || '/').split('?')[0];
}
export function usePathname() {
  const [path, setPath] = useState(currentPath);
  const previousPath = useRef(path);
  useEffect(() => {
    const update = () => {
      const next = currentPath();
      setPath(next);
      if (next !== previousPath.current) window.scrollTo({ top: 0, behavior: 'instant' });
      previousPath.current = next;
    };
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  return path;
}
export function useRouter() {
  return {
    push: (path: string) => {
      window.location.hash = path;
    },
  };
}
export function Link({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <a {...props} href={href.startsWith('/') ? '#' + href : href}>
      {children}
    </a>
  );
}
