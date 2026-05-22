const VIDEO_BUCKET = "fixora-video-uploads";
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

function getSupabaseStorageConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase storage is not configured.");
  }

  return {
    supabaseUrl: supabaseUrl.replace(/\/$/, ""),
    supabaseKey,
  };
}

async function readStorageError(response: Response) {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    const payload = await response.json().catch(() => null);
    return (
      payload?.message ??
      payload?.error ??
      payload?.msg ??
      `Supabase Storage returned ${response.status}`
    );
  }

  return (await response.text().catch(() => "")) || response.statusText;
}

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const video = formData?.get("video");

  if (!(video instanceof File)) {
    return Response.json(
      { message: "Choose a video before uploading." },
      { status: 400 },
    );
  }

  if (!video.type.startsWith("video/")) {
    return Response.json(
      { message: "Only video files can be uploaded." },
      { status: 400 },
    );
  }

  if (video.size > MAX_VIDEO_SIZE) {
    return Response.json(
      { message: "Video must be under 50 MB." },
      { status: 400 },
    );
  }

  try {
    const safeName = video.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const videoId = `${crypto.randomUUID()}-${safeName}`;
    const { supabaseUrl, supabaseKey } = getSupabaseStorageConfig();
    const uploadUrl = `${supabaseUrl}/storage/v1/object/${VIDEO_BUCKET}/${encodeURIComponent(videoId)}`;

    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Cache-Control": "3600",
        "Content-Type": video.type || "application/octet-stream",
        "x-upsert": "false",
      },
      body: video,
      cache: "no-store",
    });

    if (!response.ok) {
      return Response.json(
        { message: await readStorageError(response) },
        { status: 502 },
      );
    }

    return Response.json({ videoId });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Video upload failed.";
    const isNetworkFailure =
      /fetch failed|ENOTFOUND|EAI_AGAIN|getaddrinfo/i.test(message);

    return Response.json(
      {
        message: isNetworkFailure
          ? "Could not reach Supabase Storage. Check that NEXT_PUBLIC_SUPABASE_URL points to an active Supabase project."
          : message,
      },
      { status: isNetworkFailure ? 502 : 500 },
    );
  }
}
