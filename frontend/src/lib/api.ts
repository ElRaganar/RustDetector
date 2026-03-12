const rawBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const API_BASE_URL =
  (typeof rawBaseUrl === "string" && rawBaseUrl.length > 0 ? rawBaseUrl : "http://localhost:8000").replace(
    /\/$/,
    "",
  );

