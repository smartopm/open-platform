import React, { Fragment } from 'react'
import Nav from '../../components/Nav'
import CustodianTimeSheetLogs from '../../components/TimeTracker/CustodianTimeSheetLog'

export default function CustodianLogs() {
  return (
    <Fragment>
      <Nav navName="Time Cards" menuButton="back" backTo="/" />
      <br />
      <br />
      <CustodianTimeSheetLogs />
    </Fragment>
  )
}
