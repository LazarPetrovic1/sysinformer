import { useEffect, useState } from "react";

export default function Dashboard() {
  const [gpu, setGpu] = useState(() => null);
  const [cpuToggle, setCpuToggle] = useState(() => false);
  const [gpuToggle, setGpuToggle] = useState(() => false);
  const [netToggle, setNetToggle] = useState(() => false);
  const getPlatform = (val) => val === 'win32' ? "Windows" : val === 'linux' ? "Linux" : "Mac"; 
  useEffect(() => {
    (async function() {
      const gpus = await window.systemInfo.gpu();
      setGpu(() => gpus);
    })()
  }, []);
  const CpuInfo = (
    <ol>
      {window.systemInfo.cpu().map(cpu => (
        <>
          <li key={cpu.model}>
            <div className="d-flex justify-content-between">
              <h6 className="p-1 rounded text-secondary">{cpu.model}</h6>
            </div>
            <div className="d-flex justify-content-between">
              <span>Speed</span>
              <span className="p-1 rounded text-primary">{cpu.speed}MHz</span>
            </div>
            <div className="d-flex justify-content-between">
              <span title="This refers to your applications and programs.">
                Time spent executing code in user mode
              </span>
              <span className="p-1 rounded text-primary">{(cpu.times.user / 1000).toFixed(2)} seconds</span>
            </div>
            <div className="d-flex justify-content-between">
              <span title="This does not refer to the Windows OS and is always 0.">
                Time spent on low-priority user processes
              </span>
              <span className="p-1 rounded text-primary">{cpu.times.nice / 1000} seconds</span>
            </div>
            <div className="d-flex justify-content-between">
              <span title="Time the CPU was idle (doing nothing). This value is typically very high.">
                Idle time
              </span>
              <span className="p-1 rounded text-primary">{(cpu.times.idle / 1000).toFixed(2)} seconds</span>
            </div>
            <div className="d-flex justify-content-between">
              <span title="This includes handling system calls, drivers, etc.">
                Time spent executing code in kernel mode
              </span>
              <span className="p-1 rounded text-primary">{(cpu.times.sys / 1000).toFixed(2)} seconds</span>
            </div>
            <div className="d-flex justify-content-between">
              <span title="Examples include requests from devices like network cards or disks etc.">
                Time spent handling hardware interrupts
              </span>
              <span className="p-1 rounded text-primary">{(cpu.times.irq / 1000).toFixed(2)} seconds</span>
            </div>
          </li>
          <hr />
        </>
      ))}
    </ol>
  )
  const GpuInfo = gpu && (
    <>
      <ol>
        <li className={gpu.auxAttributes.amdSwitchable ? "text-success" : "text-danger"}>AMD hybrid graphics switching is {gpu.auxAttributes.amdSwitchable ? "" : "not"} supported</li>
        <li className={gpu.auxAttributes.canSupportThreadedTextureMailbox ? "text-success" : "text-danger"}>Can {gpu.auxAttributes.canSupportThreadedTextureMailbox ? "" : "not"} support threaded texture mailbox.</li>
        <li>Microsoft's DirectML (AI/ML acceleration) support:&nbsp;
          <span className={gpu.auxAttributes.directMLFeatureLevel.includes("Not") ? "text-danger" : "text-success"}>
            {gpu.auxAttributes.directMLFeatureLevel.includes("Not") ? "Not supported" : "Supported"}
          </span>
        </li>
        <li>DirectX 12 support level:&nbsp;
          <span className={gpu.auxAttributes.dx12FeatureLevel.includes("Not") ? "text-danger" : "text-success"}>
            {gpu.auxAttributes.dx12FeatureLevel.includes("Not") ? "Not supported" : "Supported"}
          </span>
        </li>
        <li>Graphics API backend:&nbsp;
          <span className={gpu.auxAttributes.glImplementationParts.includes("gl=none") ?
              "text-danger" : "text-success"
            }>
            {gpu.auxAttributes.glImplementationParts.includes("gl=none") ? "No OpenGL support" : "OpenGL supported"}
          </span>,&nbsp;
          <span className={gpu.auxAttributes.glImplementationParts.includes("angle=none") ?
              "text-danger" : "text-success"
            }>
            {gpu.auxAttributes.glImplementationParts.includes("angle=none") ? "No WebGL support" : "WebGL supported"}
          </span>
        </li>
        <li className={gpu.auxAttributes.inProcessGpu ? "text-success" : "text-danger"}>GPU {gpu.auxAttributes.inProcessGpu ? "runs" : "does not run"} in the main process.</li>
        <li className={gpu.auxAttributes.isAsan ? "text-success" : "text-danger"}>Developer tools: {gpu.auxAttributes.isAsan ? "Enabled" : "Not enabled"}</li>
        <li className={gpu.auxAttributes.jpegDecodeAcceleratorSupported ? "text-success" : "text-danger"}>JPEG decoding is {gpu.auxAttributes.jpegDecodeAcceleratorSupported ? "" : "not"} available.</li>
        <li className={gpu.auxAttributes.sandboxed ? "text-success" : "text-danger"}>The GPU is {gpu.auxAttributes.sandboxed ? "" : "not"} sandboxed. This suggests {gpu.auxAttributes.sandboxed ? "stronger" : "weaker"} security.</li>
        <li className={gpu.auxAttributes.skiaBackendType === "None" ? "text-danger" : "text-success"}>Graphics rendering backend: {gpu.auxAttributes.skiaBackendType}</li>
        <li className={gpu.auxAttributes.subpixelFontRendering ? "text-success" : "text-danger"}>Subpixel text rendering and ClearType fonting is {gpu.auxAttributes.subpixelFontRendering ? "" : "not"} enabled.</li>
        <li>Three-dimensional support:&nbsp;
          <span className={gpu.auxAttributes.supportsD3dSharedImages ?
              "text-success" : "text-danger"
            }>
            D3D shared images {gpu.auxAttributes.supportsD3dSharedImages ? "" : "not"} supported
          </span>,&nbsp;
          <span className={gpu.auxAttributes.supportsVulkan ?
              "text-success" : "text-danger"
            }>
            Vulkan {gpu.auxAttributes.supportsVulkan ? "" : "not"} supported
          </span>
        </li>
      </ol>
      <ol>
        {gpu.gpuDevice.map((dev, i) => (
          <>
            <li key={i} className={`${i + 1 < gpu.gpuDevice.length ? "border-bottom" : ""} mt-1`}>
              <h6 className="pt-2">{dev.deviceString}</h6>
              <div className={dev.active ? "text-success" : "text-danger"}>
                {dev.active ? "Active" : "Inactive"}
              </div>
              <div>Device ID: {dev.deviceId}</div>
              <div>Version: {dev.driverVersion}</div>
              <div>Revision: {dev.revision}</div>
              <div>Subsystem ID: {dev.subSysId}</div>
              <div>Vendor ID: {dev.vendorId}</div>
            </li>
          </>
        ))}
      </ol>
    </>
  )
  const NetLoopbacks = (
    <>
      <h5><i>Loopbacks</i></h5>
      <ol>
        {window.systemInfo.networkInterfaces()["Loopback Pseudo-Interface 1"].map((iface, i) => (
          <li key={i} className={`${i + 1 < window.systemInfo.networkInterfaces()["Loopback Pseudo-Interface 1"].length ? "border-bottom" : ""} mt-1`}>
            <div className={iface.internal ? "text-primary" : "text-secondary"}>{iface.internal ? "In" : "Ex"}ternal</div>
            <div>Address: {iface.address} ({iface.family})</div>
            <div>CIDR: {iface.cidr}</div>
            <div>MAC Address: {iface.mac}</div>
            <div>Subnet mask: {iface.netmask}</div>
          </li>
        ))}
      </ol>
    </>
  )
  const NetWifi = (
    <li className="list-group-item d-flex flex-column">
      <h5><i>Wireless connections</i></h5>
      <ol>
        {window.systemInfo.networkInterfaces()["WiFi"].map((iface, i) => (
          <li key={i} className={`${i + 1 < window.systemInfo.networkInterfaces()["WiFi"].length ? "border-bottom" : ""} mt-1`}>
            <div className={iface.internal ? "text-primary" : "text-secondary"}>{iface.internal ? "In" : "Ex"}ternal</div>
            <div>Address: {iface.address} ({iface.family})</div>
            <div>CIDR: {iface.cidr}</div>
            <div>MAC Address: {iface.mac}</div>
            <div>Subnet mask: {iface.netmask}</div>
          </li>
        ))}
      </ol>
    </li>
  )
  return (
    <div className="container-fluid px-3 mt-4">
      <ul className="list-group">
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <h4>Username</h4>
          <span className="p-1 rounded text-primary">{window.systemInfo.userInfo().username}</span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <h4>Architecture</h4>
          <span className="p-1 rounded text-primary">{window.systemInfo.arch}</span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <h4>Platform (<i>Operating System</i>)</h4>
          <span className="p-1 rounded text-primary">{getPlatform(window.systemInfo.platform)}</span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <h4>Home directory</h4>
          <span className="p-1 rounded text-primary">{window.systemInfo.drives()}</span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <h4>Total memory (<i>RAM</i>)</h4>
          <span className="p-1 rounded text-primary">≈{(window.systemInfo.totalMemory() / (1024 ** 3)).toFixed(2)}GB</span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <h4>Free memory (<i>RAM</i>)</h4>
          <span className="p-1 rounded text-primary">≈{(window.systemInfo.freeMemory() / (1024 ** 3)).toFixed(2)}GB</span>
        </li>
        <li className="list-group-item d-flex justify-content-between flex-column">
          <div className="d-flex justify-content-between">
            <h4 className="mb-2">Central Processing Units</h4>
            <button className="btn btn-secondary" onClick={() => setCpuToggle((prev) => !prev)}>
              <i className={`fa-solid fa-chevron-${cpuToggle ? "down" : "up"}`} />
            </button>
          </div>
          {cpuToggle && CpuInfo}
        </li>
        
        {gpu && (
          <li className="list-group-item d-flex justify-content-between flex-column">
            <div className="d-flex justify-content-between">
              <h4 className="mb-2">Graphics Processing Units</h4>
              <button className="btn btn-secondary" onClick={() => setGpuToggle((prev) => !prev)}>
                <i className={`fa-solid fa-chevron-${gpuToggle ? "down" : "up"}`} />
              </button>
            </div>
            {gpuToggle && GpuInfo}
          </li>
        )}

        <li className="list-group-item d-flex flex-column">
          <div className="d-flex justify-content-between">
            <h4>Net Interfaces</h4>
            <button className="btn btn-secondary" onClick={() => setNetToggle((prev) => !prev)}>
              <i className={`fa-solid fa-chevron-${netToggle ? "down" : "up"}`} />
            </button>
          </div>
          {netToggle && NetLoopbacks}
        </li>
        {netToggle && NetWifi}
      </ul>
    </div>
  );
}