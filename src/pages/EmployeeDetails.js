import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getEmployee } from "../api/employeeApi";

function EmployeeDetails() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEmployee() {
      try {
        setIsLoading(true);
        const data = await getEmployee(id);
        setEmployee(data);
        setError("");
      } catch (apiError) {
        setError(apiError.response?.data?.message || "Employee not found");
      } finally {
        setIsLoading(false);
      }
    }

    loadEmployee();
  }, [id]);

  if (isLoading) {
    return <div className="employee-detail-card">Loading employee details...</div>;
  }

  if (error || !employee) {
    return <div className="employee-detail-card">{error || "Employee not found"}</div>;
  }

  const createdDate = employee.createdAt
    ? new Date(employee.createdAt).toLocaleDateString()
    : "N/A";

  return (
    <div className="employee-detail-card">
      <h2>Employee Details</h2>
      <div className="employee-detail-grid">
        <div className="employee-detail-item">
          <span>Name</span>
          <strong>{employee.name}</strong>
        </div>
        <div className="employee-detail-item">
          <span>Role</span>
          <strong>{employee.role}</strong>
        </div>
        <div className="employee-detail-item">
          <span>Email</span>
          <strong>{employee.email}</strong>
        </div>
        <div className="employee-detail-item">
          <span>Department</span>
          <strong>{employee.department}</strong>
        </div>
        <div className="employee-detail-item">
          <span>Status</span>
          <strong>{employee.status}</strong>
        </div>
        <div className="employee-detail-item">
          <span>Created</span>
          <strong>{createdDate}</strong>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetails;
