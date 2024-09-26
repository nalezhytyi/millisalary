const Header = () => {
  return (
    <header className="flex select-none items-center gap-4 border-b border-gray-200/20 bg-gray-400/10 p-4">
      <h1 className="bg-gradient-to-r from-[#161834] via-[#373B7F] to-orange-500 bg-clip-text text-5xl font-bold text-transparent">
        Millisalary
      </h1>
      <img
        className="self-end"
        width={40}
        src="/images/money-face.gif"
        alt=""
      />
      <div className="group relative ml-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-8 cursor-pointer text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m0-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
          />
        </svg>
        <div className="absolute right-full top-full mb-2 hidden w-32 min-w-96 flex-col gap-2 rounded bg-[#161834] p-2 text-xs text-white opacity-0 transition-opacity duration-300 ease-in-out group-hover:flex group-hover:opacity-100">
          <p>
            Application designed to help users track their earnings based on
            their monthly salary and working hours.
          </p>
          <p>
            The application allows users to input their monthly salary, select
            the currency for their salary and earnings, and specify their
            working hours.
          </p>
          <p>
            It then calculates and displays the current earnings, daily
            earnings, and monthly earnings in the selected currency.
          </p>
          <p>
            The application also fetches the exchange rate to convert the salary
            and earnings into the desired currency.
          </p>
        </div>
      </div>
    </header>
  )
}
export default Header
