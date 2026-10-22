import React from 'react'
import './Sidebar.css'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  children?: React.ReactNode
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  const sidebarBg =
    'linear-gradient(135deg, rgba(22, 24, 52, 0.3) 0%, rgba(55, 59, 127, 0.3) 100%)'
  const borderColor = 'rgba(255, 255, 255, 0.1)'
  const textSecondary = 'rgba(255, 255, 255, 0.6)'

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'sidebar-overlay-visible' : ''}`}
        onClick={onClose}
      />

      <div
        className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}
        style={{
          background: sidebarBg,
          borderLeft: `1px solid ${borderColor}`,
        }}
      >
        <div
          className="sidebar-header"
          style={{ borderBottom: `1px solid ${borderColor}` }}
        >
          <h2 className="sidebar-title">Settings</h2>
          <button
            onClick={onClose}
            className="sidebar-close-button"
            aria-label="Close sidebar"
            style={{
              color: textSecondary,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="sidebar-content">{children}</div>
      </div>
    </>
  )
}

export default React.memo(Sidebar)
