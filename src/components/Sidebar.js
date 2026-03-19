import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "◈" },
    { path: "/reports", label: "Reports", icon: "▤" },
    { path: "/dashboard/profile", label: "Profile", icon: "◉" },
    { path: "/settings", label: "Settings", icon: "⚙" },
  ];
  const adminItems = [
    { path: "/employees", label: "Employees", icon: "◎" },
    { path: "/audit", label: "Audit Log", icon: "⛉" },
  ];
  const visibleItems = user?.role === "admin" ? [...navItems.slice(0, 1), ...adminItems, ...navItems.slice(1)] : navItems;

  return (
    <div className="sidebar">
      <div className="sidebar-brand">Company</div>
      <div className="sidebar-tagline">Management System</div>

      <ul className="sidebar-nav">
        {visibleItems.map((item) => (
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
