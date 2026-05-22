import { backendFetch } from "@/lib/auth/backend";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = await request.json().catch(() => null);

  return backendFetch(`/api/professionals/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));

  return backendFetch(`/api/professionals/${encodeURIComponent(id)}`, {
    method: "DELETE",
    body: JSON.stringify({
      ...body,
      professionalId: body?.professionalId ?? id,
    }),
  });
}
