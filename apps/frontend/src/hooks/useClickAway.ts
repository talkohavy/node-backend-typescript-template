import { useEffect, useRef } from 'react';

export default function useClickAway(callback: () => void) {
  /**
   * @description
   * Attach this returned domNodeRef to the element you want identified as clicked away from.
   */
  const domElementRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const detectElementClickAway = (e: any) => {
      if (!domElementRef.current?.contains(e.target)) {
        callbackRef.current();
      }
    };

    document.addEventListener('mouseup', detectElementClickAway);

    return () => document.removeEventListener('mousedown', detectElementClickAway);
  }, []);

  return domElementRef;
}
