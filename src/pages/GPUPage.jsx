// pages/GPUPage.jsx

import { useEffect, useState } from "react";
import { StatCard } from "../components";

export default function GPUPage() {
  const [gpu, setGpu] = useState(() => null);
  const [heat, setHeat] = useState(() => null);

  useEffect(() => {
    async function update() {
      const [graphics, temp] = await Promise.all([
        window.gpuInfo.graphics(),
        window.gpuInfo.gpuLoad?.()
      ]);

      setGpu(() => graphics);
      setHeat(() => temp);
    }

    update();

    const interval = setInterval(update, 3000); // GPU doesn't need 1s polling
    return () => clearInterval(interval);
  }, []);

  if (!gpu) return <div>Loading GPU...</div>;
  const controllers = gpu.controllers || [];

  return (
      <div className="container-fluid">
        {/* GPU Overview */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <StatCard title="GPU Count" value={controllers.length} color="primary" icon="fa-solid fa-display" />
          </div>

          <div className="col-md-4">
            <StatCard
              title="Temperature"
              value={heat?.main ? `${heat.main}°C` : "N/A"}
              color={heat?.main > 80 ? "danger" : "success"}
              icon="fa-solid fa-temperature-half"
            />
          </div>

          <div className="col-md-4">
            <StatCard
              title="Primary GPU"
              value={controllers[0]?.model || "Unknown"}
              color="secondary"
              icon="fa-solid fa-microchip"
            />
          </div>
        </div>

        {/* GPU Feature Flags */}
        <div className="card p-3 mb-4">
          <h5 className="mb-3">Graphics Capabilities</h5>
          <ul className="list-group">
            <li className="list-group-item">
              DirectX 12:{" "}
              <span className={gpu?.directX?.version ? "text-success" : "text-danger"}>
                {gpu?.directX?.version || "Not available"}
              </span>
            </li>

            <li className="list-group-item">
              Displays:{" "} <span className="text-primary">{gpu.displays?.length || 0}</span>
            </li>

            <li className="list-group-item">
              Active GPUs:{" "}
              <span className="text-success">{controllers.filter(c => c.vramDynamic !== false).length}</span>
            </li>

          </ul>
        </div>

        {/* GPU Devices */}
        <div className="card p-3">
          <h5 className="mb-3">GPU Devices</h5>
          <div className="list-group">
            {controllers.map((gpuDev, i) => (
              <div key={gpuDev.id || i} className="list-group-item">
                <h6>{gpuDev.model}</h6>
                <div>Vendor: {gpuDev.vendor}</div>
                <div>VRAM: {gpuDev.vram ? `${gpuDev.vram} MB` : "Unknown"}</div>
                <div>Active: {gpuDev.vramDynamic !== false ? "Yes" : "No"}</div>
                <div>Bus: {gpuDev.bus || "N/A"}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
  );
}