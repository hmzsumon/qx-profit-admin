// config/socketUrl.ts
let socketUrl = "";

if (process.env.NODE_ENV === "development") {
  socketUrl = "http://localhost:8000"; // local socket server
} else {
  socketUrl = "https://qx-profit-api-bff66bb8112c.herokuapp.com"; // deployed socket server
}

export default socketUrl;
