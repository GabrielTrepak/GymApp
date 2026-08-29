import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const nav = [
  { to: '/personal', label: 'Clientes', end: true },
  { to: '/personal/planos', label: 'Planos de treino' },
  { to: '/personal/dietas', label: 'Planos de dieta' },
]

export default function PersonalLayout() {
  const { usuario, logout } = useAuth()

  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 flex w-60 flex-col justify-between bg-ink p-6 text-white">
        <div>
          <div className="mb-8 font-display text-xl font-bold">
            Treino<span className="text-accent">.</span>
          </div>
          <nav className="flex flex-col gap-1">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded px-3 py-2.5 text-sm font-medium ${
                    isActive ? 'bg-white/10 text-white' : 'text-white/70'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-2 text-xs">
          <span className="text-white/60">{usuario?.nome}</span>
          <button
            onClick={logout}
            className="self-start rounded border border-white/20 px-2.5 py-1.5 text-xs text-white"
          >
            Sair
          </button>
        </div>
      </aside>
      <main className="ml-60 w-full p-8">
        <Outlet />
      </main>
    </div>
  )
}
