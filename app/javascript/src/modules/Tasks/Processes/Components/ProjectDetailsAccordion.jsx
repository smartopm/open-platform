/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Grid, Paper, Typography, Chip, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-apollo';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useHistory } from 'react-router';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import { ProjectRepliesRequestedComments , ProjectQuery } from '../graphql/process_queries';
import CenteredContent from '../../../../shared/CenteredContent';
import { sortRepliesRequestedComments } from '../utils';
import { dateToString } from '../../../../components/DateContainer';
import { objectAccessor, removeNewLines, sanitizeText, formatError , useParamsQuery } from '../../../../utils/helpers';
import CustomSkeleton from '../../../../shared/CustomSkeleton';
import TaskContextProvider from '../../Context';
import { SubTasksQuery, TaskQuery, TaskDocumentsQuery } from '../../graphql/task_queries';
import { StyledTabs, StyledTab, TabPanel, a11yProps } from '../../../../components/Tabs';
import ProjectOverview from './ProjectOverview';
import ProjectProcesses from './ProjectProcesses';
import ProjectDocument from './ProjectDocument';
import useDebounce from '../../../../utils/useDebounce';

export default function ProjectDetailsAccordion({ taskId }) {
  const limit = 20;
  const { t } = useTranslation(['task', 'common']);
  const classes = useStyles();
  const debouncedSearchText = useDebounce(searchText, 300);
  const [searchText, setSearchText] = useState('');
  const history = useHistory();
  const [tabValue, setTabValue] = useState(0);
  const smDownHidden = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const matches = useMediaQuery('(max-width:1000px)');
  const { data: projectData } = useQuery(
    TaskQuery,
    {
      variables: { taskId },
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all'
    }
  );
  const formUserId = projectData?.task?.formUserId;
  const { data: projectItem } = useQuery(ProjectQuery, {
    skip: !formUserId,
    variables: { formUserId },
    fetchPolicy: 'cache-and-network'
  });
  const mobileMatches = useMediaQuery('(max-width:900px)');
  const TAB_VALUES = { comments: 0, documents: 1 };
  const filterDocuments = docData?.task?.attachments?.filter(document =>
    document.filename.toLowerCase().includes(debouncedSearchText.toLowerCase())
  );

  const handleTabValueChange = (_event, newValue) => {
    history.push(
      `?tab=${Object.keys(TAB_VALUES).find(key => objectAccessor(TAB_VALUES, key) === newValue)}`
    );
    setTabValue(Number(newValue));
  };

  const { data: stepsData, refetch } = useQuery(SubTasksQuery, {
    skip: !projectItem,
    variables: {
      taskId: projectItem && projectItem?.project?.id,
      limit: projectItem?.subTasksCount || limit
    },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });
  const { data } = useQuery(ProjectRepliesRequestedComments, {
    variables: {
      taskId
    },
    fetchPolicy: 'cache-and-network'
  });
  const { data: docData, loading, error, refetch: docRefetch } = useQuery(TaskDocumentsQuery, {
    variables: { taskId },
    fetchPolicy: 'cache-and-network'
  });

  const replyRequestedComments = data?.repliesRequestedComments;
  const sentComments = replyRequestedComments?.sent.map(obj => {
    return { ...obj, status: 'Sent' };
  });
  const receivedComments = replyRequestedComments?.received.map(obj => {
    return { ...obj, status: 'Received' };
  });
  const resolvedComments = replyRequestedComments?.resolved.map(obj => {
    return { ...obj, status: 'Resolved' };
  });

  const sortedRepliesRequestedComments = sortRepliesRequestedComments(
    sentComments?.concat(receivedComments, resolvedComments, replyRequestedComments?.others)
  );

  const statusColors = {
    Sent: 'info',
    Received: 'warning',
    Resolved: 'success'
  };

  if (error) return <CenteredContent>{formatError(error.message)}</CenteredContent>;

  return (
    <Paper
      style={{
        boxShadow: '0px 0px 0px 1px #E0E0E0',
        maxHeight: '500px',
        overflowY: 'auto',
        padding: '20px'
      }}
    >
      <TaskContextProvider>
        <Grid container data-testid="process-overview-section">
          <Grid item xs={12}>
            <Grid container>
              <Grid item md={6} sm={6} xs={12} style={{ marginBottom: '35px' }}>
                <Box>
                  <Typography variant="h6" sx={{ marginRight: '0.4rem' }}>
                    {t('task.project_overview')}
                  </Typography>
                  {smDownHidden && (
                  <Box style={{ display: 'flex', marginTop: '10px' }}>
                    <Typography variant="caption" style={{ marginTop: '0.3rem' }}>
                      {t('task.project_total_documents')}
                    </Typography>
                    <Avatar className={classes.avatar} sx={{ width: 26, height: 26 }}>
                      99
                    </Avatar>
                  </Box>
                  )}
                </Box>

                <StyledTabs
                  value={tabValue}
                  onChange={handleTabValueChange}
                  aria-label="process-tabs"
                  variant="standard"
                  style={{ borderBottom: 'solid 1px #ececea' }}
                >
                  <StyledTab
                    label={t('task:processes.comments')}
                    style={
                      tabValue === objectAccessor(TAB_VALUES, 'comments')
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

              <Grid item lg={5.5} md={4.5} sm={4} xs={12} />

              {!smDownHidden && (
              <Grid item lg={0.5} md={1.5} sm={2} xs={12} sx={{ textAlign: 'center' }}>
                <Box>
                  <Typography variant="caption">{t('task.project_total_documents')}</Typography>
                </Box>
                <Box className={classes.counterBox}>1</Box>
              </Grid>
              )}
            </Grid>

            <TabPanel value={tabValue} index={0} pad>
              <Grid item md={12} style={{ marginTop: '25px' }}>
                {loading ? (
                  <CustomSkeleton variant="rectangular" width="100%" height="300px" />
                ) : sortedRepliesRequestedComments?.length === 0 ? (
                  <CenteredContent>{t('task.no_comments')}</CenteredContent>
                ) : (
                  sortedRepliesRequestedComments?.map(comment => (
                    <div key={comment.id}>
                      <Grid container>
                        <Grid item md={8} xs={12}>
                          <Grid item xs={12} style={{ display: 'flex' }}>
                            {comment.status && (
                              <Chip
                                label={comment.status}
                                color={statusColors[comment.status]}
                                size="small"
                                style={{ fontSize: '14px' }}
                                data-testid="sent-chip"
                              />
                            )}
                            <Typography
                              variant="caption"
                              style={
                                comment.status ? { margin: '0 15px' } : { marginRight: '15px' }
                              }
                            >
                              {dateToString(comment.createdAt)}
                            </Typography>
                            {comment.status && comment.status !== 'Resolved' && (
                              <Typography variant="caption" style={{ marginRight: '15px' }}>
                                {comment.status === 'Received'
                                  ? t('task.reply_submitted')
                                  : `${t('task.reply_sent_to')} ${comment.replyFrom.name}`}
                              </Typography>
                            )}
                            {(!smDownHidden || !['Received', 'Sent'].includes(comment.status)) && (
                              <>
                                <Avatar
                                  src={comment.user.imageUrl}
                                  alt="avatar-image"
                                  style={{ margin: '-2px 10px 0 0', width: '24px', height: '24px' }}
                                />
                                <Typography variant="caption">{comment.user.name}</Typography>
                              </>
                            )}
                          </Grid>
                          {smDownHidden && ['Received', 'Sent'].includes(comment.status) && (
                            <div style={{ display: 'flex', marginTop: '13px' }}>
                              <Avatar
                                src={comment.user.imageUrl}
                                alt="avatar-image"
                                style={{ margin: '-2px 10px 0 0', width: '24px', height: '24px' }}
                              />
                              <Typography variant="caption">{comment.user.name}</Typography>
                            </div>
                          )}
                          <Typography variant="caption">{comment.body}</Typography>
                        </Grid>
                        <Grid
                          item
                          md={4}
                          xs={12}
                          style={!smDownHidden ? { textAlign: 'right' } : {}}
                        >
                          <Link
                            to={`/processes/drc/projects/${comment.note.id}?tab=processes&detailTab=comments&replying_discussion=${comment.groupingId}`}
                          >
                            <Typography variant="caption">
                              <span
                                // eslint-disable-next-line react/no-danger
                                dangerouslySetInnerHTML={{
                                  __html: sanitizeText(removeNewLines(comment.note.body))
                                }}
                              />
                            </Typography>
                          </Link>
                        </Grid>
                      </Grid>
                      <hr />
                    </div>
                  ))
                )}
              </Grid>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <ProjectProcesses data={stepsData?.taskSubTasks} refetch={refetch} />
            </TabPanel>
          </Grid>
          {tabValue === 1 && (
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
            </>
          )}
        </Grid>
      </TaskContextProvider>
    </Paper>
  );
}

ProjectDetailsAccordion.propTypes = {
  taskId: PropTypes.string.isRequired
};

const useStyles = makeStyles(theme => ({
  counterBox: {
    display: 'inline-block',
    cursor: 'pointer',
    backgroundColor: theme.palette?.primary?.main,
    color: '#fff',
    fontWeight: 700,
    padding: '0.4rem 1.6rem',
    borderRadius: '0.3rem'
  },

  avatar: {
    backgroundColor: theme.palette?.primary?.main,
    fontSize: '1rem',
    marginLeft: '0.5rem'
  }
}));