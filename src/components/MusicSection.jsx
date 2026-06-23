import { GARDEN_CONFIG } from '../config/gardenConfig'

export default function MusicSection() {
  const hasSpotify = Boolean(GARDEN_CONFIG.spotifyEmbedUrl)

  if (!hasSpotify) {
    return (
      <section className="music-section">
        <h2 className="section-title">Nhạc nền</h2>
        <div className="spotify-placeholder">
          <p>Gắn link Spotify trong file:</p>
          <code>src/config/gardenConfig.js</code>
        </div>
      </section>
    )
  }

  return (
    <section className="music-section">
      <h2 className="section-title">Nhạc nền</h2>
      <p className="music-album-name">À premier regard — Billy Easton</p>
      <p className="music-hint">Nhạc đang phát ở thanh phía dưới màn hình 🎵</p>
    </section>
  )
}
