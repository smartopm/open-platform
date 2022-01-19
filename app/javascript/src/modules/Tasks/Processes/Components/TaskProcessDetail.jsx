import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useQuery } from 'react-apollo';
import { Grid, Typography } from '@mui/material';
import IconButton from '@material-ui/core/IconButton';
import ShareIcon from '@mui/icons-material/Share';
import { useTranslation } from 'react-i18next';
import TaskContextProvider from '../../Context';
import { StyledTabs, StyledTab, TabPanel, a11yProps } from '../../../../components/Tabs';
import ProjectOverview, { ProjectOverviewSplitView } from './ProjectOverview';
import { objectAccessor, sanitizeText, useParamsQuery } from '../../../../utils/helpers';
import ProjectProcesses, { ProjectProcessesSplitView } from './ProjectProcesses';
import ErrorPage from '../../../../components/Error';
import Loading from '../../../../shared/Loading';
import { SubTasksQuery, TaskQuery } from '../../graphql/task_queries';
import { hrefsExtractor } from '../utils';
import MessageAlert from '../../../../components/MessageAlert';

export default function TaskProcessDetail() {
  const limit = 20;
  const { t } = useTranslation(['task', 'common']);
  const { id: taskId } = useParams();
  const history = useHistory();
  const path = useParamsQuery();
  const tab = path.get('tab');
  const [tabValue, setTabValue] = useState(0);
  const [messageAlert, setMessageAlert] = useState('');
  const matches = useMediaQuery('(max-width:600px)');

  const { data: projectData, error: projectDataError, loading: projectDataLoading } = useQuery(
    TaskQuery,
    {
      variables: { taskId },
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all'
    }
  );

  const { data: stepsData, loading: subStepsLoading, refetch } = useQuery(SubTasksQuery, {
    variables: { taskId, limit: projectData?.subTasks?.length || limit },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  const TAB_VALUES = {
    overview: 0,
    processes: 1,
    documents: 2
  };

  function handleTabValueChange(_event, newValue) {
    history.push(
      `?tab=${Object.keys(TAB_VALUES).find(key => objectAccessor(TAB_VALUES, key) === newValue)}`
    );
    setTabValue(Number(newValue));
  }

  async function shareOnclick() {
    await navigator.clipboard.writeText(hrefsExtractor(projectData?.task?.body)[1])
    setMessageAlert('Link copied to clipboard')
  }

  useEffect(() => {
    if (tab) {
      setTabValue(objectAccessor(TAB_VALUES, tab));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, tab]);

  if (projectDataLoading || subStepsLoading) return <Loading />;
  if (projectDataError) return <ErrorPage title={projectDataError.message} />;

  return (
    <div>
      <MessageAlert
        type='success'
        message={messageAlert}
        open={!!messageAlert}
        handleClose={() => setMessageAlert('')}
      />
      <TaskContextProvider>
        <Grid container data-testid="process-detail-section" style={!matches ? {padding: '0 56px'} : {padding: '0 10px'}}>
          <Grid item md={5} xs={12}>
            <Grid container>
              <Grid item md={11} xs={10} data-testid="project-title" style={{paddingTop: '20px'}}>
                <Typography variant="h4">
                  <span
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                      __html: sanitizeText(projectData?.task?.body)
                    }}
                  />
                </Typography>
              </Grid>
              <Grid item md={1} xs={2} style={{textAlign: 'right', marginTop: '20px'}}>
                <IconButton color='primary' onClick={shareOnclick}>
                  <ShareIcon />
                </IconButton>
              </Grid>
            </Grid>
            <StyledTabs
              value={tabValue}
              onChange={handleTabValueChange}
              aria-label="process-tabs"
              variant="standard"
              style={{ borderBottom: 'solid 1px #ececea' }}
            >
              <StyledTab
                label={t('task:processes.overview')}
                style={{ fontSize: '12px', textAlign: 'left' }}
                {...a11yProps(0)}
              />
              <StyledTab
                label={t('task:processes.processes')}
                style={{ fontSize: '12px' }}
                {...a11yProps(1)}
              />
            </StyledTabs>

            <TabPanel value={tabValue} index={0}>
              <ProjectOverview data={projectData?.task} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <ProjectProcesses data={stepsData?.taskSubTasks} refetch={refetch} />
            </TabPanel>
          </Grid>
          <Grid item md={7} xs={12}>
            <TabPanel value={tabValue} index={0}>
              <ProjectOverviewSplitView data={stepsData?.taskSubTasks} refetch={refetch} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <ProjectProcessesSplitView refetch={refetch} />
            </TabPanel>
          </Grid>
        </Grid>
      </TaskContextProvider>
    </div>
  );
}
