/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { TaskDataList } from './RenderTaskData';
import FileUploader from './FileUploader';
import { objectAccessor } from '../../../utils/helpers';
import MenuList from '../../../shared/MenuList';

export default function TodoItem({
  task,
  query,
  handleChange,
  selectedTasks,
  isSelected,
  handleTaskDetails,
  handleCompleteNote,
  handleAddSubTask,
  handleUploadDocument
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [subTasksOpen, setSubTasksOpen] = useState({});
  const [openSubtask, setOpenSubTask] = useState(false);
  const anchorElOpen = Boolean(anchorEl);
  const { t } = useTranslation('common');

  const menuList = [
    {
      content: t('menu.open_task_details'),
      isAdmin: true,
      handleClick: () => handleTaskDetails({ id: selectedTask.id })
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
      handleClick: () => handleCompleteNote(selectedTask.id, selectedTask.completed)
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

  function handleClose(event) {
    event.stopPropagation();
    setAnchorEl(null);
    setSelectedTask(null);
  }

  function handleFileInputChange(event, taskToAttach = null) {
    event.stopPropagation()
    handleUploadDocument(event, selectedTask || taskToAttach);
    handleClose(event);
  }

  function renderSubtaskAsParent(taskItem) {
    if (query?.includes('assignees')) {
      return true;
    }
    return !taskItem?.parentNote;
  }

  function toggleSubTasks(subTask) {
    setSubTasksOpen({
      ...subTasksOpen,
      [subTask.id]: !objectAccessor(subTasksOpen, subTask.id)
    });
  }

  return (
    <>
      {renderSubtaskAsParent(task) && (
        <TaskDataList
          key={task.id}
          task={task}
          handleChange={handleChange}
          handleFileInputChange={handleFileInputChange}
          selectedTasks={selectedTasks}
          isSelected={isSelected}
          menuData={menuData}
          clickable={task?.subTasks?.length > 0}
          handleClick={() => setOpenSubTask(!openSubtask)}
        />
      )}
      {openSubtask && task?.subTasks?.length > 0 && task?.subTasks?.map(firstLevelSubTask => (
        <>
          <div
            className={classes.levelOne}
            key={firstLevelSubTask.id}
            onClick={() => toggleSubTasks(firstLevelSubTask)}
            style={firstLevelSubTask?.subTasks?.length > 0 ? {cursor: 'pointer'} : {}}
          >
            <TaskDataList
              key={firstLevelSubTask.id}
              task={firstLevelSubTask}
              handleChange={handleChange}
              handleFileInputChange={handleFileInputChange}
              selectedTasks={selectedTasks}
              isSelected={isSelected}
              menuData={menuData}
              styles={{backgroundColor: '#F5F5F4'}}
            />
          </div>
          {firstLevelSubTask?.subTasks?.length > 0 &&
            objectAccessor(subTasksOpen, firstLevelSubTask.id) && (
              <>
                {firstLevelSubTask?.subTasks?.map(secondLevelSubTask => (
                  <div className={classes.levelTwo} key={secondLevelSubTask.id}>
                    <TaskDataList
                      key={secondLevelSubTask.id}
                      task={secondLevelSubTask}
                      handleChange={handleChange}
                      handleFileInputChange={handleFileInputChange}
                      selectedTasks={selectedTasks}
                      isSelected={isSelected}
                      menuData={menuData}
                      styles={{backgroundColor: '#ECECEA'}}
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

TodoItem.defaultProps = {
  query: ''
};

TodoItem.propTypes = {
  task: PropTypes.shape(Task).isRequired,
  query: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  selectedTasks: PropTypes.arrayOf(PropTypes.string).isRequired,
  isSelected: PropTypes.bool.isRequired,
  handleTaskDetails: PropTypes.func.isRequired,
  handleCompleteNote: PropTypes.func.isRequired,
  handleAddSubTask: PropTypes.func.isRequired,
  handleUploadDocument: PropTypes.func.isRequired
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
