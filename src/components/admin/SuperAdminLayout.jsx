import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import Topbar from "./layout/Topbar";
import "./style/adminLayout.css";

const SuperAdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  // Handle responsiveness on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="admin-layout">
      <Sidebar open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="main-content">
        <Topbar toggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
