// Talk to the API host directly in production (the API allows the admin
// origin via CORS and sets SameSite=None cookies). This drops the extra
// Vercel serverless proxy hop that made mobile-data loads slow / flaky.
let baseUrl = "";

if (process.env.NODE_ENV === "development") {
  baseUrl = "http://localhost:8000/api/v1";
} else {
  baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://qx-profit-api-bff66bb8112c.herokuapp.com/api/v1";
}

export default baseUrl;
