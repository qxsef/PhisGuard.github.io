import { HashRouter, Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import ScanResult from './pages/ScanResult';
import History from './pages/History';
import About from './pages/About';
import { EmptyState } from './components/ui/State';

// HashRouter dipilih agar tautan tetap bekerja di GitHub Pages.
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="scan" element={<Scanner />} />
          <Route path="scan/:id" element={<ScanResult />} />
          <Route path="history" element={<History />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<EmptyState title="Halaman tidak ditemukan" text="Gunakan menu navigasi untuk kembali ke halaman yang tersedia." />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
