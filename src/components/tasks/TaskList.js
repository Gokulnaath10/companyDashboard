function TaskList({ tasks, filterStatus, onEdit, onDelete, isDeletingId }) {
  const filtered =
    filterStatus === "All"
      ? tasks
      : tasks.filter((task) => task.status === filterStatus);

  if (filtered.length === 0) {
    return (
      <div className="employee-panel employee-empty-state">
        <h3>No tasks found</h3>
        <p>
          {filterStatus === "All"
            ? "Add your first task using the form."
            : `No ${filterStatus.toLowerCase()} tasks.`}
        </p>
      </div>
    );
  }

  return (
    <div className="employee-panel">
      <div className="employee-panel-header">
        <div>
          <h3>Task Records</h3>
          <p>{filtered.length} task{filtered.length !== 1 ? "s" : ""} found</p>
        </div>
      </div>

      <div className="employee-table-wrap">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((task) => (
              <tr key={task._id}>
                <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                  {task.title}
                </td>
                <td>{task.description || "—"}</td>
                <td>
                  <span
                    className="status-pill"
                    style={{
                      background:
                        task.priority === "High"
                          ? "var(--danger-dim)"
                          : task.priority === "Medium"
                          ? "var(--warning-dim)"
                          : "var(--accent-dim)",
                      color:
                        task.priority === "High"
                          ? "var(--danger)"
                          : task.priority === "Medium"
                          ? "var(--warning)"
                          : "var(--accent)",
                    }}
                  >
                    {task.priority}
                  </span>
                </td>
                <td>
                  <span
                    className="status-pill"
                    style={{
                      background:
                        task.status === "Completed"
                          ? "var(--accent-dim)"
                          : "var(--warning-dim)",
                      color:
                        task.status === "Completed"
                          ? "var(--accent)"
                          : "var(--warning)",
                    }}
                  >
                    {task.status}
                  </span>
                </td>
                <td>
                  <div className="employee-actions">
                    <button
                      className="btn-secondary"
                      type="button"
                      onClick={() => onEdit(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-danger"
                      type="button"
                      onClick={() => onDelete(task._id)}
                      disabled={isDeletingId === task._id}
                    >
                      {isDeletingId === task._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TaskList;
