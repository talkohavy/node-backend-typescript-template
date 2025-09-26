import { RequestContext } from '../../call-context/logic/constants';

export const Context = {
  ...RequestContext,
  RequestId: 'requestId',
} as const;

type TypeOfContext = typeof Context;
export type ContextKeys = keyof TypeOfContext;
export type ContextValues = TypeOfContext[ContextKeys];
