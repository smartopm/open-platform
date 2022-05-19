import React, { useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-apollo';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import { LeadDetailsQuery } from '../../../../graphql/queries';
import { Spinner } from '../../../../shared/Loading';
import CenteredContent from '../../../../shared/CenteredContent';
import LeadManagementForm from './LeadManagementForm';
import { objectAccessor, formatError } from '../../../../utils/helpers';
import { StyledTabs, StyledTab, TabPanel, a11yProps } from '../../../../components/Tabs';
import LeadEvents from './LeadEvents';
import LeadManagementTask from './LeadManagementTask';

export default function LeadManagementDetails({ userId }) {
  const { t } = useTranslation('common');
  const [tabValue, setTabValue] = useState(0);
  const { loading, error, data } = useQuery(LeadDetailsQuery, {
    variables: { id: userId },
    fetchPolicy: 'cache-and-network'
  });

  const TAB_VALUES = {
    details: 0,
    tasks: 1,
    events: 2
  };
  function handleTabValueChange(_event, newValue) {
    setTabValue(Number(newValue));
  }

  const Item = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1)
  }));

  if (loading) return <Spinner />;
  if (error) return <CenteredContent>{formatError(error.message)}</CenteredContent>;

  return (
    <Grid
      container
      style={{ display: 'flex', justifyContent: 'center' }}
      columns={{ xs: 12, md: 12 }}
    >
      <Grid item md={6} xs={10} data-testid="lead-management-container-header">
        <Item>
          <Typography variant="h5">{t('lead_management.main_header')}</Typography>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <StyledTabs
              value={tabValue}
              onChange={handleTabValueChange}
              aria-label="lead-management-tabs"
              data-testid="lead-management-tabs"
              variant="standard"
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
                  tabValue === objectAccessor(TAB_VALUES, 'details')
                    ? { fontSize: '10px', textAlign: 'left', borderBottom: 'solid 1px' }
                    : { fontSize: '10px', textAlign: 'left' }
                }
                {...a11yProps(1)}
              />

              <StyledTab
                label={t('lead_management.event_header')}
                style={
                  tabValue === objectAccessor(TAB_VALUES, 'events')
                    ? { fontSize: '10px', borderBottom: 'solid 1px' }
                    : { fontSize: '10px' }
                }
                {...a11yProps(1)}
              />
            </StyledTabs>
          </Box>

          <TabPanel value={tabValue} index={0} data-testid="lead-management-details-tab">
            {data && <LeadManagementForm data={data} />}
          </TabPanel>
          <TabPanel value={tabValue} index={1} data-testid="lead-management-task-tab">
            <LeadManagementTask taskId={data?.user?.taskId} tabValue={tabValue} />
          </TabPanel>

          <TabPanel value={tabValue} index={2} data-testid="lead-management-event-tab">
            <LeadEvents userId={userId} data={data} />
          </TabPanel>
        </Item>
      </Grid>
    </Grid>
  );
}

LeadManagementDetails.propTypes = {
  userId: PropTypes.string.isRequired
};
