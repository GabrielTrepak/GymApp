import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const nav = [
  { to: '/app', label: 'Treino', end: true },
  { to: '/app/dieta', label: 'Dieta' },
  { to: '/app/progresso', label: 'Progresso' },
]

export default function ClienteLayout() {
  const { logout } = useAuth()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-border bg-surface px-5 py-4">
        <span className="font-display text-lg font-bold">
          Treino<span className="text-accent">.</span>
        </span>
        <button onClick={logout} className="rounded border border-border px-2.5 py-1.5 text-xs text-muted">
          Sair
        </button>
      </header>

      <main className="mx-auto w-full max-w-[480px] flex-1 px-4 pb-24 pt-4">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 flex h-16 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-1 items-center justify-center text-sm font-medium ${
                isActive ? 'font-bold text-accent' : 'text-muted'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
