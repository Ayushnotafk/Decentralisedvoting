import { Navigate, Route, Routes } from 'react-router-dom'
import ShellLayout from './components/ShellLayout.jsx'
import WalletButton from './components/WalletButton.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { useAuth } from './auth/auth.jsx'
import Admin from './pages/Admin.jsx'
import Audit from './pages/Audit.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Verification from './pages/Verification.jsx'
import Results from './pages/Results.jsx'
import Vote from './pages/Vote.jsx'

function App() {
  const { isAuthed, user, logout } = useAuth()

  return (
    <ShellLayout
      rightSlot={
        isAuthed ? (
          <div className="flex items-center gap-2">
            <div className="hidden rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-xs font-semibold text-[var(--text-h)] md:block">
              {user?.name}
            </div>
            <WalletButton />
            <button
              type="button"
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm font-semibold text-[var(--text-h)] hover:bg-[var(--surface)]"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        ) : null
      }
    >
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={isAuthed ? <Navigate to="/" replace /> : <Login />} />
        <Route
          path="/register"
          element={isAuthed ? <Navigate to="/" replace /> : <Register />}
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['admin']}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vote"
          element={
            <ProtectedRoute>
              <Vote />
            </ProtectedRoute>
          }
        />
        <Route
          path="/verification"
          element={
            <ProtectedRoute>
              <Verification />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          }
        />
        <Route
          path="/audit"
          element={
            <ProtectedRoute>
              <Audit />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={isAuthed ? '/' : '/login'} replace />} />
      </Routes>
    </ShellLayout>
  )
}

export default App
