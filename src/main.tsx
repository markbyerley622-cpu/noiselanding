import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import SecurityPage from './components/SecurityPage'
import './index.css'

// Lightweight path routing — /security is a real, standalone page.
const path = window.location.pathname.replace(/\/+$/, '')
const Root = path === '/security' ? SecurityPage : App

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
