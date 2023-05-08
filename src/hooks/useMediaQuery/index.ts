import { useState, useEffect } from 'react';
import { isBrowser } from '@/utils';

function initState(query: string, defaultState?: boolean) {
  if (defaultState !== undefined) return defaultState;
  if (isBrowser) return window.matchMedia(query).matches;
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      '必須帶入 defaultState, 避免發生 hydration mismatches 相關錯誤!'
    );
  }
}

export function useMediaQuery(query: string, defaultState?: boolean) {
  const [state, setState] = useState(initState(query, defaultState));

  useEffect(() => {
    let mounted = true;
    const mediaQuery = window.matchMedia(query);

    const update = () => {
      if (!mounted) {
        return;
      }
      setState(!!mediaQuery.matches);
    };

    if ('addEventListener' in mediaQuery) {
      mediaQuery.addEventListener('change', update);
    } else {
      // @ts-expect-error deprecated API
      mediaQuery.addListener(update);
    }
    setState(mediaQuery.matches);

    return () => {
      if ('removeEventListener' in mediaQuery) {
        mediaQuery.removeEventListener('change', update);
      } else {
        // @ts-expect-error deprecated API
        mediaQuery.removeListener(update);
      }
    };
  }, [query]);

  return state;
}
