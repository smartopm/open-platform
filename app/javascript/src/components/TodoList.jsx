import React, { useState, Fragment } from 'react'
import EditIcon from '@material-ui/icons/Edit'
import { ModalDialog } from './Dialog'
import DateUtil from '../utils/dateutil'
import { createMuiTheme } from '@material-ui/core'
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
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';

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
    const [name, setName] = useState('')
    const [loaded, setLoading] = useState(false)
    const { loading, error, data: liteData, refetch, fetchMore } = useQuery(UsersLiteQuery, {
        variables: {
          query: name,
          limit: 30,
        },
        fetchPolicy: 'cache-and-network'
      })

    
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
console.log(liteData)
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
              <li key={note.id} className={`${css(styles.listItem)} card`}>
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
                  <br />
                  <span>
                    By <i>{note.author.name}</i>
                  </span>

                  <br />

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
                    {/* autocomplete for assignees */}
                    {
                      <Autocomplete
                        id="combo-box-demo"
                        options={liteData.users}
                        getOptionLabel={(option) => option.name}
                        style={{ width: 300 }}
                        multiple
                        freeSolo
                        renderTags={(value, getTagProps) => {
                            return value.map((option, index) => (
                               <ListItem key={index} alignItems="flex-start">
                                  <ListItemAvatar>
                                    <Avatar alt="Remy Sharp" src={option.imageUrl} />
                                  </ListItemAvatar>
                                  <ListItemText primary={option.name}/>
                                </ListItem>
                            ))
                        }
                        }
                        renderInput={(params) => (
                          <Fragment>       
                            <TextField {...params} label="Assignees" variant="outlined" />
                           </Fragment>
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
