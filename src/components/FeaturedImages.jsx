import { motion } from 'framer-motion'

export default function FeaturedImages({ photos }) {
  return (
    <section className="featured-section">
      {photos.map((src, index) => (
        <motion.figure
          key={src}
          className="featured-card"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{
            scale: 1.04,
            rotate: 2,
            boxShadow: "0 8px 32px rgba(183,42,125,0.12),0 2px 10px #ffd7fc86"
          }}
          whileTap={{
            scale: 0.98,
            rotate: -1,
            boxShadow: "0 2px 6px rgba(110,42,183,0.15)"
          }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: index * 0.12, type: "spring", stiffness: 200, damping: 18 }}
          tabIndex={0}
          style={{
            cursor: "pointer",
            transition: "box-shadow 0.2s"
          }}
        >
          <img src={src} alt={`Khoảnh khắc ${index + 1}`} loading="lazy" draggable={false} />
        </motion.figure>
      ))}
    </section>
  )
}
