import React, { useState } from 'react'
import { Grid, Select, MenuItem, Typography, Button } from '@material-ui/core'
import PropTypes from 'prop-types'
import LabelIcon from '@material-ui/icons/Label'
import CampaignIcon from './Campaign/CampaignIcon'
import { CustomizedDialogs } from './Dialog'
import CreateLabel from './CreateLabel'

export default function UsersActionMenu({
  campaignCreateOption,
  setCampaignCreateOption,
  handleCampaignCreate,
  handleLabelSelect
}) {
  const [labelSelectModalOpen, setLabelSelectModalOpen] = useState(false)

  function openLabelSelectModal() {
    setLabelSelectModalOpen(true)
  }

  return (
    <Grid container>
      <CustomizedDialogs
        open={labelSelectModalOpen}
        handleModal={() => setLabelSelectModalOpen(false)}
        dialogHeader=""
        hideActionBtns
        handleBatchFilter={() => {}}
      >
        <CreateLabel handleLabelSelect={handleLabelSelect} />
      </CustomizedDialogs>
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
            onClick={openLabelSelectModal}
            color="primary"
            startIcon={<LabelIcon fontSize="large" />}
            style={{ textTransform: 'none' }}
          >
            Assign Label
          </Button>
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

UsersActionMenu.propTypes = {
  campaignCreateOption: PropTypes.string.isRequired,
  setCampaignCreateOption: PropTypes.func.isRequired,
  handleCampaignCreate: PropTypes.func.isRequired,
  handleLabelSelect: PropTypes.func.isRequired
}
