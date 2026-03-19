import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import EmployeeForm, { employeeInitialForm } from "../components/employees/EmployeeForm";
import EmployeeList from "../components/employees/EmployeeList";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../api/employeeApi";

function Employees({ onLogout }) {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState(employeeInitialForm);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  async function fetchEmployees() {
    try {
      setIsLoading(true);
      setError("");
      const data = await getEmployees();
      setEmployees(data);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to load employees");
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");

      if (selectedEmployeeId) {
        const updated = await updateEmployee(selectedEmployeeId, formData);
        setEmployees((current) =>
          current.map((employee) =>
            employee._id === selectedEmployeeId ? updated : employee
          )
        );
      } else {
        const created = await createEmployee(formData);
        setEmployees((current) => [created, ...current]);
      }

      resetForm();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to save employee");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleEdit(employee) {
    setSelectedEmployeeId(employee._id);
    setFormData({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      department: employee.department,
      status: employee.status,
    });
    setError("");
  }

  async function handleDelete(id) {
    try {
      setIsDeletingId(id);
      setError("");
      await deleteEmployee(id);
      setEmployees((current) => current.filter((employee) => employee._id !== id));

      if (selectedEmployeeId === id) {
        resetForm();
      }
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to delete employee");
    } finally {
      setIsDeletingId("");
    }
  }

  function resetForm() {
    setSelectedEmployeeId("");
    setFormData(employeeInitialForm);
  }

  const activeCount = employees.filter((employee) => employee.status === "Active").length;
  const departmentCount = new Set(employees.map((employee) => employee.department)).size;
  const isEditing = Boolean(selectedEmployeeId);

  return (
    <div className="app-layout">
      <Sidebar onLogout={onLogout} />

      <div className="main-content">
        <div className="page-header">
          <h1>Employees</h1>
          <p>MongoDB-backed CRUD records managed through your Express API.</p>
        </div>

        <div className="stat-grid">
          <div className="stat-card">
            <div className="label">Total Employees</div>
            <div className="value">{employees.length}</div>
            <div className="sub">Synced from the backend</div>
          </div>
          <div className="stat-card">
            <div className="label">Active Employees</div>
            <div className="value">{activeCount}</div>
            <div className="sub">Current active headcount</div>
          </div>
          <div className="stat-card">
            <div className="label">Departments</div>
            <div className="value">{departmentCount}</div>
            <div className="sub">Unique departments tracked</div>
          </div>
        </div>

        {error && <div className="feedback-banner error">{error}</div>}
        {isLoading && <div className="feedback-banner">Loading employees...</div>}

        <div className="employee-grid">
          <EmployeeForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            isSubmitting={isSubmitting}
            isEditing={isEditing}
          />

          <EmployeeList
            employees={employees}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeletingId={isDeletingId}
          />
        </div>
      </div>
    </div>
  );
}

export default Employees;
