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
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
  });
}


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
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