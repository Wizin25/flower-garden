import { GARDEN_CONFIG } from '../config/gardenConfig'

function buildSpotifySrc() {
  const base = GARDEN_CONFIG.spotifyEmbedUrl
  if (!base) return ''

  if (base.includes('autoplay=1')) return base

  return base.includes('?') ? `${base}&autoplay=1` : `${base}?autoplay=1`
}

export default function SpotifyPlayer() {
  const src = buildSpotifySrc()
  if (!src) return null

  return (
    <div className="spotify-player-bar" aria-label="Nhạc nền Spotify">
      <iframe
        src={src}
        title="À premier regard — Billy Easton"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="eager"
        className="spotify-embed"
      />
    </div>
  )
}
