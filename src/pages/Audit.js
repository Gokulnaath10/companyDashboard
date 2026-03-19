import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { getAuditEntries } from "../utils/auth";

function Audit({ onLogout }) {
const [entries, setEntries] = useState([]);

useEffect(() => {
setEntries(getAuditEntries());
}, []);

const getBadgeClass = (action) => {
if (action.includes("SUCCESS") || action === "REGISTER")
return "success";
if (action.includes("FAIL"))
  return "fail";

return "info";

};

const formatTime = (iso) =>
new Date(iso).toLocaleTimeString([], {
hour: "2-digit",
minute: "2-digit",
second: "2-digit",
});

return ( <div className="app-layout"> <Sidebar onLogout={onLogout} /> <div className="main-content"> <div className="page-header"> <h1>Audit Log</h1> <p>Security events & activity trail — {entries.length} entries</p> </div>
    <div className="org-container" style={{ padding: 0, overflow: "auto" }}>
      {entries.length === 0 ? (
        <div
          style={{
            padding: 40,
            textAlign: "center",
            color: "var(--text-muted)",
          }}
        >
          No audit events recorded yet.
        </div>
      ) : (
        <table className="audit-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Event</th>
              <th>Details</th>
            </tr>
          </thead>

          <tbody>
            {entries.map((e) => (
              <tr key={e.id}>
                <td
                  style={{
                    whiteSpace: "nowrap",
                    fontFamily: "monospace",
                    fontSize: 12,
                  }}
                >
                  {formatTime(e.time)}
                </td>

                <td>
                  <span className={`audit-badge ${getBadgeClass(e.action)}`}>
                    {e.action}
                  </span>
                </td>

                <td>{e.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
</div>
);
}

export default Audit;
