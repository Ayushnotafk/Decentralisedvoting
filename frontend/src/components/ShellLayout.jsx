import { NavLink } from 'react-router-dom'
import { useAuth } from '../auth/auth.jsx'

const baseNavItems = [
  { to: '/', label: 'Home' },
  { to: '/verification', label: 'Verification' },
  { to: '/vote', label: 'Vote' },
  { to: '/results', label: 'Results' },
  { to: '/audit', label: 'Audit' },
  { to: '/admin', label: 'Admin', roles: ['admin'] },
]

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'rounded-xl px-3 py-2 text-sm font-semibold transition',
          isActive
            ? 'bg-[var(--surface)] text-[var(--text-h)]'
            : 'text-[var(--text)] hover:bg-[var(--surface)] hover:text-[var(--text-h)]',
        ].join(' ')
      }
      end={to === '/'}
    >
      {children}
    </NavLink>
  )
}

export default function ShellLayout({ children, rightSlot }) {
  const { user } = useAuth()
  const role = user?.role
  const navItems = baseNavItems.filter((x) => !x.roles || x.roles.includes(role))

  return (
    <div className="min-h-[100svh]">
      <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_92%,white)] backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1120px] items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-md bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] shadow" />
            <div className="text-sm font-extrabold tracking-tight text-[var(--text-h)]">
              Decentralized Voting
            </div>
          </div>

          {rightSlot ? (
            <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {navItems.map((x) => (
              <NavItem key={x.to} to={x.to}>
                {x.label}
              </NavItem>
            ))}
            </nav>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">{rightSlot}</div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1120px] px-4 py-8">{children}</main>

      <footer className="border-t border-[var(--border)]">
        <div className="mx-auto flex w-full max-w-[1120px] items-center justify-between gap-3 px-4 py-5 text-xs text-[var(--muted)]">
          <span>© {new Date().getFullYear()} Decentralized Voting</span>
          <span>Theme: beige · grey · green</span>
        </div>
      </footer>
    </div>
  )
}

