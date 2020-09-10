import React, { useContext, useState } from 'react'
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Nav from "../../components/Nav";
// eslint-disable-next-line import/extensions
import { Context as AuthStateContext } from '../Provider/AuthStateProvider.js'
import CampaignForm from '../../components/CampaignForm'

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
          <ToggleButtonGroup
            value={campaignType}
            exclusive
            onChange={handleCampaignType}
            aria-label="text alignment"
          >
            <ToggleButton value="draft" aria-label="campaign draft">
              Draft
            </ToggleButton>
            <ToggleButton value="schedule" aria-label="campaign schedule">
              Schedule
            </ToggleButton>
          </ToggleButtonGroup>
          <CampaignForm authState={authState} campaignCreateType={campaignType} />
        </div>
      </>
    )
}