import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import { getAuditLogs } from "../api/auditApi";

function Audit({ onLogout }) {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAuditLogs() {
      try {
        setIsLoading(true);
        const data = await getAuditLogs();
        setEntries(data);
        setError("");
      } catch (apiError) {
        setError(apiError.response?.data?.message || "Failed to load audit logs");
      } finally {
        setIsLoading(false);
      }
    }

    loadAuditLogs();
  }, []);

  function getBadgeClass(action) {
    if (action.includes("LOGIN") || action.includes("CREATE") || action === "REGISTER") {
      return "success";
    }

    if (action.includes("DELETE")) {
      return "fail";
    }

    if (action.includes("PASSWORD") || action.includes("PREFERENCE")) {
      return "warn";
    }

    return "info";
  }

  function formatTime(iso) {
    return new Date(iso).toLocaleString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="app-layout">
      <Sidebar onLogout={onLogout} />
      <div className="main-content">
        <div className="page-header">
          <h1>Audit Log</h1>
          <p>Security events & activity trail — {entries.length} entries</p>
        </div>

        {error && <div className="feedback-banner error">{error}</div>}
        {isLoading && <div className="feedback-banner">Loading audit logs...</div>}

        <div className="org-container" style={{ padding: 0, overflow: "auto" }}>
          {!isLoading && entries.length === 0 ? (
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
                  <th>Actor</th>
                  <th>Details</th>
                </tr>
              </thead>

              <tbody>
                {entries.map((entry) => (
                  <tr key={entry._id}>
                    <td
                      style={{
                        whiteSpace: "nowrap",
                        fontFamily: "monospace",
                        fontSize: 12,
                      }}
                    >
                      {formatTime(entry.createdAt)}
                    </td>

                    <td>
                      <span className={`audit-badge ${getBadgeClass(entry.action)}`}>
                        {entry.action}
                      </span>
                    </td>

                    <td>{entry.actorEmail || "system"}</td>
                    <td>{entry.detail}</td>
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
