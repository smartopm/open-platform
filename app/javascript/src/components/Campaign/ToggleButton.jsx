import React from 'react'
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';


export default function CampaignCreate({ campaignType, handleCampaignType }) {
  return (
    <>
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
    </>
    )
}
  