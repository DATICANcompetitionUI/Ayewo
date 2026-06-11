import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/single-screening', label: 'Single Screening' },
  { to: '/batch-screening', label: 'Batch Screening' },
]

function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-700">Ayewo Clinical Support</p>
            <h1 className="text-2xl font-bold">Malaria Blood Smear Screening</h1>
            <p className="text-sm text-slate-600">For trained lab technicians and doctors only.</p>
          </div>
          <nav className="flex flex-wrap gap-2" aria-label="Primary">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-md border px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'border-emerald-700 bg-emerald-700 text-white'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                  }`
                }
                end={link.to === '/'}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}

export default App
