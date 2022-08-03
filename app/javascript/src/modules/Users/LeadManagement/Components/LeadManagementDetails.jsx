import React, { useState } from 'react';
import { Grid, Typography, Container, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-apollo';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import orderBy from 'lodash/orderBy';
import { LeadDetailsQuery, LeadLabelsQuery } from '../../../../graphql/queries';
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
  const { loading, error, data, refetch } = useQuery(LeadDetailsQuery, {
    variables: { id: userId },
    fetchPolicy: 'cache-and-network',
  });

  const isMobile = useMediaQuery('(max-width:800px)');

  const {
    loading: leadLabelsLoading,
    refetch: refetchLeadLabelsData,
    error: leadLabelsError,
    data: LeadLabelsData,
  } = useQuery(LeadLabelsQuery, {
    variables: { userId },
    fetchPolicy: 'cache-and-network',
  });

  const sortedLabels = orderBy(
    LeadLabelsData?.leadLabels,
    [
      function(item) {
        return item.groupingName === 'Investment';
      }
    ],
    ['asc']
  );

  const TAB_VALUES = {
    details: 0,
    tasks: 1,
    events: 2,
  };
  function handleTabValueChange(_event, newValue) {
    setTabValue(Number(newValue));
  }

  if (loading || leadLabelsLoading) return <Spinner />;
  const err = error || leadLabelsError;
  if (err) return <CenteredContent>{formatError(err.message)}</CenteredContent>;

  return (
    <Grid
      container
      style={{ display: 'flex', justifyContent: 'center' }}
      columns={{ xs: 12, md: 12 }}
    >
      <Grid item md={6} xs={10} data-testid="lead-management-container-header">
        <Grid
          container
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Grid item md={4} xs={12}>
            <Typography variant="h5">{t('lead_management.main_header')}</Typography>
          </Grid>
          <Grid item md={8} xs={12}>
            <Container
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                marginRight: !isMobile && '-50px',
                paddingLeft: isMobile && 0,
                marginTop: isMobile && 6,
                justifyContent: !isMobile && 'end',
              }}
            >
              {sortedLabels.map(labelsData => (
                <p key={labelsData.id}>
                  <span
                    style={{
                      background: 'white',
                      color: labelsData.color,
                      marginTop: 20,
                      fontSize: '12px',
                      width: '100%',
                      padding: '8px',
                      borderTop: '1px solid',
                      borderLeft: '1px solid',
                      borderColor: labelsData.color,
                      borderBottom: '1px solid',
                      borderTopLeftRadius: '16px',
                      borderBottomLeftRadius: '16px',
                    }}
                  >
                    {' '}
                    {labelsData?.groupingName}
                  </span>
                  <span
                    style={{
                      background: labelsData?.color,
                      color: 'white',
                      fontSize: '12px',
                      width: '100%',
                      padding: '9px',
                      borderTopRightRadius: '16px',
                      borderBottomRightRadius: '16px',
                      marginRight: '10px',
                    }}
                  >
                    {labelsData?.shortDesc}
                  </span>
                </p>
              ))}
            </Container>
          </Grid>
        </Grid>
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
                  ? { fontSize: '10px', textAlign: 'left', borderBottom: 'solid 1px' }
                  : { fontSize: '10px', textAlign: 'left' }
              }
              {...a11yProps(1)}
            />
          </StyledTabs>
        </Box>

        <TabPanel value={tabValue} index={0} data-testid="lead-management-details-tab">
          {data && (
            <LeadManagementForm
              data={data}
              refetchLeadLabelsData={refetchLeadLabelsData}
              refetch={refetch}
            />
          )}
        </TabPanel>
        <TabPanel value={tabValue} index={1} data-testid="lead-management-task-tab">
          <LeadManagementTask taskId={data?.user?.taskId} tabValue={tabValue} />
        </TabPanel>

        <TabPanel value={tabValue} index={2} data-testid="lead-management-event-tab">
          <LeadEvents
            userId={userId}
            data={data}
            refetch={refetch}
            refetchLeadLabelsData={refetchLeadLabelsData}
          />
        </TabPanel>
      </Grid>
    </Grid>
  );
}

LeadManagementDetails.propTypes = {
  userId: PropTypes.string.isRequired,
};
