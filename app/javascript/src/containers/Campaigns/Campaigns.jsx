import React, { useContext } from 'react'
import Nav from '../../components/Nav'
import { Context as AuthStateContext } from '../Provider/AuthStateProvider.js'
import CampaignList from '../../components/CampaignList'

export default function Campaigns() {
  const authState = useContext(AuthStateContext)
  return (
    <>
      <Nav navName="Campaigns" menuButton="back" backTo="/" />
      <CampaignList authState={authState} />
    </>
  )
}
