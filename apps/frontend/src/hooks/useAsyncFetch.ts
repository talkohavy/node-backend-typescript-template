import { useCallback, useEffect, useRef, useState } from 'react';
import type { HttpResponse } from '../lib/HttpClient/types';
import { httpClient } from '../lib/HttpClient';

type useAsyncFetchProps<ReturnType, TransformType = ReturnType> = {
  asyncFunc: (props: any) => Promise<HttpResponse<ReturnType>>;
  /**
   * Should be a memoed function.
   */
  transform?: (data: ReturnType) => TransformType;
  /**
   * @default false
   */
  isManual?: boolean;
  /**
   * Should be a memoed function.
   */
  onSuccess?: (data: TransformType) => void;
  /**
   * Should be a memoed function.
   */
  onError?: (error: any) => void;
};

export function useAsyncFetch<ReturnType, TransformType = ReturnType>(
  props: useAsyncFetchProps<ReturnType, TransformType>,
) {
  const { asyncFunc, transform, isManual, onSuccess, onError } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState(undefined as TransformType);

  const asyncFuncRef = useRef(asyncFunc);
  const requestIdRef = useRef<string>('');

  useEffect(() => {
    asyncFuncRef.current = asyncFunc;
  }, [asyncFunc]);

  const fetchData = useCallback(
    async (funcProps?: any) => {
      try {
        if (requestIdRef.current) {
          httpClient.abortRequestById(requestIdRef.current);
        }

        setIsLoading(true);
        setIsError(false);

        const { response, requestId } = await asyncFuncRef.current(funcProps);

        requestIdRef.current = requestId;

        const updatedData = (transform ? transform(response) : response) as TransformType;

        setData(updatedData);

        onSuccess?.(updatedData);

        return updatedData;
      } catch (error) {
        console.error(error);
        setIsError(true);
        onError?.(error);
      } finally {
        setIsLoading(false);
      }
    },
    [transform, onSuccess, onError],
  );

  // MUST come before the refetch useEffect! Otherwise, an outgoing request would immediately terminate.
  useEffect(
    () => () => {
      if (requestIdRef.current) {
        httpClient.abortRequestById(requestIdRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (isManual) return;

    fetchData();
  }, [fetchData, isManual]);

  return { isLoading, isError, data, fetchData };
}
