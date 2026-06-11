export default function PerCoreUsage({ cpus }) {
  return (
    <>
      <h4>Per-Core Utilization</h4>
      {cpus.map((core, index) => (
        <div key={index} className="mb-3">
          <div className="d-flex justify-content-between">
            <span>Core {index}</span>
            <span>{core.load.toFixed(1)}%</span>
          </div>

          <div className="progress">
            <div className="progress-bar" role="progressbar" style={{ width: `${core.load}%` }} />
          </div>
        </div>
      ))}
    </>
  )
}