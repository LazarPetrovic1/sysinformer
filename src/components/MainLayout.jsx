import { Outlet } from "react-router-dom";
import { Navbar, Sidebar } from ".";

export default function MainLayout() {
  return (
    <div style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div className="d-flex flex-grow-1" style={{ minHeight: 0 }}>
        <Sidebar />
        <main className="flex-grow-1 p-2" style={{ overflowY: "auto", minHeight: 0 }}><Outlet /></main>
      </div>
    </div>
  );
}