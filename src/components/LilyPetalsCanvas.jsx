import { useEffect, useRef } from 'react'

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

function createPetal(width, height) {
  return {
    x: Math.random() * width,
    y: Math.random() * height - height,
    size: 8 + Math.random() * 14,
    speedY: 0.4 + Math.random() * 1.2,
    speedX: -0.3 + Math.random() * 0.6,
    rotation: Math.random() * Math.PI * 2,
    spin: -0.02 + Math.random() * 0.04,
    opacity: 0.35 + Math.random() * 0.45,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: 0.01 + Math.random() * 0.02,
  }
}

export default function LilyPetalsCanvas() {
  const canvasRef = useRef(null)
  const petalsRef = useRef([])
  const frameRef = useRef(0)

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
        createPetal(canvas.width, canvas.height),
      )
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      petalsRef.current.forEach((petal) => {
        petal.sway += petal.swaySpeed
        petal.y += petal.speedY
        petal.x += petal.speedX + Math.sin(petal.sway) * 0.4
        petal.rotation += petal.spin

        if (petal.y > canvas.height + petal.size) {
          Object.assign(petal, createPetal(canvas.width, canvas.height))
          petal.y = -petal.size
        }

        drawPetal(ctx, petal.x, petal.y, petal.size, petal.rotation, petal.opacity)
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
