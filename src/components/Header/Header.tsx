interface HeaderProps {
  onSettingsClick: () => void
}

const Header = ({ onSettingsClick }: HeaderProps) => {
  return (
    <header className="flex select-none items-center gap-4 border-b border-gray-200/20 bg-gray-400/10 p-4 backdrop-blur-md">
      <h1 className="bg-gradient-to-r from-white to-orange-500 bg-clip-text text-5xl font-bold text-transparent opacity-70">
        Millisalary
      </h1>
      <img
        className="self-end"
        width={40}
        src="images/money-face.gif"
        alt=""
      />
      <button
        className="ml-auto cursor-pointer rounded-lg p-2 text-gray-400 transition-all hover:bg-gray-200/10 hover:text-gray-200"
        onClick={onSettingsClick}
        aria-label="Open settings"
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
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      </button>
    </header>
  )
}

export default Header
