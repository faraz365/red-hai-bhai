import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { startServerClock } from '@/firebase/serverClock';
import './index.css';

startServerClock();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
