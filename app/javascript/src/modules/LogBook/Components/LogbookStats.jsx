import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { useLazyQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import CenteredContent from '../../../shared/CenteredContent';
import { LogbookStatsQuery } from '../graphql/guestbook_queries';
import { Spinner } from '../../../shared/Loading';

export default function LogbookStats({ tabValue, shouldRefetch }) {
  const { t } = useTranslation('logbook');
  const [loadStats, { data, loading, error }] = useLazyQuery(LogbookStatsQuery, {
    fetchPolicy: 'cache-and-network'
  });

  useEffect(() => {
    if (tabValue === 2) {
      loadStats();
    }
  }, [tabValue, loadStats, shouldRefetch]);

  return (
    <Grid container>
      {loading ? (
        <Spinner />
      ) : (
        <Grid item xs={12} md={3}>
          <CenteredContent>
            <Typography gutterBottom variant="caption" data-testid="stats_title">
              {t('logbook.total_in_city')}
            </Typography>
          </CenteredContent>
          <CenteredContent>
            <Typography variant="h1" component="div" gutterBottom data-testid="stats_count">
              {error || !data?.communityPeopleStatistics.peoplePresent
                ? 0
                : data?.communityPeopleStatistics.peoplePresent}
            </Typography>
          </CenteredContent>
        </Grid>
      )}
    </Grid>
  );
}

LogbookStats.propTypes = {
  tabValue: PropTypes.number.isRequired,
  shouldRefetch: PropTypes.bool.isRequired
};
