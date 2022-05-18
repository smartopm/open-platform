/* eslint-disable max-statements */
import React, { useState } from 'react';
import { useQuery } from 'react-apollo';
import { Grid, Typography, Breadcrumbs } from '@mui/material';
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import makeStyles from '@mui/styles/makeStyles';
import { formatError, useParamsQuery } from '../../../../utils/helpers';
import { Spinner } from '../../../../shared/Loading';
import CenteredContent from '../../../../shared/CenteredContent';
import { ProjectsQuery } from '../graphql/process_queries';
import ProjectItem from './ProjectItem';
import { Context as AuthStateContext } from '../../../../containers/Provider/AuthStateProvider';
import Paginate from '../../../../components/Paginate';

export default function ProjectsList() {
  const { id: processId } = useParams();
  const { t } = useTranslation('task');
  const limit = 50;
  const [offset, setOffset] = useState(0);
  const path = useParamsQuery()
  const processName = path.get('process_name');
  const currentStep = path.get('current_step')
  const completedPerQuarter = path.get('completed_per_quarter')
  const submittedPerQuarter = path.get('submitted_per_quarter')
  const lifeTimeCategory = path.get('life_time_totals')
  const repliesRequestedStatus = path.get('replies_requested')
  const classes = useStyles();
  const authState = React.useContext(AuthStateContext);

  const { loading, error, data, refetch }
    = useQuery(ProjectsQuery, {
    variables: {
      offset,
      limit,
      processId,
      step: currentStep,
      completedPerQuarter,
      submittedPerQuarter,
      lifeTimeCategory,
      repliesRequestedStatus
    },
    fetchPolicy: 'cache-and-network'
  });

  function paginate(action) {
    if (action === 'prev') {
      if (offset < limit) {
        return;
      }
      setOffset(offset - limit);
    } else if (action === 'next') {
      setOffset(offset + limit);
    }
  }

  if (error) return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  if (loading) return <Spinner />;
  return(
    <div style={{padding: '0 8%'}}>
      <Grid container>
        {authState.user.userType === 'admin' && (
          <Grid item md={12} xs={12} style={{paddingleft: '10px'}}>
            <div role="presentation">
              <Breadcrumbs aria-label="breadcrumb" style={{paddingBottom: '10px'}}>
                <Link to="/processes">
                  <Typography color="primary" style={{marginLeft: '5px'}}>{t('processes.processes')}</Typography>
                </Link>
                <Typography color="text.primary">{processName}</Typography>
              </Breadcrumbs>
            </div>
          </Grid>
        )}
        <Grid item md={12} xs={11} className={classes.header}>
          <Grid container spacing={1}>
            <Grid item md={9} xs={10}>
              <Typography variant="h4" style={{marginLeft: '5px', marginBottom: '24px'}}>{processName}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {data?.projects?.length ?
        (
          <div>
            {data.projects.map(task => (
              <div key={task.id}>
                <ProjectItem task={task} processId={processId} refetch={refetch} />
              </div>
          ))}
          </div>
        )
        : (<CenteredContent>{t('processes.no_projects')}</CenteredContent>)
      }
      <br />
      <CenteredContent>
        <Paginate
          count={data?.projects?.length}
          offSet={offset}
          limit={limit}
          active={offset >= 1}
          handlePageChange={paginate}
        />
      </CenteredContent>
    </div>
  )
}

const useStyles = makeStyles({
  header: {
    marginBottom: '10px'
  },
});
