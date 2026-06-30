import { motion } from 'framer-motion'
import LilyPetalsCanvas from '../components/LilyPetalsCanvas'
import LilyPetalsCSS from '../components/LilyPetalsCSS'
import FeaturedImages from '../components/FeaturedImages'
import PolaroidGallery from '../components/PolaroidGallery'
import MessagesSection from '../components/MessagesSection'
import MusicSection from '../components/MusicSection'
import { featuredPhotos, galleryPhotos, lilyBg } from '../utils/assets'

export default function GardenPage() {
  return (
    <div className="garden-page">
      <div
        className="garden-bg"
        style={{ backgroundImage: `url(${lilyBg})` }}
        aria-hidden="true"
      />
      <div className="garden-overlay" aria-hidden="true" />

      <LilyPetalsCSS />
      <LilyPetalsCanvas />
      
      <main className="garden-content">
        <motion.header
          className="garden-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="header-divider" />
          <h1>🌸 Hải Huyền 🌸</h1>
          <div className="header-divider" />
          <h1>25-05-2005</h1>
          <div className="header-divider" />
        </motion.header>

        <FeaturedImages photos={featuredPhotos} />
        <MessagesSection />
        <PolaroidGallery photos={galleryPhotos} />
        <MusicSection />
      </main>
    </div>
  )
}
