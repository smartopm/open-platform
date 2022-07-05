import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from 'react-apollo';
import { Dialog } from '@mui/material';
import { formatError, useParamsQuery } from '../../../../utils/helpers';
import CenteredContent from '../../../../shared/CenteredContent';
import Paginate from '../../../../components/Paginate';
import { Spinner } from '../../../../shared/Loading';
import { TaskListsQuery } from '../graphql/task_lists_queries';
import TodoItem from '../../Components/TodoItem';
import AccessCheck from '../../../Permissions/Components/AccessCheck';
import FloatingButton from '../../../../shared/buttons/FloatingButton';
import PageWrapper from '../../../../shared/PageWrapper';
import SplitScreen from '../../../../shared/SplitScreen';
import TaskUpdate from '../../containers/TaskUpdate';
import MessageAlert from '../../../../components/MessageAlert';
import TaskForm from '../../Components/TaskForm';
import { AssignUser, UpdateNote } from '../../../../graphql/mutations';
import { UsersLiteQuery } from '../../../../graphql/queries';

export default function TaskLists() {
  const { t } = useTranslation('task');
  const [offset, setOffset] = useState(0);
  const limit = 50;
  const history = useHistory();
  const { data, loading, refetch, error } = useQuery(TaskListsQuery, {
    variables: {
      offset,
      limit
    },
    fetchPolicy: 'cache-and-network'
  });
  const [splitScreenOpen, setSplitScreenOpen] = useState(false);
  const [taskUpdate] = useMutation(UpdateNote);
  const [taskUpdateStatus, setTaskUpdateStatus] = useState({ message: '', success: false });
  const [open, setModalOpen] = useState(false);

  const path = useParamsQuery();
  const redirectedTaskListId = path.get('taskListId');
  const [parentTaskId, setParentTaskId] = useState('');
  const [subTasksCount, setSubTasksCount] = useState(0);
  const [assignUserToNote] = useMutation(AssignUser);
  const [loadAssignees, { data: liteData, called }] = useLazyQuery(UsersLiteQuery, {
    variables: {
      query:
        'user_type:admin OR user_type:custodian OR user_type:security_guard OR user_type:contractor OR user_type:site_worker OR user_type:consultant OR user_type:developer',
    },
    errorPolicy: 'all',
  });

  useEffect(() => {
    if (redirectedTaskListId) {
      setSplitScreenOpen(true);
    }
  }, [redirectedTaskListId]);

  useEffect(() => {
    if (open) {
      loadAssignees();
    }
  }, [open, loadAssignees]);

  function redirectToTaskListCreatePage() {
    history.push('/tasks/task_lists/new');
  }

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

  function handleTaskListClick(task) {
    setSplitScreenOpen(true);
    history.push({
      pathname: '/tasks/task_lists',
      search: `?taskListId=${task?.id}`,
      state: { from: history.location.pathname, noteList: task?.noteList, task },
    });
  }

  function handleSplitScreenClose() {
    setSplitScreenOpen(false);
    if (history.location.state?.search?.includes('filter')) {
      return history.push({
        pathname: '/tasks/task_lists',
        search: history.location.state.search,
      });
    }
    return history.push('/tasks/task_lists');
  }

  function handleTaskCompletion(selectedTaskId, completed) {
    taskUpdate({ variables: { id: selectedTaskId, completed } })
      .then(() => {
        refetch();
        setTaskUpdateStatus({
          ...taskUpdateStatus,
          success: true,
          message: `${t('task.task_marked_as')} ${
            completed ? t('task.complete') : t('task.incomplete')
          }`,
        });
      })
      .catch(err => {
        setTaskUpdateStatus({
          ...taskUpdateStatus,
          success: false,
          message: formatError(err.message),
        });
      });
  }

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setTaskUpdateStatus({
      ...taskUpdateStatus,
      message: '',
    });
  }

  function handleCloseTaskForm() {
    if (open) {
      setParentTaskId('');
      setSubTasksCount(0);
    }
    setModalOpen(!open);
  }

  function handleAddSubTask(task) {
    setParentTaskId(task?.id);
    setSubTasksCount(task?.subTasksCount);
    setModalOpen(!open);
  }

  function assignUnassignUser(noteId, userId) {
    assignUserToNote({ variables: { noteId, userId } })
      .then(() => {
        if (called) {
          refetch();
        }
      })
      .catch(err =>
        setTaskUpdateStatus({ ...taskUpdateStatus, success: false, message: err.message })
      );
  }
  return (
    <>
      <Dialog
        fullScreen
        open={open}
        fullWidth
        onClose={() => setModalOpen(!open)}
        aria-labelledby="task_modal"
      >
        <TaskForm
          refetch={() => refetch()}
          close={() => handleCloseTaskForm()}
          assignUser={assignUnassignUser}
          users={liteData?.usersLite}
          parentTaskId={parentTaskId}
          subTasksCount={subTasksCount}
        />
      </Dialog>
      <PageWrapper pageTitle={t('task_lists.task_lists')}>
        <MessageAlert
          type={taskUpdateStatus.success ? 'success' : 'error'}
          message={taskUpdateStatus.message}
          open={!!taskUpdateStatus.message}
          handleClose={handleMessageAlertClose}
        />
        {Boolean(data?.taskLists?.length) && (
          <SplitScreen open={splitScreenOpen} onClose={() => setSplitScreenOpen(false)}>
            <TaskUpdate
              taskId={redirectedTaskListId || data?.taskLists[0].id}
              handleSplitScreenOpen={handleTaskListClick}
              handleSplitScreenClose={handleSplitScreenClose}
            />
          </SplitScreen>
        )}
        {data?.taskLists?.length > 0 ? (
          <div>
            {data.taskLists.map(taskList => (
              <div key={taskList.id}>
                <TodoItem
                  key={taskList?.id}
                  task={taskList}
                  taskId={taskList.id}
                  refetch={refetch}
                  handleTodoClick={handleTaskListClick}
                  handleTaskCompletion={handleTaskCompletion}
                  handleAddSubTask={handleAddSubTask}
                />
              </div>
            ))}
          </div>
        ) : (
          <CenteredContent>{t('task_lists.no_task_lists')}</CenteredContent>
        )}
        <CenteredContent>
          <Paginate
            count={data?.taskLists?.length}
            offSet={offset}
            limit={limit}
            active={offset > 1}
            handlePageChange={paginate}
          />
        </CenteredContent>
        <AccessCheck
          module="note"
          allowedPermissions={['can_view_create_task_button']}
          show404ForUnauthorized={false}
        >
          <FloatingButton
            variant="extended"
            handleClick={redirectToTaskListCreatePage}
            color="primary"
            data-testid="create_task_btn"
          />
        </AccessCheck>
      </PageWrapper>
    </>
  );
}
