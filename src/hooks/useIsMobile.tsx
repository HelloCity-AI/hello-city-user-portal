import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = '(min-width:1024px)';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(MOBILE_BREAKPOINT);
    const handler = () => setIsMobile(!mediaQueryList.matches);
    handler();
    mediaQueryList.addEventListener('change', handler);
    return () => mediaQueryList.removeEventListener('change', handler);
  }, []);

  return isMobile;
};

export default useIsMobile;
