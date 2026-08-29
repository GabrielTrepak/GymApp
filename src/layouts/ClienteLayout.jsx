import { NavLink, Outlet } from 'react-router-dom'

const nav = [
  { to: '/app', label: 'Treino', end: true },
  { to: '/app/dieta', label: 'Dieta' },
  { to: '/app/progresso', label: 'Progresso' },
]

export default function ClienteLayout() {
  return (
    <div style={styles.shell}>
      <header style={styles.header}>
        <span style={styles.brand}>Treino<span style={{ color: 'var(--accent)' }}>.</span></span>
      </header>

      <main style={styles.content}>
        <Outlet />
      </main>

      <nav style={styles.bottomNav}>
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            style={({ isActive }) => ({
              ...styles.tab,
              ...(isActive ? styles.tabActive : {}),
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

const styles = {
  shell: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  header: {
    padding: '16px 20px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--surface)',
  },
  brand: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 },
  content: {
    flex: 1,
    padding: '16px 16px calc(var(--bottom-nav-h) + 24px)',
    maxWidth: 480,
    width: '100%',
    margin: '0 auto',
  },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 'var(--bottom-nav-h)',
    display: 'flex',
    background: 'var(--surface)',
    borderTop: '1px solid var(--border)',
    paddingBottom: 'env(safe-area-inset-bottom)',
  },
  tab: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--text-muted)',
    textDecoration: 'none',
  },
  tabActive: { color: 'var(--accent)', fontWeight: 700 },
}
