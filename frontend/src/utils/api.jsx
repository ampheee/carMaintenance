// src/utils/api.jsx
import axios from "axios";

const BASE_URL = "/api/v1";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const handleApiError = (error) => {
  if (error.response) {
    return { success: false, message: error.response.data.message || "Ошибка сервера." };
  } else if (error.request) {
    return { success: false, message: "Сервер недоступен. Проверьте подключение к интернету." };
  } else {
    return { success: false, message: "Произошла ошибка. Попробуйте снова." };
  }
};
export const apiRequest = async (method, endpoint, data = null) => {
  try {
    const response = await apiClient({
      method,
      url: endpoint,
      data: method === "POST" || method === "PUT" ? data : undefined,
      params: method === "GET" || method === "DELETE" ? data : undefined,
    });

    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};