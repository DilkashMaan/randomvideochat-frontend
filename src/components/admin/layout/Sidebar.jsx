import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaCog, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import '../style/adminLayout.css';

const Sidebar = ({ open, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Overlay for small screens */}
      <div className={`sidebar-overlay ${open ? 'show' : ''}`} onClick={onClose}></div>

      <div className={`sidebar ${open ? 'open' : 'collapsed'}`}>
        {/* Close button for mobile */}
        <button className="close-btn3" onClick={onClose}>
          <FaTimes />
        </button>

        <h2>{open ? 'Video-Chat' : ''}</h2>

        <div className="sidebar-content">
          <nav>
            <Link
              to="/admin/dashboard"
              className={`sidebar-link ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}
            >
              <FaTachometerAlt className="sidebar-icon" />
              {open && <span className="sidebar-text">Dashboard</span>}
            </Link>

            <Link
              to="/admin/analytics"
              className={`sidebar-link ${location.pathname === '/admin/analytics' ? 'active' : ''}`}
            >
              <FaCog className="sidebar-icon" />
              {open && <span className="sidebar-text">Analytics</span>}
            </Link>
          </nav>

          {/* Logout button at bottom */}
          <button className="sidebar-link logout-btn">
            <FaSignOutAlt className="sidebar-icon" />
            {open && <span className="sidebar-text">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
