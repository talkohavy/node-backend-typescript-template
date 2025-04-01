import { Suspense } from 'react';
import { Route, Routes } from 'react-router';
import Layout from './components/Layout';
import PageNotFound from './pages/PageNotFound';
import { routes } from './routes';

export default function App() {
  return (
    <Layout>
      <Suspense>
        <Routes>
          {routes.map(({ to: path, Component }, index) => (
            <Route key={index} path={path} element={<Component />} />
          ))}

          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
