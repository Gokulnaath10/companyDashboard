const initialForm = {
  title: "",
  description: "",
  status: "Pending",
  priority: "Medium",
};

function TaskForm({ formData, onChange, onSubmit, onCancel, isSubmitting, isEditing }) {
  return (
    <div className="employee-panel">
      <div className="employee-panel-header">
        <div>
          <h3>{isEditing ? "Update Task" : "Add Task"}</h3>
          <p>
            {isEditing
              ? "Edit the selected task record."
              : "Create a new task to track your work."}
          </p>
        </div>
      </div>

      <form className="employee-form" onSubmit={onSubmit}>
        <label className="employee-field">
          <span>title</span>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onChange}
            placeholder="Enter title"
            required
          />
        </label>

        <label className="employee-field">
          <span>description</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            placeholder="Enter description (optional)"
            rows={3}
            style={{
              width: "100%",
              padding: "11px 14px",
              background: "var(--bg-input)",
              border: "1.5px solid var(--border)",
              borderRadius: "8px",
              color: "var(--text-primary)",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              outline: "none",
              resize: "vertical",
            }}
          />
        </label>

        <label className="employee-field">
          <span>status</span>
          <select name="status" value={formData.status} onChange={onChange}>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </label>

        <label className="employee-field">
          <span>priority</span>
          <select name="priority" value={formData.priority} onChange={onChange}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>

        <div className="employee-form-actions">
          <button className="btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditing ? "Update Task" : "Add Task"}
          </button>
          {isEditing && (
            <button className="btn-secondary" type="button" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export const taskInitialForm = initialForm;

export default TaskForm;
