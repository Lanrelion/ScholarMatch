import { createCanvas } from "canvas"
import { writeFileSync, mkdirSync } from "fs"

const sizes = [192, 512]
mkdirSync("public/icons", { recursive: true })

for (const size of sizes) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext("2d")
  
  // Background
  ctx.fillStyle = "#1D9E75"
  ctx.fillRect(0, 0, size, size)
  
  // Text
  ctx.fillStyle = "#ffffff"
  ctx.font = `bold ${size * 0.25}px sans-serif`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("SM", size / 2, size / 2)
  
  writeFileSync(
    `public/icons/icon-${size}x${size}.png`,
    canvas.toBuffer("image/png")
  )
  console.log(`Generated icon-${size}x${size}.png`)
}
