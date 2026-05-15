export const ACCESS_TOKEN_COOKIE = "fixora_access_token";
export const REFRESH_TOKEN_COOKIE = "fixora_refresh_token";
export const USER_COOKIE = "fixora_user";

export const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 8;
export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

export function getBackendBaseUrl() {
  const baseUrl =
    process.env.BACKEND_SERVER_URL ?? process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;

  if (!baseUrl) {
    throw new Error(
      "Backend URL is not configured. Set BACKEND_SERVER_URL or NEXT_PUBLIC_BACKEND_SERVER_URL.",
    );
  }

  return baseUrl.replace(/\/$/, "");
}

export const authPaths = {
  login: process.env.BACKEND_AUTH_LOGIN_PATH ?? "/api/auth/login",
  me: process.env.BACKEND_AUTH_ME_PATH ?? "/api/auth/me",
};

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};
