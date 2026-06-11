// components/Navbar.jsx

import { Link } from "react-router-dom";
import { NAV_HEIGHT } from "../utils";

export default function Navbar() {
  return (
    <nav className="navbar navbar-dark bg-dark" style={{ height: `${NAV_HEIGHT}px` }}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/dashboard">
         <span className="px-2">SysInformer</span> <span style={{ fontSize: '0.7rem' }}>&nbsp;v{process.env.REACT_APP_VERSION}</span>
        </Link>
      </div>
    </nav>
  );
}