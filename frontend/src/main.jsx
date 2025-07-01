import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './store'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthWrapper, ToastProvider } from './components/common'
import App from './App.jsx'  
import './styles/index.css'

// Initialize theme on app start
const initialTheme = store.getState().theme.theme;
const initialBranding = store.getState().theme.branding;
const initialColorScheme = store.getState().theme.colorScheme;

// Set initial data attributes
document.documentElement.setAttribute('data-theme', initialTheme);
document.documentElement.setAttribute('data-branding', initialBranding);
document.documentElement.setAttribute('data-color-scheme', initialColorScheme);
document.body.className = `theme-${initialTheme} branding-${initialBranding} scheme-${initialColorScheme}`;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <ToastProvider>
            <AuthWrapper>
              <App />
            </AuthWrapper>
          </ToastProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
