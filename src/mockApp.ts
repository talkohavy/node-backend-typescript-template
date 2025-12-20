import { buildApp } from './app';

export async function buildMockApp() {
  const app = await buildApp();

  return app;
}
