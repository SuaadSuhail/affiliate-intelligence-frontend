import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API_KEY  = import.meta.env.VITE_API_KEY  || "change-me-in-production";

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
    "X-Api-Key": API_KEY,
  },
  timeout: 60000,
});