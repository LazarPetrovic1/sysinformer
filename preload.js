// preload.js
window.require = require;
const { contextBridge, ipcRenderer } = require('electron');
const si = require("systeminformation");
const dns = require("dns").promises;
const publicIp = require("public-ip");
const traceroute = require("nodejs-traceroute");
const ping = require("ping");
// const psList = require("ps-list");
const { exec } = require("child_process");

contextBridge.exposeInMainWorld("procInfo", {
  // list: () => psList(),
  list: async () => {
    const data = await si.processes();
    return data.list;
  },
  kill: (pid) => {
    if (process.platform === "win32") exec(`taskkill /PID ${pid} /F`);
    else exec(`kill -9 ${pid}`);
  }
});

contextBridge.exposeInMainWorld("cpuInfo", {
  currentLoad: () => si.currentLoad(),
  currentSpeed: () => si.cpuCurrentSpeed(),
  temperature: () => si.cpuTemperature(),
  cpu: () => si.cpu(),
  processes: () => si.processes(),
  memory: () => si.mem(),
});

contextBridge.exposeInMainWorld("memoryInfo", {
  processes: () => si.processes(),
  memory: () => si.mem(),
})

contextBridge.exposeInMainWorld("gpuInfo", {
  gpu: () => si.graphics(),
  gpuLoad: () => si.cpuTemperature(),
  graphics: () => si.graphics(),
})

contextBridge.exposeInMainWorld("netTools", {
  dnsLookup: (domain) => dns.lookup(domain, { all: true }),
  publicIP: async () => { return await publicIp.publicIpv4(); },
  pingHost: async (host) => await ping.promise.probe(host),

  localIPs: () => {
    const os = require("os");
    const nets = os.networkInterfaces();
    const results = [];
    for (const name of Object.keys(nets)) {
      for (const net of nets[name])
        if (net.family === "IPv4") results.push({ iface: name, address: net.address, internal: net.internal });
    }
    return results;
  },

  traceroute: (host, callback) => {
    const trace = new traceroute();
    const hops = [];
    trace.on("hop", (hop) => { hops.push(hop); });
    trace.on("close", () => { callback(hops); });
    trace.trace(host);
  }
});

contextBridge.exposeInMainWorld("netInfo", {
  networkStats: () => si.networkStats(),
  networkInterfaces: () => si.networkInterfaces(),
  internetPing: () => si.inetChecksite("google.com"),
})

contextBridge.exposeInMainWorld('systemInfo', {
  // Critical system information
  platform: process.platform,
  arch: process.arch,
  versions: process.versions,
  // System properties
  totalMemory: () => require('os').totalmem(),
  freeMemory: () => require('os').freemem(),
  drives: () => require('os').homedir(), // Note: Electron has no direct drive API; this is a placeholder
  // Performance & hardware
  cpu: () => require('os').cpus(),
  gpu: async () => ipcRenderer.invoke('gpu'),
  // Network and other
  networkInterfaces: () => require('os').networkInterfaces(),
  userInfo: () => require('os').userInfo(),
  memory: () => {
    return { total: require('os').totalmem(), free: require('os').freemem() }
  }
});

contextBridge.exposeInMainWorld("storageInfo", {
  disks: () => si.fsSize(),
  layout: () => si.diskLayout(),
  fsStats: () => si.fsStats(),
  full: async () => {
    const [fs, layout, stats] = await Promise.all([si.fsSize(), si.diskLayout(), si.fsStats()]);
    return { fs, layout, stats };
  }
});