import React, { useContext } from 'react'
import {  useQuery } from 'react-apollo'
import CommunitySettingsPage from './Settings'
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider'
import { CommunityQuery } from '../../../graphql/queries/community'
import Loading from '../../../shared/Loading'
import ErrorPage from '../../../components/Error'

export default function CommunitySettings(){
  const authState = useContext(AuthStateContext)
  const { data, error, loading, refetch } = useQuery(CommunityQuery, {
    variables: { id: authState?.user?.community?.id },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  })

  if (loading) return <Loading />
  if (error) return <ErrorPage />
  return (
    <>
      <div className="container">
        <CommunitySettingsPage data={data.community} refetch={refetch} token={authState.token} />
      </div>
    </>
  )
}