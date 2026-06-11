// pages/MemoryPage.jsx

import { useEffect, useState } from "react";
import { MemoryGraph, ProcessTable, StatCard } from '../components'

export default function MemoryPage() {
  const [memInfo, setMemInfo] = useState(() => null);
  const [history, setHistory] = useState(() => []);
  const [processes, setProcesses] = useState(() => []);

  useEffect(() => {
    async function update() {
      const [mem, procData] = await Promise.all([
        window.memoryInfo.memory(),
        window.memoryInfo.processes()
      ]);

      setMemInfo(() => mem);

      // history (GB used)
      const usedGB = mem.used / (1024 ** 3);
      const totalGB = mem.total / (1024 ** 3);

      setHistory(prev => {
        const next = [...prev, { time: new Date().toLocaleTimeString(), value: usedGB }];
        return next.slice(-60);
      });

      const topMem = procData.list.sort((a, b) => b.mem - a.mem).slice(0, 10);
      setProcesses(() => topMem);
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!memInfo) return <div>Loading...</div>;

  const totalGB = (memInfo.total / (1024 ** 3)).toFixed(2);
  const usedGB = (memInfo.used / (1024 ** 3)).toFixed(2);
  const freeGB = (memInfo.free / (1024 ** 3)).toFixed(2);
  const usedPercent = ((memInfo.used / memInfo.total) * 100).toFixed(1);

  return (
    <div className="container-fluid">
      {/* Stat Cards */}
      <div className="row g-3 mb-3">
        <div className="col-md-3">
          <StatCard title="Total RAM" value={`${totalGB} GB`} color="primary" icon="fa-solid fa-memory" />
        </div>

        <div className="col-md-3">
          <StatCard title="Used RAM" value={`${usedGB} GB`} color="danger" icon="fa-solid fa-chart-pie" />
        </div>

        <div className="col-md-3">
          <StatCard title="Free RAM" value={`${freeGB} GB`} color="success" icon="fa-solid fa-circle-check" />
        </div>

        <div className="col-md-3">
          <StatCard title="Usage" value={`${usedPercent}%`} color="warning" icon="fa-solid fa-bolt" />
        </div>
      </div>

      {/* Graph */}
      <div className="mb-4"><MemoryGraph history={history} /></div>

      {/* Processes */}
      <h4 className="mb-3">Top Memory Consumers</h4>
      <ProcessTable processes={processes} />
    </div>
  );
}