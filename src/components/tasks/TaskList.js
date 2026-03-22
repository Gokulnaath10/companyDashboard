function TaskList({ tasks, filterStatus, onEdit, onDelete, isDeletingId }) {
  const filtered =
    filterStatus === "All"
      ? tasks
      : tasks.filter((task) => task.status === filterStatus);

  if (filtered.length === 0) {
    return (
      <div className="employee-panel">
        <div className="employee-panel-header">
          <div>
            <h3>Tasks</h3>
            <p>No tasks found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-panel">
      <div className="employee-panel-header">
        <div>
          <h3>Tasks</h3>
          <p>{filtered.length} task{filtered.length !== 1 ? "s" : ""} found</p>
        </div>
      </div>

      <ul className="employee-list">
        {filtered.map((task) => (
          <li key={task._id} className="employee-item">
            <div className="employee-info">
              <div className="employee-name">{task.title}</div>
              {task.description && (
                <div className="employee-meta">{task.description}</div>
              )}
              <div className="employee-meta">
                <span
                  style={{
                    marginRight: "0.75rem",
                    fontWeight: 600,
                    color: task.status === "Completed" ? "var(--color-success, #4ade80)" : "var(--color-warning, #facc15)",
                  }}
                >
                  {task.status}
                </span>
                <span
                  style={{
                    color:
                      task.priority === "High"
                        ? "var(--color-danger, #f87171)"
                        : task.priority === "Medium"
                        ? "var(--color-warning, #facc15)"
                        : "var(--color-muted, #9ca3af)",
                  }}
                >
                  {task.priority} Priority
                </span>
              </div>
            </div>
            <div className="employee-actions">
              <button className="btn-edit" onClick={() => onEdit(task)}>
                Edit
              </button>
              <button
                className="btn-delete"
                onClick={() => onDelete(task._id)}
                disabled={isDeletingId === task._id}
              >
                {isDeletingId === task._id ? "..." : "Delete"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
