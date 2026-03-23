import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import { getEmployees } from "../api/employeeApi";
import { useAuth } from "../context/AuthContext";

function Dashboard({ onLogout }) {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEmployees() {
      try {
        setIsLoading(true);
        const data = await getEmployees();
        setEmployees(data);
        setError("");
      } catch (apiError) {
        setError(apiError.response?.data?.message || "Unable to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    }

    loadEmployees();
  }, []);

  const departments = [...new Set(employees.map((employee) => employee.department))];
  const activeEmployees = employees.filter((employee) => employee.status === "Active").length;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";

  return (
    <div className="app-layout">
      <Sidebar onLogout={onLogout} />

      <div className="main-content">
        <div className="page-header">
          <h1>
            Good {greeting}, {user?.name?.split(" ")[0] || "there"}
          </h1>
          <p>Here's your company overview</p>
        </div>

        {error && <div className="feedback-banner error">{error}</div>}
        {isLoading && <div className="feedback-banner">Loading dashboard data...</div>}

        <div className="stat-grid">
          <div className="stat-card">
            <div className="label">Total Employees</div>
            <div className="value">{employees.length}</div>
            <div className="sub">Live records from the backend</div>
          </div>

          <div className="stat-card">
            <div className="label">Departments</div>
            <div className="value">{departments.length}</div>
            <div className="sub">
              {departments.length ? departments.join(", ") : "No departments yet"}
            </div>
          </div>

          <div className="stat-card">
            <div className="label">Active Employees</div>
            <div className="value">{activeEmployees}</div>
            <div className="sub">
              {employees.length - activeEmployees} not currently active
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
