import { useCallback, useState } from 'react';
import { wrapInDebounce } from '@talkohavy/lodash';
import useEventListener from './useEventListener';

type UseWidthHeightResizeProps = {
  wrapperRef: any;
  fnToRun?: (value?: any) => void;
  /**
   * @default true
   */
  shouldExecute?: boolean;
  ms?: number;
};

export function useWidthHeightResize(props: UseWidthHeightResizeProps) {
  const { wrapperRef, fnToRun, ms = 300, shouldExecute } = props;

  const [size, setSize] = useState(() => ({ width: 0, height: 0 }));

  const memoizedCallback = useCallback(
    // eslint-disable-next-line react-compiler/react-compiler
    wrapInDebounce(() => {
      const { width, height } = wrapperRef.current.getBoundingClientRect();
      const newSize = { width, height };
      setSize(newSize);
      fnToRun?.(newSize);
    }, ms),
    [],
  );

  useEventListener({
    eventType: 'resize',
    fnToRun: memoizedCallback,
    shouldExecute,
  });

  return size;
}
