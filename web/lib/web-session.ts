// Strictly necessary website session. The extension continues to use bearer tokens.
export const WEB_SESSION_COOKIE = "naranews_session";
export const webSessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
