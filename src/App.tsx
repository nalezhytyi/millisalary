import React from 'react'
import BreakdownSheet from './components/BreakdownSheet'
import EarningsDial from './components/EarningsDial'
import Header from './components/Header'
import PeriodTabs from './components/PeriodTabs'
import SettingsSheet from './components/SettingsSheet'
import SetupHint from './components/SetupHint'
import StatsRow from './components/StatsRow'
import { useAppState, useTheme } from './hooks'

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
    handleSetMonthlySalary,
    handleMonthlySalaryBlur,
    handleSetMonthlySalaryCurrency,
    handleSetEarningsCurrency,
    handleSetWorkingHoursPerDay,
    handleWorkingHoursPerDayBlur,
    handleSetWorkingDays,
    handleWorkingDaysBlur,
    handleSetPayday,
    handlePaydayBlur,
    handleStartHourChange,
    handleEndHourChange,
    handleSettingsClick,
    handleSetupHintSettingsClick,
    handleCloseSettings,
    handleBreakdownClick,
    handleCloseBreakdown,
    handlePeriodChange,
  } = useAppState()
  const { theme, setTheme } = useTheme()

  return (
    <>
      <SettingsSheet
        open={isSettingsOpen}
        onClose={handleCloseSettings}
        monthlySalary={monthlySalary}
        monthlySalaryCurrency={monthlySalaryCurrency}
        earningsCurrency={earningsCurrency}
        workingHoursPerDay={workingHoursPerDay}
        workingDays={workingDays}
        payday={payday}
        startHour={startHour}
        endHour={endHour}
        theme={theme}
        onMonthlySalaryChange={handleSetMonthlySalary}
        onMonthlySalaryBlur={handleMonthlySalaryBlur}
        onMonthlySalaryCurrencyChange={handleSetMonthlySalaryCurrency}
        onEarningsCurrencyChange={handleSetEarningsCurrency}
        onWorkingHoursPerDayChange={handleSetWorkingHoursPerDay}
        onWorkingHoursPerDayBlur={handleWorkingHoursPerDayBlur}
        onWorkingDaysChange={handleSetWorkingDays}
        onWorkingDaysBlur={handleWorkingDaysBlur}
        onPaydayChange={handleSetPayday}
        onPaydayBlur={handlePaydayBlur}
        onStartHourChange={handleStartHourChange}
        onEndHourChange={handleEndHourChange}
        onThemeChange={setTheme}
      />
      <BreakdownSheet
        open={isBreakdownOpen}
        onClose={handleCloseBreakdown}
        earnings={earnings}
        currency={earningsCurrency}
        monthlySalaryCurrency={monthlySalaryCurrency}
        exchangeRate={exchangeRate}
      />
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
    </>
  )
}

export default App
