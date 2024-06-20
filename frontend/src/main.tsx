import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import "./styles/global.css"
import { AuthProvider } from './context/AuthContext.tsx'
import { StrictMode } from 'react'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
)
