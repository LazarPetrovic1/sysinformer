import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const NAV_HEIGHT = 40
// -----------------------------
// DOWNLOAD HELPER
// -----------------------------
export const downloadFile = (url, filename) => {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// -----------------------------
// JSON EXPORT
// -----------------------------
export const exportJSON = (data, filename = "report.json") => {
  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  downloadFile(url, filename);
};

// -----------------------------
// CSV EXPORT (generic flatten)
// -----------------------------
export const exportCSV = (rows, filename = "report.csv") => {
  if (!rows || !rows.length) return;

  const headers = Object.keys(rows[0]);

  const csv = [
      headers.join(","),
      ...rows.map(row =>
        headers
          .map(h => JSON.stringify(row[h] ?? ""))
          .join(",")
      )
    ].join("\n");

  const blob = new Blob([csv], { type: "text/csv" });

  const url = URL.createObjectURL(blob);
  downloadFile(url, filename);
};

export const exportPDF = (systemData, filename = "system-report.pdf") => {
  const doc = new jsPDF();
  let y = 10;

  // TITLE
  doc.setFontSize(16);
  doc.text("SysInformer System Report", 10, y);
  y += 10;

  // SYSTEM INFO SECTION
  doc.setFontSize(12);
  doc.text("System Overview", 10, y);
  y += 5;

  const overview = [
    `User: ${systemData.user}`,
    `Platform: ${systemData.platform}`,
    `CPU Cores: ${systemData.cpuCores}`,
    `Total RAM: ${systemData.ram} GB`
  ];

  overview.forEach(line => { doc.text(line, 10, (y += 6)); });
  y += 10;

  // PROCESS TABLE
  doc.text("Top Processes", 10, y);
  y += 5;

  autoTable(doc, {
    startY: y,
    head: [["Name", "PID", "CPU %", "Memory %"]],
    body: systemData.processes.map(p => [p.name, p.pid, p.cpu, p.memory])
  });

  // DISKS SECTION AFTER TABLE
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.text("Disks", 10, finalY);
  autoTable(doc, {
    startY: finalY + 5,
    head: [["Drive", "Used", "Free", "Usage %"]],
    body: systemData.disks.map(d => [d.fs, `${d.used} GB`, `${d.available} GB`, `${((d.used / d.size) * 100).toFixed(1)}%`])
  });

  doc.save(filename);
};