import React from 'react';
import './Sidebar.css'; // custom styling

const Sidebar = () => {
  return (
    <div className="sidebar bg-dark text-white d-flex flex-column p-3">
      <div className="text-center mb-4">
        <img src="https://via.placeholder.com/70" className="rounded-circle" alt="User" />
        <h6 className="mt-2">John David</h6>
        <small className="text-success">● Online</small>
      </div>
      <ul className="nav flex-column">
        <li>🏠 Dashboard</li>
        <li>💡 Widgets</li>
        <li>✨ Elements</li>
        <li>📊 Tables</li>
        <li>📱 Apps</li>
        <li>💰 Pricing</li>
        <li>📞 Contact</li>
        <li>📂 Pages</li>
        <li>🗺️ Map</li>
        <li>📈 Charts</li>
        <li>⚙️ Settings</li>
      </ul>
    </div>
  );
};

export default Sidebar;
