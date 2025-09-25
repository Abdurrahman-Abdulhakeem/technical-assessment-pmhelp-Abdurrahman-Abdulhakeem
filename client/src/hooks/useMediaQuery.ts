import { useEffect, useState } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [query]);

  return matches;
};

// Commonly used breakpoints
export const useBreakpoints = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  const isLarge = useMediaQuery('(min-width: 1440px)');

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLarge,
    current: isMobile ? 'mobile' : isTablet ? 'tablet' : isDesktop ? 'desktop' : 'large'
  };
};
