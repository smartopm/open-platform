/* eslint-disable no-use-before-define */
import React, { useContext } from 'react'
import { Context as AuthStateContext } from './Provider/AuthStateProvider'
import Loading from '../shared/Loading'
import Homepage from '../components/HomePage'
import NewsFeed from '../components/NewsPage/NewsFeed'
import { TaskReminder } from '../modules/Tasks'
import { PaymentSummary } from '../modules/Payments'

export default function Home() {
  const authState = useContext(AuthStateContext)

  if (!authState.loggedIn) return <Loading />
  return (
    <div style={{backgroundColor: '#FFFFFF'}}>
      <br />
      <br />
      <NewsFeed />
      <br />
      {authState.user.userType === 'admin' && (
        <div>
          <PaymentSummary />
          <br />
          <TaskReminder id={authState.user.id} />
        </div>
      )}
      <Homepage authState={authState} />
    </div>
  )
}
