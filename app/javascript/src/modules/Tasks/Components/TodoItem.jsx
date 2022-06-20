/* eslint-disable max-lines */
/* eslint-disable max-statements */
/* eslint-disable complexity */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery, useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import makeStyles from '@mui/styles/makeStyles';
import { useLocation, useHistory } from 'react-router-dom';
import TaskDataList from './TaskDataList';
import FileUploader from './FileUploader';
import { objectAccessor, sortTaskOrder, formatError, useParamsQuery } from '../../../utils/helpers';
import MenuList from '../../../shared/MenuList';
import { SubTasksQuery } from '../graphql/task_queries';
import { LinearSpinner } from '../../../shared/Loading';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import OpenTaskDataList from '../Processes/Components/OpenTaskDataList';
import TaskListDataList from '../TaskLists/Components/TaskListDataList';
import { ActionDialog } from '../../../components/Dialog';
import MessageAlert from '../../../components/MessageAlert';
import { DeleteTaskList } from '../TaskLists/graphql/task_list_mutation';
import ProjectDetailsAccordion from '../Processes/Components/ProjectDetailsAccordion';

export default function TodoItem({
  task,
  taskId,
  query,
  handleChange,
  selectedTasks,
  isSelected,
  handleAddSubTask,
  handleUploadDocument,
  handleTodoClick,
  handleTaskCompletion,
  clientView,
  createTaskListSubTask,
  refetch,
  showWidgetsIcon
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasksOpen, setTasksOpen] = useState({});
  const [projectsAccordionOpen, setProjectsAccordionOpen] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const anchorElOpen = Boolean(anchorEl);
  const { t } = useTranslation('common');
  const history = useHistory();
  const location = useLocation();
  const authState = React.useContext(AuthStateContext);
  const taskPermissions = authState?.user?.permissions?.find(
    permissionObject => permissionObject.module === 'note'
  );
  const canCreateNote = taskPermissions
    ? taskPermissions.permissions.includes('can_create_note')
    : false;
  const canUpdateNote = taskPermissions
    ? taskPermissions.permissions.includes('can_update_note')
    : false;
  const [loadSubTasks, { data, loading: isLoadingSubTasks }] = useLazyQuery(SubTasksQuery, {
    variables: { taskId: task?.id, limit: task?.subTasksCount },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });
  const [isDialogOpen, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [info, setInfo] = useState({ loading: false, error: false, message: '' });
  const [taskListDelete] = useMutation(DeleteTaskList);
  const currentPath = useParamsQuery();
  const currentProjectId = currentPath.get('project_id');

  let menuList = [
    {
      content: t('menu.open_task_details'),
      isAdmin: true,
      handleClick: () => handleTaskDetails()
    },
    {
      content: canCreateNote ? t('menu.add_subtask') : null,
      isAdmin: true,
      handleClick: () => handleAddSubTask(selectedTask)
    },
    {
      content: <FileUploader handleFileInputChange={handleFileInputChange} />,
      isAdmin: true,
      handleClick: () => {}
    },
    {
      content: t('menu.leave_a_comment'),
      isAdmin: true,
      handleClick: () => handleTaskDetails({ id: selectedTask.id, comment: true })
    },
    {
      content:
        // eslint-disable-next-line no-nested-ternary
        canUpdateNote
          ? selectedTask && selectedTask.completed
            ? t('menu.mark_incomplete')
            : t('menu.mark_complete')
          : null,
      isAdmin: true,
      handleClick: () => handleNoteComplete()
    }
  ];

  if (location.pathname === '/processes') {
    menuList = [
      {
        content: t('menu.open_project_details'),
        isAdmin: true,
        handleClick: () => handleTaskDetails()
      }
    ];
  }

  if (location.pathname === '/tasks/task_lists') {
    const { noteList } = task;
    menuList = [
      {
        content: t('menu.edit_task_list'),
        isAdmin: true,
        handleClick: () =>
          history.push({
            pathname: `/tasks/task_lists/edit/${noteList?.id}`,
            state: { noteList, task }
          })
      },
      {
        content: t('menu.delete_task_list'),
        isAdmin: true,
        handleClick: () => handleDeleteTaskList()
      }
    ];
  }

  const menuData = {
    menuList,
    anchorEl,
    handleTodoMenu,
    open: anchorElOpen,
    handleClose
  };

  useEffect(() => {
    if (currentProjectId && currentProjectId === task?.id) {
      setProjectsAccordionOpen({
        ...projectsAccordionOpen,
        [task.id]: !objectAccessor(projectsAccordionOpen, currentProjectId)
      });
    }
  }, []);

  function handleDeleteTaskList() {
    setOpen(!isDialogOpen);
    setAnchorEl(null);
  }

  function handleTaskListDelete() {
    taskListDelete({
      variables: { id: task.noteList?.id }
    })
      .then(() => {
        setInfo({
          ...info,
          message: t('menu.task_list_deleted'),
          loading: false
        });
        setTimeout(refetch, 500);
        setAlertOpen(true);
        setOpen(!isDialogOpen);
      })
      .catch(err => {
        setInfo({
          ...info,
          error: true,
          message: formatError(err.message)
        });
        setAlertOpen(true);
      });
  }

  function handleTodoMenu(event, taskItem) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedTask(taskItem);
  }

  function handleTaskDetails() {
    setAnchorEl(null);
    handleTodoClick(selectedTask);
  }

  function handleClose(event) {
    event.stopPropagation();
    setAnchorEl(null);
    setSelectedTask(null);
  }

  function handleNoteComplete() {
    setIsUpdating(true);
    toggleTask(selectedTask);
    handleTaskCompletion(selectedTask.id, !selectedTask.completed);
  }

  function handleFileInputChange(event, taskToAttach = null) {
    event.stopPropagation();
    setIsUpdating(true);
    toggleTask(selectedTask || taskToAttach);
    handleUploadDocument(event, selectedTask || taskToAttach);
    handleClose(event);
  }

  function toggleTask(taskItem) {
    setTasksOpen({
      ...tasksOpen,
      [taskItem.id]: !objectAccessor(tasksOpen, taskItem.id)
    });
  }

  function handleParentTaskClick(e) {
    e.stopPropagation();
    if (task && !(data?.subTasksCount > 0)) {
      loadSubTasks();
    }

    toggleTask(task);
  }

  function handleTodoItemClick(taskItem, tab) {
    handleTodoClick(taskItem, 'processes', tab);
  }

  function handleToggleProjectAccordionOverview() {
    setProjectsAccordionOpen({
      ...projectsAccordionOpen,
      [task.id]: !objectAccessor(projectsAccordionOpen, task.id)
    });
  }

  return (
    <>
      <div style={{ marginBottom: '10px' }} key={task?.id}>
        <MessageAlert
          type={info.error ? 'error' : 'success'}
          message={info.message}
          open={alertOpen}
          handleClose={() => setAlertOpen(false)}
        />

        <ActionDialog
          open={isDialogOpen}
          handleClose={handleDeleteTaskList}
          handleOnSave={handleTaskListDelete}
          message={t('menu.task_list_delete_confirmation_message')}
        />

        {createTaskListSubTask && task && (
          <TaskListDataList
            task={task}
            handleOpenSubTasksClick={handleParentTaskClick}
            handleTodoClick={handleTodoClick}
            handleAddSubTask={() => handleAddSubTask(task)}
            menuData={menuData}
            styles={{ backgroundColor: '#F5F5F4' }}
            openSubTask={objectAccessor(tasksOpen, task.id)}
          />
        )}

        {clientView && taskId !== null ? (
          <OpenTaskDataList
            taskId={taskId}
            handleTaskCompletion={handleTaskCompletion}
            handleTodoClick={handleTodoClick}
          />
        ) : (
          !createTaskListSubTask &&
          task && (
            <TaskDataList
              key={task?.id}
              task={task}
              query={query}
              handleChange={handleChange}
              selectedTasks={selectedTasks}
              isSelected={isSelected}
              menuData={menuData}
              styles={{ marginBottom: 0 }}
              openSubTask={objectAccessor(tasksOpen, task.id)}
              handleOpenSubTasksClick={handleParentTaskClick}
              handleClick={tab => handleTodoItemClick(task, tab)}
              handleTaskCompletion={handleTaskCompletion}
              clientView={clientView}
              taskCommentHasReply={task?.taskCommentReply}
              handleOpenProjectClick={handleToggleProjectAccordionOverview}
              openProject={
                location.pathname.match(/\bprocesses\b/) &&
                objectAccessor(projectsAccordionOpen, task?.id)
              }
              showWidgetsIcon={showWidgetsIcon}
            />
          )
        )}

        {(isLoadingSubTasks || (isUpdating && objectAccessor(tasksOpen, task?.id))) && (
          <LinearSpinner />
        )}
      </div>

      {location.pathname.match(/\bprocesses\b/) && objectAccessor(projectsAccordionOpen, task?.id) && (
        <div className={classes.levelOne}>
          <ProjectDetailsAccordion
            taskId={task?.id}
            handleCloseAccordion={handleToggleProjectAccordionOverview}
          />
        </div>
      )}

      {objectAccessor(tasksOpen, task?.id) &&
        data?.taskSubTasks?.length > 0 &&
        data?.taskSubTasks?.sort(sortTaskOrder)?.map(firstLevelSubTask => (
          <>
            <div className={classes.levelOne} key={firstLevelSubTask.id}>
              {!createTaskListSubTask ? (
                <TaskDataList
                  key={firstLevelSubTask.id}
                  task={firstLevelSubTask}
                  handleChange={handleChange}
                  selectedTasks={selectedTasks}
                  isSelected={isSelected}
                  menuData={menuData}
                  styles={{ backgroundColor: '#F5F5F4' }}
                  openSubTask={objectAccessor(tasksOpen, firstLevelSubTask.id)}
                  handleOpenSubTasksClick={() => toggleTask(firstLevelSubTask)}
                  clickable
                  handleClick={() => handleTodoItemClick(firstLevelSubTask)}
                  handleTaskCompletion={handleTaskCompletion}
                  clientView={clientView}
                  taskCommentHasReply={false}
                  subTaskCard
                  alignStyles={{ marginLeft: '-12px' }}
                />
              ) : (
                <TaskListDataList
                  task={firstLevelSubTask}
                  handleOpenSubTasksClick={() => toggleTask(firstLevelSubTask)}
                  handleTodoClick={handleTodoClick}
                  handleAddSubTask={() => handleAddSubTask(firstLevelSubTask)}
                  menuData={menuData}
                  styles={{ backgroundColor: '#F5F5F4' }}
                  openSubTask={objectAccessor(tasksOpen, firstLevelSubTask.id)}
                  subTaskCard
                  alignStyles={{ marginLeft: '-12px' }}
                />
              )}
            </div>
            {firstLevelSubTask?.subTasksCount > 0 &&
              objectAccessor(tasksOpen, firstLevelSubTask?.id) && (
                <>
                  {firstLevelSubTask?.subTasks?.sort(sortTaskOrder)?.map(secondLevelSubTask => (
                    <div className={classes.levelTwo} key={secondLevelSubTask.id}>
                      {!createTaskListSubTask ? (
                        <TaskDataList
                          key={secondLevelSubTask.id}
                          task={secondLevelSubTask}
                          handleChange={handleChange}
                          selectedTasks={selectedTasks}
                          isSelected={isSelected}
                          menuData={menuData}
                          styles={{ backgroundColor: '#ECECEA' }}
                          clickable
                          handleClick={() => handleTodoItemClick(secondLevelSubTask)}
                          handleTaskCompletion={handleTaskCompletion}
                          clientView={clientView}
                          taskCommentHasReply={false}
                          subTaskCard
                          alignStyles={{ marginLeft: '-24px' }}
                        />
                      ) : (
                        <TaskListDataList
                          subTaskCard
                          isSecondLevelSubTask
                          task={secondLevelSubTask}
                          handleTodoClick={handleTodoClick}
                          menuData={menuData}
                          styles={{ backgroundColor: '#F5F5F4' }}
                          alignStyles={{ marginLeft: '-32px' }}
                        />
                      )}
                    </div>
                  ))}
                </>
              )}
          </>
        ))}
      {!createTaskListSubTask && (
        <MenuList
          open={menuData.open}
          anchorEl={menuData.anchorEl}
          handleClose={menuData.handleClose}
          list={menuData.menuList.filter(menuItem => menuItem.content !== null)}
        />
      )}
    </>
  );
}

const Task = {
  id: PropTypes.string,
  body: PropTypes.string,
  completed: PropTypes.bool,
  author: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string
  }),
  assignees: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string
    })
  ),
  subTasks: PropTypes.arrayOf(PropTypes.object)
};

TodoItem.defaultProps = {
  clientView: false,
  createTaskListSubTask: false,
  taskId: null,
  task: null,
  query: '',
  handleChange: () => {},
  selectedTasks: [],
  isSelected: false,
  handleAddSubTask: () => {},
  handleUploadDocument: () => {},
  handleTodoClick: () => {},
  handleTaskCompletion: () => {},
  refetch: () => {},
  showWidgetsIcon: false
};

TodoItem.propTypes = {
  task: PropTypes.shape(Task),
  query: PropTypes.string,
  handleChange: PropTypes.func,
  selectedTasks: PropTypes.arrayOf(PropTypes.string),
  isSelected: PropTypes.bool,
  handleAddSubTask: PropTypes.func,
  handleUploadDocument: PropTypes.func,
  handleTodoClick: PropTypes.func,
  handleTaskCompletion: PropTypes.func,
  clientView: PropTypes.bool,
  createTaskListSubTask: PropTypes.bool,
  taskId: PropTypes.string,
  refetch: PropTypes.func,
  showWidgetsIcon: PropTypes.bool
};

const useStyles = makeStyles(() => ({
  levelOne: {
    backgroundColor: '#f5f5f4',
    marginBottom: '8px',
    marginLeft: '16px'
  },
  levelTwo: {
    backgroundColor: '#ececea',
    marginLeft: '32px',
    marginBottom: '8px'
  }
}));
