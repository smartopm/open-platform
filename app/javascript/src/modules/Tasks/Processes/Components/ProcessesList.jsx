/* eslint-disable max-statements */
import React from 'react';
import { useQuery } from 'react-apollo';
import { Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@mui/styles';
import { formatError } from '../../../../utils/helpers';
import { Spinner } from '../../../../shared/Loading';
import CenteredContent from '../../../../shared/CenteredContent';
import { ProcessesQuery } from '../graphql/process_queries';
import ProcessItem from './ProcessItem'

export default function ProcessesList() {
  const { t } = useTranslation('task');
  const limit = 50;
  const offset = 0;
  const classes = useStyles();

  const { loading, error, data, refetch }
    = useQuery(ProcessesQuery, {
    variables: {
      offset,
      limit,
    },
    fetchPolicy: 'cache-and-network'
  });

  // function handleTaskFilter(_evt, key) {
  //   setCurrentTile(key);
  //   setQuery(objectAccessor(taskQuery, key));
  //   // show tasks when a filter has been applied, we might have to move this to useEffect
  //   loadTasks();
  //   history.push(`/tasks?filter=${key}`)
  // }



  if (error) return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  if (loading) return <Spinner />;
  return(
    <>
      <Grid container>
        <Grid item md={11} xs={11} className={classes.header}>
          <Grid container spacing={1}>
            <Grid item md={9} xs={10}>
              <Typography variant="h4" style={{marginLeft: '5px'}}>{t('process.processes')}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item md={6} xs={6} style={{ display: 'flex', alignItems: 'center' }}>
        {/* <TaskQuickSearch filterTasks={handleTaskFilter} currentTile={currentTile} /> */}
      </Grid>
      {data?.processes?.length ?
        (
          <div>
            {data.processes.map(task => (
              <ProcessItem key={task.id} task={task} refetch={refetch} />
          ))}
          </div>
        )
        : (<CenteredContent>No projects</CenteredContent>)
      }
    </>
  )
}

const useStyles = makeStyles({
  header: {
    marginBottom: '10px'
  },
});
