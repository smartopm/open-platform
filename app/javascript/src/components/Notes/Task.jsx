import React, { useState } from 'react'
import { dateToString } from '../DateContainer'
import { UserChip } from '../UserChip'
import {
  Chip,
  TextField,
  Divider,
  Grid,
  Button,
  Typography
} from '@material-ui/core'
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
  classes,
  loadingMutation
}) {
  const [autoCompleteOpen, setOpen] = useState(false)
  const [id, setNoteId] = useState('')

  function handleOpenAutoComplete(_event, noteId) {
    setOpen(!autoCompleteOpen)
    setNoteId(noteId)
  }

  return (
    <li key={note.id} className={classes}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="baseline"
          >
            <Grid
              container
              direction="row"
              justify="flex-end"
              alignItems="baseline"
            >
              <EditIcon
                style={{
                  float: 'right',
                  cursor: 'pointer'
                }}
                fontSize="small"
                color="inherit"
                onClick={() => handleModal(note.id)}
              />
              <label style={{ fontSize: 17 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Due at:
                  {note.dueDate ? `  ${dateToString(note.dueDate)}` : ' Never'}
                </Typography>
              </label>
            </Grid>
            <Typography variant="subtitle1" gutterBottom>
              Title:&nbsp;<i>{note.body}</i>
            </Typography>
            <Typography variant="body2" gutterBottom>
              Associated with:&nbsp;<i>{note.user.name}</i>
            </Typography>
          </Grid>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
          >
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
          </Grid>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-end"
          >
            <Typography variant="caption" display="block" gutterBottom>
              Created By:&nbsp;<i>{note.author.name}</i>&nbsp; On:&nbsp;
              <i>{dateToString(note.createdAt)}</i>
            </Typography>
            <Grid
              container
              direction="row"
              justify="flex-end"
              alignItems="flex-end"
            >
                <Button
                  variant="outlined"
                  color='primary'
                  disabled={note.id && loadingMutation}
                    style={{ 
                      marginBottom: 3, 
                    }}
                  onClick={() => handleCompleteNote(note.id, note.completed)}
                >
                  {note.completed ? 'Complete' : 'Mark as complete'}
                </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Divider />
    </li>
  )
}
