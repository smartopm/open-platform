/* eslint-disable no-use-before-define */
import React, { useContext } from 'react'
import Divider from '@material-ui/core/Divider';
import { Context as AuthStateContext } from './Provider/AuthStateProvider'
import Loading from '../shared/Loading'
import Homepage from '../components/HomePage'
import NewsFeed from '../components/NewsPage/NewsFeed'
import { TaskReminder } from '../modules/Tasks'
import { PaymentSummary } from '../modules/Payments'
import UserDetail from '../modules/Users/Components/UserDetail'
import ViewCustomerJourney from '../modules/CustomerJourney/Components/ViewCustomerJourney'

export default function Home() {
  const authState = useContext(AuthStateContext)

  if (!authState.loggedIn) return <Loading />
  return (
    <div style={{backgroundColor: '#FFFFFF', marginTop: '-30px'}}>
      {authState.user.userType === 'admin' && (
        <div>
          <UserDetail user={authState.user} />
          <ViewCustomerJourney />
          <PaymentSummary authState={authState} />
          <br />
          <Divider />
          <TaskReminder />
          <Divider />
          <NewsFeed />
        </div>
      )}
      {authState.user.userType !== 'admin' && (
        <div>
          <NewsFeed />
          <Homepage authState={authState} />
        </div>
      )}
    </div>
  )
}
