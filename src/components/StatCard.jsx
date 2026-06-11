// components/StatCard.jsx

export default function StatCard({ title, value, color = "primary", icon }) {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-muted">{title}</h6>
            <h3 className={`text-${color}`}>{value}</h3>
          </div>
          {icon && <i className={`${icon} fs-2 text-${color}`} />}
        </div>
      </div>
    </div>
  );
}