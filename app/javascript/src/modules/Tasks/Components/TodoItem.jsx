import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import { TaskDataList } from './RenderTaskData'

export default function TodoItem({
  task,
  handleChange,
  selectedTasks,
  isSelected,
  handleTaskDetails,
  handleCompleteNote,
  handleAddSubTask,
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const anchorElOpen = Boolean(anchorEl)
  const { t } = useTranslation('common')

  const menuList = [
  { content: t('menu.edit_task'), isAdmin: true, handleClick: () =>  handleTaskDetails({id: selectedTask.id}) },
    { content: t('menu.add_subtask'), isAdmin: true, handleClick: () => handleAddSubTask({id: selectedTask.id }) },
    { content: t('menu.leave_a_comment'), isAdmin: true, handleClick: () => handleTaskDetails({id: selectedTask.id, comment: true }) },
    { content: (selectedTask && selectedTask.completed) ? t('menu.mark_incomplete') : t('menu.mark_complete'),
      isAdmin: true,
      handleClick: () => handleCompleteNote(selectedTask.id, selectedTask.completed)
    },
  ];

  const menuData = {
    menuList,
    anchorEl,
    handleTodoMenu,
    open: anchorElOpen,
    handleClose,
  }

  function handleTodoMenu(event, taskItem){
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setSelectedTask(taskItem)
  }

  function handleClose(event) {
    event.stopPropagation()
    setAnchorEl(null)
  }

  return (
    <>
      {!task?.parentNote && (
        <Accordion key={task.id} className={classes.accordion}>
          <AccordionSummary className={classes.accordionHeader}>
            <TaskDataList
              key={task.id}
              task={task}
              handleChange={handleChange}
              selectedTasks={selectedTasks}
              isSelected={isSelected}
              menuData={menuData}
            />
          </AccordionSummary>
          {task?.subTasks?.length > 0 && (
            <AccordionDetails className={classes.child}>
                {task?.subTasks?.map((firstLevelSubTask) => (
                  <>
                    <div className={classes.levelOne} key={firstLevelSubTask.id}>
                      <TaskDataList
                        key={firstLevelSubTask.id}
                        task={firstLevelSubTask}
                        handleChange={handleChange}
                        selectedTasks={selectedTasks}
                        isSelected={isSelected}
                        menuData={menuData}
                      />
                    </div>
                    {firstLevelSubTask?.subTasks?.length > 0 && (
                      <>
                          {firstLevelSubTask?.subTasks?.map((secondLevelSubTask) => (
                            <div className={classes.levelTwo} key={secondLevelSubTask.id}>
                              <TaskDataList
                                key={secondLevelSubTask.id}
                                task={secondLevelSubTask}
                                handleChange={handleChange}
                                selectedTasks={selectedTasks}
                                isSelected={isSelected}
                                menuData={menuData}
                              />
                            </div>
                          ))}
                      </>
                    )}
                  </>
                ))}
            </AccordionDetails>
          )}
        </Accordion>
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
    id: PropTypes.string,
  }),
  assignees: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  })),
  subTasks: PropTypes.arrayOf(PropTypes.object)
}

TodoItem.propTypes = {
  task: PropTypes.shape(Task).isRequired,
  handleChange: PropTypes.func.isRequired,
  selectedTasks: PropTypes.arrayOf(PropTypes.string).isRequired,
  isSelected: PropTypes.bool.isRequired,
  handleTaskDetails: PropTypes.func.isRequired,
  handleCompleteNote: PropTypes.func.isRequired,
  handleAddSubTask: PropTypes.func.isRequired
}

const useStyles = makeStyles(() => ({
  accordion: {
    boxShadow: 'none',
  },
  accordionHeader: {
    border: 'solid 1px #dee2e6',
    display: 'flex',
    flexDirection: 'row',
    height: '60px',
    marginBottom: '8px',
    padding: 0
  },
  child: {
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
  },
  levelOne: {
    backgroundColor: '#f5f5f4',
    height: '60px',
    marginBottom: '8px',
    marginLeft: '16px',
  },
  levelTwo: {
    height: '60px',
    backgroundColor: '#ececea',
    marginLeft: '32px',
    marginBottom: '72px',
  }
}));
