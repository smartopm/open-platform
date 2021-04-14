import React, { useContext } from 'react'
import {  useQuery } from 'react-apollo'
import CommunitySettingsPage from './Settings'
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider'
import { Spinner } from '../../../shared/Loading'
import ErrorPage from '../../../components/Error'
import { CurrentCommunityQuery } from '../graphql/community_query'

export default function CommunitySettings(){
  const authState = useContext(AuthStateContext)
  const { data, error, loading, refetch } = useQuery(CurrentCommunityQuery, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  })

  if (loading) return <Spinner />
  if (error) return <ErrorPage />
  return (
    <>
      <div className="container">
        <CommunitySettingsPage data={data.currentCommunity} refetch={refetch} token={authState.token} />
      </div>
    </>
  )
}