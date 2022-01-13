/* eslint-disable max-statements */
import React from 'react';
import { useQuery } from 'react-apollo';
import { Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/styles';
import { formatError } from '../../../../utils/helpers';
import { Spinner } from '../../../../shared/Loading';
import CenteredContent from '../../../../shared/CenteredContent';
import { ProjectsQuery } from '../graphql/process_queries';
import ProjectItem from './ProjectItem'

export default function ProjectsList() {
  const { t } = useTranslation('task');
  const limit = 50;
  const offset = 0;
  const classes = useStyles();

  const { loading, error, data, refetch }
    = useQuery(ProjectsQuery, {
    variables: {
      offset,
      limit,
    },
    fetchPolicy: 'cache-and-network'
  });

  if (error) return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  if (loading) return <Spinner />;
  return(
    <div className='container'>
      <Grid container>
        <Grid item md={11} xs={11} className={classes.header}>
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
        : (<CenteredContent>No projects</CenteredContent>)
      }
    </div>
  )
}

const useStyles = makeStyles({
  header: {
    marginBottom: '10px'
  },
});
