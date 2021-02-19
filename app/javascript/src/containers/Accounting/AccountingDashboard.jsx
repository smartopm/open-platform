import React, { useContext } from 'react'
import Nav from '../../components/Nav'
import Accounting from '../../components/Accounting/AccountingDashboard'
import { Context } from '../Provider/AuthStateProvider'

export default function AccountingDashboard(){
  const authState = useContext(Context)
    return (
      <div>
        <>
          <Nav navName="Accounting Report" menuButton="back" backTo="/" />
          <Accounting userId={authState.user.id} />
        </>
      </div>
    )
}