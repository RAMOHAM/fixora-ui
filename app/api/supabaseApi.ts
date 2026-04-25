import { createClient } from "@supabase/supabase-js";
import { uuid } from "zod";


const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY!
)

export const uploadVideo = async (file: File) => {
    const videoId = `${uuid()}-${file.name}`
    const { error } = await supabase.storage
        .from("fixora-video-uploads")
        .upload(videoId, file, {
            cacheControl: "3600",
            upsert: false,
        })
    if (error) {
        throw new Error(error.message);
    }
    return videoId;
}
