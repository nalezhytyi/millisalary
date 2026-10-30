import React, { lazy, Suspense } from 'react'
import EarningsDial from './components/EarningsDial'
import Header from './components/Header'
import InstallBanner from './components/InstallBanner'
import PeriodTabs from './components/PeriodTabs'
import SetupHint from './components/SetupHint'
import StatsRow from './components/StatsRow'
import { useAppState, useInstallPrompt, useTheme } from './hooks'

// The sheets and pushed screens start closed, so they (with vaul and Radix
// Dialog) load in their own chunks while the main screen paints instead of
// delaying it
const BreakdownScreen = lazy(() => import('./components/BreakdownScreen'))
const InstallSheet = lazy(() => import('./components/InstallSheet'))
const SettingsScreen = lazy(() => import('./components/SettingsScreen'))

const App: React.FC = () => {
  const {
    monthlySalary,
    monthlySalaryCurrency,
    earningsCurrency,
    workingHoursPerDay,
    workingDays,
    payday,
    selectedPeriod,
    startHour,
    endHour,
    isSettingsOpen,
    isBreakdownOpen,
    exchangeRate,
    earnings,
    handleSettingsClick,
    handleSetupHintSettingsClick,
    handleCloseSettings,
    handleSaveSettings,
    handleDiscardSettings,
    handleBreakdownClick,
    handleCloseBreakdown,
    handlePeriodChange,
  } = useAppState()
  const { theme, setTheme } = useTheme()
  const {
    isInstallBannerVisible,
    isInstallSheetOpen,
    handleInstallClick,
    handleDismissInstallBanner,
    handleCloseInstallSheet,
  } = useInstallPrompt()

  return (
    <>
      <Suspense fallback={null}>
        <SettingsScreen
          open={isSettingsOpen}
          onClose={handleCloseSettings}
          onSave={handleSaveSettings}
          onDiscard={handleDiscardSettings}
          monthlySalary={monthlySalary}
          monthlySalaryCurrency={monthlySalaryCurrency}
          earningsCurrency={earningsCurrency}
          workingHoursPerDay={workingHoursPerDay}
          workingDays={workingDays}
          payday={payday}
          startHour={startHour}
          endHour={endHour}
          theme={theme}
          onThemeChange={setTheme}
        />
        <BreakdownScreen
          open={isBreakdownOpen}
          onClose={handleCloseBreakdown}
          earnings={earnings}
          currency={earningsCurrency}
          monthlySalaryCurrency={monthlySalaryCurrency}
          exchangeRate={exchangeRate}
        />
        <InstallSheet
          open={isInstallSheetOpen}
          onClose={handleCloseInstallSheet}
        />
      </Suspense>
      <main className="app-screen mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <Header
          onSettingsClick={handleSettingsClick}
          onBreakdownClick={handleBreakdownClick}
        />
        <div className="flex flex-1 items-center justify-center py-4">
          <EarningsDial
            earned={earnings[selectedPeriod].earned}
            total={earnings[selectedPeriod].total}
            currency={earningsCurrency}
            period={selectedPeriod}
          />
        </div>
        {monthlySalary > 0 ? (
          <StatsRow earnings={earnings} currency={earningsCurrency} />
        ) : (
          <SetupHint onOpenSettings={handleSetupHintSettingsClick} />
        )}
        <div className="mt-4">
          <PeriodTabs value={selectedPeriod} onChange={handlePeriodChange} />
        </div>
      </main>
      {isInstallBannerVisible && (
        <InstallBanner
          onInstall={handleInstallClick}
          onDismiss={handleDismissInstallBanner}
        />
      )}
    </>
  )
}

export default App
