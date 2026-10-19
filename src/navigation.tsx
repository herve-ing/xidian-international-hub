import React, { useState, useEffect } from 'react';
function currentPath() {
  return (window.location.hash.slice(1) || '/').split('?')[0];
}
export function usePathname() {
  const [path, setPath] = useState(currentPath);
  useEffect(() => {
    const update = () => {
      setPath(currentPath());
      window.scrollTo({ top: 0, behavior: 'instant' });
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
