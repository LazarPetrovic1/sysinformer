// components/MemoryGraph.jsx

import Plot from "react-plotly.js";

export default function MemoryGraph({ history }) {
  return (
    <Plot
      data={[
        {
          x: history.map(x => x.time),
          y: history.map(x => x.value),
          type: "scatter",
          mode: "lines",
          fill: "tozeroy",
          line: { color: "#0d6efd" }
        }
      ]}
      layout={{
          title: "Memory Usage (GB)",
          autosize: true,
          margin: { l: 50, r: 20, t: 50, b: 50 },
          plot_bgcolor: "rgb(33,37,41)",
          paper_bgcolor: "rgb(33,37,41)",
          xaxis: { title: "Time", color: "white", tickfont: { color: "white" } },
          yaxis: { title: "Memory Usage (GB)", rangemode: "tozero", color: "white", tickfont: { color: "white" } }
        }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: "100%", height: "400px" }}
    />
  );
}