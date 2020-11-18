import React from 'react'
import { Grid, Select, MenuItem, Typography, Button } from '@material-ui/core'
import PropTypes from 'prop-types'
import CampaignIcon from './Campaign/CampaignIcon'

export default function UserActionMenu({
  campaignCreateOption,
  setCampaignCreateOption,
  handleCampaignCreate
}) {
  return (
    <Grid container>
      <Grid item style={{ display: 'flex' }}>
        <Typography> Select </Typography>
        <Select
          labelId="user-action-select"
          id="user-action-select"
          value={campaignCreateOption}
          onChange={event => setCampaignCreateOption(event.target.value)}
          style={{ height: '23px', marginLeft: '10px' }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="all_on_the_page">All on this page</MenuItem>
          <MenuItem value="none">None</MenuItem>
        </Select>
      </Grid>
      {campaignCreateOption !== 'none' && (
        <Grid item style={{ marginLeft: '20px', marginTop: '-4px' }}>
          <Button
            onClick={handleCampaignCreate}
            color="primary"
            startIcon={<CampaignIcon />}
            style={{ textTransform: 'none' }}
          >
            Create Campaign
          </Button>
        </Grid>
      )}
    </Grid>
  )
}

UserActionMenu.propTypes = {
  campaignCreateOption: PropTypes.string.isRequired,
  setCampaignCreateOption: PropTypes.func.isRequired,
  handleCampaignCreate: PropTypes.func.isRequired
}
