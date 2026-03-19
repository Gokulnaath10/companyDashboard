import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import { getEmployees } from "../api/employeeApi";

function Reports({ onLogout }) {
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
        setError(apiError.response?.data?.message || "Unable to load reports");
      } finally {
        setIsLoading(false);
      }
    }

    loadEmployees();
  }, []);

  const departmentCounts = employees.reduce((counts, employee) => {
    counts[employee.department] = (counts[employee.department] || 0) + 1;
    return counts;
  }, {});
  const activeEmployees = employees.filter((employee) => employee.status === "Active").length;
  const managementCount = employees.filter((employee) =>
    /lead|manager|head|chief|director|vp|ceo|cto|cfo/i.test(employee.role)
  ).length;
  const averageTeamSize = Object.keys(departmentCounts).length
    ? (employees.length / Object.keys(departmentCounts).length).toFixed(1)
    : "0.0";
  const managementRatio = managementCount ? `1:${Math.max(1, Math.round(employees.length / managementCount))}` : "N/A";

  return (
    <div className="app-layout">
      <Sidebar onLogout={onLogout} />
      <div className="main-content">
        <div className="page-header">
          <h1>Reports</h1>
          <p>Company analytics & metrics</p>
        </div>

        {error && <div className="feedback-banner error">{error}</div>}
        {isLoading && <div className="feedback-banner">Loading reports...</div>}

        <div className="report-grid">
          <div className="report-card">
            <h4>Headcount by Department</h4>
            {Object.entries(departmentCounts).map(([department, count]) => (
              <div className="report-item" key={department}>
                <span className="r-label">{department}</span>
                <span className="r-value">{count}</span>
              </div>
            ))}
            <div
              className="report-item"
              style={{
                borderTop: "2px solid var(--border)",
                marginTop: 8,
                paddingTop: 12,
              }}
            >
              <span className="r-label" style={{ fontWeight: 600 }}>
                Total
              </span>
              <span className="r-value" style={{ color: "var(--accent)" }}>
                {employees.length}
              </span>
            </div>
          </div>

          <div className="report-card">
            <h4>Status Distribution</h4>
            <div className="report-item">
              <span className="r-label">Active</span>
              <span className="r-value">{activeEmployees}</span>
            </div>
            <div className="report-item">
              <span className="r-label">Inactive</span>
              <span className="r-value">
                {employees.filter((employee) => employee.status === "Inactive").length}
              </span>
            </div>
            <div className="report-item">
              <span className="r-label">On Leave</span>
              <span className="r-value">
                {employees.filter((employee) => employee.status === "On Leave").length}
              </span>
            </div>
          </div>

          <div className="report-card">
            <h4>Quick Stats</h4>
            <div className="report-item">
              <span className="r-label">Avg. Team Size</span>
              <span className="r-value">{averageTeamSize}</span>
            </div>
            <div className="report-item">
              <span className="r-label">Management Ratio</span>
              <span className="r-value">{managementRatio}</span>
            </div>
            <div className="report-item">
              <span className="r-label">Managers / Leaders</span>
              <span className="r-value">{managementCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
