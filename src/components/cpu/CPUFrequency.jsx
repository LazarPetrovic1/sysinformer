// components/CpuFrequencyGraph.jsx

import Plot from "react-plotly.js";

export default function CpuFrequencyGraph({ history }) {
  return (
    <div className="mt-4">
      <Plot
        data={[
          {
            x: history.map(point => point.time),
            y: history.map(point => point.value),
            type: "scatter",
            mode: "lines",
            fill: "tozeroy",
            line: {
              color: "#198754" // Bootstrap success green
            },
            name: "Frequency"
          }
        ]}
        layout={{
          title: "CPU Frequency (GHz)",
          autosize: true,
          margin: { l: 50, r: 20, t: 50, b: 50 },
          plot_bgcolor: "rgb(33,37,41)",
          paper_bgcolor: "rgb(33,37,41)",
          xaxis: { title: "Time", color: "white", tickfont: { color: "white" } },
          yaxis: { title: "GHz", rangemode: "tozero", color: "white", tickfont: { color: "white" } }
        }}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: "100%", height: "400px" }}
      />
    </div>
  );
}