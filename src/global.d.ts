declare module 'json-easy-strip' {
  function requireJSON(path: string): any;
  export default requireJSON;
}

declare module 'express' {
  export interface Request {
    user?: Record<string, any>;
  }
}
