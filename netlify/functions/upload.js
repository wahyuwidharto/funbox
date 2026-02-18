import { getStore } from '@netlify/blobs'

export default async (req) => {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    try {
        const body = await req.json()
        const { image } = body

        if (!image) {
            return new Response(JSON.stringify({ error: 'No image provided' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        // Generate unique ID
        const id = crypto.randomUUID().replace(/-/g, '').substring(0, 12)

        // Convert base64 data URL to buffer
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '')
        const buffer = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0))

        // Store in Netlify Blobs
        const store = getStore('photos')

        // Store the image
        await store.set(id, buffer, {
            metadata: {
                createdAt: Date.now(),
                expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
                contentType: 'image/jpeg',
            },
        })

        const url = `/api/photo?id=${id}`

        return new Response(
            JSON.stringify({
                id,
                url,
                expiresAt: Date.now() + 5 * 60 * 1000,
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        )
    } catch (err) {
        console.error('Upload error:', err)
        return new Response(
            JSON.stringify({ error: 'Upload failed', details: err.message }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        )
    }
}

export const config = {
    path: '/api/upload',
}
