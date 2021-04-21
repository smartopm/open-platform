/* eslint-disable no-use-before-define */
import React, { useContext } from 'react'
import { Context as AuthStateContext } from './Provider/AuthStateProvider'
import Loading from '../shared/Loading'
import Homepage from '../components/HomePage'
import NewsFeed from '../components/NewsPage/NewsFeed'
import { TaskReminder } from '../modules/Tasks'

export default function Home() {
  const authState = useContext(AuthStateContext)

  if (!authState.loggedIn) return <Loading />
  return (
    <>
      <br />
      <br />
      <NewsFeed />
      <br />
      {authState.user.userType === 'admin' && (
        <TaskReminder id={authState.user.id} />
      )}
      <br />
      <Homepage authState={authState} />
    </>
  )
}
