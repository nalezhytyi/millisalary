import React from 'react'
import EarningsDial from './components/EarningsDial'
import Header from './components/Header'
import PeriodTabs from './components/PeriodTabs'
import SalaryInputs from './components/SalaryInputs'
import SetupHint from './components/SetupHint'
import Sidebar from './components/Sidebar'
import StatsRow from './components/StatsRow'
import { useAppState, useTheme } from './hooks'

const App: React.FC = () => {
  const {
    monthlySalary,
    monthlySalaryCurrency,
    earningsCurrency,
    workingHoursPerDay,
    workingDays,
    selectedPeriod,
    startHour,
    endHour,
    isSidebarOpen,
    earnings,
    handleSetMonthlySalary,
    handleMonthlySalaryBlur,
    handleSetMonthlySalaryCurrency,
    handleSetEarningsCurrency,
    handleSetWorkingHoursPerDay,
    handleSetWorkingDays,
    handleStartHourChange,
    handleEndHourChange,
    handleSettingsClick,
    handleCloseSidebar,
    handlePeriodChange,
  } = useAppState()
  useTheme()

  return (
    <>
      {/* Stopgap: the inputs live in the old sidebar until the settings sheet (Epic 5) */}
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar}>
        <SalaryInputs
          monthlySalary={monthlySalary}
          monthlySalaryCurrency={monthlySalaryCurrency}
          earningsCurrency={earningsCurrency}
          workingHoursPerDay={workingHoursPerDay}
          workingDays={workingDays}
          startHour={startHour}
          endHour={endHour}
          onMonthlySalaryChange={handleSetMonthlySalary}
          onMonthlySalaryBlur={handleMonthlySalaryBlur}
          onMonthlySalaryCurrencyChange={handleSetMonthlySalaryCurrency}
          onEarningsCurrencyChange={handleSetEarningsCurrency}
          onWorkingHoursPerDayChange={handleSetWorkingHoursPerDay}
          onWorkingDaysChange={handleSetWorkingDays}
          onStartHourChange={handleStartHourChange}
          onEndHourChange={handleEndHourChange}
        />
      </Sidebar>
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <Header onSettingsClick={handleSettingsClick} />
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
          <SetupHint onOpenSettings={handleSettingsClick} />
        )}
        <div className="mt-4">
          <PeriodTabs value={selectedPeriod} onChange={handlePeriodChange} />
        </div>
      </main>
    </>
  )
}

export default React.memo(App)
