import React, { useContext } from 'react'
import Nav from '../../components/Nav'
import Accounting from '../../components/Accounting/AccountingDashboard'
import { Context } from '../Provider/AuthStateProvider'
import { currencies } from '../../utils/constants';

export default function AccountingDashboard(){
  const authState = useContext(Context)
  const currency = currencies[authState.user?.community.currency] || '';
    return (
      <div>
        <>
          <Nav navName="Accounting Report" menuButton="back" backTo="/" />
          <Accounting currency={currency} />
        </>
      </div>
    )
}