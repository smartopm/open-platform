import React, { useState } from 'react'
import { dateToString } from '../DateContainer'
import { formatDistance } from 'date-fns'
import { UserChip } from '../UserChip'
import { Chip, TextField, Divider } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import EditIcon from '@material-ui/icons/Edit'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import CancelIcon from '@material-ui/icons/Cancel'
import { Spinner } from '../Loading'

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
  classes
}) {
  const [autoCompleteOpen, setOpen] = useState(false)
  const [id, setNoteId] = useState('')

  function handleOpenAutoComplete(_event, noteId) {
    setOpen(!autoCompleteOpen)
    setNoteId(noteId)
  }

  return (
    <li key={note.id} className={classes}>
      <div className="custom-control custom-checkbox text">
        <input
          type="checkbox"
          checked={note.completed}
          onChange={() => handleCompleteNote(note.id, note.completed)}
          className="custom-control-input"
          id={`todo-check-${note.id}`}
        />
        <label
          className="custom-control-label"
          htmlFor={`todo-check-${note.id}`}
          style={{
            textDecoration: note.completed && 'line-through',
            fontSize: 17
          }}
        >
          {note.body} {'  '}
          <br />
          <br />
          <span>
            By <i>{note.author.name}</i>
          </span>
        </label>

        <label style={{ float: 'right', fontSize: 17 }}>
          <span>
            Due at:
            {note.dueDate ? `  ${dateToString(note.dueDate)}` : ' Never'}
          </span>
        </label>
        {'  '}
        <EditIcon
          style={{
            float: 'right',
            cursor: 'pointer'
          }}
          fontSize="small"
          color="inherit"
          onClick={() => handleModal(note.id)}
        />

        <br />
        <span style={{ marginRight: 10 }}>
          Created{' '}
          <i>
            {formatDistance(new Date(note.createdAt), new Date(), {
              addSuffix: true,
              includeSeconds: true
            })}
          </i>
        </span>
        <span style={{ float: 'right' }}>
          Associated with <i>{note.user.name}</i>
        </span>
      </div>
      <br />
      {/* notes assignees */}
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
          label={autoCompleteOpen && id === note.id ? 'Close' : 'Add Assignee'}
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
      <br />
      <br />

      {/* autocomplete for assignees */}
      {// avoid opening autocomplete box for other notes
      autoCompleteOpen && id === note.id && (
        <Autocomplete
          clearOnEscape
          clearOnBlur
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
            <TextField {...params} placeholder="Name of assignee" />
          )}
        />
      )}
      <Divider />
    </li>
  )
}
