import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GARDEN_CONFIG } from '../config/gardenConfig'

export default function MessagesSection() {
  const [open, setOpen] = useState(false);

  // Animation variants for the message lines appearing one after another
  const containerVariants = {
    open: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
    closed: {},
  };

  const lineVariants = {
    closed: { opacity: 0, y: 28 },
    open: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  };

  return (
    <section className="messages-section ">
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

      {/* Clickable envelope/message header */}
      <div
        className="message-envelope"
        style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '2.2rem 0 1rem',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onClick={() => setOpen((o) => !o)}
        tabIndex={0}
        aria-pressed={open}
        role="button"
      >
        <motion.span
          initial={false}
          animate={{ rotate: open ? 7 : 0, scale: open ? 1.07 : 1, color: open ? "#c25779" : "#ffecfe" }}
          transition={{ type: "spring", stiffness: 240, damping: 16 }}
          style={{ fontSize: "2.1rem", padding: "0.33em 1.4em 0.33em 1em", fontFamily: "serif", background: "rgba(255,255,255,0.13)", borderRadius: "20px", boxShadow: open ? "0 6px 24px rgba(209,100,151,0.09)" : "0 2px 12px rgba(200,60,140,0.06)" }}
        >
           💌 {open ? '' : ''}
        </motion.span>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="message-body"
            key="message-body"
            variants={containerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            style={{ overflow: 'hidden', margin: '0 auto', maxWidth: 440 }}
          >
            {GARDEN_CONFIG.messages.map((line, index) =>
              line === '' ? (
                <br key={`space-${index}`} />
              ) : (
                <motion.p
                  key={line + index}
                  variants={lineVariants}
                  style={{ marginBottom: '.65em' }}
                >
                  {line}
                </motion.p>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
