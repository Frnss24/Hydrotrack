import { Plus } from 'lucide-react'

export default function Header({ onLogoClick, onQuickAdd }) {
  return (
    <header className="header">
      <div
        className="header-brand-wrap"
        onClick={onLogoClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onLogoClick()}
      >
        <div className="header-logo-badge">
          <img src="/logo.svg" alt="HydroTrack Logo" />
        </div>
        <div className="header-brand-text">
          <span className="brand-title">HydroTrack</span>
          <span className="brand-sub">Daily Hydration Tracker</span>
        </div>
      </div>

      {onQuickAdd && (
        <button
          type="button"
          className="btn btn--primary btn--sm"
          onClick={onQuickAdd}
        >
          <Plus size={16} />
          <span>Catat Air</span>
        </button>
      )}
    </header>
  )
}
