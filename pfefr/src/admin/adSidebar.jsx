import { Link } from "react-router-dom";
import './adSidebar.css'; // Don't forget to import the CSS file

const Sidebar = () => {
  return (
    <div className="sidebarr">
      <a href="/" className="sidebarr-title">🏠 Admin Dashboard</a>
      <nav>
        <ul>
          <li className="sidebarr-item">
            <Link to="/admin/users" className="sidebarr-link">
              <span className="icon">👤</span>
              <span className="link-text">User List</span>
            </Link>
          </li>
          <li className="sidebarr-item">
            <Link to="/admin/stats" className="sidebarr-link">
              <span className="icon">📊</span>
              <span className="link-text">Statistics & Charts</span>
            </Link>
          </li>
          <li className="sidebarr-item">
            <Link to="/admin/contacts" className="sidebarr-link">
              <span className="icon">📩</span>
              <span className="link-text">Messages</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
