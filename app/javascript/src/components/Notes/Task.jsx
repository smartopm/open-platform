/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import {
  Chip,
  TextField,
  Divider,
  Grid,
  Button,
  Typography, Link as MuiLink
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import EditIcon from '@material-ui/icons/Edit'
import AlarmIcon from '@material-ui/icons/Alarm'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import CancelIcon from '@material-ui/icons/Cancel'
import { Link, useHistory } from 'react-router-dom'

import { useMutation } from 'react-apollo'
import { Spinner } from '../Loading'
import { UserChip } from '../UserChip'
import DateContainer, { dateToString, dateTimeToString } from '../DateContainer'
import { removeNewLines, sanitizeText } from '../../utils/helpers'
import RemindMeLaterMenu from './RemindMeLaterMenu'
import { TaskReminder } from '../../graphql/mutations'

export default function Task({
  note,
  message,
  users,
  handleCompleteNote,
  assignUnassignUser,
  loaded,
  handleDelete,
  handleModal,
  loading,
  loadingMutation,
  isAssignTaskOpen,
  handleOpenTaskAssign,
  currentUser
}) {
  const [autoCompleteOpen, setOpen] = useState(false)
  const [id, setNoteId] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const [setReminder] = useMutation(TaskReminder)
  const [reminderTime, setReminderTime] = useState(null)

  const history = useHistory()

  function handleOpenAutoComplete(_event, noteId) {
    setOpen(!autoCompleteOpen)
    setNoteId(noteId)
  }

  function routeToAction(_event, taskId) {
    return history.push(`/tasks/${taskId}`)
  }

  function handleOpenMenu(event) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose() {
    setAnchorEl(null)
  }

  function timeFormat(time) {
    return `${dateToString(time)}, ${dateTimeToString(new Date(time))}`
  }

  function setTaskReminder(hour) {
    setReminder({
      variables: { noteId: note.id, hour }
    })
      .then(() => {
        handleClose()
        const timeScheduled = new Date(
          Date.now() + hour * 60 * 60000
        ).toISOString()
        setReminderTime(timeFormat(timeScheduled))
      })
      .catch(err => console.log(err))
  }

  function currentActiveReminder() {
    const assignedNote = note.assigneeNotes
      .find(assigneeNote => assigneeNote.userId === currentUser.id)
    
    const timeScheduled = reminderTime || assignedNote?.reminderTime
    let formattedTime = null
    if (
      timeScheduled &&
      new Date(timeScheduled).getTime() > new Date().getTime()
    ) {
      formattedTime = timeFormat(timeScheduled)
    }

    return formattedTime
  }

  function isCurrentUserAnAssignee() {
    return note.assignees.find(assignee => assignee.id === currentUser.id)
  }

  return (
    <>
      <Grid container direction="column" justify="flex-start">
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {/* eslint-disable-next-line react/no-danger */}
            <span
              style={{ whiteSpace: 'pre-line' }}
              dangerouslySetInnerHTML={{
                __html: sanitizeText(removeNewLines(note.body))
              }}
            />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption" gutterBottom>
            <Link
              style={{ textDecoration: 'none' }}
              to={`/user/${note.author.id}`}
            >
              {note.author.name}
              {' '}
            </Link>
            created this note for
            {' '}
            <Link
              style={{ textDecoration: 'none' }}
              to={`/user/${note.user.id}`}
            >
              {note.user.name}
              {' '}
            </Link>
            on
            {' '}
            <i style={{ color: 'grey' }}>
              <DateContainer date={note.createdAt} />
            </i>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {note.assignees.map(user => (
            <UserChip
              key={user.id}
              user={user}
              size="medium"
              onDelete={() => handleDelete(user.id, note.id)}
            />
          ))}

          {/* loader */}
          {loaded && id === note.id ? (
            <Spinner />
          ) : (
            <Chip
              key={note.id}
              variant="outlined"
              label={
                autoCompleteOpen && id === note.id ? 'Close' : 'Add Assignee'
              }
              size="medium"
              icon={
                autoCompleteOpen && id === note.id ? (
                  <CancelIcon />
                ) : (
                  <AddCircleIcon />
                )
              }
              onClick={event => handleOpenAutoComplete(event, note.id)}
            />
          )}
          {/* error message */}
          <br />
          {Boolean(message.length) && <span>{message}</span>}
          {/* autocomplete for assignees */}
          {// avoid opening autocomplete box for other notes
          autoCompleteOpen && id === note.id && (
            <Autocomplete
              clearOnEscape
              clearOnBlur
              open={isAssignTaskOpen}
              onOpen={handleOpenTaskAssign}
              onClose={handleOpenTaskAssign}
              loading={loading}
              id={note.id}
              options={users}
              getOptionLabel={option => option.name}
              style={{ width: 300 }}
              onChange={(_evt, value) => {
                // if nothing selected, ignore and move on
                if (!value) {
                  return
                }
                // assign or unassign the user here
                assignUnassignUser(note.id, value.id)
              }}
              renderInput={params => (
                // eslint-disable-next-line react/jsx-props-no-spreading
                <TextField {...params} placeholder="Name of assignee" />
              )}
            />
          )
}
        </Grid>
        <Grid item>
          <div
            style={{
              display: 'inline-flex',
              margin: '5px 0 10px 0'
            }}
          >
            <EditIcon
              data-testid="edit_due_date_btn"
              style={{
                cursor: 'pointer',
                margin: '5px 4px 0 0',
                fontSize: 18
              }}
              color="inherit"
              onClick={() => handleModal(note.id)}
            />
            <Typography variant="subtitle1" gutterBottom>
              Due at:
              {' '}
              {note.dueDate ? `  ${dateToString(note.dueDate)} ` : ' Never '}
              <MuiLink
                href="#"
                data-testid="more_details_btn"
                style={{
                  cursor: 'pointer',
                  color: '#69ABA4',
                  marginLeft: '5px'
                }}
                onClick={event => routeToAction(event, note.id)}
              >
                More Details
              </MuiLink>
            </Typography>
          </div>
          <Button
            color="primary"
            disabled={note.id && loadingMutation}
            style={{
              float: 'right'
            }}
            onClick={() => handleCompleteNote(note.id, note.completed)}
          >
            {note.completed ? 'Completed' : 'Mark as complete'}
          </Button>
          {isCurrentUserAnAssignee() && (
            <Button
              color="primary"
              style={{
                float: 'right'
              }}
              onClick={handleOpenMenu}
            >
              {currentActiveReminder() ? 'Change reminder' : 'Remind me later'}
            </Button>
          )}
          {isCurrentUserAnAssignee() && currentActiveReminder() && (
            <>
              <Typography
                variant="subtitle1"
                style={{ margin: '5px 5px 10px 0', float: 'right' }}
              >
                {currentActiveReminder()}
              </Typography>
              <AlarmIcon style={{ float: 'right', marginTop: '5px' }} />
            </>
          )}
        </Grid>
        <RemindMeLaterMenu
          taskId={id}
          anchorEl={anchorEl}
          handleClose={handleClose}
          open={open}
          setTaskReminder={setTaskReminder}
        />
      </Grid>
      <Divider />
      <br />
    </>
  )
}
