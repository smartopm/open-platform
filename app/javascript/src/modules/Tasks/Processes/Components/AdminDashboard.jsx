import React, { Fragment, useState } from 'react';
import {
  Divider,
  // Link,
  List,
  ListItem,
  ListItemText,
  Typography,
  Card,
  CardContent,
  Container,
  Grid,
  Chip,
  Stack
} from '@mui/material';
import { useQuery } from 'react-apollo';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@mui/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { useHistory, Link } from 'react-router-dom';
import { formatError } from '../../../../utils/helpers';
import CenteredContent from '../../../../shared/CenteredContent';
import { Spinner } from '../../../../shared/Loading';
import SpeedDial from '../../../../shared/buttons/SpeedDial';
import {
  TaskQuarterySummaryQuery,
  ProjectsStatsQuery,
  ReplyCommentStatQuery
} from '../graphql/process_queries';
import {
  filterProjectAndStages,
  calculateOpenProjectsByStage,
  snakeCaseToSentence,
  accessibleMenus
} from '../utils';

export default function AdminDashboard() {
  const { t } = useTranslation(['task', 'process']);
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:800px)');
  const history = useHistory();
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const [openSpeedDial, setOpenSpeedDial] = useState(false);

  const { loading: summaryLoading, error: summaryError, data: summaryData } = useQuery(
    TaskQuarterySummaryQuery,
    {
      fetchPolicy: 'cache-and-network'
    }
  );

  const { loading: projectsLoading, error: projectsError, data: projectsData } = useQuery(
    ProjectsStatsQuery,
    {
      variables: { offset: 0, limit: 50 },
      fetchPolicy: 'cache-and-network'
    }
  );

  const { data: commentStatData } = useQuery(ReplyCommentStatQuery, {
    fetchPolicy: 'cache-and-network'
  });

  function tasksPerQuarter(processStats, quarter) {
    const quarterStats = processStats?.find(stats => stats[1] === quarter);
    return quarterStats?.[2];
  }

  function tasksTillNow(processStats) {
    const initialValue = 0;
    const overallStats = processStats.reduce(
      (previousValue, currentValue) => previousValue + currentValue[2],
      initialValue
    );
    return overallStats;
  }

  function tasksPerYear(processStats) {
    const initialValue = 0;
    const yearStats = processStats.reduce(
      (previousValue, currentValue) => previousValue + currentValue[2],
      initialValue
    );
    return yearStats;
  }

  const currentYear = new Date().getFullYear();
  const completedResults = summaryData?.tasksByQuarter.completed || [];
  const submittedResults = summaryData?.tasksByQuarter.submitted || [];
  const currentYearCompletedStats = completedResults.filter(result => result[0] === currentYear);
  const currentYearSubmittedStats = submittedResults.filter(result => result[0] === currentYear);

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

  const projectStageLookup = {
    concept_design_review: 0,
    scheme_design_review: 0,
    detailed_design_review: 0,
    kiambu_county_submission: 0,
    construction_starts: 0,
    inspections: 0,
    post_construction: 0
  };

  const speedDialActions = [
    {
      icon: <VisibilityIcon />,
      name: t('process:templates.process_templates'),
      handleClick: () => history.push('/processes/templates'),
      isVisible: true // TODO: Use permission if needed
    }
  ];

  function cardName(name) {
    if (quarters.includes(name)) return name;

    return 'ytd';
  }

  function routeToProjects(paramName, paramValue) {
    history.push(`/processes/drc/projects?${paramName}=${paramValue}`);
  }

  const filteredProjects = filterProjectAndStages(projectsData?.projects, projectStageLookup);
  const stats = calculateOpenProjectsByStage(filteredProjects, projectStageLookup);

  return (
    <Container maxWidth="xl" data-testid="processes-admin-dashboard">
      <Grid container>
        <Grid item md={11} xs={10}>
          <Typography variant="h4" className={classes.title}>
            {t('processes.processes')}
          </Typography>
        </Grid>
        <Grid item md={1} xs={2}>
          <SpeedDial
            open={openSpeedDial}
            handleSpeedDial={() => setOpenSpeedDial(!openSpeedDial)}
            actions={accessibleMenus(speedDialActions)}
          />
        </Grid>
      </Grid>
      <Grid container style={{ marginTop: '10px' }}>
        <Grid item md={7} xs={12}>
          <Link to="/processes/drc/projects" underline="hover">
            <Typography className={classes.processTitle} color="primary" variant="h5">
              {t('processes.drc_process')}
            </Typography>
          </Link>
        </Grid>
        <Grid item md={5} xs={12}>
          {commentStatData && (
            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
              <Typography style={{ fontSize: '14px' }}>
                {t('processes.replies_requested')}
              </Typography>
              <Chip
                label={t('task:misc.sent', { count: commentStatData.replyCommentStats.sent })}
                color="info"
                size="small"
                style={{ fontSize: '14px' }}
                data-testid="sent-chip"
              />
              <Chip
                label={t('task:misc.received', {
                  count: commentStatData.replyCommentStats.received
                })}
                color="warning"
                size="small"
                style={{ fontSize: '14px' }}
              />
              <Chip
                label={t('task:misc.resolved', {
                  count: commentStatData.replyCommentStats.resolved
                })}
                color="success"
                size="small"
                style={{ fontSize: '14px' }}
              />
            </Stack>
          )}
        </Grid>
      </Grid>
      <Grid container justifyContent="space-between" spacing={4}>
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
                          index === 4 ? classes.evenCardsBackground : classes.oddCardsBackground
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
                          index === 4 ? classes.evenCardsBackground : classes.oddCardsBackground
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
                          index === 2 ? classes.evenCardsBackground : classes.oddCardsBackground
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
              {Object.entries(stats).map(([stage, count]) => (
                <Fragment key={stage}>
                  <ListItem
                    onClick={() => routeToProjects('current_step', snakeCaseToSentence(stage))}
                    className={classes.projectStageLink}
                  >
                    <Grid container>
                      <Grid item xs={11}>
                        <ListItemText>
                          <Typography variant="body2">
                            {t(`processes.drc_stages.${stage}`)}
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
                  <Divider variant="inset" className={classes.divider} />
                </Fragment>
              ))}
            </List>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: '24px'
  },
  processTitle: {
    marginBottom: '20px'
  },
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
  oddCardsBackground: {
    backgroundColor: theme.palette?.primary?.main
  },
  evenCardsBackground: {
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
