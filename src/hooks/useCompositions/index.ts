import { useRef, CompositionEvent } from 'react';

type InputElement = HTMLInputElement | HTMLTextAreaElement;

export const useCompositions = () => {
  const compositionLockRef = useRef<boolean>(false);

  function onCompositionStart(e?: CompositionEvent<InputElement>) {
    compositionLockRef.current = true;
  }

  function onCompositionEnd(e?: CompositionEvent<InputElement>) {
    compositionLockRef.current = false;
  }

  return {
    isComposition: compositionLockRef.current,
    onCompositionStart,
    onCompositionEnd
  };
};
