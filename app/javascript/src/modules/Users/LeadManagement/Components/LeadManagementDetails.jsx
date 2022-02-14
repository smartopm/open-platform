import React, { useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import LeadManagementForm from './LeadManagementForm';
import { objectAccessor } from '../../../../utils/helpers';
import { StyledTabs, StyledTab, TabPanel, a11yProps } from '../../../../components/Tabs';
import UserNotes from '../../Components/UserNote';

export default function LeadManagementDetails({ userId }) {
  const { t } = useTranslation('common');
  const [tabValue, setTabValue] = useState(0);

  const TAB_VALUES = {
    details: 0,
    task: 1,
    notes: 2
  };
  function handleTabValueChange(_event, newValue) {
    setTabValue(Number(newValue));
  }

  const Item = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1)
  }));

  return (
    <Grid
      container
      style={{ display: 'flex', justifyContent: 'center' }}
      columns={{ xs: 12, md: 12 }}
    >
      <Grid item md={6} xs={10} data-testid="lead-management-container-header">
        <Item>
          <Typography variant="h5">{t('lead_management.main_header')}</Typography>

          <StyledTabs
            value={tabValue}
            onChange={handleTabValueChange}
            aria-label="lead-management-tabs"
            data-testid="lead-management-tabs"
            variant="standard"
            style={{ borderBottom: 'solid 1px #ececea' }}
          >
            <StyledTab
              label={t('lead_management.detail_header')}
              style={
                tabValue === objectAccessor(TAB_VALUES, 'details')
                  ? { fontSize: '10px', textAlign: 'left', borderBottom: 'solid 1px' }
                  : { fontSize: '10px', textAlign: 'left' }
              }
              {...a11yProps(0)}
            />
            <StyledTab
              label={t('lead_management.task_header')}
              style={
                tabValue === objectAccessor(TAB_VALUES, 'task')
                  ? { fontSize: '10px', borderBottom: 'solid 1px' }
                  : { fontSize: '10px' }
              }
              {...a11yProps(1)}
            />
            <StyledTab
              label={t('lead_management.note_header')}
              style={
                tabValue === objectAccessor(TAB_VALUES, 'notes')
                  ? { fontSize: '10px', borderBottom: 'solid 1px' }
                  : { fontSize: '10px' }
              }
              {...a11yProps(2)}
            />
          </StyledTabs>

          <TabPanel value={tabValue} index={0} data-testid="lead-management-details-tab">
            <LeadManagementForm userId={userId} />
          </TabPanel>
          <TabPanel value={tabValue} index={1} data-testid="lead-management-task-tab">
            <></>
          </TabPanel>
          <TabPanel value={tabValue} index={2} data-testid="lead-management-note-tab">
            <UserNotes userId={userId} tabValue={tabValue} />
          </TabPanel>
        </Item>
      </Grid>
    </Grid>
  );
}

LeadManagementDetails.propTypes = {
  userId: PropTypes.string.isRequired
};
