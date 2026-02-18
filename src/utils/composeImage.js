/**
 * Compose 4 photos into a framed image.
 * Output: 1200×1800 JPEG at 75% quality.
 * 
 * @param {string[]} photos - Array of 4 data URLs
 * @param {'white' | 'black'} frameStyle - Frame background color
 * @returns {Promise<Blob>} - JPEG blob
 */
export async function composeImage(photos, frameStyle) {
    const CANVAS_W = 1200
    const CANVAS_H = 1800
    const PADDING = 40
    const GAP = 20
    const BOTTOM_AREA = 120

    const PHOTO_W = (CANVAS_W - PADDING * 2 - GAP) / 2      // 550
    const PHOTO_H = (CANVAS_H - PADDING - BOTTOM_AREA - GAP) / 2 // 810

    const isWhite = frameStyle === 'white'
    const bgColor = isWhite ? '#FFFFFF' : '#1A1A1A'
    const textColor = isWhite ? '#1A1A1A' : '#FFFFFF'

    const canvas = document.createElement('canvas')
    canvas.width = CANVAS_W
    canvas.height = CANVAS_H
    const ctx = canvas.getContext('2d')

    // Fill background
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

    // Grid positions
    const positions = [
        { x: PADDING, y: PADDING },
        { x: PADDING + PHOTO_W + GAP, y: PADDING },
        { x: PADDING, y: PADDING + PHOTO_H + GAP },
        { x: PADDING + PHOTO_W + GAP, y: PADDING + PHOTO_H + GAP },
    ]

    // Load all images
    const images = await Promise.all(
        photos.map(
            (src) =>
                new Promise((resolve, reject) => {
                    const img = new Image()
                    img.onload = () => resolve(img)
                    img.onerror = reject
                    img.src = src
                })
        )
    )

    // Draw each photo (cover-fit into slot)
    images.forEach((img, i) => {
        const pos = positions[i]
        const { sx, sy, sw, sh } = coverFit(
            img.width,
            img.height,
            PHOTO_W,
            PHOTO_H
        )
        ctx.drawImage(img, sx, sy, sw, sh, pos.x, pos.y, PHOTO_W, PHOTO_H)
    })

    // Draw branding
    ctx.fillStyle = textColor
    ctx.font = '700 28px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.letterSpacing = '6px'
    const brandY = CANVAS_H - BOTTOM_AREA / 2 + 10
    ctx.fillText('FUNBOX', CANVAS_W / 2, brandY)

    // Export as JPEG at 75% quality
    return new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.75)
    })
}

/**
 * Calculate source crop dimensions to cover-fit into target dimensions.
 */
function coverFit(srcW, srcH, targetW, targetH) {
    const srcRatio = srcW / srcH
    const targetRatio = targetW / targetH

    let sw, sh, sx, sy

    if (srcRatio > targetRatio) {
        // Source is wider — crop sides
        sh = srcH
        sw = srcH * targetRatio
        sx = (srcW - sw) / 2
        sy = 0
    } else {
        // Source is taller — crop top/bottom
        sw = srcW
        sh = srcW / targetRatio
        sx = 0
        sy = (srcH - sh) / 2
    }

    return { sx, sy, sw, sh }
}
