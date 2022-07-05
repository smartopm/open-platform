/* eslint-disable react/no-array-index-key */
import React, { useContext } from 'react';
import { useQuery } from 'react-apollo';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LeadScoreCardQuery } from '../graphql/queries';
import { Spinner } from '../../../../shared/Loading';
import ScoreCard from './ScoreCard';
import { Context as AuthStateContext } from '../../../../containers/Provider/AuthStateProvider';
import { objectAccessor } from '../../../../utils/helpers';
import { months, leadStatuses, statuses, scoreCardTitle } from '../../../../utils/constants';
import CenteredContent from '../../../../shared/CenteredContent';
import { buildScoreCardData, buildStatusCard, buildCurrentStatusCard } from '../../utils';
import PageWrapper from '../../../../shared/PageWrapper';

export default function LeadsPage() {
  const classes = useStyles();
  const authState = useContext(AuthStateContext);
  const { data, loading, error } = useQuery(LeadScoreCardQuery, {
    fetchPolicy: 'cache-and-network',
  });
  const { t } = useTranslation('common');
  const communityDivisionTargets = authState?.user.community?.leadMonthlyTargets;

  function getMonthlyTarget(division) {
    const target = authState?.user.community.leadMonthlyTargets
      ?.filter(tar => tar.division === division)
      .map(tar => tar.target);
    return target?.join() || 0;
  }

  function BS(status, month) {
    if (!data?.leadScorecards.leads_monthly_stats_by_status[objectAccessor(statuses, status)]) {
      return '0';
    }
    if (
      !data?.leadScorecards.leads_monthly_stats_by_status[objectAccessor(statuses, status)][
        objectAccessor(months, month)
      ]
    ) {
      return '0';
    }

    return `${
      data?.leadScorecards.leads_monthly_stats_by_status[objectAccessor(statuses, status)][
        objectAccessor(months, month)
      ]
    }`;
  }

  function SL(leadStatus) {
    return `${data?.leadScorecards.lead_status[objectAccessor(leadStatuses, leadStatus)] || '0'}`;
  }
  
  if (error)
    return (
      <CenteredContent>
        <p>{error.message}</p>
      </CenteredContent>
    );
  return (
    <PageWrapper pageTitle={t('lead_management.leads')}>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Grid container>
            <Grid item md={12} xs={12} className={classes.title} data-testid="subtitle">
              <Typography variant="h6">{t('lead_management.scorecard')}</Typography>
            </Grid>
            <Grid item md={10} xs={7} className={classes.title} data-testid="monthly_lead">
              <Typography variant="body1" className={classes.weight}>
                {t('lead_management.monthly_leads_by_division')}
              </Typography>
            </Grid>
            {communityDivisionTargets && communityDivisionTargets?.length >= 2 && (
              <Grid item md={2} xs={5} className={classes.title} style={{ textAlign: 'right' }}>
                <Typography
                  component="span"
                  variant="caption text"
                  color="text.secondary"
                  style={{ marginRight: '20px' }}
                >
                  {t('lead_management.year_total')}
                </Typography>
                {'  '}
                <Typography color="primary" component="span">
                  {data.leadScorecards.ytd_count?.leads_by_division || 0}
                </Typography>
              </Grid>
            )}
          </Grid>
          <Grid container spacing={2} data-testid="card_one">
            {communityDivisionTargets && communityDivisionTargets?.length >= 2 ? (
              buildScoreCardData(
                data?.leadScorecards?.leads_monthly_stats_by_division,
                getMonthlyTarget
              ).map((score, index) => (
                <Grid item md={3} xs={12} key={index}>
                  <ScoreCard data={score} />
                </Grid>
              ))
            ) : (
              <Grid item md={12} xs={12}>
                <Typography variant="body2">
                  {t('lead_management.go_settings')}
                  <a href="/community">
                    <Typography variant="subtitle1">
                      {t('lead_management.community_settings_page')}
                    </Typography>
                  </a>
                  {t('lead_management.to_set_up')}
                </Typography>
              </Grid>
            )}
          </Grid>
          <Grid container spacing={2} data-testid="card_two">
            {buildCurrentStatusCard(SL).map((score, index) => (
              <Grid item md={3} xs={12} key={index}>
                <Typography className={`${classes.cardTitle} ${classes.weight}`}>
                  {t('lead_management.current_status_of_leads')}
                </Typography>
                <ScoreCard data={score} currentStatus />
              </Grid>
            ))}
            {buildStatusCard(BS).map((score, index) => (
              <Grid item md={3} xs={12} key={index}>
                <Grid container className={classes.cardTitle}>
                  <Grid item md={6} xs={6} className={classes.weight}>
                    {objectAccessor(scoreCardTitle, score.name)}
                  </Grid>
                  <Grid item md={6} xs={6} style={{ textAlign: 'right' }}>
                    <Typography
                      component="span"
                      variant="caption text"
                      color="text.secondary"
                      style={{ marginRight: '20px' }}
                    >
                      {t('lead_management.year_total')}
                    </Typography>
                    {'  '}
                    <Typography color="primary" component="span">
                      {data.leadScorecards.ytd_count[score.name] || 0}
                    </Typography>
                  </Grid>
                </Grid>
                <ScoreCard data={score} statusCard />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </PageWrapper>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    padding: '0 100px',
  },
  containerMobile: {
    padding: '0 20px',
  },
  title: {
    paddingBottom: '20px',
  },
  cardTitle: {
    padding: '20px 0',
  },
  addColor: {
    color: theme.palette.primary.main,
  },
  weight: {
    fontWeight: 500,
  },
}));
