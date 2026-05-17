import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY)!,
);

export const uploadVideo = async (file: File) => {
  const formData = new FormData();
  formData.append("video", file);

  const res = await fetch("/api/video-upload", {
    method: "POST",
    body: formData,
  });

  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      typeof payload?.message === "string"
        ? payload.message
        : "Error uploading video.";
    console.error("Error uploading video:", message);
    throw new Error(message);
  }

  return payload.videoId as string;
};
