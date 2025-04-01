import { lazy } from 'react';

const HomePage = lazy(() => import('./pages/Home'));

export const routes = [
  {
    to: '/',
    text: 'Home',
    activeNames: ['/home', '/'],
    Component: HomePage,
  },
];
