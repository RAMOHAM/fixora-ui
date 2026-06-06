import { backendFetch } from "@/lib/auth/backend";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const { searchParams } = new URL(request.url);
  const professionalId = searchParams.get("professionalId");
  const backendPath = `/api/booking/${encodeURIComponent(id)}/confirm${
    professionalId
      ? `?${new URLSearchParams({ professionalId }).toString()}`
      : ""
  }`;

  return backendFetch(backendPath, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}
