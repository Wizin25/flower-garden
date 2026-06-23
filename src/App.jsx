import { useState } from 'react'
import PasswordPage from './pages/PasswordPage'
import GardenPage from './pages/GardenPage'
import SpotifyPlayer from './components/SpotifyPlayer'

function App() {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem('garden_unlocked') === 'true',
  )

  if (!unlocked) {
    return <PasswordPage onUnlock={() => setUnlocked(true)} />
  }

  return (
    <>
      <SpotifyPlayer />
      <GardenPage />
    </>
  )
}

export default App
