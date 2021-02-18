import React from 'react'
import Nav from '../../components/Nav'
import Accounting from '../../components/Accounting/AccountingDashboard'

export default function AccountingDashboard(){
    return (
      <div>
        <>
          <Nav navName="Accounting Report" menuButton="back" backTo="/" />
          <Accounting />
        </>
      </div>
    )
}