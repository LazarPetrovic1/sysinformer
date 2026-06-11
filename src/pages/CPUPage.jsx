// pages/CPUPage.jsx

import { useEffect, useState } from "react";
import { CPUFrequency, CPUGraph, CPUOverview, PerCoreUsage, TopProcessesTable } from "../components";

export default function CPUPage() {
  const [cpu, setCpu] = useState(() => null);
  const [load, setLoad] = useState(() => null);
  const [speed, setSpeed] = useState(() => null);
  const [temp, setTemp] = useState(() => null);
  const [usageHistory, setUsageHistory] = useState(() => []);
  const [freqHistory, setFreqHistory] = useState(() => []);
  const [processes, setProcesses] = useState(() => []);
  useEffect(() => {
    async function loadStaticInfo() {
      const info = await window.cpuInfo.cpu();
      setCpu(() => info);
    }

    loadStaticInfo();
  }, []);

  useEffect(() => {
    async function updateStats() {
      const [currentLoad, currentSpeed, temperature, procData] =
        await Promise.all([
          window.cpuInfo.currentLoad(),
          window.cpuInfo.currentSpeed(),
          window.cpuInfo.temperature(),
          window.cpuInfo.processes(),
        ]);

      setLoad(() => currentLoad);
      setSpeed(() => currentSpeed);
      setTemp(() => temperature);
      setUsageHistory(prev => {
        const next = [...prev, { time: new Date().toLocaleTimeString(), value: currentLoad.currentLoad }];
        return next.slice(-60);
      });

      setFreqHistory(prev => {
        const next = [...prev, { time: new Date().toLocaleTimeString(), value: currentSpeed.avg }];
        return next.slice(-60);
      });

      const topProcesses = procData.list.sort((a, b) => b.cpu - a.cpu).slice(0, 10);
      setProcesses(topProcesses);
    }

    updateStats();
    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!cpu || !load || !speed) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>{cpu.brand}</h2>
      <CPUOverview cpu={cpu} load={load} speed={speed} temp={temp} />
      <hr />
      <PerCoreUsage cpus={load.cpus} />
      <hr />
      <CPUGraph history={usageHistory} />
      <hr />
      <CPUFrequency history={freqHistory} />
      <hr />
      <TopProcessesTable processes={processes} />
    </div>
  );
}