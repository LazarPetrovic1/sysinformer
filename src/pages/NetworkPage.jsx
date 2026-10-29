// pages/NetworkPage.jsx

import { useEffect, useState } from "react";
import { StatCard } from "../components";

export default function NetworkPage() {
  const [interfaces, setInterfaces] = useState(() => []);
  const [stats, setStats] = useState(() => []);
  const [history, setHistory] = useState(() => ({ download: [], upload: [] }));
  const [publicIP, setPublicIP] = useState(() => "");
  const [localIPs, setLocalIPs] = useState(() => []);
  const [dnsResult, setDnsResult] = useState(() => []);
  const [trace, setTrace] = useState(() => []);
  const [domain, setDomain] = useState(() => "google.com");
  const [pingHostValue, setPingHostValue] = useState(() => "google.com");
  const [pingResult, setPingResult] = useState(() => null);

  useEffect(() => {
    async function loadTools() {
      const ip = await window.netTools.publicIP();
      const local = window.netTools.localIPs();
      setPublicIP(() => ip);
      setLocalIPs(() => local);
    }

    loadTools();
  }, []);

  useEffect(() => {
    async function update() {
      const [ifaces, netStats] = await Promise.all([
        window.netInfo.networkInterfaces(),
        window.netInfo.networkStats()
      ]);

      setInterfaces(() => ifaces);
      setStats(() => netStats);
      console.log("NET STATS", netStats);
      

      // systeminformation gives cumulative bytes
      const main = netStats[0];
      const downloadMbps = (main.rx_sec / 1024 / 1024).toFixed(2);
      const uploadMbps = (main.tx_sec / 1024 / 1024).toFixed(2);

      setHistory(prev => ({
        download: [...prev.download, { time: new Date().toLocaleTimeString(), value: Number(downloadMbps) }].slice(-60),
        upload: [...prev.upload, { time: new Date().toLocaleTimeString(), value: Number(uploadMbps) }].slice(-60)
      }));
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const mainStats = stats[0] || {};

  const handleDnsLookup = async () => {
    const res = await window.netTools.dnsLookup(domain);
    console.log("REZ", res);
    setDnsResult(() => {
      if (!Array.isArray(res) && res?.addresses) return res.addresses;
      return res;
    });
  };

  const handlePing = async () => {
    const res = await window.netTools.pingHost(pingHostValue);
    setPingResult(res);
  };

  const handleTrace = () => {
    setTrace(() => []);
    window.netTools.traceroute(domain, (hops) => setTrace(() => hops));
  };

  return (
    <div className="container-fluid">
      {/* LIVE STATS */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <StatCard
            title="Download"
            value={`${(mainStats.rx_sec / 1024 / 1024).toFixed(2)} MB/s`}
            color="success"
            icon="fa-solid fa-download"
          />
        </div>

        <div className="col-md-4">
          <StatCard
            title="Upload"
            value={`${(mainStats.tx_sec / 1024 / 1024).toFixed(2)} MB/s`}
            color="primary"
            icon="fa-solid fa-upload"
          />
        </div>

        <div className="col-md-4">
          <StatCard title="Total Interfaces" value={interfaces.length} color="secondary" icon="fa-solid fa-network-wired" />
        </div>
      </div>

      {/* INTERFACES */}
      <div className="card p-3 mb-4">
        <h5>Network Interfaces</h5>
        <div className="list-group">
          {interfaces.map((iface, i) => (
            <div key={iface.iface || i} className="list-group-item">
              <h6>{iface.iface}</h6>
              <div>IP: {iface.ip4 || iface.ip6 || "N/A"}</div>
              <div>MAC: {iface.mac || "N/A"}</div>
              <div>Type: {iface.type}</div>
              <div>Internal: {iface.internal ? "Yes" : "No"}</div>
              <div>CIDR: {iface.cidr || "N/A"}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-3 mb-3">
        <h5>Public IP</h5>
        <h4 className="text-primary">{publicIP || "Loading..."}</h4>
      </div>

      <div className="card p-3 mb-3">
        <h5>Local IPs</h5>
        {localIPs.map((ip, i) => (
          <div key={i} className="border-bottom py-1">
            <div>{ip.iface}</div>
            <div>{ip.address}</div>
            <div>{ip.internal ? "Internal" : "External"}</div>
          </div>
        ))}
      </div>

      <div className="card p-3 mb-3">
        <h5>Ping Test</h5>
        <div className="input-group mb-2">
          <input className="form-control" value={pingHostValue} onChange={(e) => setPingHostValue(e.target.value)} />
          <button className="btn btn-success" onClick={handlePing}>Ping</button>
        </div>

        {pingResult && (
          <div>
            <div>Alive: {pingResult.alive ? "Yes" : "No"}</div>
            <div>Time: {pingResult.time}</div>
            <div>Host: {pingResult.host}</div>
          </div>
        )}
      </div>

      <div className="card p-3 mb-3">
        <h5>Traceroute</h5>
        <button className="btn btn-warning mb-2" onClick={handleTrace}>Run Trace</button>
        <ol>{trace.map((hop, i) => <li key={i}>{hop.ip || hop.hostname || "Unknown"} — {hop.rtt1}ms</li>)}</ol>
      </div>

      <div className="card p-3 mb-3">
        <h5>DNS Lookup</h5>
        <div className="input-group mb-2">
          <input className="form-control" value={domain} onChange={(e) => setDomain(e.target.value)} />
          <button className="btn btn-primary" onClick={handleDnsLookup}>Lookup</button>
        </div>
        <ul>{dnsResult.map(({ address, family }, i) => <li key={i}>{address} - IPv{family}</li>)}</ul>
      </div>
    </div>
  );
}