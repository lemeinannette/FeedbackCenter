// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'

// ✅ Ignore 403 errors caused by browser extensions (e.g., Grammarly, ChatGPT Writer, etc.)
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  if (
    reason &&
    typeof reason === 'object' &&
    reason.code === 403 &&
    (reason.message === 'permission error' || reason.data?.error === 'exceptions.UserAuthError')
  ) {
    console.warn('Ignored third-party extension error:', reason);
    event.preventDefault(); // stops "Uncaught (in promise)" console spam
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
