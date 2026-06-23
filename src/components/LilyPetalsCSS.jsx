const CSS_PETALS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i * 5.7 + 3) % 100}%`,
  delay: `${(i * 0.9) % 12}s`,
  duration: `${10 + (i % 6) * 2}s`,
  size: 10 + (i % 4) * 4,
}))

export default function LilyPetalsCSS() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden" aria-hidden="true">
      {CSS_PETALS.map((petal) => (
        <span
          key={petal.id}
          className="petal-float absolute rounded-full"
          style={{
            left: petal.left,
            width: petal.size,
            height: petal.size * 1.6,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
          }}
        />
      ))}
    </div>
  )
}
