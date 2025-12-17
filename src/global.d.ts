import type { OptimizedApp } from './common/types';

declare module 'express' {
  export interface Request {
    user?: Record<string, any>;
  }

  export interface Application extends OptimizedApp {
    no_keys: never;
  }
}
