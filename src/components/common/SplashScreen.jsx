import { useState, useEffect, useCallback, useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import './SplashScreen.css'

export default function SplashScreen({ onFinish, duration = 2000 }) {
  const [isFading, setIsFading] = useState(false)
  const dismissedRef = useRef(false)

  const handleDismiss = useCallback(() => {
    if (dismissedRef.current) return
    dismissedRef.current = true
    setIsFading(true)
    setTimeout(() => {
      if (onFinish) onFinish()
    }, 450)
  }, [onFinish])

  useEffect(() => {
    const timer = setTimeout(handleDismiss, duration)
    return () => clearTimeout(timer)
  }, [duration, handleDismiss])

  return (
    <div
      className={`splash-overlay ${isFading ? 'splash-overlay--fading' : ''}`}
      onClick={handleDismiss}
      role="dialog"
      aria-modal="true"
      aria-label="HydroTrack Intro"
    >
      <div className="splash-card">
        <div className="splash-logo-wrap">
          <img src="/logo.svg" alt="HydroTrack" />
        </div>
        <h1 className="splash-title">HydroTrack</h1>
        <p className="splash-subtitle">
          Stay Calm, Stay Hydrated Every Day
        </p>
        <button
          type="button"
          className="splash-skip-btn"
          onClick={(e) => {
            e.stopPropagation()
            handleDismiss()
          }}
        >
          <span>Mulai Catat</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
