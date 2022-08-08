/* eslint-disable complexity */
/* eslint-disable max-statements */
import React, { useState, useEffect, useContext } from 'react';
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
import ProjectOverview from './ProjectOverview';
import ProjectOverviewSplitView from './ProjectOverviewSplitView';
import {
  objectAccessor,
  useParamsQuery,
  removeNewLines,
  formatError,
} from '../../../../utils/helpers';
import ProjectProcesses from './ProjectProcesses';
import ProjectProcessesSplitView from './ProjectProcessesSplitView';
import CenteredContent from '../../../../shared/CenteredContent';
import { Spinner } from '../../../../shared/Loading';
import { getFormUrl } from '../utils';
import { ProjectQuery, ProjectCommentsQuery } from '../graphql/process_queries';
import ProjectDocument from './ProjectDocument';
import { SubTasksQuery, TaskQuery, TaskDocumentsQuery } from '../../graphql/task_queries';
import SearchInput from '../../../../shared/search/SearchInput';
import useDebounce from '../../../../utils/useDebounce';
import PageWrapper from '../../../../shared/PageWrapper';
import { SnackbarContext } from '../../../../shared/snackbar/Context';

export default function TaskProcessDetail() {
  const limit = 20;
  const { t } = useTranslation(['task', 'common', 'processes']);
  const { processId, id: taskId } = useParams();
  const history = useHistory();
  const path = useParamsQuery();
  const tab = path.get('tab');
  const detailTabValue = path.get('detailTab');
  const processName = path.get('processName');
  const replyingDiscussion = path.get('replying_discussion');
  const [tabValue, setTabValue] = useState(0);
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText, 300);
  const matches = useMediaQuery('(max-width:1000px)');
  const mobileMatches = useMediaQuery('(max-width:900px)');
  const [splitScreenOpen, setSplitScreenOpen] = useState(false);

  const { showSnackbar, messageType } = useContext(SnackbarContext);

  const { data: projectData, error: projectDataError, loading: projectDataLoading } = useQuery(
    TaskQuery,
    {
      variables: { taskId },
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    }
  );

  const formUserId = projectData?.task?.formUserId;
  const { data: projectItem, loading: projectItemLoading } = useQuery(ProjectQuery, {
    skip: !formUserId,
    variables: { formUserId },
    fetchPolicy: 'cache-and-network',
  });

  const { data: stepsData, loading: subStepsLoading, refetch } = useQuery(SubTasksQuery, {
    skip: !projectItem,
    variables: {
      taskId: projectItem && projectItem?.project?.id,
      limit: projectItem?.subTasksCount || limit,
    },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const { data: docData, loading, error, refetch: docRefetch } = useQuery(TaskDocumentsQuery, {
    variables: { taskId },
    fetchPolicy: 'cache-and-network',
  });

  const {
    data: comments,
    loading: commentsLoading,
    error: commentsError,
    refetch: commentsRefetch,
    fetchMore: commentsFetchMore,
  } = useQuery(ProjectCommentsQuery, {
    variables: { taskId, limit: 3 },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const TAB_VALUES = {
    overview: 0,
    processes: 1,
    documents: 2,
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

  const filterDocuments = docData?.task?.attachments?.filter(document =>
    document.filename.toLowerCase().includes(debouncedSearchText.toLowerCase())
  );

  async function shareOnclick() {
    await navigator.clipboard.writeText(getFormUrl(projectData?.task?.formUser?.formId));
    showSnackbar({ type: messageType.success, message: 'Link copied to clipboard' });
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

  function handleProjectStepClick(task, currentTab = 'processes', detailTab = 'subtasks') {
    setSplitScreenOpen(true);
    history.push({
      pathname: `/processes/${processId}/projects/${task?.id}`,
      search: `?tab=${currentTab}&detailTab=${detailTab}`,
      state: { from: history.location.pathname, search: history.location.search },
    });
    window.document.getElementById('anchor-section')?.scrollIntoView();
  }

  if (projectDataLoading) return <Spinner />;
  if (projectDataError) {
    return <CenteredContent>{formatError(projectDataError.message)}</CenteredContent>;
  }

  const breadCrumbObj = {
    extraBreadCrumb: t('processes.processes'),
    extraBreadCrumbLink: '/processes',
    linkText: `${processName}`,
    linkHref: `/processes/${processId}/projects?process_name=${processName}`,
    pageName: t('common:misc.process_detail_page'),
  };

  return (
    <PageWrapper
      pageTitle={projectItemLoading ? <Spinner /> : removeNewLines(projectItem?.project?.body)}
      breadCrumbObj={breadCrumbObj}
    >
      <TaskContextProvider>
        <Grid
          container
          data-testid="process-detail-section"
          style={!matches ? { padding: '0 56px' } : { padding: '0 20px' }}
        >
          <Grid item md={5} xs={12}>
            <Grid container style={{ marginBottom: '10px' }}>
              <Grid item md={11} xs={10} data-testid="project-title">
                <StyledTabs
                  value={tabValue}
                  onChange={handleTabValueChange}
                  aria-label="process-tabs"
                  variant="standard"
                  style={{ borderBottom: 'solid 1px #ececea' }}
                >
                  <StyledTab
                    label={t('task:processes.overview')}
                    style={
                      tabValue === objectAccessor(TAB_VALUES, 'overview')
                        ? { fontSize: '12px', textAlign: 'left', borderBottom: 'solid 1px' }
                        : { fontSize: '12px', textAlign: 'left' }
                    }
                    {...a11yProps(0)}
                  />
                  <StyledTab
                    label={t('task:processes.processes')}
                    style={
                      tabValue === objectAccessor(TAB_VALUES, 'processes')
                        ? { fontSize: '12px', borderBottom: 'solid 1px' }
                        : { fontSize: '12px' }
                    }
                    {...a11yProps(1)}
                  />
                  <StyledTab
                    label={t('task:processes.documents')}
                    style={
                      tabValue === objectAccessor(TAB_VALUES, 'documents')
                        ? { fontSize: '12px', borderBottom: 'solid 1px' }
                        : { fontSize: '12px' }
                    }
                    {...a11yProps(1)}
                  />
                </StyledTabs>
              </Grid>
              <Grid item md={1} xs={2} style={{ textAlign: 'right', marginTop: '20px' }}>
                <IconButton color="primary" onClick={shareOnclick} size="large">
                  <ShareIcon />
                </IconButton>
                {matches && (
                  <IconButton
                    color="primary"
                    onClick={() => handleProjectStepClick(projectData?.task)}
                    size="large"
                  >
                    <Edit />
                  </IconButton>
                )}
              </Grid>
            </Grid>

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
          </Grid>
          {tabValue === 2 && (
            <>
              {mobileMatches && docData?.task?.attachments?.length > 0 && (
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    style={{ padding: '20px 0 0 0' }}
                    color="textSecondary"
                  >
                    {t('processes.documents')}
                  </Typography>
                </Grid>
              )}
              <Grid item md={2} xs={12} />
              {docData?.task?.attachments?.length > 0 && (
                <Grid
                  item
                  md={5}
                  xs={12}
                  style={mobileMatches ? { margin: '20px 0' } : { marginTop: '55px' }}
                >
                  <SearchInput
                    filterRequired={false}
                    title={t('processes.documents')}
                    searchValue={searchText}
                    handleSearch={e => setSearchText(e.target.value)}
                    handleClear={() => setSearchText('')}
                    data-testid="search_input"
                  />
                </Grid>
              )}
            </>
          )}
          <Grid item md={tabValue === 2 ? 12 : 7} xs={12}>
            <TabPanel value={tabValue} index={0}>
              {subStepsLoading ? (
                <Spinner />
              ) : (
                <ProjectOverviewSplitView
                  data={stepsData?.taskSubTasks || []}
                  refetch={refetch}
                  handleProjectStepClick={handleProjectStepClick}
                />
              )}
            </TabPanel>
            <TabPanel value={tabValue} index={1} pad>
              <ProjectProcessesSplitView
                splitScreenOpen={!matches ? true : splitScreenOpen}
                setSplitScreenOpen={setSplitScreenOpen}
                handleProjectStepClick={handleProjectStepClick}
                refetch={refetch}
                commentsRefetch={commentsRefetch}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={2} pad>
              <ProjectDocument
                attachments={searchText !== '' ? filterDocuments : docData?.task?.attachments}
                loading={loading}
                refetch={docRefetch}
                error={error?.message}
              />
            </TabPanel>
          </Grid>
        </Grid>
      </TaskContextProvider>
    </PageWrapper>
  );
}
