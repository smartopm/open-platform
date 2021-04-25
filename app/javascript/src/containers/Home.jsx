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

export default function Home() {
  const authState = useContext(AuthStateContext)

  if (!authState.loggedIn) return <Loading />
  return (
    <div style={{backgroundColor: '#FFFFFF'}}>
      {authState.user.userType === 'admin' && (
        <div>
          <UserDetail user={authState.user} />
          <PaymentSummary authState={authState} />
          <br />
          <Divider />
          <TaskReminder />
          <Divider />
          <NewsFeed />
        </div>
      )}
      {authState.user.userType !== 'admin' && (
        <Homepage authState={authState} />
      )}
    </div>
  )
}
