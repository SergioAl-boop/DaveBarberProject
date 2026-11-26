import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ReservaProvider } from './context/ReservaContext'
import { CarritoProvider } from './context/CarritoContext'
import './index.css'
import App from './App.jsx'

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const base = import.meta.env.BASE_URL;
    navigator.serviceWorker.register(`${base}sw.js`, { scope: base });
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <ReservaProvider>
          <CarritoProvider>
            <App />
          </CarritoProvider>
        </ReservaProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)