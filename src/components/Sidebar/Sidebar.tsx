import React from 'react'
import './Sidebar.css'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  selectedBackground: 'aurora' | 'darkveil' | 'galaxy' | 'lightrays'
  onBackgroundChange: (
    background: 'aurora' | 'darkveil' | 'galaxy' | 'lightrays'
  ) => void
  isInputsCollapsed: boolean
  onToggleInputsCollapsed: () => void
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  selectedBackground,
  onBackgroundChange,
  isInputsCollapsed,
  onToggleInputsCollapsed,
}) => {
  const sidebarBg =
    'linear-gradient(135deg, rgba(22, 24, 52, 0.3) 0%, rgba(55, 59, 127, 0.3) 100%)'
  const borderColor = 'rgba(255, 255, 255, 0.1)'
  const textColor = '#fff'
  const textSecondary = 'rgba(255, 255, 255, 0.6)'
  const buttonBg = 'rgba(255, 255, 255, 0.05)'
  const buttonBorder = 'rgba(255, 255, 255, 0.1)'

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

        <div className="sidebar-content">
          <div className="sidebar-section">
            <h3 className="sidebar-section-title" style={{ color: textColor }}>
              Layout
            </h3>
            <p
              className="sidebar-section-description"
              style={{ color: textSecondary }}
            >
              Choose whether the calculator inputs stay visible on the main screen
            </p>

            <button
              type="button"
              className="sidebar-toggle-button"
              onClick={onToggleInputsCollapsed}
              aria-pressed={isInputsCollapsed}
            >
              <div className="sidebar-toggle-copy">
                <span className="sidebar-toggle-title">
                  {isInputsCollapsed ? 'Compact earnings view' : 'Full calculator view'}
                </span>
                <span className="sidebar-toggle-description">
                  {isInputsCollapsed
                    ? 'Only the earnings widget is shown on the main screen.'
                    : 'Inputs and earnings are both shown on the main screen.'}
                </span>
              </div>
              <span className="sidebar-toggle-status">
                {isInputsCollapsed ? 'Enabled' : 'Disabled'}
              </span>
            </button>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-section-title" style={{ color: textColor }}>
              Background
            </h3>
            <p
              className="sidebar-section-description"
              style={{ color: textSecondary }}
            >
              Choose your preferred background style
            </p>

            <div className="background-options">
              <button
                className={`background-option ${
                  selectedBackground === 'aurora' ? 'background-option-selected' : ''
                }`}
                onClick={() => onBackgroundChange('aurora')}
                style={{
                  background: buttonBg,
                  borderColor: buttonBorder,
                }}
              >
                <div className="background-preview aurora-preview">
                  <div className="aurora-gradient" />
                </div>
                <div className="background-option-info">
                  <span className="background-option-name" style={{ color: textColor }}>
                    Aurora
                  </span>
                  <span className="background-option-desc" style={{ color: textSecondary }}>
                    Colorful animated gradient
                  </span>
                </div>
                {selectedBackground === 'aurora' && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="background-option-check"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>

              <button
                className={`background-option ${
                  selectedBackground === 'darkveil'
                    ? 'background-option-selected'
                    : ''
                }`}
                onClick={() => onBackgroundChange('darkveil')}
                style={{
                  background: buttonBg,
                  borderColor: buttonBorder,
                }}
              >
                <div className="background-preview darkveil-preview">
                  <div className="darkveil-gradient" />
                </div>
                <div className="background-option-info">
                  <span className="background-option-name" style={{ color: textColor }}>
                    Dark Veil
                  </span>
                  <span className="background-option-desc" style={{ color: textSecondary }}>
                    Mysterious dark pattern
                  </span>
                </div>
                {selectedBackground === 'darkveil' && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="background-option-check"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>

              <button
                className={`background-option ${
                  selectedBackground === 'galaxy' ? 'background-option-selected' : ''
                }`}
                onClick={() => onBackgroundChange('galaxy')}
                style={{
                  background: buttonBg,
                  borderColor: buttonBorder,
                }}
              >
                <div className="background-preview galaxy-preview">
                  <div className="galaxy-gradient" />
                </div>
                <div className="background-option-info">
                  <span className="background-option-name" style={{ color: textColor }}>
                    Galaxy
                  </span>
                  <span className="background-option-desc" style={{ color: textSecondary }}>
                    Animated starfield
                  </span>
                </div>
                {selectedBackground === 'galaxy' && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="background-option-check"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>

              <button
                className={`background-option ${
                  selectedBackground === 'lightrays'
                    ? 'background-option-selected'
                    : ''
                }`}
                onClick={() => onBackgroundChange('lightrays')}
                style={{
                  background: buttonBg,
                  borderColor: buttonBorder,
                }}
              >
                <div className="background-preview lightrays-preview">
                  <div className="lightrays-gradient" />
                </div>
                <div className="background-option-info">
                  <span className="background-option-name" style={{ color: textColor }}>
                    Light Rays
                  </span>
                  <span className="background-option-desc" style={{ color: textSecondary }}>
                    Animated light beams
                  </span>
                </div>
                {selectedBackground === 'lightrays' && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="background-option-check"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default React.memo(Sidebar)
