export default function SpotifyPlayer() {
  return (
    <div className="spotify-player-bar" aria-label="Nhạc nền">
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          borderRadius: '12px',
          overflow: 'hidden',
          background: 'rgba(1, 1, 1, 0)',
        }}
      >
        <audio
          controls
          autoPlay
          style={{ display: 'grid', width: 50, borderRadius: '20px', background: 'transparent' }}
        >
          <source src="/assets/song.mp3" type="audio/mpeg" />
          Trình duyệt của bạn không hỗ trợ audio element.
        </audio>
      </div>
    </div>
  );
}
