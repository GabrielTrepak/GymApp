import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'

import Login from './features/Login'
import PaginaEmBranco from './features/PaginaEmBranco'

import PersonalLayout from './layouts/PersonalLayout'
import ClientesList from './features/personal/clientes/ClientesList'
import PlanoTreino from './features/personal/planos/PlanoTreino'

import ClienteLayout from './layouts/ClienteLayout'
import MeuTreino from './features/cliente/meu-treino/MeuTreino'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Área do Personal */}
          <Route
            path="/personal"
            element={
              <ProtectedRoute role="Personal">
                <PersonalLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ClientesList />} />
            <Route path="planos" element={<PlanoTreino />} />
            <Route path="dietas" element={<PaginaEmBranco titulo="Planos de dieta" />} />
          </Route>

          {/* Área do Cliente */}
          <Route
            path="/app"
            element={
              <ProtectedRoute role="Cliente">
                <ClienteLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<MeuTreino />} />
            <Route path="dieta" element={<PaginaEmBranco titulo="Minha dieta" />} />
            <Route path="progresso" element={<PaginaEmBranco titulo="Meu progresso" />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
