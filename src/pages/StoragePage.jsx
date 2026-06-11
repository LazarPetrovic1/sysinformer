// pages/StoragePage.jsx

import { useEffect, useState } from "react";
import { StatCard } from "../components";

export default function StoragePage() {
  const [disks, setDisks] = useState(() => []);
  const [layout, setLayout] = useState(() => []);
  const [stats, setStats] = useState(() => null);
  const [health, setHealth] = useState(() => ({}));
  const [alerts, setAlerts] = useState(() => []);
  const [io, setIo] = useState(() => null);

  useEffect(() => {
    const updateIO = async () => {
      const stats = await window.storageInfo.fsStats();
      setIo(() => stats);
    };

    updateIO();
    const interval = setInterval(updateIO, 1000);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    async function load() {
      const { fs, layout, stats } = await window.storageInfo.full();
      setDisks(() => fs);
      setLayout(() => layout);
      setStats(() => stats);

      // ---------------------------
      // HEALTH ANALYSIS ENGINE
      // ---------------------------

      const newAlerts = [];
      const healthMap = {};

      fs.forEach(disk => {
        const usage = (disk.used / disk.size) * 100;
        let score = 100;
        // usage penalty
        if (usage > 90) score -= 40;
        else if (usage > 75) score -= 20;
        // low space warning
        if (disk.available < 20 * 1024 ** 3) {
          newAlerts.push(`${disk.fs} has low free space`);
          score -= 20;
        }

        // heuristic stability penalty
        if (disk.type === "Unknown") score -= 10;
        healthMap[disk.fs] = { score: Math.max(score, 0), usage };
      });

      setHealth(() => healthMap);
      setAlerts(() => newAlerts);
    }

    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!disks.length) return <div>Loading storage...</div>;

  return (
    <div className="container-fluid">
      {/* SUMMARY CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <StatCard
            title="Total Drives"
            value={disks.length}
            color="primary"
            icon="fa-solid fa-hard-drive"
          />
        </div>

        <div className="col-md-4">
          <StatCard
            title="Total Used"
            value={`${((disks.reduce((acc, d) => acc + d.used, 0).toFixed(2)) / (1024 ** 3)).toFixed(2)} GB`}
            color="danger"
            icon="fa-solid fa-database"
          />
        </div>

        <div className="col-md-4">
          <StatCard
            title="Total Free"
            value={`${((disks.reduce((acc, d) => acc + d.available, 0)) / (1024 ** 3)).toFixed(2)} GB`}
            color="success"
            icon="fa-solid fa-circle-check"
          />
        </div>
      </div>

      {/* DISK LIST */}
      <div className="card p-3 mb-4">
        <h5>Drives</h5>
        <div className="list-group">
          {disks.map((disk, i) => {
            const diskHealth = health[disk.fs];
            const usage = ((disk.used / disk.size) * 100).toFixed(1);
            return (
              <div key={i} className="list-group-item">
                <h6>{disk.fs}</h6>
                <div>Type: {disk.type}</div>
                <div>Size: {(disk.size / 1024 ** 3).toFixed(2)} GB</div>
                <div>Used: {(disk.used / 1024 ** 3).toFixed(2)} GB</div>
                <div>Free: {(disk.available / 1024 ** 3).toFixed(2)} GB</div>
                <div>
                  Usage:{" "}
                  <span className={usage > 85 ? "text-danger" : usage > 70 ? "text-warning" : "text-success"}>{usage}%</span>
                </div>
                <div>
                  Health Score:{" "}
                  <span
                    className={diskHealth?.score > 80
                        ? "text-success"
                        : diskHealth?.score > 50
                        ? "text-warning"
                        : "text-danger"
                    }
                  >{diskHealth?.score ?? 100}/100</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DISK LAYOUT (HARDWARE LEVEL) */}
      <div className="card p-3">
        <h5>Physical Disks</h5>
        <div className="list-group">
          {layout.map((d, i) => (
            <div key={i} className="list-group-item">
              <h6>{d.name}</h6>
              <div>Vendor: {d.vendor}</div>
              <div>Type: {d.type}</div>
              <div>Interface: {d.interfaceType}</div>
              <div>Size: {(d.size / 1024 ** 3).toFixed(2)} GB</div>
              <div>SSD: {d.type === "SSD" ? "Yes" : "No"}</div>
              <div>Temperature: {d.temperature ? `${d.temperature}°C` : "N/A"}</div>
              <div>
                SMART Status:{" "}
                <span className={d.smartStatus === "Ok" ? "text-success" : "text-warning"}>
                  {d.smartStatus || "Unknown"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <StatCard
            title="Disk Read"
            value={`${(io?.rx_sec / 1024 / 1024 || 0).toFixed(2)} MB/s`}
            color="primary"
            icon="fa-solid fa-download"
          />
        </div>

        <div className="col-md-6">
          <StatCard
            title="Disk Write"
            value={`${(io?.tx_sec / 1024 / 1024 || 0).toFixed(2)} MB/s`}
            color="danger"
            icon="fa-solid fa-upload"
          />
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="alert alert-warning mb-3">
          <h6>Storage Alerts</h6>
          <ul>{alerts.map((a, i) => <li key={i}>{a}</li>)}</ul>
        </div>
      )}
    </div>
  );
}