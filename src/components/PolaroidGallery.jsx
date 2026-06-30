import { useState } from 'react'
import { motion } from 'framer-motion'

const polaroidVariants = {
  initial: { opacity: 0, y: 40, scale: 0.95, rotate: -8 },
  animate: { opacity: 1, y: 0, scale: 1, rotate: 0 },
  hover: { scale: 1.06, rotate: 4, zIndex: 10, boxShadow: "0 8px 32px rgba(183, 42, 125,0.13)" },
}

const overlayVariants = {
  initial: { opacity: 0 },
  hover: { opacity: 1 }
}

// Icon list to decorate around the polaroids
const ICONS = [
  { symbol: '🌸', name: 'flower' },
  { symbol: '💖', name: 'heart' },
  { symbol: '🦋', name: 'butterfly' },
  { symbol: '✨', name: 'sparkle' },
  { symbol: '🌷', name: 'tulip' },
  { symbol: '🎀', name: 'ribbon' },
  { symbol: '🍥', name: 'swirl' },
]

function DecorativeIcons({ hovered, index = 0 }) {
  // Decorate 4 corners and 4 mid-sides
  // Also mildly animate on hover!
  const positions = [
    { top: 0, left: 0, transform: 'translate(-40%,-35%)', rot: -25 },      // Top Left
    { top: 0, right: 0, transform: 'translate(40%,-40%)', rot: 18 },       // Top Right
    { bottom: 0, right: 0, transform: 'translate(36%,36%)', rot: 24 },     // Bottom Right
    { bottom: 0, left: 0, transform: 'translate(-34%,38%)', rot: -18 },    // Bottom Left
    { top: '50%', left: 0, transform: 'translate(-90%,-50%)', rot: -10 },  // Mid Left
    { top: '50%', right: 0, transform: 'translate(80%,-50%)', rot: 12},    // Mid Right
    { top: 0, left: '50%', transform: 'translate(-50%,-80%)', rot: 4 },    // Top Center
    { bottom: 0, left: '50%', transform: 'translate(-50%,85%)', rot: -7 }, // Bottom Center
  ]
  // Cycle through icons for variety using index so each polaroid has different icons
  return (
    <>
      {positions.map((pos, i) => (
        <motion.span
          key={i}
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            fontSize: hovered ? '1.5em' : '1.15em',
            opacity: hovered ? 0.69 : 0.34,
            zIndex: 5,
            filter: hovered ? 'drop-shadow(0 0 8px #ffe2fdcc)' : 'none',
            ...pos,
            transform: `${pos.transform} rotate(${pos.rot}deg)`,
            transition: 'opacity 0.15s, font-size 0.33s, filter 0.25s'
          }}
          animate={hovered ? { scale: 1.15, opacity: 0.9 } : { scale: 0.98, opacity: 0.36 }}
          transition={{ type: "spring", stiffness: 320, damping: 18 }}
          aria-hidden="true"
        >
          {ICONS[(i + index) % ICONS.length].symbol}
        </motion.span>
      ))}
    </>
  )
}

export default function PolaroidGallery({ photos = [] }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <section className="gallery-section" style={{ padding: '2.4rem 0' }}>
      <h2 className="section-title" style={{
        fontWeight: 600,
        letterSpacing: "0.07em",
        marginBottom: "2.15rem",
        color: "#fff8f5",
        textShadow: "0 2px 20px #f4bbf550"
      }}>
        📷 Gallery ảnh
      </h2>
      <div className="polaroid-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "2.1rem 1.5rem",
          padding: "0.2rem 0",
        }}
      >
        {photos.map((item, index) => (
          <motion.figure
            key={item.url}
            className="polaroid"
            custom={index}
            initial="initial"
            whileInView="animate"
            whileHover="hover"
            viewport={{ once: true, margin: '-30px' }}
            variants={{
              ...polaroidVariants,
              animate: { ...polaroidVariants.animate, rotate: item.rotation || 0 },
              hover: { ...polaroidVariants.hover, rotate: (item.rotation || 0) + 3 }
            }}
            transition={{ duration: 0.55, ease: "easeOut", delay: (index % 4) * 0.09 }}
            style={{
              '--rotate': `${item.rotation}deg`,
              boxShadow: hoveredIndex === index
                ? "0 10px 36px 2px #da81b7b4,0 2px 4px #fff8"
                : "0 3px 18px 2px #d57cc06c,0 2px 14px #ffd8fa72",
              borderRadius: 17,
              background: 'linear-gradient(135deg, #fff8fb 60%, #ffe9fa 100%)',
              overflow: 'hidden',
              cursor: 'pointer',
              position: "relative"
            }}
            tabIndex={0}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setHoveredIndex(index)}
            onBlur={() => setHoveredIndex(null)}
          >
            {/* Decorative icons around border */}
            <DecorativeIcons hovered={hoveredIndex === index} index={index} />
            <motion.div
              className="polaroid-photo"
              style={{
                background: "#fdeaf7",
                borderRadius: "13px",
                overflow: "hidden",
                boxShadow: "0 2px 14px 0 #f8bff5a1",
              }}
            >
              <img
                src={item.url}
                alt={item.caption || `Polaroid ${index + 1}`}
                loading="lazy"
                style={{
                  width: "100%",
                  height: "250px",
                  objectFit: "cover",
                  display: "block",
                  filter: hoveredIndex === index ? "saturate(1.25) blur(0.2px)" : "saturate(1) blur(0)",
                  transition: "filter 0.27s"
                }}
                draggable={false}
              />
              <motion.div
                className="photo-overlay"
                initial="initial"
                variants={overlayVariants}
                animate={hoveredIndex === index ? "hover" : "initial"}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(160deg, rgba(250,208,242,0.04) 55%, rgba(220,151,200,0.18) 100%)",
                  borderRadius: 13,
                  pointerEvents: 'none',
                  zIndex: 4,
                  opacity: hoveredIndex === index ? 1 : 0,
                  transition: "opacity 0.25s",
                }}
              />
            </motion.div>
            {item.caption &&
              <figcaption
                style={{
                  marginTop: ".9em",
                  fontSize: "1.06em",
                  color: "#d05297",
                  fontWeight: 500,
                  textAlign: "center",
                  textShadow: "0 1px 8px #ffebf8CC",
                  minHeight: "2.5em"
                }}
              >
                {item.caption}
              </figcaption>
            }
            <span
              style={{
                position: "absolute",
                left: "50%",
                top: "5px",
                transform: "translateX(-50%)",
                fontSize: "1.6rem",
                opacity: 0.20
              }}
            >✨</span>
          </motion.figure>
        ))}
      </div>
    </section>
  )
}
