import React, { useState } from 'react'
import PropTypes from 'prop-types'
import DataList from '../../../shared/list/DataList';
import renderTaskData from './RenderTaskData'

const taskHeader = [
  { title: 'Select', col: 1 },
  { title: 'Task', col: 4 },
  { title: 'Created By', col: 3 },
  { title: 'Duedate', col: 1 },
  { title: 'Assignees', col: 2 },
  { title: 'Menu', col: 1 }
];

export default function TodoItem({
  task,
  handleChange,
  selectedTasks,
  isSelected,
  handleTaskDetails,
  handleCompleteNote,
}) {
  const [anchorEl, setAnchorEl] = useState(null)
  const anchorElOpen = Boolean(anchorEl)
  const menuList = [
    { content: 'Edit Task', isAdmin: true, handleClick: () => handleTaskDetails({id: task.id}) },
    { content: 'Leave a Comment', isAdmin: true, handleClick: () => handleTaskDetails({id: task.id, comment: true }) },
    { content: task.completed ? 'Mark as Incomplete' : 'Mark as Complete', isAdmin: true, handleClick: () => handleCompleteNote(task.id, task.completed) },
  ];

  const menuData = {
    menuList,
    anchorEl,
    handleTodoMenu,
    open: anchorElOpen,
    handleClose,
  }

  function handleTodoMenu(event){
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  function handleClose(event) {
    event.stopPropagation()
    setAnchorEl(null)
  }

  return(
    <DataList
      key={task.id}
      keys={taskHeader}
      hasHeader={false}
      data={renderTaskData({
        task,
        handleChange,
        selectedTasks,
        isSelected,
        menuData,
      })}
    />
  );
}

TodoItem.propTypes = {
  task: PropTypes.shape({
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
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  selectedTasks: PropTypes.arrayOf(PropTypes.string).isRequired,
  isSelected: PropTypes.bool.isRequired,
  handleTaskDetails: PropTypes.func.isRequired,
  handleCompleteNote: PropTypes.func.isRequired,
}