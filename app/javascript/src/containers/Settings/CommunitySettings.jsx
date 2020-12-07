import React, { useContext } from 'react'
import {  useQuery } from 'react-apollo'
import CommunitySettingsPage from '../../components/Community/CommunitySettings'
import Nav from '../../components/Nav'
import { Context as AuthStateContext } from '../Provider/AuthStateProvider'
import { CommunityQuery } from '../../graphql/queries'
import Loading from '../../components/Loading'
import ErrorPage from '../../components/Error'

export default function CommunitySettings(){
  const authState = useContext(AuthStateContext)
  const { data, error, loading, refetch } = useQuery(CommunityQuery, {
    variables: { id: authState.user.community.id },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  })
  
  if (loading) return <Loading />
  if (error) return <ErrorPage />
  return (
    <>
      <Nav
        navName="Community Settings"
        menuButton="back"
        backTo='/'
      />
      <div className="container">
        {console.log(data)}
        <CommunitySettingsPage data={data} refetch={refetch} /> 
      </div>
    </>
  )
}