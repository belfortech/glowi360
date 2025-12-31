// hooks/useResponsive.ts
import { useState, useEffect } from 'react';

interface Breakpoints {
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
}

export const useResponsive = (): Breakpoints => {
  const [breakpoints, setBreakpoints] = useState<Breakpoints>({
    sm: false,
    md: false,
    lg: false,
    xl: false,
  });

  useEffect(() => {
    const handleResize = () => {
      setBreakpoints({
        sm: window.innerWidth >= 640,
        md: window.innerWidth >= 768,
        lg: window.innerWidth >= 1024,
        xl: window.innerWidth >= 1280,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoints;
};