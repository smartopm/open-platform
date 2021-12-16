/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { TaskDataList } from './RenderTaskData';
import FileUploader from './FileUploader';
import { objectAccessor } from '../../../utils/helpers';
import MenuList from '../../../shared/MenuList';
import { SubTasksQuery } from '../graphql/task_queries';
import { LinearSpinner } from '../../../shared/Loading';

export default function TodoItem({
  task,
  handleChange,
  selectedTasks,
  isSelected,
  handleCompleteNote,
  handleAddSubTask,
  handleUploadDocument,
  handleTodoClick,
  handleTaskCompletion
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasksOpen, setTasksOpen] = useState({});
  const [isUpdating, setIsUpdating] = useState(false)
  const anchorElOpen = Boolean(anchorEl);
  const { t } = useTranslation('common');

  const [
    loadSubTasks,
    { data, loading: isLoadingSubTasks }
  ] = useLazyQuery(SubTasksQuery, {
    variables: { taskId: task?.id, limit: task?.subTasks?.length },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  const menuList = [
    {
      content: t('menu.open_task_details'),
      isAdmin: true,
      handleClick: () => handleTaskDetails()
    },
    {
      content: t('menu.add_subtask'),
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
        selectedTask && selectedTask.completed
          ? t('menu.mark_incomplete')
          : t('menu.mark_complete'),
      isAdmin: true,
      handleClick: () => handleNoteComplete()
    }
  ];

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
    handleCompleteNote(selectedTask.id, selectedTask.completed)
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
    if(task && !(data?.taskSubTasks?.length > 0)){
       loadSubTasks();
    }

    toggleTask(task)
  }

  function handleTodoItemClick(taskItem) {
    handleTodoClick(taskItem);
  }

  return (
    <>
      {task && (
        <div style={{ marginBottom: '10px' }} key={task.id}>
          <TaskDataList
            key={task.id}
            task={task}
            handleChange={handleChange}
            selectedTasks={selectedTasks}
            isSelected={isSelected}
            menuData={menuData}
            styles={{marginBottom: 0}}
            openSubTask={objectAccessor(tasksOpen, task.id)}
            handleOpenSubTasksClick={handleParentTaskClick}
            handleClick={() => handleTodoItemClick(task)}
            handleTaskCompletion={handleTaskCompletion}
          />
          {(isLoadingSubTasks || (isUpdating && objectAccessor(tasksOpen, task.id))) && <LinearSpinner />}
        </div>
      )}
      {objectAccessor(tasksOpen, task.id) && data?.taskSubTasks?.length > 0 && data?.taskSubTasks?.map(firstLevelSubTask => (
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
              handleOpenSubTasksClick={() => toggleTask(firstLevelSubTask)}
              clickable
              handleClick={() => handleTodoItemClick(firstLevelSubTask)}
              handleTaskCompletion={handleTaskCompletion}
            />
          </div>
          {firstLevelSubTask?.subTasks?.length > 0 &&
            objectAccessor(tasksOpen, firstLevelSubTask.id) && (
              <>
                {firstLevelSubTask?.subTasks?.map(secondLevelSubTask => (
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
        list={menuData.menuList}
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
  
  TodoItem.defaultProps = {};

  TodoItem.propTypes = {
  task: PropTypes.shape(Task).isRequired,
  handleChange: PropTypes.func.isRequired,
  selectedTasks: PropTypes.arrayOf(PropTypes.string).isRequired,
  isSelected: PropTypes.bool.isRequired,
  handleCompleteNote: PropTypes.func.isRequired,
  handleAddSubTask: PropTypes.func.isRequired,
  handleUploadDocument: PropTypes.func.isRequired,
  handleTodoClick: PropTypes.func.isRequired,
  handleTaskCompletion: PropTypes.func.isRequired
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
