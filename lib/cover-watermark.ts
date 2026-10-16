const FONT_FAMILY = 'Playfair Display'
const FONT_URL = '/fonts/PlayfairDisplay-Regular.ttf'

// Fleet cards are portrait (about 240px tall on a two-column phone).
// object-cover keeps this slice of the photo, so the mark is drawn inside it.
const CARD_WIDTH_OVER_HEIGHT = 0.78

let fontReady: Promise<void> | null = null

function loadCoverFont() {
  if (typeof document === 'undefined') return Promise.resolve()
  if (!fontReady) {
    const face = new FontFace(FONT_FAMILY, `url(${FONT_URL})`, {
      weight: '400',
      style: 'normal',
    })
    fontReady = face.load().then((loaded) => {
      document.fonts.add(loaded)
    })
  }
  return fontReady
}

function fontSizeForWidth(
  ctx: CanvasRenderingContext2D,
  text: string,
  targetWidth: number,
) {
  const probe = 100
  ctx.font = `400 ${probe}px "${FONT_FAMILY}"`
  const measured = ctx.measureText(text).width || probe
  return probe * (targetWidth / measured)
}

function fillWord(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
) {
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  const metrics = ctx.measureText(text)
  const ascent = metrics.actualBoundingBoxAscent || 0
  const descent = metrics.actualBoundingBoxDescent || 0
  const baseline = centerY + (ascent - descent) / 2
  ctx.fillText(text, centerX, baseline)
}

function drawBlueWaves(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const imageRatio = width / height
  let zoneX = 0
  let zoneY = 0
  let zoneW = width
  let zoneH = height

  if (imageRatio > CARD_WIDTH_OVER_HEIGHT) {
    zoneW = height * CARD_WIDTH_OVER_HEIGHT
    zoneX = (width - zoneW) / 2
  } else {
    zoneH = width / CARD_WIDTH_OVER_HEIGHT
    zoneY = (height - zoneH) / 2
  }

  const fontSize = fontSizeForWidth(ctx, 'WAVES', zoneW * 0.92)
  ctx.font = `400 ${fontSize}px "${FONT_FAMILY}"`
  ctx.fillStyle = '#ffffff'
  const centerX = zoneX + zoneW / 2
  fillWord(ctx, 'BLUE', centerX, zoneY + zoneH * 0.23)
  fillWord(ctx, 'WAVES', centerX, zoneY + zoneH * 0.78)
}

export async function stampBlueWavesCover(file: File): Promise<File> {
  await loadCoverFont()
  const bitmap = await createImageBitmap(file)
  try {
    const canvas = document.createElement('canvas')
    canvas.width = bitmap.width
    canvas.height = bitmap.height
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(bitmap, 0, 0)
    drawBlueWaves(ctx, bitmap.width, bitmap.height)
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.92)
    })
    if (!blob) return file
    const base = file.name.replace(/\.[^.]+$/, '') || 'portada'
    return new File([blob], `${base}.jpg`, { type: 'image/jpeg' })
  } finally {
    bitmap.close()
  }
}
