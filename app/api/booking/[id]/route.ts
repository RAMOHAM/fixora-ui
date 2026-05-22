import { backendFetch } from "@/lib/auth/backend";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));

  return backendFetch(`/api/booking/${encodeURIComponent(id)}`, {
    method: "DELETE",
    body: JSON.stringify({
      ...body,
      bookingId: body?.bookingId ?? id,
    }),
  });
}
