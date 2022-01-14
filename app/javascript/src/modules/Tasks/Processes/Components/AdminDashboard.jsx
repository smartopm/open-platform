import React from 'react';
import {
  Divider,
  Link,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@material-ui/core';
import { useQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@mui/styles';
import { Card, CardContent, Grid } from '@mui/material';
import { formatError } from '../../../../utils/helpers';
import CenteredContent from '../../../../shared/CenteredContent';
import { Spinner } from '../../../../shared/Loading';
import { ProjectStagesQuery } from '../graphql/process_queries';
import { updateStageCount } from '../utils';

export default function AdminDashboard() {
  const { t } = useTranslation('task');
  const classes = useStyles();

  const { loading, error, data } = useQuery(ProjectStagesQuery, {
    fetchPolicy: 'cache-and-network'
  });

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

  if (error) return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  if (loading) return <Spinner />;
  const updatedProjectStages = updateStageCount(projectStages, data);
  return(
    <div className="container">
      <Typography variant="h4" className={classes.title}>{t('processes.processes')}</Typography>
      <Link href="/processes/drc/projects">
        <Typography className={classes.processTitle} variant="h5">{t('processes.drc_process')}</Typography>
      </Link>
      <Grid container justifyContent="space-between" spacing={3}>

        {/* To be continued... */}

        <Grid item xs={12} sm={6}>
          <Typography className={classes.quarterSection} variant="body1">{t('processes.completed_by_quarter')}</Typography>
          <Grid container spacing={2} className={classes.cards}>
            {cards.map((card, index) => (
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
          <List data-testid="project-stages">
            {Object.entries(updatedProjectStages).map(([stage, count]) => (
              <>
                <ListItem key={stage}>
                  <Grid container>
                    <Grid item xs={11}>
                      <ListItemText>
                        <Typography variant="body2">{t(`processes.drc_stages.${stage}`)}</Typography>
                      </ListItemText>
                    </Grid>
                    <Grid item xs={1}>
                      <ListItemText>
                        <Typography variant="body2">{count}</Typography>
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
    </div>
  )
}

const useStyles = makeStyles({
  title: {
    marginBottom: '24px'
  },
  processTitle: {
    color: '#53A2BE',
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
    backgroundColor: '#53A2BE'
  },
  evenCardsBackground: {
    backgroundColor: '#1E4785'
  }
});
