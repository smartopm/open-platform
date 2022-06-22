import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import LabelIcon from '@mui/icons-material/Label';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/styles';
import { CustomizedDialogs, ActionDialog } from '../../../components/Dialog';
import CreateLabel from '../../Labels/Components/CreateLabel';
import CampaignIcon from '../../Campaigns/components/CampaignIcon';
import MessageAlert from '../../../components/MessageAlert';

const USERS_LABEL_WARNING_LIMIT = 2000;
export default function UsersActionMenu({
  campaignCreateOption,
  handleCampaignCreate,
  handleLabelSelect,
  usersCountData,
  selectedUsers,
  labelsData,
  labelsRefetch,
  copyToClipBoard
}) {
  const [labelSelectModalOpen, setLabelSelectModalOpen] = useState(false);
  const [labelAssignWarningOpen, setLabelAssignWarningOpen] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ isError: false, detail: '' });
  const { t } = useTranslation(['users', 'common']);
  const theme = useTheme();

  function openLabelSelectModal() {
    setLabelSelectModalOpen(true);
  }

  function handleAssignLabel() {
    if (usersCountData.usersCount > USERS_LABEL_WARNING_LIMIT) {
      setLabelAssignWarningOpen(true);
      return;
    }
    setLoading(true);
    handleLabelSelect(selectedLabels);
  }

  return (
    <Grid container data-testid='user_action'>
      <MessageAlert
        type={message.isError ? 'error' : 'success'}
        message={message.detail}
        open={!!message.detail}
        handleClose={() => setMessage({ ...message, detail: '' })}
      />
      <CustomizedDialogs
        open={labelSelectModalOpen}
        handleModal={() => setLabelSelectModalOpen(false)}
        dialogHeader=""
        handleBatchFilter={handleAssignLabel}
        saveAction={t('common:form_actions.assign')}
        disableActionBtn={selectedLabels.length === 0}
        actionLoading={loading}
      >
        <CreateLabel
          handleLabelSelect={labels => setSelectedLabels(labels)}
          loading={loading}
          setLoading={setLoading}
          setMessage={setMessage}
          data={labelsData}
          refetch={labelsRefetch}
        />
      </CustomizedDialogs>
      <ActionDialog
        open={labelAssignWarningOpen}
        handleClose={() => setLabelAssignWarningOpen(false)}
        handleOnSave={() => handleLabelSelect(selectedLabels)}
        message={t('users.label_message')}
      />
      {(campaignCreateOption !== 'none' || selectedUsers.length > 0) && (
        <Grid item>
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
            startIcon={<CampaignIcon primaryColor={theme.palette.primary.main} />}
            style={{ textTransform: 'none' }}
          >
            {t('common:form_actions.create_campaign')}
          </Button>
          {selectedUsers.length > 0 && (
            <Button
              onClick={copyToClipBoard}
              color="primary"
              style={{ textTransform: 'none' }}
              data-testid='copy-id'
            >
              {t('common:form_actions.copy_id')}
            </Button>
          )}
        </Grid>
      )}
    </Grid>
  );
}

UsersActionMenu.defaultProps = {
  usersCountData: {
    usersCount: 0
  }
};

UsersActionMenu.propTypes = {
  campaignCreateOption: PropTypes.string.isRequired,
  handleCampaignCreate: PropTypes.func.isRequired,
  handleLabelSelect: PropTypes.func.isRequired,
  selectedUsers: PropTypes.arrayOf(PropTypes.string).isRequired,
  usersCountData: PropTypes.shape({
    usersCount: PropTypes.number.isRequired
  }),
  labelsData: PropTypes.shape({
    labels: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        shortDesc: PropTypes.string
      })
    )
  }).isRequired,
  labelsRefetch: PropTypes.func.isRequired,
  copyToClipBoard: PropTypes.func.isRequired
};
