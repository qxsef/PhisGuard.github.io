import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { History, Info, LayoutDashboard, ScanSearch, ShieldCheck } from 'lucide-react';

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/scan', label: 'Pindai URL', icon: ScanSearch },
  { to: '/history', label: 'Riwayat', icon: History },
  { to: '/about', label: 'Tentang', icon: Info },
];

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-deep"><ShieldCheck size={20} aria-hidden="true" /></span>
      <span className="text-lg font-extrabold tracking-tight">PhishGuard</span>
    </div>
  );
}

export default function AppShell() {
  const { pathname } = useLocation();
  const link = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition duration-200 active:scale-[0.97] ${
      isActive ? 'bg-brand/15 text-fg' : 'text-muted hover:bg-white/5 hover:text-fg'
    }`;

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-white/10 bg-panel px-4 py-6 md:flex">
        <Logo />
        <nav aria-label="Navigasi utama" className="mt-10 flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={link}>
              <Icon size={18} aria-hidden="true" />{label}
            </NavLink>
          ))}
        </nav>
        <p className="mt-auto text-xs leading-relaxed text-muted">Analisis dilakukan di browser Anda. URL tidak dikirim ke mana pun.</p>
      </aside>

      <header className="flex items-center border-b border-white/10 bg-panel px-5 py-3.5 md:hidden"><Logo /></header>

      <main className="md:pl-60">
        <div key={pathname} className="page-in mx-auto w-full max-w-5xl px-5 pb-28 pt-8 md:px-10 md:pb-16 md:pt-12">
          <Outlet />
        </div>
      </main>

      <nav aria-label="Navigasi utama" className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-white/10 bg-panel/95 pb-[env(safe-area-inset-bottom)] md:hidden">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex min-h-[56px] flex-col items-center justify-center gap-1 text-[11px] font-semibold transition active:scale-95 ${isActive ? 'text-brand' : 'text-muted'}`}>
            <Icon size={20} aria-hidden="true" />{label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
