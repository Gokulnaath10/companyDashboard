import apiClient from "./apiClient";

export async function getAuditLogs() {
  const response = await apiClient.get("/audit");
  return response.data;
}
