import axios from "axios";
import { readTokens, clearTokens } from "@/lib/auth/tokens";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
  timeout: 15000
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const runtimeBase = (window as any).__ENV?.NEXT_PUBLIC_API_BASE_URL as string | undefined;
    if (runtimeBase && config.baseURL !== runtimeBase) {
      config.baseURL = runtimeBase;
    }
  }
  const tokens = readTokens();
  if (tokens?.accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status !== 401) return Promise.reject(error);
    clearTokens();
    return Promise.reject(error);
  }
);

export default api;
