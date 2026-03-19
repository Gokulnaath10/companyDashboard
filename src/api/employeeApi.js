import apiClient from "./apiClient";

export async function getEmployees() {
  const response = await apiClient.get("/employees");
  return response.data;
}

export async function getEmployee(id) {
  const response = await apiClient.get(`/employees/${id}`);
  return response.data;
}

export async function createEmployee(payload) {
  const response = await apiClient.post("/employees", payload);
  return response.data;
}

export async function updateEmployee(id, payload) {
  const response = await apiClient.put(`/employees/${id}`, payload);
  return response.data;
}

export async function deleteEmployee(id) {
  const response = await apiClient.delete(`/employees/${id}`);
  return response.data;
}
