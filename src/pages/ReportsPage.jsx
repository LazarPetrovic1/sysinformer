import { useState } from "react";
import { exportJSON, exportCSV, exportPDF } from "../utils";

export default function ReportsPage() {
  const [loading, setLoading] = useState(() => false);

  const gatherSystemData = async () => {
    setLoading(() => true);

    const [cpu, mem, proc, disk] = await Promise.all([
      window.systemInfo.cpu(),
      window.systemInfo.memory(),
      window.procInfo.list(),
      window.storageInfo.disks()
    ]);

    setLoading(() => false);

    return {
      user: window.systemInfo.userInfo().username,
      platform: window.systemInfo.platform,
      cpuCores: cpu.length,
      ram: (mem.total / 1024 ** 3).toFixed(2),

      processes: proc.map(p => ({
        name: p.name,
        pid: p.pid,
        cpu: p.cpu?.toFixed?.(1) ?? 0,
        memory: p.memory?.toFixed?.(1) ?? 0
      })),

      disks: disk.map(d => ({
        fs: d.fs,
        used: (d.used / 1024 ** 3).toFixed(2),
        available: (d.available / 1024 ** 3).toFixed(2),
        size: d.size / 1024 ** 3
      }))
    };
  };

  const handleJSON = async () => {
    const data = await gatherSystemData();
    exportJSON(data);
  };

  const handleCSV = async () => {
    const data = await gatherSystemData();
    exportCSV(data.processes);
  };

  const handlePDF = async () => {
    const data = await gatherSystemData();
    exportPDF(data);
  };

  return (
    <div className="container-fluid">
      <h3 className="mb-4">Reports</h3>
      <div className="card p-4">
        <p className="text-muted">Export a snapshot of your system state.</p>
        <button className="btn btn-primary" onClick={handleJSON} disabled={loading}>Export JSON</button>
        <button className="btn btn-success" onClick={handleCSV} disabled={loading}>Export CSV (Processes)</button>
        <button className="btn btn-danger" onClick={handlePDF} disabled={loading}>Export PDF Report</button>
      </div>
    </div>
  );
}