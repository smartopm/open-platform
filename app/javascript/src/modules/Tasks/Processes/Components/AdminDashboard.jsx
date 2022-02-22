import React, { Fragment } from 'react';
import { Divider, Link, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import { useQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Container, Grid } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { formatError } from '../../../../utils/helpers';
import CenteredContent from '../../../../shared/CenteredContent';
import { Spinner } from '../../../../shared/Loading';
import { TaskQuarterySummaryQuery, ProjectsQuery } from '../graphql/process_queries';
import {
  filterProjectAndStages,
  calculateOpenProjectsByStage,
  snakeCaseToSentence
} from '../utils';

export default function AdminDashboard() {
  const { t } = useTranslation('task');
  const classes = useStyles();
  const history = useHistory();

  const { loading: summaryLoading, error: summaryError, data: summaryData } = useQuery(
    TaskQuarterySummaryQuery
  );

  const { loading: projectsLoading, error: projectsError, data: projectsData } = useQuery(
    ProjectsQuery,
    {
      variables: { offset: 0, limit: 50 },
      fetchPolicy: 'cache-and-network'
    }
  );

  function tasksPerQuarter(processStats, quarter) {
    const quarterStats = processStats?.find(stats => stats[1] === quarter);
    return quarterStats?.[2];
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

  function routeToProjects(paramName, paramValue) {
    history.push(`/processes/drc/projects?${paramName}=${paramValue}`);
  }

  const filteredProjects = filterProjectAndStages(projectsData?.projects, projectStageLookup);
  const stats = calculateOpenProjectsByStage(filteredProjects, projectStageLookup);

  return (
    <Container maxWidth="xl" data-testid="processes-admin-dashboard">
      <Typography variant="h4" className={classes.title}>
        {t('processes.processes')}
      </Typography>
      <Link href="/processes/drc/projects">
        <Typography className={classes.processTitle} color="primary" variant="h5">
          {t('processes.drc_process')}
        </Typography>
      </Link>
      <Grid container justifyContent="space-between" spacing={4}>
        <Grid item xs={12} sm={6}>
          <Typography className={classes.quarterSection} variant="body1">
            {t('processes.projects_by_quarter')}
          </Typography>
          {summaryLoading && <Spinner />}
          {summaryError && <CenteredContent>{formatError(summaryError.message)}</CenteredContent>}
          <Grid container spacing={1} className={classes.cards}>
            <Grid item xs={3} />
            {cards.map((card, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Grid key={index} item xs={2} container justifyContent="center" alignItems="center">
                <Typography variant="body2">{card.name}</Typography>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={1} style={{ marginBottom: '12px' }}>
            <Grid
              item
              container
              justifyContent="center"
              alignItems="center"
              xs={3}
              style={{ background: '#FAFAFA' }}
            >
              <Typography variant="body2" color="secondary">
                {t('processes.submitted')}
              </Typography>
            </Grid>
            {cards.map((card, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Grid key={index} item xs={2}>
                <Card
                  className={classes.card}
                  onClick={() => routeToProjects('submitted_per_quarter', card.name)}
                  style={{ cursor: 'pointer' }}
                >
                  <CardContent
                    className={`${classes.oddCardsBackground} ${classes.cardContent}`}
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

          <Grid container spacing={1} className={classes.cards}>
            <Grid
              item
              container
              justifyContent="center"
              alignItems="center"
              xs={3}
              style={{ background: '#FAFAFA' }}
            >
              <Typography variant="body2" color="secondary">
                {t('processes.completed')}
              </Typography>
            </Grid>
            {cards.map((card, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Grid key={index} item xs={2}>
                <Card
                  className={classes.card}
                  onClick={() => routeToProjects('completed_per_quarter', card.name)}
                  style={{ cursor: 'pointer' }}
                >
                  <CardContent
                    className={`${classes.oddCardsBackground} ${classes.cardContent}`}
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
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">{t('processes.projects_by_stage')}</Typography>
          {projectsLoading && <Spinner />}
          {projectsError && <CenteredContent>{formatError(projectsError.message)}</CenteredContent>}
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
