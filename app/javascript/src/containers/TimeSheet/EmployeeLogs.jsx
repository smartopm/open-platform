import React, { Fragment } from 'react'
import Nav from '../../components/Nav'
import EmployeeTimeSheetLogs from '../../components/TimeTracker/EmployeeTimeSheetLog'

export default function EmployeeLogs() {
  return (
    <Fragment>
      <Nav navName="TimeSheet" menuButton="back" backTo={`/timesheet/`} />
      <br />
      <br />
      <EmployeeTimeSheetLogs />
    </Fragment>
  )
}
