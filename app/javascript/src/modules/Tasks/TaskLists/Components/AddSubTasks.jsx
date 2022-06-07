import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumbs, Grid, Typography, Dialog, DialogContent } from '@mui/material';
import { useQuery, useMutation } from 'react-apollo';
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import CenteredContent from '../../../../shared/CenteredContent';
import { formatError } from '../../../../utils/helpers';
import { Spinner } from '../../../../shared/Loading';
import TodoItem from '../../Components/TodoItem';
import SplitScreen from '../../../../shared/SplitScreen';
import TaskUpdate from '../../containers/TaskUpdate';
import { TaskListQuery } from '../graphql/task_lists_queries';
import { UsersLiteQuery } from '../../../../graphql/queries';
import { AssignUser } from '../../../../graphql/mutations';
import TaskForm from '../../Components/TaskForm';

export default function AddSubTasks() {
  const { t } = useTranslation('task');
  const classes = useStyles();
  const [splitScreenOpen, setSplitScreenOpen] = useState(false);
  const [open, setModalOpen] = useState(false);
  const { taskId } = useParams();
  const [parentTaskId, setParentTaskId] = useState('');
  const [subTasksCount, setSubTasksCount] = useState(0);
  const [assignUserToNote] = useMutation(AssignUser);
  const { data: liteData } = useQuery(UsersLiteQuery, {
    variables: {
      query:
        'user_type:admin OR user_type:custodian OR user_type:security_guard OR user_type:contractor OR user_type:site_worker'
    },
    errorPolicy: 'all'
  });

  const {
    data: taskListData,
    error: taskListDataError,
    loading: taskListDataLoading,
    refetch
  } = useQuery(TaskListQuery, {
    variables: { taskId },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  function handleTodoItemClick(task) {
    setParentTaskId(task?.id);
    setSplitScreenOpen(true);
  }

  async function assignUnassignUser(noteId, userId) {
    await assignUserToNote({ variables: { noteId, userId } });
    refetch();
  }

  function handleSplitScreenClose() {
    setSplitScreenOpen(false);
  }

  function openModal() {
    setModalOpen(!open);
  }

  function handleAddSubTask(task) {
    setParentTaskId(task?.id);
    setSubTasksCount(task?.subTasksCount);
    openModal();
  }

  if (taskListDataLoading) return <Spinner />;
  if (taskListDataError)
    return <CenteredContent>{formatError(taskListDataError.message)}</CenteredContent>;

  return (
    <div className="container">
      <Grid container spacing={1}>
        <Dialog
          open={open}
          onClose={openModal}
          fullScreen
          fullWidth
          maxWidth="lg"
          aria-labelledby="task_modal"
        >
          <DialogContent>
            <TaskForm
              refetch={refetch}
              close={() => setModalOpen(!open)}
              assignUser={assignUnassignUser}
              users={liteData?.usersLite}
              parentTaskId={parentTaskId}
              subTasksCount={subTasksCount}
              createTaskListSubTask
            />
          </DialogContent>
        </Dialog>

        <Grid item md={12} xs={12} style={{ paddingleft: '10px' }}>
          <div role="presentation">
            <Breadcrumbs
              aria-label="breadcrumb"
              style={{ paddingBottom: '10px', marginTop: '-45px' }}
            >
              <Link to="/tasks/task_lists">
                <Typography color="primary" style={{ marginLeft: '5px' }}>
                  {t('task_lists.task_lists')}
                </Typography>
              </Link>
              <Typography color="text.primary">{t('task_lists.configure_task_list')}</Typography>
            </Breadcrumbs>
          </div>
        </Grid>
        <Grid item md={12} xs={11} className={classes.header}>
          <Grid container spacing={1}>
            <Grid item md={9} xs={10}>
              <Typography
                variant="h4"
                style={{ marginLeft: '5px', marginBottom: '10px', marginTop: '-10px' }}
              >
                {t('task_lists.configure_task_list')}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item md={12} xs={12}>
          <Grid container spacing={2}>
            <Grid item md={12} xs={12}>
              <Typography variant="body1">{t('task_lists.step_2')}</Typography>
            </Grid>
            <Grid item md={12} xs={12} style={{ marginBottom: 10 }}>
              <Typography variant="body2">{t('task_lists.step_2_sub_header')}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {taskListData?.taskList !== undefined && (
        <div>
          <br />
          <TodoItem
            key={taskListData?.taskList?.id}
            task={taskListData?.taskList}
            handleAddSubTask={handleAddSubTask}
            handleTodoClick={handleTodoItemClick}
            createTaskListSubTask
          />
        </div>
      )}
      {taskListData?.taskList?.id !== undefined && (
        <SplitScreen open={splitScreenOpen} onClose={() => setSplitScreenOpen(false)}>
          <TaskUpdate
            taskId={parentTaskId || taskListData?.taskList?.id}
            handleSplitScreenClose={handleSplitScreenClose}
          />
        </SplitScreen>
      )}
    </div>
  );
}

const useStyles = makeStyles({
  header: {
    marginBottom: '10px'
  }
});
