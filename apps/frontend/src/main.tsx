import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from '@src/App';
import SuspenseUntilReady from './components/SuspenseUntilReady';
import DarkThemeProvider from './providers/DarkThemeProvider';
import { initSessionManager } from './lib/SessionManager';
import { initHttpClient } from './lib/HttpClient';
import './common/bootstrap';
import './index.css';

const API_GATEWAY_URL = 'http://localhost:8000';

function Client() {
  return (
    <StrictMode>
      <SuspenseUntilReady
        asyncFn={async () => {
          initSessionManager();
          initHttpClient(API_GATEWAY_URL);
          console.log('Application is up and running!');
        }}
      >
        <BrowserRouter>
          <DarkThemeProvider>
            <App />
          </DarkThemeProvider>
        </BrowserRouter>
      </SuspenseUntilReady>
    </StrictMode>
  );
}

const rootElement = document.getElementById('root')!;

createRoot(rootElement).render(<Client />);
