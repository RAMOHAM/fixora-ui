import { useState, useCallback } from "react"
import { supabase } from "@/app/api/supabaseApi";

type Options = {
    bucket: string
    path: string | null
    expiresIn?: number // seconds
}

export const useSignedVideoUrl =
    ({bucket, path, expiresIn = 60 * 60,}: Options) => {
    const [url, setUrl] = useState<string | null>(null)
    const [expiresAt, setExpiresAt] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const load = useCallback(async () => {
        if (!path) return

        const now = Date.now()

        // ✅ use cached URL if still valid
        if (url && expiresAt && now < expiresAt) {
            return url
        }

        setLoading(true)
        setError(null)

        const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUrl(path, expiresIn)

        if (error) {
            setError(error.message)
            setLoading(false)
            return null
        }

        const signedUrl = data?.signedUrl || null

        setUrl(signedUrl)
        setExpiresAt(now + expiresIn * 1000)
        setLoading(false)

        return signedUrl
    }, [bucket, path, expiresIn, url, expiresAt])

    return {
        url,
        load,
        loading,
        error,
    }
}