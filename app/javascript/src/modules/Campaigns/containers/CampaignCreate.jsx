import React, { useContext } from 'react'
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider'
import CampaignForm from '../components/CampaignForm'

export default function CampaignCreate() {
    const authState = useContext(AuthStateContext)
    return (
      <>
        <div className="container">
          <CampaignForm authState={authState} />
        </div>
      </>
    )
}