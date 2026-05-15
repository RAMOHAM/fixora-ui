import type { NextRequest } from "next/server";

import { backendFetch } from "@/lib/auth/backend";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.search;
  return backendFetch(`/api/booking${query}`, { method: "GET" });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  return backendFetch("/api/booking", {
    method: "POST",
    body: JSON.stringify(body),
    authenticated: false,
  });
}
