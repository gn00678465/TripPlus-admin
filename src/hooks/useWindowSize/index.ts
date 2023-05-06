import { useEffect, useState } from 'react';

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window !== undefined) {
      const handler = () => {
        setWindowSize(() => ({
          width: window.innerWidth,
          height: window.innerHeight
        }));
      };

      window.addEventListener('resize', handler);

      handler();

      return () => {
        window.removeEventListener('resize', handler);
      };
    }
  }, []);

  return windowSize;
}

export type useWindowSizeReturnType = ReturnType<typeof useWindowSize>;
