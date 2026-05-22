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
    console.log("DELETE handler called with id:", id);

    const result = await backendFetch(`/api/professionals/${encodeURIComponent(id)}`, {
        method: "DELETE",
    });

    console.log("backendFetch result status:", result.status);
    return result;
}