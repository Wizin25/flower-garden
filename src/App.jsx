import { useState } from 'react'
import PasswordPage from './pages/PasswordPage'
import GardenPage from './pages/GardenPage'
import FlowerAnimation from './components/FlowerAnimation'
import SpotifyPlayer from './components/SpotifyPlayer'

function App() {
  // FlowerAnimation sẽ được remount lại mỗi lần unlock
  const [animationKey, setAnimationKey] = useState(0)
  const [appState, setAppState] = useState(() =>
    sessionStorage.getItem('garden_unlocked') === 'true' ? 'unlocked' : 'locked'
  )

  const handleLock = () => {
    sessionStorage.removeItem('garden_unlocked')
    setAppState('locked')
    // Reset key để khi đăng nhập lại FlowerAnimation sẽ luôn được dựng lại
    setAnimationKey(prev => prev + 1)
  }

  return (
    <>
      {appState !== 'locked' && (
        <>
          <SpotifyPlayer />
          <GardenPage />

          {/* Nút quay về — chỉ hiện khi đã unlock xong */}
          {appState === 'unlocked' && (
            <button
              onClick={handleLock}
              title="Quay về trang mật khẩu"
              style={{
                position: 'fixed',
                top: '1rem',
                right: '1rem',
                zIndex: 200,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.9rem',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                borderRadius: '999px',
                color: 'rgba(255, 248, 245, 0.85)',
                fontSize: '0.82rem',
                fontFamily: 'inherit',
                cursor: 'pointer',
                letterSpacing: '0.02em',
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
                e.currentTarget.style.color = '#fff'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.color = 'rgba(255,248,245,0.85)'
              }}
            >
              🔒 Khóa
            </button>
          )}
        </>
      )}

      {appState === 'locked' && (
        <PasswordPage onUnlock={() => setAppState('animating')} />
      )}

      {appState === 'animating' && (
        <FlowerAnimation
          key={animationKey}
          onComplete={() => {
            sessionStorage.setItem('garden_unlocked', 'true')
            setAppState('unlocked')
          }}
        />
      )}
    </>
  )
}

export default App
