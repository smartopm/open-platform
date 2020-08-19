import React, { useState } from 'react'
import DateContainer, { dateToString } from '../DateContainer'
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
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import CenteredContent from '../CenteredContent'

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
    // <li key={note.id} className={classes}>
    <>
      <Grid container direction="column" justify="flex-start">
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {note.body}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption" gutterBottom>
            <Link style={{ textDecoration: 'none' }}  to={`/user/${note.author.id}`}>
             {note.author.name}{' '}
            </Link>
            created a note for{' '} 
            <Link style={{ textDecoration: 'none' }} to={`/user/${note.user.id}`}>
              {note.user.name} {' '}
            </Link>
            on{' '}
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
        <Grid item>
          <CenteredContent>
          <EditIcon
            style={{
              float: 'right',
              cursor: 'pointer',
              marginBottom: 8
            }}
            fontSize="small"
            color="inherit"
            onClick={() => handleModal(note.id)}
          />
          <Typography variant="subtitle1" gutterBottom>
            Due at: {note.dueDate ? `  ${dateToString(note.dueDate)}` : ' Never'}
          </Typography>
            <Button
              variant="outlined"
              color='primary'
              disabled={note.id && loadingMutation}
              style={{ 
                marginBottom: 3,
                marginLeft: 12
              }}
              onClick={() => handleCompleteNote(note.id, note.completed)}
            >
              {note.completed ? 'Completed' : 'Mark as complete'}
            </Button>
          </CenteredContent>    
        </Grid>
      </Grid>
      <Divider />
    </>
  )
}
