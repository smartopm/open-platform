import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next';
import DataList from '../../../shared/list/DataList';
import renderTaskData from './RenderTaskData'

export default function TodoItem({
  task,
  handleChange,
  selectedTasks,
  isSelected,
  handleTaskDetails,
  handleCompleteNote,
  handleAddSubTask,
  headers,
}) {
  const [anchorEl, setAnchorEl] = useState(null)
  const anchorElOpen = Boolean(anchorEl)
  const { t } = useTranslation('common')
  const menuList = [
    { content: t('menu.edit_task'), isAdmin: true, handleClick: () => handleTaskDetails({id: task.id}) },
    { content: t('menu.add_subtask'), isAdmin: true, handleClick: () => handleAddSubTask({id: task.id }) },
    { content: t('menu.leave_a_comment'), isAdmin: true, handleClick: () => handleTaskDetails({id: task.id, comment: true }) },
    { content: task.completed ? t('menu.mark_incomplete') : t('menu.mark_complete'), isAdmin: true, handleClick: () => handleCompleteNote(task.id, task.completed) },
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
      keys={headers}
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
  headers: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleAddSubTask: PropTypes.func.isRequired
}
