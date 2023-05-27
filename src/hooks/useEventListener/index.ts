import { useEffect, useCallback, useRef } from 'react';

export function useEventListener(
  eventName: string,
  callback: (e: Event) => void,
  element = window
) {
  const handler = useRef<(e: Event) => void | undefined>();

  useEffect(() => {
    handler.current = callback;
  }, [callback]);

  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;

    const eventListener = (event: Event) => handler.current?.(event);
    element.addEventListener(eventName, eventListener);
    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
}
