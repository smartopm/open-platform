/* eslint-disable max-statements */
/* eslint-disable complexity */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { useLocation } from 'react-router'
import TaskDataList from './TaskDataList';
import FileUploader from './FileUploader';
import { objectAccessor } from '../../../utils/helpers';
import MenuList from '../../../shared/MenuList';
import { SubTasksQuery } from '../graphql/task_queries';
import { LinearSpinner } from '../../../shared/Loading';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import OpenTaskDataList from '../Processes/Components/OpenTaskDataList';

export default function TodoItem({
  task,
  taskId,
  handleChange,
  selectedTasks,
  isSelected,
  handleAddSubTask,
  handleUploadDocument,
  handleTodoClick,
  handleTaskCompletion,
  clientView
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedSubSubTask, setSelectedSubSubTask] = useState(null);
  const [tasksOpen, setTasksOpen] = useState({});
  const [isUpdating, setIsUpdating] = useState(false)
  const anchorElOpen = Boolean(anchorEl);
  const { t } = useTranslation('common');
  const location = useLocation()
  const authState = React.useContext(AuthStateContext);
  const taskPermissions = authState?.user?.permissions?.find(permissionObject => permissionObject.module === 'note')
  const canCreateNote = taskPermissions? taskPermissions.permissions.includes('can_create_note'): false
  const canUpdateNote = taskPermissions? taskPermissions.permissions.includes('can_update_note'): false

  const [
    loadSubTasks,
    { data, loading: isLoadingSubTasks }
  ] = useLazyQuery(SubTasksQuery, {
    variables: { taskId: task?.id, limit: task?.subTasksCount },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  const [
    loadSubSubTasks,
    { data: subSubTasksData, loading: isLoadingSubSubTasks }
  ] = useLazyQuery(SubTasksQuery, {
    variables: { taskId: selectedSubSubTask?.id, limit: selectedSubSubTask?.subTasksCount },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  let menuList = [
    {
      content: t('menu.open_task_details'),
      isAdmin: true,
      handleClick: () => handleTaskDetails()
    },
    {
      content:  canCreateNote ? t('menu.add_subtask'): null,
      isAdmin: true,
      handleClick: () => handleAddSubTask({ id: selectedTask.id })
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
        canUpdateNote ? selectedTask && selectedTask.completed
          ? t('menu.mark_incomplete')
          : t('menu.mark_complete'): null,
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
      }]
  }

  const menuData = {
    menuList,
    anchorEl,
    handleTodoMenu,
    open: anchorElOpen,
    handleClose
  };

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

  function handleNoteComplete(){
    setIsUpdating(true)
    toggleTask(selectedTask)
    handleTaskCompletion(selectedTask.id, !selectedTask.completed)
  }

  function handleFileInputChange(event, taskToAttach = null) {
    event.stopPropagation()
    setIsUpdating(true)
    toggleTask(selectedTask || taskToAttach)
    handleUploadDocument(event, selectedTask || taskToAttach);
    handleClose(event);
  }

  function toggleTask(taskItem){
    setTasksOpen({
      ...tasksOpen,
      [taskItem.id]: !objectAccessor(tasksOpen, taskItem.id)
    });
  }

  function handleParentTaskClick(e){
    e.stopPropagation();
    if(task && !(data?.subTasksCount > 0)){
       loadSubTasks();
    }

    toggleTask(task)
  }

  function handleSubTaskClick(e, taskItem){
    e.stopPropagation();
    setSelectedSubSubTask(taskItem);
    
    if(taskItem && taskItem?.subTasksCount > 0){
      loadSubSubTasks()
    }

    toggleTask(taskItem)
  }

  function handleTodoItemClick(taskItem, tab) {
    handleTodoClick(taskItem, 'processes', tab);
  }

  function projectSubStepCommentHasReply(){

    return (task?.subTasks?.some((subTask) => subTask?.taskCommentReply))
  }

  return (
    <>
      <div style={{ marginBottom: '10px' }} key={task?.id}>
        { clientView && taskId !== null ? (
          <OpenTaskDataList
            taskId={taskId}
            handleTaskCompletion={handleTaskCompletion}
            handleTodoClick={handleTodoClick}
          />
        ) : task && (
          <TaskDataList
            key={task?.id}
            task={task}
            handleChange={handleChange}
            selectedTasks={selectedTasks}
            isSelected={isSelected}
            menuData={menuData}
            styles={{marginBottom: 0}}
            openSubTask={objectAccessor(tasksOpen, task.id)}
            handleOpenSubTasksClick={handleParentTaskClick}
            handleClick={(tab) => handleTodoItemClick(task, tab)}
            handleTaskCompletion={handleTaskCompletion}
            clientView={clientView}
            taskCommentHasReply={task?.taskCommentReply || projectSubStepCommentHasReply()}
          />
         )}

        {(isLoadingSubTasks || (isUpdating && objectAccessor(tasksOpen, task?.id))) && <LinearSpinner />}
      </div>

      {objectAccessor(tasksOpen, task?.id) && data?.taskSubTasks?.length > 0 && data?.taskSubTasks?.map(firstLevelSubTask => (
        <>
          <div
            className={classes.levelOne}
            key={firstLevelSubTask.id}
          >
            <TaskDataList
              key={firstLevelSubTask.id}
              task={firstLevelSubTask}
              handleChange={handleChange}
              selectedTasks={selectedTasks}
              isSelected={isSelected}
              menuData={menuData}
              styles={{backgroundColor: '#F5F5F4'}}
              openSubTask={objectAccessor(tasksOpen, firstLevelSubTask.id)}
              handleOpenSubTasksClick={(e) => handleSubTaskClick(e, firstLevelSubTask)}
              clickable
              handleClick={() => handleTodoItemClick(firstLevelSubTask)}
              handleTaskCompletion={handleTaskCompletion}
              clientView={clientView}
              taskCommentHasReply={false}
            />
            {(isLoadingSubSubTasks && objectAccessor(tasksOpen, firstLevelSubTask?.id)) && <LinearSpinner />}
          </div>
          {subSubTasksData?.taskSubTasks?.length > 0 &&
            objectAccessor(tasksOpen, firstLevelSubTask?.id) && (
              <>
                {subSubTasksData?.taskSubTasks?.map(secondLevelSubTask => (
                  <div className={classes.levelTwo} key={secondLevelSubTask.id}>
                    <TaskDataList
                      key={secondLevelSubTask.id}
                      task={secondLevelSubTask}
                      handleChange={handleChange}
                      selectedTasks={selectedTasks}
                      isSelected={isSelected}
                      menuData={menuData}
                      styles={{backgroundColor: '#ECECEA'}}
                      clickable
                      handleClick={() => handleTodoItemClick(secondLevelSubTask)}
                      handleTaskCompletion={handleTaskCompletion}
                      clientView={clientView}
                      taskCommentHasReply={false}
                    />
                  </div>
                ))}
              </>
            )}
        </>
      ))}
      <MenuList
        open={menuData.open}
        anchorEl={menuData.anchorEl}
        handleClose={menuData.handleClose}
        list={menuData.menuList.filter(menuItem => menuItem.content !== null)}
      />
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
    taskId: null,
    task: null
  };

  TodoItem.propTypes = {
  task: PropTypes.shape(Task),
  handleChange: PropTypes.func.isRequired,
  selectedTasks: PropTypes.arrayOf(PropTypes.string).isRequired,
  isSelected: PropTypes.bool.isRequired,
  handleAddSubTask: PropTypes.func.isRequired,
  handleUploadDocument: PropTypes.func.isRequired,
  handleTodoClick: PropTypes.func.isRequired,
  handleTaskCompletion: PropTypes.func.isRequired,
  clientView: PropTypes.bool,
  taskId: PropTypes.string,
};

const useStyles = makeStyles(() => ({
  levelOne: {
    backgroundColor: '#f5f5f4',
    marginBottom: '8px',
    marginLeft: '16px',
  },
  levelTwo: {
    backgroundColor: '#ececea',
    marginLeft: '32px',
    marginBottom: '8px'
  }
}));
