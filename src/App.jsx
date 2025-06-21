// src/App.jsx - VERSIÓN ACTUALIZADA CON ROUTER Y AUTH
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import PrivateRoute from '@/pages/PrivateRoute'
import LoginForm from '@/components/auth/LoginForm'
import Dashboard from '@/pages/Dashboard'
import QuoteGenerator from '@/components/QuoteGenerator' 
import QuoteEditor from '@/components/QuoteEditor'
import '@/App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta pública - Generador de presupuestos */}
          <Route path="/" element={<QuoteGenerator />} />
          
          {/* Ruta de login */}
          <Route path="/login" element={<LoginForm />} />
          
          {/* Rutas privadas */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/edit-quote/:quoteId" 
            element={
              <PrivateRoute>
                <QuoteEditor />
              </PrivateRoute>
            } 
          />
          
          {/* Redirección para rutas no encontradas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App