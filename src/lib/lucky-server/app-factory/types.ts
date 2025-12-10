export type ModuleConstructor = new (app: any) => any;

export type ErrorHandlerFn = (app: any) => void;

export type MiddlewareFactory = (app: any) => void;
