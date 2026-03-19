import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

export async function getEmployees() {
  const response = await api.get("/employees");
  return response.data;
}

export async function getEmployee(id) {
  const response = await api.get(`/employees/${id}`);
  return response.data;
}

export async function createEmployee(payload) {
  const response = await api.post("/employees", payload);
  return response.data;
}

export async function updateEmployee(id, payload) {
  const response = await api.put(`/employees/${id}`, payload);
  return response.data;
}

export async function deleteEmployee(id) {
  const response = await api.delete(`/employees/${id}`);
  return response.data;
}
