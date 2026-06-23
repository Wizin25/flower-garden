import { motion } from 'framer-motion'

export default function PolaroidGallery({ photos }) {
  return (
    <section className="gallery-section">
      <h2 className="section-title">Gallery ảnh</h2>
      <div className="polaroid-grid">
        {photos.map((item, index) => (
          <motion.figure
            key={item.url}
            className="polaroid"
            style={{ '--rotate': `${item.rotation}deg` }}
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: (index % 6) * 0.08 }}
          >
            <div className="polaroid-photo">
              <img src={item.url} alt={`Polaroid ${index + 1}`} loading="lazy" />
            </div>
            {item.caption && <figcaption>{item.caption}</figcaption>}
          </motion.figure>
        ))}
      </div>
    </section>
  )
}
