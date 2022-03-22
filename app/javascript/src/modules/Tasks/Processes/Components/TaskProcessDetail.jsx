/* eslint-disable max-statements */
import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useQuery } from 'react-apollo';
import { Grid, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ShareIcon from '@mui/icons-material/Share';
import Edit from '@mui/icons-material/Edit';
import { useTranslation } from 'react-i18next';
import TaskContextProvider from '../../Context';
import { StyledTabs, StyledTab, TabPanel, a11yProps } from '../../../../components/Tabs';
import ProjectOverview, { ProjectOverviewSplitView } from './ProjectOverview';
import {
  objectAccessor,
  useParamsQuery,
  removeNewLines,
  sanitizeText,
  formatError
} from '../../../../utils/helpers';
import ProjectProcesses from './ProjectProcesses';
import ProjectProcessesSplitView from './ProjectProcessesSplitView';
import CenteredContent from '../../../../shared/CenteredContent';
import { Spinner } from '../../../../shared/Loading';
import { SubTasksQuery, TaskQuery } from '../../graphql/task_queries';
import { hrefsExtractor } from '../utils';
import MessageAlert from '../../../../components/MessageAlert';
import { ProjectQuery, ProjectCommentsQuery } from '../graphql/process_queries';
import ProjectDocument from './ProjectDocument'

export default function TaskProcessDetail() {
  const limit = 20;
  const { t } = useTranslation(['task', 'common']);
  const { id: taskId } = useParams();
  const history = useHistory();
  const path = useParamsQuery();
  const tab = path.get('tab');
  const detailTabValue = path.get('detailTab');
  const replyingDiscussion = path.get('replying_discussion');
  const [tabValue, setTabValue] = useState(0);
  const [messageAlert, setMessageAlert] = useState('');
  const matches = useMediaQuery('(max-width:600px)');
  const [splitScreenOpen, setSplitScreenOpen] = useState(false);

  const { data: projectData, error: projectDataError, loading: projectDataLoading } = useQuery(
    TaskQuery,
    {
      variables: { taskId },
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all'
    }
  );

  const formUserId = projectData?.task?.formUserId;
  const { data: projectItem } = useQuery(
    ProjectQuery, {
      skip: !formUserId,
      variables: { formUserId },
      fetchPolicy: 'cache-and-network'
    }
  );

  const { data: stepsData, loading: subStepsLoading, refetch } = useQuery(SubTasksQuery, {
    variables: { taskId, limit: projectData?.subTasks?.length || limit },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  const {
    data: comments,
    loading: commentsLoading,
    error: commentsError,
    refetch: commentsRefetch,
    fetchMore: commentsFetchMore
  } = useQuery(ProjectCommentsQuery, {
    variables: { taskId, limit: 3 },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  const TAB_VALUES = {
    overview: 0,
    processes: 1,
    documents: 2
  };


  const DETAIL_TAB_VALUES = {
    subtasks: 'subtasks',
    comments: 'comments',
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

  useEffect(() => {
    if (replyingDiscussion && detailTabValue === DETAIL_TAB_VALUES.comments && matches) {
      setSplitScreenOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, replyingDiscussion]);

  function handleProjectStepClick(task, currentTab='processes', detailTab='subtasks') {
    setSplitScreenOpen(true);
    history.push({
      pathname: `/processes/drc/projects/${task?.id}`,
      search: `?tab=${currentTab}&detailTab=${detailTab}`,
      state: { from: history.location.pathname,  search: history.location.search }
    })
    window.document.getElementById('anchor-section').scrollIntoView()
  }

  if (projectDataLoading || subStepsLoading) return <Spinner />;
  if (projectDataError) {
    return <CenteredContent>{formatError(projectDataError.message)}</CenteredContent>
  };

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
          <Grid item md={tabValue === 2 ? 12 : 5} xs={12}>
            <Grid container>
              <Grid item md={11} xs={10} data-testid="project-title" style={{paddingTop: '20px'}}>
                <Typography variant="h4">
                  <span
                    data-testid='task-title'
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                      __html: sanitizeText(removeNewLines(projectItem?.project?.body))
                    }}
                  />
                </Typography>
              </Grid>
              <Grid item md={1} xs={2} style={{textAlign: 'right', marginTop: '20px'}}>
                <IconButton color='primary' onClick={shareOnclick} size="large">
                  <ShareIcon />
                </IconButton>
                {matches && (
                  <IconButton
                    color='primary'
                    onClick={() => handleProjectStepClick(projectData?.task)}
                    size="large"
                  >
                    <Edit />
                  </IconButton>
                )}
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
                style={tabValue === objectAccessor(TAB_VALUES, 'overview')
                  ? { fontSize: '12px', textAlign: 'left', borderBottom: 'solid 1px' }
                  : { fontSize: '12px', textAlign: 'left' }}
                {...a11yProps(0)}
              />
              <StyledTab
                label={t('task:processes.processes')}
                style={tabValue ===  objectAccessor(TAB_VALUES, 'processes') ?
                  { fontSize: '12px', borderBottom: 'solid 1px' }
                  : { fontSize: '12px' }}
                {...a11yProps(1)}
              />
              <StyledTab
                label={t('task:processes.documents')}
                style={tabValue ===  objectAccessor(TAB_VALUES, 'documents') ?
                  { fontSize: '12px', borderBottom: 'solid 1px' }
                  : { fontSize: '12px' }}
                {...a11yProps(1)}
              />
            </StyledTabs>

            <TabPanel value={tabValue} index={0}>
              <ProjectOverview data={projectData?.task} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <ProjectProcesses
                data={stepsData?.taskSubTasks}
                refetch={refetch}
                handleProjectStepClick={handleProjectStepClick}
                comments={comments}
                commentsLoading={commentsLoading}
                commentsError={commentsError}
                commentsRefetch={commentsRefetch}
                commentsFetchMore={commentsFetchMore}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <ProjectDocument taskId={taskId} />
            </TabPanel>
          </Grid>
          <Grid item md={7} xs={12}>
            <TabPanel value={tabValue} index={0}>
              <ProjectOverviewSplitView
                data={stepsData?.taskSubTasks}
                refetch={refetch}
                handleProjectStepClick={handleProjectStepClick}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <ProjectProcessesSplitView
                splitScreenOpen={splitScreenOpen}
                setSplitScreenOpen={setSplitScreenOpen}
                handleProjectStepClick={handleProjectStepClick}
                refetch={refetch}
                commentsRefetch={commentsRefetch}
              />
            </TabPanel>
          </Grid>
        </Grid>
      </TaskContextProvider>
    </div>
  );
}
