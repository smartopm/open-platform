import React, {useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router';
import { useQuery } from 'react-apollo';
import { Grid,Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import TaskContextProvider from "../../Context";
import { StyledTabs, StyledTab, TabPanel, a11yProps } from '../../../../components/Tabs';
import ProjectOverview, { ProjectOverviewSplitView } from './ProjectOverview';
import { objectAccessor, sanitizeText, useParamsQuery } from '../../../../utils/helpers';
import ProjectProcesses, { ProjectProcessesSplitView } from './ProjectProcesses';
import ErrorPage from '../../../../components/Error'
import Loading from '../../../../shared/Loading'
import { SubTasksQuery, TaskQuery } from '../../graphql/task_queries';

export default function TaskProcessDetail() {
  const limit = 20;
  const { t } = useTranslation(['task', 'common']);
  const { id: taskId } = useParams();
  const history = useHistory();
  const path = useParamsQuery();
  const tab = path.get('tab');
  const [tabValue, setTabValue] = useState(0);

  const { data: projectData, error: projectDataError, loading: projectDataLoading } = useQuery(TaskQuery, {
    variables: { taskId },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  const { data: stepsData, loading: subStepsLoading, refetch } = useQuery(SubTasksQuery, {
    variables: { taskId, limit:  projectData?.subTasks?.length || limit },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  const TAB_VALUES = {
    overview: 0,
    processes: 1,
    documents: 2
  };


  function handleTabValueChange(_event, newValue) {
    history.push(`?tab=${Object.keys(TAB_VALUES).find(key => objectAccessor(TAB_VALUES, key) === newValue)}`);
    setTabValue(Number(newValue));
  }

  useEffect(() => {
    if (tab) {
      setTabValue(objectAccessor(TAB_VALUES, tab));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, tab]);

  
  if (projectDataLoading || subStepsLoading) return <Loading />
  if (projectDataError) return <ErrorPage title={projectDataError.message} />

  return (
    <div>
      <TaskContextProvider>
        <Grid container data-testid="process-detail-section">
          <Grid item md={6} xs={12}>
            <Grid container>
              <Grid item data-testid="project-title">
                <Typography variant="h6">
                  <span
                  // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                    __html: sanitizeText(projectData?.task?.body)
                  }}
                  />
                </Typography>
              </Grid>
            </Grid>
            <StyledTabs
              value={tabValue}
              onChange={handleTabValueChange}
              aria-label="process-tabs"
              variant="standard"
              style={{ borderBottom: 'solid 1px #ececea'}}
            >
              <StyledTab label={t('task:processes.overview')} style={{fontSize: '12px', textAlign: 'left'}} {...a11yProps(0)} />
              <StyledTab label={t('task:processes.processes')} style={{fontSize: '12px'}} {...a11yProps(1)} />
            </StyledTabs>

            <TabPanel value={tabValue} index={0}>
              <ProjectOverview data={projectData?.task} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <ProjectProcesses data={stepsData?.taskSubTasks} refetch={refetch} />
            </TabPanel>
          </Grid>
          <Grid item md={6} xs={12}>
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
  )
}
