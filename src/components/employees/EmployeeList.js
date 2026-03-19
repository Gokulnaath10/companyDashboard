import { Link } from "react-router-dom";

function EmployeeList({ employees, onEdit, onDelete, isDeletingId }) {
  if (!employees.length) {
    return (
      <div className="employee-panel employee-empty-state">
        <h3>No employees yet</h3>
        <p>Create your first employee record to test the CRUD flow.</p>
      </div>
    );
  }

  return (
    <div className="employee-panel">
      <div className="employee-panel-header">
        <div>
          <h3>Employee Records</h3>
          <p>Manage employees with edit and delete actions.</p>
        </div>
      </div>

      <div className="employee-table-wrap">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td>
                  <Link className="employee-link" to={`/dashboard/${employee._id}`}>
                    {employee.name}
                  </Link>
                </td>
                <td>{employee.email}</td>
                <td>{employee.role}</td>
                <td>{employee.department}</td>
                <td>
                  <span className={`status-pill status-${employee.status.toLowerCase().replace(/\s+/g, "-")}`}>
                    {employee.status}
                  </span>
                </td>
                <td>
                  <div className="employee-actions">
                    <button className="btn-secondary" type="button" onClick={() => onEdit(employee)}>
                      Edit
                    </button>
                    <button
                      className="btn-danger"
                      type="button"
                      onClick={() => onDelete(employee._id)}
                      disabled={isDeletingId === employee._id}
                    >
                      {isDeletingId === employee._id ? "Deleting..." : "Delete"}
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

export default EmployeeList;
