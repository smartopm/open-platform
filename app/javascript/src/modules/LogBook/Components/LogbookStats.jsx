import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/styles';
import { CSVLink } from 'react-csv';
import { Download } from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import { useLazyQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { MenuItem, TextField } from '@mui/material';
import CenteredContent from '../../../shared/CenteredContent';
import { LogbookStatsQuery, CurrentGuestEntriesQuery } from '../graphql/guestbook_queries';
import { Spinner } from '../../../shared/Loading';
import useLogbookStyles from '../styles';
import { filterOptions } from '../utils';
import { dateToString } from '../../../components/DateContainer';

export default function LogbookStats() {
  const { t } = useTranslation(['logbook', 'common']);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  const initialFilter = { type: 'allVisits', duration: 'today' };
  const [statsTypeFilter, setStatType] = useState({ ...initialFilter });
  const [loadStats, { data, loading }] = useLazyQuery(LogbookStatsQuery, {
    variables: { duration: statsTypeFilter.duration },
    fetchPolicy: 'cache-and-network',
  });
  const [
    visitorData,
    { data: guestData, loading: guestsLoading, called },
  ] = useLazyQuery(CurrentGuestEntriesQuery, {
    variables: {
      type: statsTypeFilter.type,
      duration: statsTypeFilter.duration,
    },
    fetchPolicy: 'cache-and-network',
  });
  const classes = useLogbookStyles();

  function handleFilter(filter, filterType = 'entryType') {
    const isDuration = filterType === 'duration';
    setStatType(current => ({
      ...statsTypeFilter,
      type: isDuration ? current.type : filter,
      duration: isDuration ? filter : current.duration,
    }));
  }

  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDurationFilter(event) {
    handleFilter(event.target.value, 'duration');
  }

  const statsData = [
    {
      title: t('logbook.total_entries'),
      count: data?.communityPeopleStatistics.peopleEntered || 0,
      id: 'total_entries',
      action: () => handleFilter('peopleEntered'),
    },
    {
      title: t('logbook.total_exits'),
      count: data?.communityPeopleStatistics.peopleExited || 0,
      id: 'total_exits',
      action: () => handleFilter('peopleExited'),
    },
    {
      title: t('logbook.total_in_city'),
      count: data?.communityPeopleStatistics.peoplePresent || 0,
      id: 'total_in_city',
      action: () => handleFilter('peoplePresent'),
    },
  ];

  const csvHeaders = [
    { label: t('logbook:review_screen.name'), key: 'name' },
    { label: t('common:form_fields.status'), key: 'status' },
    { label: t('logbook:csv.grantor_name'), key: 'grantor.name' },
    { label: t('logbook:csv.granted_at'), key: 'grantedAt' },
  ];

  if (loading) return <Spinner />;
  return (
    <>
      <Grid container alignItems="center" spacing={2}>
        <Grid item lg={12} md={12} sm={12}>
          {t('logbook.visitor_statistics')}
        </Grid>
        <Grid item lg={8} md={8} sm={8}>
          <TextField
            id="choose_logbook_stat_duration"
            select
            label={t('common:misc.timeframe')}
            value={statsTypeFilter.duration}
            defaultValue="today"
            size="small"
            onChange={handleDurationFilter}
            fullWidth
          >
            {filterOptions(t).map((option, i) => (
              <MenuItem
                data-testid={`${i}-${option.title}`}
                key={option.value}
                value={option.value}
              >
                {`${t('common:misc.show')} ${option.title}`}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item lg={4} md={4} sm={4}>
          {!guestData?.currentGuests.length > 0 && (
            <Button
              variant="contained"
              style={{ color: '#FFFFFF' }}
              onClick={() => visitorData()}
              startIcon={guestsLoading && <Spinner />}
              data-testid="export_data"
              disableElevation
            >
              {matches ? <Download color="primary" /> : t('common:misc.export_data')}
            </Button>
          )}
          {called && guestData?.currentGuests.length > 0 && (
            <CSVLink
              data={guestData?.currentGuests || []}
              style={{ color: theme.palette.primary.main, textDecoration: 'none' }}
              headers={csvHeaders}
              filename={`visit_view-data-${dateToString(new Date(), 'MM-DD-YYYY-HH:mm')}.csv`}
            >
              <Button variant="outlined" color="primary">
                {t('common:misc.download')}
              </Button>
            </CSVLink>
          )}
        </Grid>
      </Grid>
      <br />
      <Grid container spacing={4}>
        {statsData.map(stat => (
          <Grid item xs={4} key={stat.id} style={{ cursor: 'pointer' }} data-testid="card">
            <Card className={classes.statCard} onClick={stat.action}>
              <CardContent>
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
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
