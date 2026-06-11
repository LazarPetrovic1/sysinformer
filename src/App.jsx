import { HashRouter as Router , Routes, Route } from 'react-router-dom';
import { CPUPage, Dashboard, GPUPage, MemoryPage, NetworkPage, ProcessesPage, ReportsPage, StoragePage } from './pages'
import { MainLayout } from './components';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path='/' element={<Dashboard />} />
          <Route path="/cpu" element={<CPUPage />} />
          <Route path="/gpu" element={<GPUPage />} />
          <Route path="/memory" element={<MemoryPage />} />
          <Route path="/network" element={<NetworkPage />} />
          <Route path="/processes" element={<ProcessesPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/storage" element={<StoragePage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App;