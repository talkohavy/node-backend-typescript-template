import { type PropsWithChildren, type ReactNode, useEffect, useState } from 'react';

type SuspenseUntilReadyProps = PropsWithChildren<{
  asyncFn: () => Promise<void>;
  Loader?: ReactNode | (() => ReactNode);
}>;

export default function SuspenseUntilReady(props: SuspenseUntilReadyProps) {
  const { children, asyncFn, Loader } = props;

  const [isReady, setIsReady] = useState<boolean>();

  useEffect(() => {
    asyncFn().then(() => setIsReady(true));
  }, [asyncFn]);

  if (!isReady) {
    if (Loader) {
      if (typeof Loader === 'function') return <Loader />;

      return Loader;
    }

    return null;
  }

  return children;
}
