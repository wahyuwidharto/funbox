/**
 * Upload the composed photo to the serverless backend.
 * @param {Blob} blob - The JPEG blob
 * @returns {Promise<{id: string, url: string, expiresAt: number}>}
 */
export async function uploadPhoto(blob) {
    const base64 = await blobToBase64(blob)

    const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
    })

    if (!res.ok) {
        throw new Error(`Upload failed: ${res.status}`)
    }

    return res.json()
}

/**
 * Get the full download URL for a photo by ID.
 * @param {string} id
 * @returns {string}
 */
export function getPhotoUrl(id) {
    return `${window.location.origin}/api/photo?id=${id}`
}

function blobToBase64(blob) {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.readAsDataURL(blob)
    })
}
