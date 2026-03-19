import apiClient from "./apiClient";

export async function updateProfile(payload) {
  const response = await apiClient.put("/users/me", payload);
  return response.data;
}

export async function changePassword(payload) {
  const response = await apiClient.put("/users/me/password", payload);
  return response.data;
}

export async function updatePreferences(payload) {
  const response = await apiClient.put("/users/me/preferences", payload);
  return response.data;
}
