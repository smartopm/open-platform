import React, { useContext, useState } from 'react'
import Nav from "../../components/Nav";
import { Context as AuthStateContext } from '../Provider/AuthStateProvider'
import CampaignForm from '../../components/CampaignForm'
import CampaignToggle from '../../components/Campaign/ToggleButton'

export default function CampaignCreate() {
    const authState = useContext(AuthStateContext)
    const [campaignType, setCampaignType] = useState("schedule")
    const handleCampaignType = (event, newCampaignType) => {
        setCampaignType(newCampaignType);
    };
    return (
      <>
        <Nav navName="Campaign" menuButton="back" backTo="/campaigns" />
        <div className="container">
          <CampaignToggle campaignType={campaignType} handleCampaignType={handleCampaignType} />
          <CampaignForm authState={authState} campaignCreateType={campaignType} />
        </div>
      </>
    )
}