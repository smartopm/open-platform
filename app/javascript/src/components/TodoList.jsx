import React, { useState } from 'react'
import EditIcon from '@material-ui/icons/Edit'
import { ModalDialog } from './Dialog'
import DateUtil from '../utils/dateutil'
import { createMuiTheme, Chip, Avatar } from '@material-ui/core'
import { formatDistance } from 'date-fns'
import { StyleSheet, css } from 'aphrodite'
import Loading from './Loading'
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { makeStyles, ThemeProvider } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useQuery } from 'react-apollo'
import { UsersLiteQuery } from '../graphql/queries'

const useStyles = makeStyles({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'right',
    width: '100%',
    overflowX: 'auto'
  }
})

const theme = createMuiTheme({
  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: '#25c0b0'
      }
    },
    MuiPickersDay: {
      day: {
        color: '#25c0b0'
      },
      daySelected: {
        backgroundColor: '#25c0b0'
      },
      current: {
        color: '#25c0b0'
      }
    },
    MuiPickersModal: {
      dialogAction: {
        color: '#25c0b0'
      }
    }
  }
})

export default function TodoList({
  isDialogOpen,
  handleModal,
  saveDate,
  selectedDate,
  handleDateChange,
  data,
  isLoading,
  todoAction
}) {
    const classes = useStyles()
    // eslint-disable-next-line no-unused-vars
    const [name, setName] = useState('')
      // eslint-disable-next-line no-unused-vars
    const [loaded, setLoading] = useState(false)
    const { loading, error, data: liteData, fetchMore } = useQuery(UsersLiteQuery, {
        variables: {
          query: name,
          limit: 30,
        },
        fetchPolicy: 'cache-and-network'
      })

    // unsubscribe the user
    function handleDelete(userId, noteId) {
      console.log({userId, noteId})
    }

      // eslint-disable-next-line no-unused-vars
      function fetchMoreUsers() {
        setLoading(true)
        fetchMore({
            variables: { offset: liteData.users.length },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev
                setLoading(false)
                return Object.assign({}, prev, {
                    users: [...prev.users, ...fetchMoreResult.users]
                })
            }
        })
    }
    if(loading || error){
        return 'loading'
    }

  return (
    <div className="container" data-testid="todo-container">
      <ModalDialog
        open={isDialogOpen}
        handleClose={handleModal}
        handleConfirm={saveDate}
      >
        <ThemeProvider theme={theme}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Pick due date for this todo"
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date'
              }}
            />
          </MuiPickersUtilsProvider>
        </ThemeProvider>
      </ModalDialog>

      <div classes={classes.root}>
        <ul className={css(styles.list)}>
          {isLoading ? (
            <Loading />
          ) : data.flaggedNotes.length ? (
            data.flaggedNotes.map(note => (
              <li key={note.id} className={`${css(styles.listItem)}`}>
                <div className="custom-control custom-checkbox text">
                  <input
                    type="checkbox"
                    checked={note.completed}
                    onChange={() => todoAction(note.id, note.completed)}
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
                      Due at:{' ' + DateUtil.formatDate(note.dueDate)}
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
                    
                    {
                      note.assignees.map(user => (
                              <Chip
                                key={user.id}
                                variant="outlined"
                                label={user.name}
                                size="medium"
                                onDelete={() => handleDelete(user.id, note.id)}
                                avatar={<Avatar src={user.imageUrl} alt={user.name} />}
                                />
                      ))
                    }

                    <br />
                    <br />

                    {/* autocomplete for assignees */}
                    {
                      <Autocomplete
                        id={note.id}
                        options={liteData.users}
                        getOptionLabel={(option) => option.name}
                        style={{ width: 300 }}
                        multiple
                        freeSolo
                        onChange={(_evt, value) => {
                          // subscribe the user here
                          console.log(value)
                        }}
                        renderTags={(value, getTagProps) => {
                          return value.map((option, index) => (
                              <Chip
                                  key={index}
                                  variant="outlined"
                                  label={option.name}
                                  avatar={<Avatar src={option.imageUrl} alt={option.name} />}
                                  {...getTagProps({ index })}
                              />
                                ))
                              }
                            }
                          renderInput={(params) => (
                              <TextField {...params} label="Assignees" variant="outlined" />
                          )}
                       />
                    }
              </li>
            ))
          ) : (
            <span>No Actions yet</span>
          )}
        </ul>
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
  list: {
    margin: 0,
    padding: 0,
    background: 'white'
  },
  listItem: {
    position: 'relative',
    listStyle: 'none',
    padding: 15
  }
})
