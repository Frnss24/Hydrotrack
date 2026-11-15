import { Droplets, BarChart3, PlusCircle, GlassWater, User } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'Dashboard', label: 'Beranda', icon: Droplets },
  { id: 'History', label: 'Riwayat', icon: BarChart3 },
  { id: 'LogDrink', label: 'Catat', icon: PlusCircle },
  { id: 'Beverages', label: 'Minuman', icon: GlassWater },
  { id: 'Profile', label: 'Profil', icon: User },
]

export default function BottomNav({ activeTab, onSelectTab }) {
  return (
    <nav className="bottom-nav" aria-label="Navigasi Utama">
      <div className="bottom-nav-inner">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              type="button"
              className={`bottom-nav-item ${isActive ? 'bottom-nav-item--active' : ''}`}
              onClick={() => onSelectTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={20} strokeWidth={isActive ? 2.4 : 1.9} />
              <span className="bottom-nav-label">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
