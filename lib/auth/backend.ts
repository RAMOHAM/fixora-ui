import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_MAX_AGE,
  USER_COOKIE,
  authPaths,
  cookieOptions,
  getBackendBaseUrl,
} from "@/lib/auth/config";

type TokenPayload = {
  accessToken?: string;
  token?: string;
  jwt?: string;
  access_token?: string;
  refreshToken?: string;
  refresh_token?: string;
  user?: unknown;
};

type BackendFetchOptions = RequestInit & {
  authenticated?: boolean;
};

function getAccessTokenFromPayload(payload: TokenPayload) {
  return payload.accessToken ?? payload.token ?? payload.jwt ?? payload.access_token;
}

function getRefreshTokenFromPayload(payload: TokenPayload) {
  return payload.refreshToken ?? payload.refresh_token;
}

export async function readBackendError(response: Response) {
  try {
    const payload = await response.json();
    if (typeof payload?.message === "string") return payload.message;
    if (typeof payload?.error === "string") return payload.error;
  } catch {
    // Body is not JSON, fall through to status text.
  }

  return response.statusText || "Request failed";
}

export async function backendFetch(path: string, init: BackendFetchOptions = {}) {
  const { authenticated = true, headers, ...requestInit } = init;
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (authenticated && !token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const requestHeaders = new Headers(headers);
  if (!requestHeaders.has("Content-Type") && requestInit.body) {
    requestHeaders.set("Content-Type", "application/json");
  }
  if (token) requestHeaders.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${getBackendBaseUrl()}${path}`, {
    ...requestInit,
    headers: requestHeaders,
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type");
  const text = await response.text();

  if (!text) {
    if (response.status === 204 || response.status === 205) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    return new NextResponse(null, { status: response.status });
  }

  if (contentType?.includes("application/json")) {
    return NextResponse.json(JSON.parse(text), { status: response.status });
  }

  return new NextResponse(text, {
    status: response.status,
    headers: contentType ? { "Content-Type": contentType } : undefined,
  });
}

export async function authenticateWithBackend(body: unknown) {
  const response = await fetch(`${getBackendBaseUrl()}${authPaths.login}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json(
      { message: await readBackendError(response) },
      { status: response.status },
    );
  }

  const payload = (await response.json()) as TokenPayload;
  const accessToken = getAccessTokenFromPayload(payload);
  const refreshToken = getRefreshTokenFromPayload(payload);

  if (!accessToken) {
    return NextResponse.json(
      { message: "Backend did not return an access token." },
      { status: 502 },
    );
  }

  const result = NextResponse.json({
    user: payload.user ?? null,
    authenticated: true,
  });

  result.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
    ...cookieOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  if (refreshToken) {
    result.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
      ...cookieOptions,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
  }

  if (payload.user) {
    result.cookies.set(USER_COOKIE, JSON.stringify(payload.user), {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });
  }

  return result;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return null;

  try {
    const response = await fetch(`${getBackendBaseUrl()}${authPaths.me}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) return null;
    return await response.json();
  } catch {
    const userCookie = cookieStore.get(USER_COOKIE)?.value;
    if (!userCookie) return null;

    try {
      return JSON.parse(userCookie);
    } catch {
      return null;
    }
  }
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.delete(ACCESS_TOKEN_COOKIE);
  response.cookies.delete(REFRESH_TOKEN_COOKIE);
  response.cookies.delete(USER_COOKIE);
}
