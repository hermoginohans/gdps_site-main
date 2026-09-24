import React, { createContext, useContext, useState, useEffect } from 'react';

interface RouterContextType {
  currentPath: string;
  navigate: (path: string) => void;
  params: Record<string, string>;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

const getNormalizedPath = (): string => {
  if (typeof window === 'undefined') return '/';

  // Support hash routing if present (#/games)
  if (window.location.hash && window.location.hash.startsWith('#/')) {
    return window.location.hash.slice(1);
  }

  let path = window.location.pathname || '/';

  // If running on GitHub Pages (e.g. /GPDS-Website-design/games)
  if (window.location.hostname.includes('github.io')) {
    const segments = path.split('/').filter(Boolean);
    if (segments.length > 0) {
      // Remove the repo name segment (first segment)
      return '/' + segments.slice(1).join('/');
    }
    return '/';
  }

  return path;
};

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(getNormalizedPath);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(getNormalizedPath());
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = (path: string) => {
    if (path === currentPath) return;

    if (window.location.hostname.includes('github.io')) {
      const repoName = window.location.pathname.split('/').filter(Boolean)[0] || 'GPDS-Website-design';
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      window.history.pushState({}, '', `/${repoName}${cleanPath}`);
    } else {
      window.history.pushState({}, '', path);
    }

    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  // Helper to extract dynamic params
  const params: Record<string, string> = {};
  if (currentPath.startsWith('/games/')) {
    params.gameId = currentPath.replace('/games/', '').split('?')[0];
  } else if (currentPath.startsWith('/blog/')) {
    params.blogId = currentPath.replace('/blog/', '').split('?')[0];
  }

  return (
    <RouterContext.Provider value={{ currentPath, navigate, params }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};

// Convenient Link component for declarative navigation
export const Link: React.FC<{
  to: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
}> = ({ to, className, children, onClick, title }) => {
  const { navigate } = useRouter();

  const isExternal = to.startsWith('http') || to.startsWith('mailto:') || to.startsWith('tel:') || to.startsWith('https://wa.me');

  const getHref = () => {
    if (isExternal) return to;
    if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
      const repoName = window.location.pathname.split('/').filter(Boolean)[0] || 'GPDS-Website-design';
      const cleanPath = to.startsWith('/') ? to : `/${to}`;
      return `/${repoName}${cleanPath}`;
    }
    return to;
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isExternal) {
      return; // External link normal behavior
    }
    e.preventDefault();
    onClick?.();
    navigate(to);
  };

  return (
    <a
      href={getHref()}
      onClick={handleClick}
      className={className}
      title={title}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  );
};
