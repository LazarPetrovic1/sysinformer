window.require = require;
const { contextBridge, ipcRenderer } = require('electron');

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
});