export default function CPUOverview({ cpu, load, speed, temp }) {
  return (
    <div className="row">
      <div className="col-md-3">
        <div className="card p-3">
          <h5>Total Usage</h5>
          <h3>{load.currentLoad.toFixed(1)}%</h3>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card p-3">
          <h5>Frequency</h5>
          <h3>{speed.avg.toFixed(2)} GHz</h3>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card p-3">
          <h5>Temperature</h5>
          <h3>{temp?.main ? `${temp.main} °C` : "Unavailable"}</h3>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card p-3">
          <h5>Cores</h5>
          <h3>{cpu.cores}</h3>
        </div>
      </div>
    </div>
  )
}