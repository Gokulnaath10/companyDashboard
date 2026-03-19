const initialForm = {
  name: "",
  email: "",
  role: "",
  department: "",
  status: "Active",
};

function EmployeeForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
  isSubmitting,
  isEditing,
}) {
  const fields = Object.keys(initialForm);

  return (
    <div className="employee-panel">
      <div className="employee-panel-header">
        <div>
          <h3>{isEditing ? "Update Employee" : "Add Employee"}</h3>
          <p>{isEditing ? "Edit the selected employee record." : "Create a new employee record in MongoDB."}</p>
        </div>
      </div>

      <form className="employee-form" onSubmit={onSubmit}>
        {fields.map((field) => (
          <label key={field} className="employee-field">
            <span>{field}</span>
            {field === "status" ? (
              <select name={field} value={formData[field]} onChange={onChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
              </select>
            ) : (
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={formData[field]}
                onChange={onChange}
                placeholder={`Enter ${field}`}
                required
              />
            )}
          </label>
        ))}

        <div className="employee-form-actions">
          <button className="btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditing ? "Update Record" : "Add Record"}
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

export const employeeInitialForm = initialForm;

export default EmployeeForm;
