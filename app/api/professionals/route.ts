import { backendFetch } from "@/lib/auth/backend";

export async function GET() {
  return backendFetch("/api/professionals", { method: "GET" });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  return backendFetch("/api/professionals", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
