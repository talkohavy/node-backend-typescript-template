import { AsyncLocalStorage } from 'async_hooks';
import { CallContextService } from '../lib/call-context';

export let callContextService: CallContextService<string, string>;

export function initCallContextService(): CallContextService<string, string> {
  const asyncLocalStorage = new AsyncLocalStorage<Map<string, string>>();

  callContextService = new CallContextService(asyncLocalStorage);

  return callContextService;
}
