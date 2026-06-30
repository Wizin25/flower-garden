import { useEffect, useState } from 'react'
import { GARDEN_CONFIG } from '../config/gardenConfig'
import { lilyBg } from '../utils/assets'

const PIN_LENGTH = GARDEN_CONFIG.password.length
const KEYPAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

export default function PasswordPage({ onUnlock }) {
  const [digits, setDigits] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const verifyPin = (pin) => {
    if (pin === GARDEN_CONFIG.password) {
      sessionStorage.setItem('garden_unlocked', 'true')
      onUnlock()
      return
    }

    setError(true)
    setShake(true)
    setDigits('')
    setTimeout(() => setShake(false), 450)
  }

  const handleDigit = (digit) => {
    if (digits.length >= PIN_LENGTH) return
    setDigits((prev) => prev + digit)
    setError(false)
  }

  const handleDelete = () => {
    setDigits((prev) => prev.slice(0, -1))
    setError(false)
  }

  useEffect(() => {
    if (digits.length === PIN_LENGTH) {
      verifyPin(digits)
    }
  }, [digits])

  return (
    <div className="password-page">
      <div
        className="password-bg"
        style={{ backgroundImage: `url(${lilyBg})` }}
        aria-hidden="true"
      />
      <div className="password-overlay" aria-hidden="true" />
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <filter
            id="liquidGlass"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008 0.012"
              numOctaves="1"
              seed="10"
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="2" result="map" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale="100"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <main className="password-card liquid">
        <h1 className="password-title">🌸 Một khu vườn dành cho em 🌸</h1>
        <p className="password-subtitle">Nhập mật khẩu để bước vào</p>

        <div className={`pin-display ${shake ? 'pin-shake' : ''}`} aria-label="Mật khẩu">
          {Array.from({ length: PIN_LENGTH }, (_, i) => (
            <span
              key={i}
              className={`pin-dot ${i < digits.length ? 'pin-dot-filled' : ''}`}
            />
          ))}
        </div>

        <div className="pin-keypad">
          {KEYPAD.slice(0, 9).map((key) => (
            <button
              key={key}
              type="button"
              className="pin-key"
              onClick={() => handleDigit(key)}
            >
              {key}
            </button>
          ))}
          <button type="button" className="pin-key pin-key-action" onClick={handleDelete}>
            ⌫
          </button>
          <button type="button" className="pin-key" onClick={() => handleDigit('0')}>
            0
          </button>
          <button
            type="button"
            className="pin-key pin-key-action pin-key-enter"
            onClick={() => verifyPin(digits)}
            disabled={digits.length !== PIN_LENGTH}
          >
            ✓
          </button>
        </div>

        {error && (
          <p className="password-error">Là ngày sinh nhật của chúng ta💕</p>
        )}
      </main>
    </div>
  )
}
