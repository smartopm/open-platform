/* eslint-disable react/prop-types */
import React from 'react'
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import EditIcon from '@material-ui/icons/Edit'
import VisibilityIcon from '@material-ui/icons/Visibility';
import PropTypes from 'prop-types'

// TODO: Reuse the toggler
export default function CampaignCreate({ campaignType, handleCampaignType }) {
  return (
    <>
      <ToggleButtonGroup
        value={campaignType}
        exclusive
        onChange={handleCampaignType}
        aria-label="text alignment"
        style={{ marginBottom: '10px' }}
      >
        <ToggleButton value="draft" aria-label="campaign draft">
          Draft
        </ToggleButton>
        <ToggleButton value="scheduled" aria-label="campaign schedule">
          Schedule
        </ToggleButton>
      </ToggleButtonGroup>
    </>
  )
}

export function FormToggle({ type, handleType }) {
  return (
    <>
      <ToggleButtonGroup
        value={type}
        exclusive
        onChange={handleType}
        aria-label="text alignment"
        style={{ marginBottom: '10px' }}
      >
        <ToggleButton value="preview" aria-label="preview">
          <VisibilityIcon />
        </ToggleButton>
        <ToggleButton value="edit" aria-label="edit">
          <EditIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </>
    )
}

CampaignCreate.propTypes = {
  campaignType: PropTypes.string.isRequired,
  handleCampaignType: PropTypes.func.isRequired
}

FormToggle.propTypes = {
  type: PropTypes.string.isRequired,
  handleType: PropTypes.func.isRequired
}

  
