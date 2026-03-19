import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";

function Sidebar({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "◈" },
    { path: "/employees", label: "Employees", icon: "◎" },
    { path: "/reports", label: "Reports", icon: "▤" },
    { path: "/audit", label: "Audit Log", icon: "⛉" },
    { path: "/dashboard/profile", label: "Profile", icon: "◉" },
    { path: "/settings", label: "Settings", icon: "⚙" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-brand">Company</div>
      <div className="sidebar-tagline">Management System</div>

      <ul className="sidebar-nav">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={location.pathname === item.path ? "active" : ""}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="sidebar-user">
        <div className="sidebar-user-info" onClick={() => navigate("/dashboard/profile")}>
          <div className="user-avatar">{initials}</div>
          <div style={{ overflow: "hidden" }}> {/*to prevent the mailid or name overflow*/}
            <div className="user-name">{user?.name || "User"}</div>
            <div className="user-email">{user?.email || ""}</div>
          </div>
        </div>
        <button className="btn-logout" onClick={onLogout}>
          <span>↤</span> Sign Out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;