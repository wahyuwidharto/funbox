import { getStore } from '@netlify/blobs'

export default async (req) => {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')

    if (!id) {
        return new Response(JSON.stringify({ error: 'Missing photo ID' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    try {
        const store = getStore('photos')

        // Get blob with metadata
        const { data, metadata } = await store.getWithMetadata(id, { type: 'arrayBuffer' })

        if (!data) {
            return new Response(JSON.stringify({ error: 'Photo not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        // Check if expired
        if (metadata?.expiresAt && Date.now() > metadata.expiresAt) {
            // Lazy cleanup — delete expired blob
            await store.delete(id)
            return new Response(JSON.stringify({ error: 'Photo has expired' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        // Return the image
        return new Response(data, {
            status: 200,
            headers: {
                'Content-Type': 'image/jpeg',
                'Content-Disposition': `attachment; filename="funbox-photo-${id}.jpg"`,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
        })
    } catch (err) {
        console.error('Photo fetch error:', err)

        // If blob not found, getWithMetadata throws
        if (err.message?.includes('not found') || err.status === 404) {
            return new Response(JSON.stringify({ error: 'Photo not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        return new Response(
            JSON.stringify({ error: 'Failed to retrieve photo', details: err.message }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        )
    }
}

export const config = {
    path: '/api/photo',
}
