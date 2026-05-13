import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import ScrollToTop from './component/common/ScrollToTop'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>

        <ScrollToTop />

        <App />

      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)