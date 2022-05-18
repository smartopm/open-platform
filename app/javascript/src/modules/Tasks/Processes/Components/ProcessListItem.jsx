/* eslint-disable max-lines */
/* eslint-disable complexity */
import React, { Fragment } from 'react';
import {
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import { Link, useHistory } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import CenteredContent from '../../../../shared/CenteredContent';
import { formatError } from '../../../../utils/helpers';
import { Spinner } from '../../../../shared/Loading';
import {
  TaskQuarterySummaryQuery,
  ProjectsStatsQuery,
  ProjectStages,
  ReplyCommentStatQuery,
} from '../graphql/process_queries';
import {
  calculateOpenProjectsByStage,
  snakeCaseToSentence
} from '../utils';

export default function ProcessListItem({ processName }) {
  const { t } = useTranslation(['task', 'process']);
  const matches = useMediaQuery('(max-width:800px)');
  const classes = useStyles();
  const history = useHistory();
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

  const { loading: summaryLoading, error: summaryError, data: summaryData } = useQuery(
    TaskQuarterySummaryQuery,
    {
      variables: { processName },
      fetchPolicy: 'cache-and-network'
    }
  );

  const { data: commentStatData } = useQuery(ReplyCommentStatQuery, {
    variables: { processName },
    fetchPolicy: 'cache-and-network'
  });

  const { data: stagesData } = useQuery(ProjectStages, {
    variables: { processName },
    fetchPolicy: 'cache-and-network'
  });

  const { loading: projectsLoading, error: projectsError, data: projectsData } = useQuery(
    ProjectsStatsQuery,
    {
      variables: { processName, offset: 0, limit: 50 },
      fetchPolicy: 'cache-and-network'
    }
  );

  const projectStats = calculateOpenProjectsByStage(
    projectsData?.projects, stagesData?.projectStages
  );

  const currentYear = new Date().getFullYear();
  const completedResults = summaryData?.tasksByQuarter.completed || [];
  const submittedResults = summaryData?.tasksByQuarter.submitted || [];
  const currentYearCompletedStats = completedResults.filter(result => result[0] === currentYear);
  const currentYearSubmittedStats = submittedResults.filter(result => result[0] === currentYear);

  function tasksPerQuarter(processStats, quarter) {
    const quarterStats = processStats?.find(statsTotal => statsTotal[1] === quarter);
    return quarterStats?.[2];
  }

  function tasksPerYear(processStats) {
    const initialValue = 0;
    const yearStats = processStats.reduce(
      (previousValue, currentValue) => previousValue + currentValue[2],
      initialValue
    );
    return yearStats;
  }

  function tasksTillNow(processStats) {
    const initialValue = 0;
    const overallStats = processStats.reduce(
      (previousValue, currentValue) => previousValue + currentValue[2],
      initialValue
    );
    return overallStats;
  }

  function routeToProjects(paramName, paramValue) {
    history.push(`/processes/projects?process_name=${processName}&${paramName}=${paramValue}`);
  }

  function cardName(name) {
    if (quarters.includes(name)) return name;

    return 'ytd';
  }

  const cards = [
    {
      name: 'Q1',
      completed: tasksPerQuarter(currentYearCompletedStats, 1) || 0,
      submitted: tasksPerQuarter(currentYearSubmittedStats, 1) || 0,
      primary: false
    },
    {
      name: 'Q2',
      completed: tasksPerQuarter(currentYearCompletedStats, 2) || 0,
      submitted: tasksPerQuarter(currentYearSubmittedStats, 2) || 0,
      primary: true
    },
    {
      name: 'Q3',
      completed: tasksPerQuarter(currentYearCompletedStats, 3) || 0,
      submitted: tasksPerQuarter(currentYearSubmittedStats, 3) || 0,
      primary: true
    },
    {
      name: 'Q4',
      completed: tasksPerQuarter(currentYearCompletedStats, 4) || 0,
      submitted: tasksPerQuarter(currentYearSubmittedStats, 4) || 0,
      primary: false
    },
    {
      name: t('processes.year_to_date'),
      completed: tasksPerYear(currentYearCompletedStats) || 0,
      submitted: tasksPerYear(currentYearSubmittedStats) || 0,
      primary: false
    }
  ];

  const lifeTimeCards = [
    {
      name: t('processes.submitted'),
      category: 'submitted',
      count: tasksTillNow(submittedResults) || 0,
      primary: true
    },
    {
      name: t('processes.completed'),
      category: 'completed',
      count: tasksTillNow(completedResults) || 0,
      primary: true
    },
    {
      name: t('processes.outstanding'),
      category: 'outstanding',
      count: (tasksTillNow(submittedResults) || 0) - (tasksTillNow(completedResults) || 0),
      primary: false
    }
  ];

  if (!processName) return <div />;

  return (
    <>
      <Grid container style={{ marginTop: '10px' }}>
        <Grid item md={8} xs={12}>
          <Link to={`/processes/projects?process_name=${processName}`} underline="hover">
            <Typography className={classes.processTitle} color="primary" variant="h5">
              {processName}
            </Typography>
          </Link>
        </Grid>
        <Grid item md={3} xs={12} style={!matches ? {textAlign: 'right'} : { padding: '10px 0'}}>
          {commentStatData && (
          <Button color='primary' variant='outlined' data-testid='comments_button' onClick={() => history.push(`/processes/comments?process_name=${processName}`)}>{t('processes.open_comments')}</Button>
          )}
        </Grid>
      </Grid>
      <Grid container justifyContent="space-between" spacing={4} style={{ marginTop: '8px' }}>
        <Grid item xs={12} sm={6}>
          <Typography className={classes.quarterSection} variant="body1">
            {t('processes.projects_by_quarter')}
          </Typography>
          {summaryError && <CenteredContent>{formatError(summaryError.message)}</CenteredContent>}
          {summaryLoading ? (
            <Spinner />
          ) : (
            <>
              <Grid container spacing={1} className={classes.cards}>
                <Grid item xs={2.5} />
                {matches && <Grid item xs={1} />}
                {cards.map((card, index) => (
                  <Grid
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    item
                    xs={1.5}
                    container
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Typography variant="caption">{card.name}</Typography>
                  </Grid>
                ))}
              </Grid>

              <Grid container spacing={1} style={{ marginBottom: '12px', paddingLeft: '7px' }}>
                <Grid
                  item
                  container
                  justifyContent="center"
                  alignItems="center"
                  xs={2.5}
                  style={{
                    background: '#F5F5F4',
                    borderRadius: '4px',
                    height: '47px',
                    marginTop: '7px',
                    paddingTop: 0,
                    paddingRight: '8px'
                  }}
                >
                  <Typography variant="caption" color="secondary">
                    {t('processes.submitted')}
                  </Typography>
                </Grid>
                {matches && <Grid item xs={1} />}
                {cards.map((card, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Grid key={index} item xs={1.5}>
                    <Card
                      className={classes.card}
                      onClick={() => routeToProjects('submitted_per_quarter', cardName(card.name))}
                      style={{ cursor: 'pointer', boxShadow: 'none' }}
                    >
                      <CardContent
                        className={`${
                          index === 4 ?
                            classes.secondaryCardsBackground : classes.primaryCardsBackground
                        } ${classes.cardContent}`}
                        style={{ paddingTop: '8px', paddingBottom: '8px' }}
                      >
                        <Grid container justifyContent="center" alignItems="center">
                          <Typography variant="body1" style={{ fontSize: '1.2rem' }}>
                            {card.submitted}
                          </Typography>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Grid container spacing={1} style={{ marginBottom: '15px', paddingLeft: '7px' }}>
                <Grid
                  item
                  container
                  justifyContent="center"
                  alignItems="center"
                  xs={2.5}
                  style={{
                    background: '#F5F5F4',
                    borderRadius: '4px',
                    height: '47px',
                    marginTop: '7px',
                    paddingTop: 0,
                    paddingRight: '8px'
                  }}
                >
                  <Typography variant="caption" color="secondary">
                    {t('processes.completed')}
                  </Typography>
                </Grid>
                {matches && <Grid item xs={1} />}
                {cards.map((card, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Grid key={index} item xs={1.5}>
                    <Card
                      className={classes.card}
                      onClick={() => routeToProjects('completed_per_quarter', cardName(card.name))}
                      style={{ cursor: 'pointer', boxShadow: 'none' }}
                    >
                      <CardContent
                        className={`${
                          index === 4 ?
                            classes.secondaryCardsBackground : classes.primaryCardsBackground
                        } ${classes.cardContent}`}
                        style={{ paddingTop: '8px', paddingBottom: '8px' }}
                      >
                        <Grid container justifyContent="center" alignItems="center">
                          <Typography variant="body1" style={{ fontSize: '1.2rem' }}>
                            {card.completed}
                          </Typography>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Divider
                variant="inset"
                className={matches ? classes.mobileStatsDivider : classes.statsDivider}
              />
              <Grid container spacing={1} className={classes.cards}>
                <Grid item xs={4} />
                {matches && <Grid item xs={1} />}
                {lifeTimeCards.map((card, index) => (
                  <Grid
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    item
                    xs={2}
                    container
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Typography variant="caption" style={{ fontSize: '0.6rem' }}>
                      {card.name}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
              <Grid container spacing={1} style={{ paddingLeft: '7px' }}>
                <Grid
                  item
                  container
                  justifyContent="center"
                  alignItems="center"
                  xs={4}
                  style={{
                    background: '#F5F5F4',
                    borderRadius: '4px',
                    height: '47px',
                    marginTop: '7px',
                    paddingTop: 0,
                    paddingRight: '8px'
                  }}
                >
                  <Typography variant="caption" color="secondary">
                    {t('processes.lifetime_totals')}
                  </Typography>
                </Grid>
                {matches && <Grid item xs={1} />}
                {lifeTimeCards.map((card, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Grid key={index} item xs={2}>
                    <Card
                      className={classes.card}
                      onClick={() => routeToProjects('life_time_totals', card.category)}
                      style={{ cursor: 'pointer', boxShadow: 'none' }}
                    >
                      <CardContent
                        className={`${
                          index === 2 ?
                            classes.secondaryCardsBackground : classes.primaryCardsBackground
                        } ${classes.cardContent}`}
                        style={{ paddingTop: '8px', paddingBottom: '8px' }}
                      >
                        <Grid container justifyContent="center" alignItems="center">
                          <Typography variant="body1" style={{ fontSize: '1.2rem' }}>
                            {card.count}
                          </Typography>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">{t('processes.projects_by_stage')}</Typography>
          {projectsError && <CenteredContent>{formatError(projectsError.message)}</CenteredContent>}
          {projectsLoading ? (
            <CenteredContent>
              <Spinner />
            </CenteredContent>
          ) : (
            <List data-testid="project-stages">
              {Object.entries(projectStats).map(([stage, count], index) => (
                <Fragment key={stage}>
                  <ListItem
                    onClick={() => routeToProjects('current_step', snakeCaseToSentence(stage))}
                    className={classes.projectStageLink}
                  >
                    <Grid container>
                      <Grid item xs={11}>
                        <ListItemText>
                          <Typography variant="body2">
                            {snakeCaseToSentence(stage)}
                          </Typography>
                        </ListItemText>
                      </Grid>
                      <Grid item xs={1}>
                        <ListItemText>
                          <Typography color="primary" className={classes.projectStageCount}>
                            {count}
                          </Typography>
                        </ListItemText>
                      </Grid>
                    </Grid>
                  </ListItem>
                  { (index + 1 < Object.keys(projectStats).length) && <Divider variant="inset" className={classes.divider} /> }
                </Fragment>
              ))}
            </List>
          )}
        </Grid>
        <Grid item xs={12}>
          <Divider variant='fullWidth' />
        </Grid>
      </Grid>
    </>
  );
};

const useStyles = makeStyles(theme => ({
  quarterSection: {
    marginTop: '10px',
    marginBottom: '20px'
  },
  cardContent: {
    color: '#fff'
  },
  divider: {
    marginLeft: '15px',
    marginRight: '15px'
  },
  statsDivider: {
    marginLeft: '-2px',
    marginRight: '120px',
    marginBottom: '30px'
  },
  mobileStatsDivider: {
    marginLeft: '-2px',
    marginRight: '23px',
    marginBottom: '30px'
  },
  primaryCardsBackground: {
    backgroundColor: theme.palette?.primary?.main
  },
  secondaryCardsBackground: {
    backgroundColor: theme.palette?.secondary?.main
  },
  projectStageLink: {
    textDecoration: 'none',
    cursor: 'pointer'
  },
  projectStageCount: {
    fontWeight: 700
  }
}));

ProcessListItem.propTypes = {
  processName: PropTypes.string.isRequired,
}
