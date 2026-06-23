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
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: index * 0.12 }}
        >
          <img src={src} alt={`Khoảnh khắc ${index + 1}`} loading="lazy" />
        </motion.figure>
      ))}
    </section>
  )
}
