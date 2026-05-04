import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'

import App from './App.jsx'
import { AuthProvider } from './context/AuthContext' // Import your new context

// The createRoot call is correct, we just add the AuthProvider here
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> 
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
