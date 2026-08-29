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
    <div style={styles.shell}>
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.brand}>Treino<span style={{ color: 'var(--accent)' }}>.</span></div>
          <nav style={styles.nav}>
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                style={({ isActive }) => ({
                  ...styles.navItem,
                  ...(isActive ? styles.navItemActive : {}),
                })}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div style={styles.userBox}>
          <span style={styles.userName}>{usuario?.nome}</span>
          <button style={styles.logoutBtn} onClick={logout}>Sair</button>
        </div>
      </aside>
      <main style={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}

const styles = {
  shell: { display: 'flex', minHeight: '100vh' },
  sidebar: {
    width: 'var(--sidebar-w)',
    background: 'var(--ink)',
    color: '#fff',
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'fixed',
    top: 0,
    bottom: 0,
  },
  brand: { fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 32 },
  nav: { display: 'flex', flexDirection: 'column', gap: 4 },
  navItem: {
    padding: '10px 12px',
    borderRadius: 8,
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
  },
  navItemActive: { background: 'rgba(255,255,255,0.08)', color: '#fff' },
  userBox: { display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 },
  userName: { color: 'rgba(255,255,255,0.6)' },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    padding: '6px 10px',
    borderRadius: 6,
    fontSize: 13,
    alignSelf: 'flex-start',
  },
  content: {
    marginLeft: 'var(--sidebar-w)',
    padding: 32,
    width: '100%',
  },
}
