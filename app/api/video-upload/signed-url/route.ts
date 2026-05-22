import { createClient } from "@supabase/supabase-js";

import { getCurrentUser } from "@/lib/auth/backend";

const VIDEO_BUCKET = "fixora-video-uploads";
const DEFAULT_EXPIRES_IN = 60 * 60;
const MAX_EXPIRES_IN = 60 * 60 * 4;

function getSupabaseStorageConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase storage signing is not configured.");
  }

  return { supabaseUrl, supabaseKey };
}

function getExpiresIn(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return DEFAULT_EXPIRES_IN;
  }

  return Math.min(Math.max(Math.floor(value), 1), MAX_EXPIRES_IN);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const path = typeof body?.path === "string" ? body.path.trim() : "";
  const bucket = typeof body?.bucket === "string" ? body.bucket : VIDEO_BUCKET;

  if (bucket !== VIDEO_BUCKET) {
    return Response.json({ message: "Unsupported video bucket." }, { status: 400 });
  }

  if (!path) {
    return Response.json({ message: "Video path is required." }, { status: 400 });
  }

  try {
    const { supabaseUrl, supabaseKey } = getSupabaseStorageConfig();
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const expiresIn = getExpiresIn(body?.expiresIn);
    const { data, error } = await supabase.storage
      .from(VIDEO_BUCKET)
      .createSignedUrl(path, expiresIn);

    if (error || !data?.signedUrl) {
      return Response.json(
        { message: error?.message ?? "Could not create signed video URL." },
        { status: 502 },
      );
    }

    return Response.json({
      signedUrl: data.signedUrl,
      expiresIn,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not create signed video URL.";

    return Response.json({ message }, { status: 500 });
  }
}
