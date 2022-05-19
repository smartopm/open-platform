import React, { useContext } from 'react';
import { useQuery } from 'react-apollo';
import makeStyles from '@mui/styles/makeStyles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import { LeadScoreCardQuery } from '../graphql/queries';
import { Spinner } from '../../../../shared/Loading';
import ScoreCard from './ScoreCard';
import { Context as AuthStateContext } from '../../../../containers/Provider/AuthStateProvider';
import { objectAccessor } from '../../../../utils/helpers';
import CenteredContent from '../../../../shared/CenteredContent';

export default function LeadsPage() {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:900px)');
  const authState = useContext(AuthStateContext);
  const { data, loading, error } = useQuery(LeadScoreCardQuery, {
    fetchPolicy: 'cache-and-network'
  });

  const divisions = {
    Europe: 'Europe',
    China: 'China',
    India: 'India'
  };

  const months = {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    10: '10',
    11: '11',
    12: '12'
  };

  const statuses = {
    Ql: 'Qualified Lead',
    Sl: 'Signed Lease',
    Sm: 'Signed MOU'
  };

  const leadStatuses = {
    Ql: 'Qualified Lead',
    Is: 'Interest shown',
    Iv: 'Interest shown',
    Sm: 'Signed MOU',
    Sl: 'Signed Lease',
    Ev: 'Evaluation',
    St: 'Stakeholder meetings',
    Sv: 'Site Visit',
    Rs: 'Ready to sign',
    Im: 'Investment Motive Verified'
  };

  const scoreCardTitle = {
    qualified_lead: 'Qualified Lead',
    signed_lease: 'Signed Lease',
    signed_mou: 'Signed MOU'
  };

  function getMonthlyTarget(division) {
    const target = authState?.user.community.leadMonthlyTargets
      .filter(tar => tar.division === division)
      .map(tar => tar.target);
    return target.join();
  }

  function CS(division, month) {
    if (
      !data?.leadScorecards.leads_monthly_stats_by_division[objectAccessor(divisions, division)]
    ) {
      return `0/${getMonthlyTarget(division)}`;
    }
    if (
      !data?.leadScorecards.leads_monthly_stats_by_division[objectAccessor(divisions, division)][
        objectAccessor(months, month)
      ]
    ) {
      return `0/${getMonthlyTarget(division)}`;
    }

    return `${
      data?.leadScorecards.leads_monthly_stats_by_division[objectAccessor(divisions, division)][
        objectAccessor(months, month)
      ]
    }/${getMonthlyTarget(division)}`;
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

  function buildScoreCardData() {
    return [
      {
        score: [
          { col1: 'Q1', col2: 'Jan', col3: 'Feb', col4: 'Mar' },
          {
            col1: 'Europe',
            col2: CS('Europe', '1'),
            col3: CS('Europe', '2'),
            col4: CS('Europe', '2')
          },
          { col1: 'China', col2: CS('China', '1'), col3: CS('China', '2'), col4: CS('China', '3') },
          { col1: 'India', col2: CS('India', '1'), col3: CS('India', '2'), col4: CS('India', '3') }
        ]
      },
      {
        score: [
          { col1: 'Q2', col2: 'Apr', col3: 'May', col4: 'Jun' },
          {
            col1: 'Europe',
            col2: CS('Europe', '4'),
            col3: CS('Europe', '5'),
            col4: CS('Europe', '6')
          },
          { col1: 'China', col2: CS('China', '4'), col3: CS('China', '5'), col4: CS('China', '6') },
          { col1: 'India', col2: CS('India', '4'), col3: CS('India', '5'), col4: CS('India', '6') }
        ]
      },
      {
        score: [
          { col1: 'Q3', col2: 'Jul', col3: 'Aug', col4: 'Sep' },
          {
            col1: 'Europe',
            col2: CS('Europe', '7'),
            col3: CS('Europe', '8'),
            col4: CS('Europe', '9')
          },
          { col1: 'China', col2: CS('China', '7'), col3: CS('China', '8'), col4: CS('China', '9') },
          { col1: 'India', col2: CS('India', '7'), col3: CS('India', '8'), col4: CS('India', '9') }
        ]
      },
      {
        score: [
          { col1: 'Q4', col2: 'Oct', col3: 'Nov', col4: 'Dec' },
          {
            col1: 'Europe',
            col2: CS('Europe', '10'),
            col3: CS('Europe', '11'),
            col4: CS('Europe', '12')
          },
          {
            col1: 'China',
            col2: CS('China', '10'),
            col3: CS('China', '11'),
            col4: CS('China', '12')
          },
          {
            col1: 'India',
            col2: CS('India', '10'),
            col3: CS('India', '11'),
            col4: CS('India', '12')
          }
        ]
      }
    ];
  }

  function buildStatusCard() {
    return [
      {
        score: [
          { col1: 'Q1', col2: BS('Ql', '1'), col3: BS('Ql', '2'), col4: BS('Ql', '3') },
          { col1: 'Q2', col2: BS('Ql', '4'), col3: BS('Ql', '5'), col4: BS('Ql', '6') },
          { col1: 'Q3', col2: BS('Ql', '7'), col3: BS('Ql', '8'), col4: BS('Ql', '9') },
          { col1: 'Q4', col2: BS('Ql', '10'), col3: BS('Ql', '11'), col4: BS('Ql', '12') }
        ],
        name: 'qualified_lead'
      },
      {
        score: [
          { col1: 'Q1', col2: BS('Sm', '1'), col3: BS('Sm', '2'), col4: BS('Sm', '3') },
          { col1: 'Q2', col2: BS('Sm', '4'), col3: BS('Sm', '5'), col4: BS('Sm', '6') },
          { col1: 'Q3', col2: BS('Sm', '7'), col3: BS('Sm', '8'), col4: BS('Sm', '9') },
          { col1: 'Q4', col2: BS('Sm', '10'), col3: BS('Sm', '11'), col4: BS('Sm', '12') }
        ],
        name: 'signed_lease'
      },
      {
        score: [
          { col1: 'Q1', col2: BS('Sl', '1'), col3: BS('Sl', '2'), col4: BS('Sl', '3') },
          { col1: 'Q2', col2: BS('Sl', '4'), col3: BS('Sl', '5'), col4: BS('Sl', '6') },
          { col1: 'Q3', col2: BS('Sl', '7'), col3: BS('Sl', '8'), col4: BS('Sl', '9') },
          { col1: 'Q4', col2: BS('Sl', '10'), col3: BS('Sl', '11'), col4: BS('Sl', '12') }
        ],
        name: 'signed_mou'
      }
    ];
  }

  function buildCurrentStatusCard() {
    return [
      {
        score: [
          { col1: 'Interest Shown', col2: SL('Iv') },
          { col1: 'Investment Motive Verified', col2: SL('Im') },
          { col1: 'Qualified Lead', col2: SL('Ql') },
          { col1: 'Evaluation', col2: SL('Ev') },
          { col1: 'Stakeholder Meetings', col2: SL('St') },
          { col1: 'Site Visit', col2: SL('Sv') },
          { col1: 'Ready to Sign', col2: SL('Rs') },
          { col1: 'Signed MOU', col2: SL('Sm') },
          { col1: 'Signed Lease', col2: SL('Sl') }
        ]
      }
    ];
  }

  if (loading) return <Spinner />;
  if (error)
    return (
      <CenteredContent>
        <p>{error.message}</p>
      </CenteredContent>
    );
  return (
    <div className={matches ? classes.containerMobile : classes.container}>
      <Grid container>
        {console.log(data)}
        <Grid item md={12} xs={12} className={classes.title}>
          <Typography variant="h4">Leads</Typography>
        </Grid>
        <Grid item md={12} xs={12} className={classes.title}>
          <Typography variant="h6">Scorecard</Typography>
        </Grid>
        <Grid item md={10} xs={7} className={classes.title}>
          <Typography variant="body1" className={classes.weight}>Monthly Leads By Division</Typography>
        </Grid>
        <Grid item md={2} xs={5} className={classes.title} style={{ textAlign: 'right' }}>
          <Typography component='span' color='text.secondary'>YTD Total</Typography>
          {'  '}
          <Typography color='primary' component='span'>{data.leadScorecards.ytd_count.leads_by_division}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {buildScoreCardData().map(score => (
          <Grid item md={3} xs={12} key={score.stage}>
            <ScoreCard data={score} />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2}>
        {buildCurrentStatusCard().map(score => (
          <Grid item md={3} xs={12} key={score.score.col1}>
            <Typography className={`${classes.cardTitle} ${classes.weight}`}>Current Status of leads</Typography>
            <ScoreCard data={score} currentStatus />
          </Grid>
        ))}
        {buildStatusCard().map(score => (
          <Grid item md={3} xs={12} key={score.stage}>
            <Grid container className={classes.cardTitle}>
              <Grid item md={6} xs={6} className={classes.weight}>
                {objectAccessor(scoreCardTitle, score.name)}
              </Grid>
              <Grid item md={6} xs={6} style={{ textAlign: 'right' }}>
                <Typography component='span' color='text.secondary'>YTD Total</Typography>
                {'  '}
                <Typography color='primary' component='span'>{data.leadScorecards.ytd_count[score.name]}</Typography>
              </Grid>
            </Grid>
            <ScoreCard data={score} statusCard />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    padding: '0 100px'
  },
  containerMobile: {
    padding: '0 20px'
  },
  title: {
    paddingBottom: '20px'
  },
  cardTitle: {
    padding: '20px 0'
  },
  addColor: {
    color: theme.palette.primary.main
  },
  weight: {
    fontWeight: 500
  }
}));
