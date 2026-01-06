import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function useScrollRestoration() {
  const location = useLocation();

  const restore = useCallback(() => {
    if (location.hash) {
      document.getElementById(location.hash.substring(1))?.scrollIntoView({
        behavior: 'smooth',
      });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);

  // Scroll restoration when visiting new pages
  useEffect(() => {
    restore();
  }, [restore, location]);

  return { restore };
}
