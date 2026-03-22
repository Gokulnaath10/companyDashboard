import apiClient from "./apiClient";

export async function getTasks() {
  const response = await apiClient.get("/tasks");
  return response.data;
}

export async function createTask(payload) {
  const response = await apiClient.post("/tasks", payload);
  return response.data;
}

export async function updateTask(id, payload) {
  const response = await apiClient.put(`/tasks/${id}`, payload);
  return response.data;
}

export async function deleteTask(id) {
  const response = await apiClient.delete(`/tasks/${id}`);
  return response.data;
}
