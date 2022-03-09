import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { useLazyQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import CenteredContent from '../../../shared/CenteredContent';
import { LogbookStatsQuery } from '../graphql/guestbook_queries';
import { Spinner } from '../../../shared/Loading';
import CardComponent from '../../../shared/Card';
import useLogbookStyles from '../styles';


export default function LogbookStats({ tabValue, shouldRefetch, isSmall }) {
  const { t } = useTranslation('logbook');
  const [loadStats, { data, loading }] = useLazyQuery(LogbookStatsQuery, {
    fetchPolicy: 'cache-and-network'
  });
  const classes = useLogbookStyles();

  useEffect(() => {
    if (tabValue === 2) {
      loadStats();
    }
  }, [tabValue, loadStats, shouldRefetch]);

  const statsData = [
    {
      title: t('logbook.total_entries'),
      count: data?.communityPeopleStatistics.peopleEntered,
      id: 'total_entries'
    },
    {
      title: t('logbook.total_exits'),
      count: data?.communityPeopleStatistics.peopleExited,
      id: 'total_exits'
    },
    {
      title: t('logbook.total_in_city'),
      count: data?.communityPeopleStatistics.peoplePresent,
      id: 'total_in_city'
    }
  ];

  if (loading) return <Spinner />;
  return (
    <Grid container spacing={isSmall ? 1 : 4}>
      {statsData.map(stat => (
        <Grid item xs={4} key={stat.id}>
          <CardComponent className={classes.statCard}>
            <CenteredContent>
              <Typography gutterBottom variant="caption" data-testid="stats_title">
                {stat.title}
              </Typography>
            </CenteredContent>
            <CenteredContent>
              <Typography variant="h3" component="div" gutterBottom data-testid="stats_count">
                {stat.count}
              </Typography>
            </CenteredContent>
          </CardComponent>
        </Grid>
      ))}
    </Grid>
  );
}

LogbookStats.propTypes = {
  tabValue: PropTypes.number.isRequired,
  shouldRefetch: PropTypes.bool.isRequired
};
