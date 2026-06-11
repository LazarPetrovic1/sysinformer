// pages/ProcessesPage.jsx

import { useEffect, useMemo, useState } from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, flexRender } from "@tanstack/react-table";

export default function ProcessesPage() {
  const [data, setData] = useState(() => []);
  const [globalFilter, setGlobalFilter] = useState(() => "");
  const [sorting, setSorting] = useState(() => []);

  // Fetch processes
  useEffect(() => {
    async function fetchProcesses() {
      const list = await window.procInfo.list();
      const cleaned = list.map(p => ({
        pid: p.pid,
        name: p.name || "Unknown",
        cpu: p.cpu || 0,
        memory: p.mem || p.memory || 0,
        gpu: p.gpu || 0 // ⚠️ may be undefined depending on OS
      }));
      setData(cleaned);
    }

    fetchProcesses();
    const interval = setInterval(fetchProcesses, 2000);
    return () => clearInterval(interval);
  }, []);

  // TOP OFFENDERS
  const topCPU = useMemo(() => [...data].sort((a, b) => b.cpu - a.cpu)[0], [data]);
  const topMem = useMemo(() => [...data].sort((a, b) => b.memory - a.memory)[0], [data]);
  const topGPU = useMemo(() => [...data].sort((a, b) => b.gpu - a.gpu)[0], [data]);

  // KILL PROCESS
  const killProcess = async (pid) => {
    const confirmKill = window.confirm(`Kill process ${pid}? This may cause data loss.`);
    if (!confirmKill) return;
    await window.procInfo.kill(pid);
  };

  // Table columns
  const columns = useMemo(() => [
    { accessorKey: "name", header: "Process", cell: info => info.getValue() },
    { accessorKey: "pid", header: "PID", cell: info => info.getValue() },
    { accessorKey: "cpu", header: "CPU %", cell: info => `${info.getValue().toFixed(1)}%` },
    { accessorKey: "memory", header: "Memory %", cell: info => `${info.getValue().toFixed(1)}%` },
    { accessorKey: "gpu", header: "GPU %", cell: info => `${(info.getValue() || 0).toFixed(1)}%` },
    {
      id: "actions",
      header: "Actions",
        cell: ({ row }) => 
          <button className="btn btn-sm btn-danger" onClick={() => killProcess(row.original.pid)}>Kill</button>
    }
  ], []);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString"
  });

  return (
    <div className="container-fluid">
      {/* STICKY SUMMARY */}
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <div className="card p-3 bg-dark">
            <h6>Top CPU</h6>
            <strong>{topCPU?.name} ({topCPU?.cpu.toFixed(1)}%)</strong>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 bg-dark">
            <h6>Top Memory</h6>
            <strong>{topMem?.name} ({topMem?.memory.toFixed(1)}%)</strong>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 bg-dark">
            <h6>Top GPU</h6>
            <strong>{topGPU?.name} ({(topGPU?.gpu || 0).toFixed(1)}%)</strong>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <input
        className="form-control mb-3"
        placeholder="Search process..."
        value={globalFilter}
        onChange={e => setGlobalFilter(e.target.value)}
      />

      {/* TABLE */}
      <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
        <table className="table table-hover table-striped">
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(h => (
                  <th
                    key={h.id}
                    onClick={h.column.getToggleSortingHandler()}
                    style={{ cursor: "pointer" }}
                  >{flexRender(h.column.columnDef.header, h.getContext())}</th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map(row => {
              const cpu = row.original.cpu;
              const mem = row.original.memory;
              const danger = cpu > 50 || mem > 50;
              return (
                <tr key={row.original.pid} style={{ backgroundColor: danger ? "#ffe5e5" : undefined }}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}