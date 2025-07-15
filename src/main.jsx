import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import process from 'process';
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

