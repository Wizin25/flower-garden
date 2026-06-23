import { motion } from 'framer-motion'
import { GARDEN_CONFIG } from '../config/gardenConfig'

export default function MessagesSection() {
  return (
    <section className="messages-section">
      <h2 className="section-title">Một vài lời nhắn...</h2>

      <motion.blockquote
        className="quote"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        &ldquo;{GARDEN_CONFIG.quote}&rdquo;
      </motion.blockquote>

      <motion.div
        className="message-body"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.15 }}
      >
        {GARDEN_CONFIG.messages.map((line, index) =>
          line === '' ? (
            <br key={`space-${index}`} />
          ) : (
            <p key={line}>{line}</p>
          ),
        )}
      </motion.div>
    </section>
  )
}
