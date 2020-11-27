import React, { useState } from 'react'
import {
  Grid,
  Select,
  MenuItem,
  Typography,
  Button,
  Checkbox
} from '@material-ui/core'
import PropTypes from 'prop-types'
import LabelIcon from '@material-ui/icons/Label'
import CampaignIcon from './Campaign/CampaignIcon'
import { CustomizedDialogs, WarningDialog } from './Dialog'
import CreateLabel from './CreateLabel'

const USERS_LABEL_WARNING_LIMIT = 2000
export default function UsersActionMenu({
  campaignCreateOption,
  setCampaignCreateOption,
  setSelectAllOption,
  handleCampaignCreate,
  handleLabelSelect,
  usersCountData,
  selectedUsers,
  userList
}) {
  const [labelSelectModalOpen, setLabelSelectModalOpen] = useState(false)
  const [labelAssignWarningOpen, setLabelAssignWarningOpen] = useState(false)
  const [selectedLabels, setSelectedLabels] = useState([])

  function openLabelSelectModal() {
    setLabelSelectModalOpen(true)
  }

  function handleAssignLabel() {
    if (
      campaignCreateOption === 'all' &&
      usersCountData.usersCount > USERS_LABEL_WARNING_LIMIT
    ) {
      setLabelAssignWarningOpen(true)
      return
    }
    handleLabelSelect(selectedLabels)
  }

  function isAllSelected() {
    return (
      !!selectedUsers.length &&
      !!userList.length &&
      selectedUsers.length === userList.length
    )
  }

  return (
    <Grid container>
      <CustomizedDialogs
        open={labelSelectModalOpen}
        handleModal={() => setLabelSelectModalOpen(false)}
        dialogHeader=""
        handleBatchFilter={handleAssignLabel}
        saveAction="Assign"
        disableActionBtn={selectedLabels.length === 0}
      >
        <CreateLabel handleLabelSelect={labels => setSelectedLabels(labels)} />
      </CustomizedDialogs>
      <WarningDialog
        open={labelAssignWarningOpen}
        handleClose={() => setLabelAssignWarningOpen(false)}
        handleOnSave={() => handleLabelSelect(selectedLabels)}
        message={`You are about to assign labels to 2000+ users. We recommend using
          a smaller list. Do you still want to proceed?`}
      />
      <Grid item style={{ display: 'flex' }}>
        <Grid>
          <Checkbox
            checked={isAllSelected()}
            onChange={setSelectAllOption}
            name="includeReplyLink"
            data-testid="reply_link"
            color="primary"
            style={{ padding: '0px', marginRight: '15px' }}
          />
        </Grid>
        <Typography> Select </Typography>
        <Grid>
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
      </Grid>
      {(campaignCreateOption !== 'none' || selectedUsers.length > 0) && (
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
  handleLabelSelect: PropTypes.func.isRequired,
  setSelectAllOption: PropTypes.func.isRequired,
  selectedUsers: PropTypes.arrayOf(PropTypes.number).isRequired,
  userList: PropTypes.arrayOf(PropTypes.number).isRequired,
  usersCountData: PropTypes.shape({
    usersCount: PropTypes.number.isRequired
  }).isRequired
}
