import React, { useContext } from 'react'
import { Context as AuthStateContext } from '../Provider/AuthStateProvider'
import CampaignList from '../../components/CampaignList'
import AdminWrapper from '../../shared/AdminWrapper'

export default function Campaigns() {
  const authState = useContext(AuthStateContext)
  return (
    <AdminWrapper>
      <CampaignList authState={authState} />
    </AdminWrapper>
  )
}
