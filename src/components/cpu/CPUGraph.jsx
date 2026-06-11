// components/CpuUsageGraph.jsx
import Plot from "react-plotly.js";

export default function CPUGraph({ history }) {
  return (
    <Plot
      data={[
        {
          x: history.map(x => x.time),
          y: history.map(x => x.value),
          type: "scatter",
          mode: "lines",
          fill: "tozeroy"
        }
      ]}
      layout={{
        title: "CPU Usage (%)",
        autosize: true,
        plot_bgcolor: "rgb(33,37,41)",
        paper_bgcolor: "rgb(33,37,41)",
        xaxis: { color: "white", tickfont: { color: "white" } },
        yaxis: { color: "white", tickfont: { color: "white" },
          title: { text: "CPU Usage Graph", font: { color: "white" } } 
        }
      }}
      
      style={{ width: "100%", height: "400px" }}
    />
  );
}