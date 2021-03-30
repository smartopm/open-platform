/* eslint-disable no-use-before-define */
import React, { useContext } from 'react'
import { Context as AuthStateContext } from './Provider/AuthStateProvider'
import Loading from '../shared/Loading'
import Homepage from '../components/HomePage'
import NewsFeed from '../components/NewsPage/NewsFeed'

export default function Home() {
  const authState = useContext(AuthStateContext)

  if (!authState.loggedIn) return <Loading />
  return (
    <>
      <br />
      <br />
      <NewsFeed />
      <br />
      <Homepage authState={authState} />
    </>
  )
}
