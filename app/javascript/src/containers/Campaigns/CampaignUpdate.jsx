/* eslint-disable */
import React, { useContext } from 'react'
import { Redirect } from 'react-router-dom'
import {  useQuery } from 'react-apollo'
import { Campaign } from '../../graphql/queries'
import { Context as AuthStateContext } from '../Provider/AuthStateProvider.js'
import Loading from '../../components/Loading'
import Nav from '../../components/Nav'
import ErrorPage from '../../components/Error'
import CampaignForm from '../../components/CampaignForm'

export default function CampaignUpdate({ match }) {
  const authState = useContext(AuthStateContext)
  const { data, error, loading, refetch } = useQuery(Campaign, {
    variables: { id: match.params.id },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  })

  if (authState.user.userType !== 'admin') {
    return <Redirect push to="/" />
  }
  if (loading) return <Loading />
  if (error) return <ErrorPage />

  return (
    <>
      <Nav navName="Campaign Update" menuButton="back" backTo="/campaigns" />
      <CampaignForm authState={authState} data={data?.campaign} refetch={refetch} />
    </>
  )
}
