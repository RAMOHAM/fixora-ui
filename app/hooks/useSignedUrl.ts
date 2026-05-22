import { useState, useCallback } from "react"

type Options = {
    bucket: string
    path: string | null
    expiresIn?: number // seconds
}

export const useSignedVideoUrl =
    ({bucket, path, expiresIn = 60 * 60,}: Options) => {
    const [url, setUrl] = useState<string | null>(null)
    const [urlPath, setUrlPath] = useState<string | null>(null)
    const [expiresAt, setExpiresAt] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const load = useCallback(async () => {
        if (!path) return

        const now = Date.now()

        // use cached URL if still valid
        if (url && urlPath === path && expiresAt && now < expiresAt) {
            return url
        }

        setLoading(true)
        setError(null)

        const response = await fetch("/api/video-upload/signed-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bucket, path, expiresIn }),
        })

        const payload = await response.json().catch(() => null)

        if (!response.ok) {
            const message =
                typeof payload?.message === "string"
                    ? payload.message
                    : "Could not load video."
            setError(message)
            setLoading(false)
            throw new Error(message)
        }

        const signedUrl = payload?.signedUrl || null

        setUrl(signedUrl)
        setUrlPath(path)
        setExpiresAt(now + expiresIn * 1000)
        setLoading(false)

        return signedUrl
    }, [bucket, path, expiresIn, url, urlPath, expiresAt])

    return {
        url,
        load,
        loading,
        error,
    }
}
