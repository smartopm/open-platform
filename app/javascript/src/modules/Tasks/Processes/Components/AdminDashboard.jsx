import React from 'react';
import {
  Divider,
  Link,
  List,
  ListItem,
  ListItemText,
  Typography,
  makeStyles
} from '@material-ui/core';
import { useQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Container, Grid } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { formatError } from '../../../../utils/helpers';
import CenteredContent from '../../../../shared/CenteredContent';
import { Spinner } from '../../../../shared/Loading';
import { ProjectStagesQuery, TaskQuarterySummaryQuery } from '../graphql/process_queries';
import { updateStageCount } from '../utils';

export default function AdminDashboard() {
  const { t } = useTranslation('task');
  const classes = useStyles();
  const history = useHistory()

  const { loading, error, data } = useQuery(ProjectStagesQuery, {
    fetchPolicy: 'cache-and-network'
  });

  const {
    loading: summaryLoading,
    // error: summaryError,
    data: summaryData
  } = useQuery(TaskQuarterySummaryQuery);

  console.log(summaryData)
  const cards = [
    {
      name: 'Q1',
      completed: 42,
      primary: false
    },
    {
      name: 'Q2',
      completed: 63,
      primary: true
    },
    {
      name: 'Q3',
      completed: 87,
      primary: true
    },
    {
      name: 'Q4',
      completed: 103,
      primary: false
    }
  ];

  const projectStages = {
    concept_design_review: 0,
    scheme_design_review: 0,
    detailed_design_review: 0,
    kiambu_county_submission: 0,
    construction_starts: 0,
    inspections: 0,
    post_construction: 0,
  };

  function routeToProjects(){
    history.push('/processes/drc/projects')
  }

  const updatedProjectStages = updateStageCount(projectStages, data);
  return(
    <Container maxWidth="xl">
      <Typography variant="h4" className={classes.title}>{t('processes.processes')}</Typography>
      <Link href="/processes/drc/projects">
        <Typography className={classes.processTitle} color='primary' variant="h5">{t('processes.drc_process')}</Typography>
      </Link>
      <Grid container justifyContent="space-between" spacing={4}>

        {/* To be continued... */}

        <Grid item xs={12} sm={6}>
          <Typography className={classes.quarterSection} variant="body1">{t('processes.completed_by_quarter')}</Typography>
          {
            summaryLoading && <Spinner />
          }
          {/* {
            summaryError && <CenteredContent>{formatError(summaryError.message)}</CenteredContent>
          } */}
          <Grid container spacing={2} className={classes.cards}>
            {cards.map((card, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Grid key={index} item xs={6} sm={12} md={6}>
                <Card className={classes.card}>
                  <CardContent
                    className={`${card.primary ? classes.evenCardsBackground : classes.oddCardsBackground} ${classes.cardContent}`}
                  >
                    <Grid container justifyContent="center" alignItems="center" direction="column">
                      <Typography variant="body2">Total completed</Typography>
                      <Typography variant="body2">{`${card.name} completed`}</Typography>
                      <Typography variant="body1" style={{fontSize: '2rem'}}>{card.completed}</Typography>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              ))}
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">{t('processes.projects_by_stage')}</Typography>
          {
            loading && <Spinner />
          }
          {
            error && <CenteredContent>{formatError(error.message)}</CenteredContent>
          }
          <List data-testid="project-stages">
            {Object.entries(updatedProjectStages).map(([stage, count]) => (
              <>
                <ListItem
                  key={stage}
                  onClick={routeToProjects}
                  className={classes.projectStageLink}
                >
                  <Grid container>
                    <Grid item xs={11}>
                      <ListItemText>
                        <Typography variant="body2">{t(`processes.drc_stages.${stage}`)}</Typography>
                      </ListItemText>
                    </Grid>
                    <Grid item xs={1}>
                      <ListItemText>
                        <Typography color='primary' className={classes.projectStageCount}>{count}</Typography>
                      </ListItemText>
                    </Grid>
                  </Grid>
                </ListItem>
                <Divider variant="inset" className={classes.divider} />
              </>
            ))}
          </List>
        </Grid>
      </Grid>
    </Container>
  )
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
    backgroundColor: theme.palette.secondary.main // '#53A2BE'
  },
  evenCardsBackground: {
    backgroundColor: theme.palette.primary.main // '#1E4785'
  },
  projectStageLink: {
    textDecoration: 'none',
    cursor: 'pointer'
  },
  projectStageCount: {
    fontWeight: 700
  }
}));
