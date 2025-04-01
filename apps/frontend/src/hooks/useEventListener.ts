import { useEffect, useRef } from 'react';

type UseEventListenerProps = {
  eventType: string;
  fnToRun: (props?: any) => void;
  dependencies?: Array<any>;
  element?: any;
  /**
   * @default true
   */
  shouldExecute?: boolean;
};

export default function useEventListener(props: UseEventListenerProps) {
  const { eventType, fnToRun, dependencies = [], element = window, shouldExecute = true } = props;

  const callbackRef = useRef(fnToRun);

  useEffect(() => {
    callbackRef.current = fnToRun;
  }, [fnToRun]);

  useEffect(() => {
    if (!shouldExecute) return;

    element.addEventListener(eventType, callbackRef.current);

    callbackRef.current();

    return () => element.removeEventListener(eventType, callbackRef.current);
  }, [...dependencies, shouldExecute]);
}
