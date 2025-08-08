import * as THREE from "three"

type Theme = {
  background: string
  text: string
  heading: string
  border: string
  accent: string
  scanline: string
}

export function createCodeTexture({
  title,
  code,
  width = 1024,
  height = 512,
  theme,
}: {
  title: string
  code: string
  width?: number
  height?: number
  theme: Theme
}) {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) return new THREE.Texture()

  // Background
  ctx.fillStyle = theme.background
  ctx.fillRect(0, 0, width, height)

  // Frame border
  ctx.strokeStyle = theme.border
  ctx.lineWidth = 6
  roundRect(ctx, 4, 4, width - 8, height - 8, 14)
  ctx.stroke()

  // Header bar
  const headerH = 54
  ctx.fillStyle = "#0f130f"
  roundRect(ctx, 8, 8, width - 16, headerH, 10)
  ctx.fill()

  // Traffic lights
  const lightsY = 8 + headerH / 2
  drawCircle(ctx, 28, lightsY, 8, "#ff5f56")
  drawCircle(ctx, 50, lightsY, 8, "#ffbd2e")
  drawCircle(ctx, 72, lightsY, 8, "#27c93f")

  // Title
  ctx.font = "700 26px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
  ctx.fillStyle = theme.heading
  ctx.textBaseline = "middle"
  ctx.fillText(truncate(title, 28), 100, lightsY)

  // Content area
  const pad = 22
  const startY = 8 + headerH + 10
  const contentW = width - pad * 2
  const contentH = height - startY - pad

  // Scanlines + subtle noise
  for (let y = startY; y < height - pad; y += 2) {
    ctx.fillStyle = theme.scanline
    ctx.fillRect(pad, y, contentW, 1)
  }
  const noiseDensity = 0.02
  for (let i = 0; i < width * height * noiseDensity; i++) {
    const nx = Math.random() * width
    const ny = startY + Math.random() * contentH
    const alpha = Math.random() * 0.05
    ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`
    ctx.fillRect(nx, ny, 1, 1)
  }

  // Code text with prompt caret
  ctx.font = "500 22px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
  ctx.fillStyle = theme.text
  ctx.textBaseline = "top"

  const lines = wrapCode(ctx, code, contentW)
  let y = startY + 6
  const lineHeight = 28
  const maxLines = Math.floor(contentH / lineHeight) - 1

  for (let i = 0; i < Math.min(lines.length, maxLines); i++) {
    const ln = lines[i]
    ctx.fillStyle = theme.accent
    ctx.fillText(">", pad, y)
    ctx.fillStyle = theme.text
    ctx.fillText(ln, pad + 18, y)
    y += lineHeight
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  texture.anisotropy = 8
  texture.magFilter = THREE.LinearFilter
  texture.minFilter = THREE.LinearMipmapLinearFilter
  return texture
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
}

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max - 1) + "…" : text
}

function wrapCode(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = tokenize(text)
  const lines: string[] = []
  let line = ""
  for (const w of words) {
    const test = line + w
    if (ctx.measureText(test).width > maxWidth && line !== "") {
      lines.push(line.trimEnd())
      line = w
    } else {
      line = test
    }
  }
  if (line) lines.push(line.trimEnd())
  return lines
}

function tokenize(text: string) {
  return text.split(/(\s+|[(){}[\].,;:])/g).filter(Boolean)
}
