/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
import React from 'react'
import EventNoteOutlinedIcon from '@material-ui/icons/EventNoteOutlined';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import { makeStyles } from '@material-ui/core/styles';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import ClassOutlinedIcon from '@material-ui/icons/ClassOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import AssignmentTurnedInOutlinedIcon from '@material-ui/icons/AssignmentTurnedInOutlined';
import FlagOutlinedIcon from '@material-ui/icons/FlagOutlined';
import TaskUpdateItem from './TaskUpdateItem'
import { dateToString } from "../DateContainer"

export default function TaskUpdateList({ data }) {
  const classes = useStyles();

  return(
    <>
      {console.log(data)}
      {data?.map(history => (
        <div key={history.id}>
          {history.action === 'create' && history.noteEntityType === 'NoteComment' && (
            <TaskUpdateItem
              user={history.user.name} 
              icon={<AddBoxOutlinedIcon className={classes.icon} />} 
              content='added a new comment'
            />
          )}
          {history.action === 'update' && history.attrChanged === 'description' && (
            <TaskUpdateItem
              user={history.user.name} 
              icon={<DescriptionOutlinedIcon className={classes.icon} />} 
              content={`change description from ${history.initialValue || 'empty value'} to ${history.updatedValue || 'empty value'}`}
            />
          )}
          {history.action === 'update' && history.attrChanged === 'due_date' && (
            <TaskUpdateItem
              user={history.user.name} 
              icon={<EventNoteOutlinedIcon className={classes.icon} />} 
              content={`change due date from ${dateToString(history.initialValue) || 'empty value'} to ${dateToString(history.updatedValue) || 'empty value'}`}
            />
          )}
          {history.action === 'update' && history.attrChanged === 'completed' && (
            <TaskUpdateItem
              user={history.user.name} 
              icon={<AssignmentTurnedInOutlinedIcon className={classes.icon} />} 
              content={`change complete status from ${history.initialValue === 't' ? 'true' : 'false' || 'empty value'} to ${history.updatedValue === 't' ? 'true' : 'false' || 'empty value'}`}
            />
          )}
          {history.action === 'update' && history.attrChanged === 'body' && (
            <TaskUpdateItem
              user={history.user.name} 
              icon={<CreateOutlinedIcon className={classes.icon} />} 
              content='updated the body of the task'
            />
          )}
          {history.action === 'update' && history.attrChanged === 'category' && (
            <TaskUpdateItem
              user={history.user.name} 
              icon={<ClassOutlinedIcon className={classes.icon} />} 
              content={`change category from ${history.initialValue || 'empty value'} to ${history.updatedValue || 'empty value'}`}
            />
          )}
          {history.action === 'update' && history.attrChanged === 'flaged' && (
            <TaskUpdateItem
              user={history.user.name} 
              icon={<FlagOutlinedIcon className={classes.icon} />} 
              content={`change flagged status from ${history.initialValue === 't' ? 'true' : 'false' || 'empty value'} to ${history.updatedValue === 't' ? 'true' : 'false' || 'empty value'}`}
            />
          )}
        </div>
      ))}
    </>
  )
}

const useStyles = makeStyles({
  icon: {
    padding: '4px',
    marginBottom: '10px',
    fontSize: '40px',
    border: '2px solid #dad9d9',
    color: '#dad9d9',
    borderRadius: '50%'
  }
});