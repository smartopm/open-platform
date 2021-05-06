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
import { useTranslation } from 'react-i18next'
import { CustomizedDialogs, ActionDialog } from '../../../components/Dialog'
import CreateLabel from '../../../components/CreateLabel'
import CampaignIcon from '../../../components/Campaign/CampaignIcon'

// TODO: @olivier ==> Find a way to reuse this for other similar actions like we have on tasks
const USERS_LABEL_WARNING_LIMIT = 2000
export default function UsersActionMenu({
  campaignCreateOption,
  setCampaignCreateOption,
  setSelectAllOption,
  handleCampaignCreate,
  handleLabelSelect,
  usersCountData,
  selectedUsers,
  userList,
  selectCheckBox
}) {
  const [labelSelectModalOpen, setLabelSelectModalOpen] = useState(false)
  const [labelAssignWarningOpen, setLabelAssignWarningOpen] = useState(false)
  const [selectedLabels, setSelectedLabels] = useState([])
  const { t } = useTranslation(['users', 'common'])

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
        saveAction={t('common:form_actions.assign')}
        disableActionBtn={selectedLabels.length === 0}
      >
        <CreateLabel handleLabelSelect={labels => setSelectedLabels(labels)} />
      </CustomizedDialogs>
      <ActionDialog
        open={labelAssignWarningOpen}
        handleClose={() => setLabelAssignWarningOpen(false)}
        handleOnSave={() => handleLabelSelect(selectedLabels)}
        message={t('users.label_message')}
      />
      <Grid item style={{ display: 'flex' }}>
        <Grid>
          <Checkbox
            checked={isAllSelected() || selectCheckBox}
            onChange={setSelectAllOption}
            name="includeReplyLink"
            data-testid="reply_link"
            color="primary"
            style={{ padding: '0px', marginRight: '15px' }}
          />
        </Grid>
        <Typography> 
          {' '}
          {t('common:misc.select')}
          {' '}
        </Typography>
        <Grid>
          <Select
            labelId="user-action-select"
            id="user-action-select"
            value={campaignCreateOption}
            onChange={event => setCampaignCreateOption(event.target.value)}
            style={{ height: '23px', marginLeft: '10px' }}
          >
            <MenuItem value="all">{t('common:misc.all')}</MenuItem>
            <MenuItem value="all_on_the_page">{t('common:misc.all_this_page')}</MenuItem>
            <MenuItem value="none">{t('common:misc.none')}</MenuItem>
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
            {t('common:form_actions.assign_label')}
          </Button>
          <Button
            onClick={handleCampaignCreate}
            color="primary"
            startIcon={<CampaignIcon />}
            style={{ textTransform: 'none' }}
          >
            {t('common:form_actions.create_campaign')}
          </Button>
        </Grid>
      )}
    </Grid>
  )
}

UsersActionMenu.defaultProps = {
  usersCountData: {
    usersCount: 0
  }
};

UsersActionMenu.propTypes = {
  campaignCreateOption: PropTypes.string.isRequired,
  setCampaignCreateOption: PropTypes.func.isRequired,
  handleCampaignCreate: PropTypes.func.isRequired,
  handleLabelSelect: PropTypes.func.isRequired,
  setSelectAllOption: PropTypes.func.isRequired,
  selectedUsers: PropTypes.arrayOf(PropTypes.string).isRequired,
  userList: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectCheckBox: PropTypes.bool.isRequired,
  usersCountData: PropTypes.shape({
    usersCount: PropTypes.number.isRequired
  })
}
