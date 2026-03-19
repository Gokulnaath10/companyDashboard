import Sidebar from "../components/Sidebar";
import { getCurrentUser } from "../utils/auth";
import employees from "../utils/mockEmployees";
import { Outlet, useOutlet } from "react-router-dom";

function Dashboard({ onLogout }) {
  const user = getCurrentUser();
  const outlet = useOutlet(); // non-null when a nested route like /profile or /:id is active
  const depts = [...new Set(employees.map((e) => e.department))];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";

  return (
    <div className="app-layout">
      <Sidebar onLogout={onLogout} />

      <div className="main-content">
        {/* Only show overview when exactly at /dashboard (no nested route active) */}
        {!outlet && (
          <>
            <div className="page-header">
              <h1>
                Good {greeting}, {user?.name?.split(" ")[0] || "there"}
              </h1>
              <p>Here's your company overview</p>
            </div>

            <div className="stat-grid">
              <div className="stat-card">
                <div className="label">Total Employees</div>
                <div className="value">{employees.length}</div>
                <div className="sub">↑ 2 this quarter</div>
              </div>

              <div className="stat-card">
                <div className="label">Departments</div>
                <div className="value">{depts.length}</div>
                <div className="sub">{depts.join(", ")}</div>
              </div>

              <div className="stat-card">
                <div className="label">Open Positions</div>
                <div className="value">3</div>
                <div className="sub">2 in Technology</div>
              </div>

              <div className="stat-card">
                <div className="label">Avg. Tenure</div>
                <div className="value">2.4y</div>
                <div className="sub">↑ 0.3y YoY</div>
              </div>
            </div>
          </>
        )}

        {/* Nested route content renders here (/dashboard/profile or /dashboard/:id) */}
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;

