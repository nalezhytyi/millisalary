import React from 'react'
import EarningsSummary from './components/EarningsSummary'
import Header from './components/Header'
import SalaryInputs from './components/SalaryInputs'
import Sidebar from './components/Sidebar'
import { useAppState, useBackground } from './hooks'

const App: React.FC = () => {
  const {
    monthlySalary,
    monthlySalaryCurrency,
    earningsCurrency,
    workingHoursPerDay,
    workingDays,
    startHour,
    endHour,
    isSidebarOpen,
    currentEarnings,
    monthEarnings,
    dayEarnings,
    totalDayEarnings,
    exchangeRate,
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
  } = useAppState()
  const { background, backgroundComponent, handleBackgroundChange } =
    useBackground()

  return (
    <>
      <div className="fixed inset-0 -z-10">{backgroundComponent}</div>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        selectedBackground={background}
        onBackgroundChange={handleBackgroundChange}
      />
      <Header onSettingsClick={handleSettingsClick} />
      <div className="container mx-auto max-w-md p-4">
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
        <EarningsSummary
          currentEarnings={currentEarnings}
          dayEarnings={dayEarnings}
          totalDayEarnings={totalDayEarnings}
          monthEarnings={monthEarnings}
          earningsCurrency={earningsCurrency}
          exchangeRate={exchangeRate}
          monthlySalaryCurrency={monthlySalaryCurrency}
        />
      </div>
    </>
  )
}

export default App
