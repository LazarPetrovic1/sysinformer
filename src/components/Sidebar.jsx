import { NavLink } from "react-router-dom";
import { NAV_HEIGHT } from "../utils";

const routes = [
  {
    path: "/",
    icon: "fa-solid fa-chart-line",
    label: "Dashboard"
  },
  {
    path: "/cpu",
    icon: "fa-solid fa-microchip",
    label: "CPU"
  },
  {
    path: "/memory",
    icon: "fa-solid fa-memory",
    label: "Memory"
  },
  {
    path: "/gpu",
    icon: "fa-solid fa-display",
    label: "GPU"
  },
  {
    path: "/storage",
    icon: "fa-solid fa-hard-drive",
    label: "Storage"
  },
  {
    path: "/network",
    icon: "fa-solid fa-network-wired",
    label: "Network"
  },
  {
    path: "/processes",
    icon: "fa-solid fa-list",
    label: "Processes"
  },
  {
    path: "/reports",
    icon: "fa-solid fa-file-pdf",
    label: "Reports"
  }
];

export default function Sidebar() {
  return (
    <div
      className="bg-dark text-white"
      style={{
        width: "250px",
        height: `calc(100vh - ${NAV_HEIGHT}px)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <ul className="nav flex-column">
        {routes.map(route => (
          <li key={route.path} className="nav-item">
            <NavLink
              to={route.path}
              end={route.path === "/"}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center ${isActive ? "active-link" : "text-white"}`
              }
              style={{ textDecoration: "none" }}
            >
              <i className={`${route.icon} me-2`} />
              {route.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}