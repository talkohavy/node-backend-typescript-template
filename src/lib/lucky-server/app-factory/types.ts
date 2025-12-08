import type { NextFunction, Request, Response } from 'express';

export interface StaticModule {
  getInstance: () => ModuleFactory;
}

export interface ModuleFactory {
  attachController(app: any): void;
  attachEventHandlers?(io: any): void;
}

export type ErrorHandlerFn = (app: any) => void;

// Specific to "express" framework
export type MiddlewareFactory = (req: Request, res: Response, next: NextFunction) => void;
