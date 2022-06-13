import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { useLazyQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { MenuItem, TextField } from '@mui/material';
import CenteredContent from '../../../shared/CenteredContent';
import { LogbookStatsQuery } from '../graphql/guestbook_queries';
import { Spinner } from '../../../shared/Loading';
import CardComponent from '../../../shared/Card';
import useLogbookStyles from '../styles';


export default function LogbookStats({ tabValue, shouldRefetch, handleFilter, duration, isSmall }) {
  const { t } = useTranslation(['logbook', 'common']);
  const [loadStats, { data, loading }] = useLazyQuery(LogbookStatsQuery, {
    variables: { duration },
    fetchPolicy: 'cache-and-network'
  });
  const classes = useLogbookStyles();

  useEffect(() => {
    if (tabValue === 2) {
      loadStats();
    }
  }, [tabValue, loadStats, shouldRefetch]);

  function handleDurationFilter(event){
    handleFilter(event.target.value, 'duration')
  }

  const statsData = [
    {
      title: t('logbook.total_entries'),
      count: data?.communityPeopleStatistics.peopleEntered || 0,
      id: 'total_entries',
      action: () => handleFilter('peopleEntered')
    },
    {
      title: t('logbook.total_exits'),
      count: data?.communityPeopleStatistics.peopleExited || 0,
      id: 'total_exits',
      action: () => handleFilter('peopleExited')
    },
    {
      title: t('logbook.total_in_city'),
      count: data?.communityPeopleStatistics.peoplePresent || 0,
      id: 'total_in_city',
      action: () => handleFilter('peoplePresent')
    }
  ];

  const filterOptions = [
    {
      title: t('common:misc.all'),
      value: 'All'
    },
    {
      title: t('logbook.today'),
      value: 'today'
    },
    {
      title: t('logbook.last_7_days'),
      value: 'past7Days'
    },
    {
      title: t('logbook.last_30_days'),
      value: 'past30Days'
    },
  ]

  if (loading) return <Spinner />;
  return (
    <Grid container spacing={isSmall ? 0.5 : 4}>
      <Grid container alignItems='center' spacing={2} style={{marginBottom: isSmall ? 14 : -10, marginLeft: 14, marginTop: isSmall ? -7 : 16}}>
        <Grid item>{t('common:misc.statistics')}</Grid>
        <Grid item>
          <TextField
            id="choose_logbook_stat_duration"
            select
            label={t('common:misc.timeframe')}
            value={!duration ?  'All' : duration}
            size="small"
            onChange={handleDurationFilter}
          >
            {filterOptions.map((option, i) => (
              <MenuItem data-testid={`${i}-${option.title}`} key={option.value} value={option.value}>
                {
                 `${t('common:misc.show')} ${option.title}`
                }
              </MenuItem>
          ))}
          </TextField>
        </Grid>
      </Grid>
      <br />
      {statsData.map(stat => (
        <Grid item xs={4} key={stat.id}>
          <CardComponent
            className={classes.statCard}
            clickData={{ clickable: true, handleClick: stat.action }}
          >
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

LogbookStats.defaultProps = {
  duration: null
}

LogbookStats.propTypes = {
  tabValue: PropTypes.number.isRequired,
  shouldRefetch: PropTypes.bool.isRequired,
  isSmall: PropTypes.bool.isRequired,
  handleFilter: PropTypes.func.isRequired,
  duration: PropTypes.string,
};
