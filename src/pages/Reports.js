import Sidebar from "../components/Sidebar";
import employees from "../utils/mockEmployees";

function Reports({ onLogout }) {
  const deptCounts = {};
  employees.forEach((e) => {
    deptCounts[e.department] = (deptCounts[e.department] || 0) + 1;// to get the department count
  });

  return (
    <div className="app-layout">
      <Sidebar onLogout={onLogout} />
      <div className="main-content">
        <div className="page-header">
          <h1>Reports</h1>
          <p>Company analytics & metrics</p>
        </div>

        <div className="report-grid">
          <div className="report-card">
            <h4>Headcount by Department</h4>
            {Object.entries(deptCounts).map(([dept, count]) => (
              <div className="report-item" key={dept}>
                <span className="r-label">{dept}</span>
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
            <h4>Leadership Span</h4>
            {employees
              .filter((e) => employees.some((c) => c.parentId === e.id))
              .map((e) => (
                <div className="report-item" key={e.id}>
                  <span className="r-label">{e.name}</span>
                  <span className="r-value">
                    {employees.filter((c) => c.parentId === e.id).length} reports
                  </span>
                </div>
              ))}
          </div>

          <div className="report-card">
            <h4>Quick Stats</h4>
            <div className="report-item">
              <span className="r-label">Avg. Team Size</span>
              <span className="r-value">{(employees.length / 4).toFixed(1)}</span>
            </div>
            <div className="report-item">
              <span className="r-label">Management Ratio</span>
              <span className="r-value">1:{Math.round(employees.length / 4)}</span>
            </div>
            <div className="report-item">
              <span className="r-label">Open Positions</span>
              <span className="r-value">3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
