import { useEffect, useRef } from 'react'

// Lấy toàn bộ ảnh hoa từ thư mục ly_flower để dùng cho cánh rơi
const flowerImages = Object.values(
  import.meta.glob('/ly_flower/*.{png,jpg,jpeg,webp,svg,PNG,JPG,JPEG,WEBP}', {
    eager: true,
    as: 'url',
  })
)

function drawPetal(ctx, x, y, size, rotation, opacity) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.globalAlpha = opacity

  const gradient = ctx.createLinearGradient(-size, 0, size, 0)
  gradient.addColorStop(0, 'rgba(255, 248, 245, 0.9)')
  gradient.addColorStop(0.5, 'rgba(255, 230, 220, 0.85)')
  gradient.addColorStop(1, 'rgba(245, 210, 200, 0.7)')

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.moveTo(0, -size * 0.15)
  ctx.bezierCurveTo(size * 0.5, -size * 0.5, size * 0.55, size * 0.45, 0, size)
  ctx.bezierCurveTo(-size * 0.55, size * 0.45, -size * 0.5, -size * 0.5, 0, -size * 0.15)
  ctx.fill()

  ctx.restore()
}

// Vẽ hoa dạng image lên canvas, làm to và rõ hơn
function drawFlowerImage(ctx, img, x, y, size, rotation, opacity) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.globalAlpha = Math.min(1, opacity * 1.12) // tăng opacity cho rõ hơn, nhưng không vượt 1

  // Để rõ hơn nữa có thể thêm shadow nhẹ cho ảnh
  ctx.shadowColor = "rgba(160, 90, 100, 0.12)"
  ctx.shadowBlur = Math.max(8, size * 0.16)

  ctx.drawImage(img, -size / 2, -size / 2, size, size)

  ctx.restore()
}

function createPetal(width, height, withImage = false) {
  // Image sẽ to hơn và có độ rõ cao hơn các cánh gradient
  const isImage = withImage && flowerImages.length > 0 && Math.random() < 0.57 // ~1/2 số sẽ dùng image
  // Size ảnh hoa: vừa to hơn (~52 đến 98) vừa random một chút; petal thường giữ nguyên cỡ cũ
  return {
    x: Math.random() * width,
    y: Math.random() * height - height,
    size: isImage
      ? 52 + Math.random() * 46 // làm to tối thiểu so với trước
      : 8 + Math.random() * 14,
    speedY: isImage ? (0.63 + Math.random() * 0.69) : (0.4 + Math.random() * 1.2),
    speedX: isImage ? (-0.23 + Math.random() * 0.46) : (-0.5 + Math.random() * 1.0),
    rotation: Math.random() * Math.PI * 2,
    spin: isImage ? (-0.007 + Math.random() * 0.014) : (-0.02 + Math.random() * 0.04),
    opacity: isImage
      ? (0.82 + Math.random() * 0.15) // rõ hơn: tối thiểu 0.82 đến 0.97
      : (0.35 + Math.random() * 0.45),
    sway: Math.random() * Math.PI * 2,
    swaySpeed: isImage ? (0.008 + Math.random() * 0.012) : (0.01 + Math.random() * 0.02),
    image: isImage ? flowerImages[Math.floor(Math.random() * flowerImages.length)] : null,
    isImage,
    imgObj: null, // Ảnh cache thực tế sẽ preload bên dưới
  }
}

export default function LilyPetalsCanvas() {
  const canvasRef = useRef(null)
  const petalsRef = useRef([])

  // Preload hình ảnh thành Image object để animation mượt
  const imageCacheRef = useRef({})
  useEffect(() => {
    if (flowerImages.length) {
      flowerImages.forEach((url) => {
        if (!imageCacheRef.current[url]) {
          const img = new window.Image()
          img.src = url
          imageCacheRef.current[url] = img
        }
      })
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const count = Math.floor((canvas.width * canvas.height) / 18000)
      petalsRef.current = Array.from({ length: Math.min(count, 55) }, () =>
        createPetal(canvas.width, canvas.height, true)
      )
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      petalsRef.current.forEach((petal) => {
        petal.sway += petal.swaySpeed
        petal.y += petal.speedY
        petal.x += petal.speedX + Math.sin(petal.sway) * 0.4
        petal.rotation += petal.spin

        // Vượt màn hình sẽ respawn ở trên cùng (ngẫu nhiên lại)
        if (petal.y > canvas.height + petal.size) {
          const newPetal = createPetal(canvas.width, canvas.height, true)
          Object.assign(petal, newPetal)
          petal.y = -petal.size
        }

        // Եթե là hình ảnh hoa, vẽ bằng ảnh
        if (petal.isImage && petal.image) {
          let img = petal.imgObj
          if (!img) {
            img = imageCacheRef.current[petal.image]
            petal.imgObj = img
          }
          if (img && img.complete && img.naturalWidth > 0) {
            drawFlowerImage(ctx, img, petal.x, petal.y, petal.size, petal.rotation, petal.opacity)
          } else {
            // fallback vẽ petal thường khi ảnh chưa sẵn sàng
            drawPetal(
              ctx,
              petal.x,
              petal.y,
              petal.size * 0.75,
              petal.rotation,
              Math.max(0.6, petal.opacity * 0.85)
            )
          }
        } else {
          // Vẽ cánh hoa gradient
          drawPetal(ctx, petal.x, petal.y, petal.size, petal.rotation, petal.opacity)
        }
      })

      animationId = requestAnimationFrame(animate)
    }

    resize()
    animate()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[3]"
      aria-hidden="true"
    />
  )
}
