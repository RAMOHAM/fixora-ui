import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY!
)

export const uploadVideo = async (file: File) => {
    const videoId = `${crypto.randomUUID()}-${file.name}`
    const { error } = await supabase.storage
        .from("fixora-video-uploads")
        .upload(videoId, file, {
            cacheControl: "3600",
            upsert: false,
        })
    if (error) {
        console.error("Error uploading video:", error.message);
        throw new Error(error.message);
    }
    return videoId;
}
