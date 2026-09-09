// REST base URL for RTK Query.
//
// Production goes through the SAME-ORIGIN rewrite proxy (see next.config.mjs
// `rewrites`) on purpose. The API sets the session cookie (sw99_token) with no
// Domain attribute, so it is scoped to whichever host answered the request.
// Calling the Heroku API host directly from the Vercel admin origin makes
// sw99_token a third-party cookie: browsers block it, and middleware.ts — which
// reads sw99_token on the admin origin to guard routes — can never see it, so a
// successful login bounces straight back to /register-login. Routing through
// /api/v1 keeps the cookie first-party on the admin domain.
const DEV = process.env.NODE_ENV === "development";

// Absolute API origin. Used for socket.io only (websockets are not proxied).
export const apiOrigin = DEV
  ? "http://localhost:8000"
  : "https://qx-profit-api-bff66bb8112c.herokuapp.com";

// Same-origin proxy in production, direct host in dev (localhost shares the
// cookie across ports, so dev has no third-party-cookie problem).
const baseUrl = DEV ? "http://localhost:8000/api/v1" : "/api/v1";

export default baseUrl;
