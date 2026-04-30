import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClaraThemeProvider } from './pages/settings/theme/ThemeContext'
import { AvatarProvider } from './context/AvatarContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClaraThemeProvider>
      <AvatarProvider>
        <App />
      </AvatarProvider>
    </ClaraThemeProvider>
  </StrictMode>,
)
