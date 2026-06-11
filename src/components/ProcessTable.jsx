// components/ProcessTable.jsx

export default function ProcessTable({ processes }) {
  return (
    <table className="table table-striped table-hover">
      <thead>
        <tr>
          <th>Name</th>
          <th>PID</th>
          <th>CPU %</th>
          <th>Memory %</th>
        </tr>
      </thead>

      <tbody>
        {processes.map(proc => (
          <tr key={proc.pid}>
            <td>{proc.name}</td>
            <td>{proc.pid}</td>
            <td>{proc.cpu.toFixed(1)}</td>
            <td>{proc.mem.toFixed(1)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}