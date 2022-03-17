/* eslint-disable max-statements */
import React from 'react';
import { useQuery } from 'react-apollo';
import { Grid, Typography, Breadcrumbs } from '@mui/material';
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import makeStyles from '@mui/styles/makeStyles';
import { formatError, useParamsQuery } from '../../../../utils/helpers';
import { Spinner } from '../../../../shared/Loading';
import CenteredContent from '../../../../shared/CenteredContent';
import { ProjectsQuery } from '../graphql/process_queries';
import ProjectItem from './ProjectItem';
import { Context as AuthStateContext } from '../../../../containers/Provider/AuthStateProvider';

export default function ProjectsList() {
  const { t } = useTranslation('task');
  const limit = 50;
  const offset = 0;
  const path = useParamsQuery()
  const currentStep = path.get('current_step')
  const completedPerQuarter = path.get('completed_per_quarter')
  const submittedPerQuarter = path.get('submitted_per_quarter')
  const classes = useStyles();
  const authState = React.useContext(AuthStateContext);

  const { loading, error, data, refetch }
    = useQuery(ProjectsQuery, {
    variables: {
      offset,
      limit,
      step: currentStep,
      completedPerQuarter,
      submittedPerQuarter
    },
    fetchPolicy: 'cache-and-network'
  });

  if (error) return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  if (loading) return <Spinner />;
  return(
    <div className='container'>
      <Grid container>
        {authState.user.userType === 'admin' && (
          <Grid item md={12} xs={12} style={{paddingleft: '10px'}}>
            <div role="presentation">
              <Breadcrumbs aria-label="breadcrumb" style={{paddingBottom: '10px'}}>
                <Link to="/processes">
                  <Typography color="primary" style={{marginLeft: '5px'}}>{t('processes.processes')}</Typography>
                </Link>
                <Typography color="text.primary">{t('processes.drc_process')}</Typography>
              </Breadcrumbs>
            </div>
          </Grid>
        )}
        <Grid item md={12} xs={11} className={classes.header}>
          <Grid container spacing={1}>
            <Grid item md={9} xs={10}>
              <Typography variant="h4" style={{marginLeft: '5px', marginBottom: '24px'}}>{t('processes.drc_process')}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {data?.projects?.length ?
        (
          <div>
            {data.projects.map(task => (
              <div key={task.id}>
                <ProjectItem task={task} refetch={refetch} />
              </div>
          ))}
          </div>
        )
        : (<CenteredContent>{t('processes.no_projects')}</CenteredContent>)
      }
    </div>
  )
}

const useStyles = makeStyles({
  header: {
    marginBottom: '10px'
  },
});
