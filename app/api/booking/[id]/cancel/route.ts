import { backendFetch } from "@/lib/auth/backend";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = await request.json().catch(() => null);

  return backendFetch(`/api/booking/${encodeURIComponent(id)}/cancel`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}
