import { createClient } from "@supabase/supabase-js";

const VIDEO_BUCKET = "fixora-video-uploads";
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

function createSupabaseStorageClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SECRET_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase storage is not configured.");
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
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
    const supabase = createSupabaseStorageClient();
    const { error } = await supabase.storage
      .from(VIDEO_BUCKET)
      .upload(videoId, video, {
        cacheControl: "3600",
        upsert: false,
        contentType: video.type,
      });

    if (error) {
      return Response.json({ message: error.message }, { status: 502 });
    }

    return Response.json({ videoId });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Video upload failed.";
    return Response.json({ message }, { status: 500 });
  }
}
