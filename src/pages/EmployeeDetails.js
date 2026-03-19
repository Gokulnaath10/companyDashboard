import { useParams } from "react-router-dom";
import employees from "../utils/mockEmployees";

function EmployeeDetails() {
  const { id } = useParams();

  const employee = employees.find(
    (emp) => emp.id === Number(id)
  );

  if (!employee) {
    return <h2>Employee not found</h2>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2><b>Here is your Employee Details</b></h2>
      <p>Name: {employee.name}</p>
      <p>Role: {employee.role}</p>
      <p>Email: {employee.email}</p>
      <p>Department: {employee.department}</p>
      <p>Joined: {employee.joined}</p>
    </div>
  );
}

export default EmployeeDetails;