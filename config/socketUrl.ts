// config/socketUrl.ts
let socketUrl = "";

if (process.env.NODE_ENV === "development") {
  socketUrl = "http://localhost:8000"; // local socket server
} else {
  socketUrl = "https://qx-profit-878840149c63.herokuapp.com"; // deployed socket server
}

export default socketUrl;
