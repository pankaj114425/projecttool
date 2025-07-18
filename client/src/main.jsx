import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ConfiguratorProvider } from './context/Configurator.jsx'

createRoot(document.getElementById('root')).render(
  <>
  
  <ConfiguratorProvider>
    <App />
  </ConfiguratorProvider>
  
  </>,
)
