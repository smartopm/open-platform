import React, { Fragment, useState, useContext } from 'react'
import Nav from '../components/Nav'
import { StyleSheet, css } from 'aphrodite'
import { Context as AuthStateContext } from './Provider/AuthStateProvider.js'
import { useQuery, useMutation } from 'react-apollo'
import { formatDistance } from 'date-fns'
import { flaggedNotes } from '../graphql/queries'
import Loading from '../components/Loading'
import ErrorPage from '../components/Error'
import { UpdateNote } from '../graphql/mutations'
import EditIcon from '@material-ui/icons/Edit';
import { ModalDialog } from '../components/Dialog'
import { makeStyles } from '@material-ui/core/styles'
import DateUtil from '../utils/dateutil'
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'

const useStyles = makeStyles({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'right',
    width: '100%',
    overflowX: 'auto'
  }

});


export default function Todo({ history }) {
  const classes = useStyles()
  const [isLoading, setLoading] = useState(false)
  const authState = useContext(AuthStateContext)
  const { loading, error, data, refetch } = useQuery(flaggedNotes)
  const [noteUpdate] = useMutation(UpdateNote)
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [userId, setUserId] = React.useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  function todoAction(id, isCompleted) {
    setLoading(true)
    noteUpdate({ variables: { id, completed: !isCompleted } }).then(() => {
      setLoading(false)
      refetch()
    })
  }

  function handleModal(Uid) {
    setUserId(Uid)
    setIsDialogOpen(!isDialogOpen)
  }

  function saveDate() {
    let id = userId
    noteUpdate({ variables: { id, dueDate: selectedDate } }).then(() => {
      refetch()
      setIsDialogOpen(!isDialogOpen)

    })

  }

  const handleDateChange = (date) => {
    setSelectedDate(new Date(date).toISOString());
  };
  if (authState.user.userType !== 'admin') {
    // re-route to home
    history.push('/')
  }
  if (loading) return <Loading />
  if (error) return <ErrorPage error={error.message} />

  return (
    <Fragment>
      <Nav navName="Todo" menuButton="back" />
      <div className="container">
        <ModalDialog
          open={isDialogOpen}
          handleClose={handleModal}
          handleConfirm={saveDate}
        >
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

                    <label
                      style={{ float: 'right', fontSize: 17 }}>
                      <span >
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
                      onClick={() => handleModal(note.id)} />

                    <br />
                    <br />
                    <span>
                      By <i>{note.author.name}</i>
                    </span>

                    <br />

                    <br />
                    <span style={{ marginRight: 10 }}>
                      Created  {' '}
                      <i>
                        {
                          formatDistance(
                            new Date(note.createdAt),
                            new Date(),
                            { addSuffix: true, includeSeconds: true }
                          )
                        }
                      </i>
                    </span>
                    <span style={{ float: 'right' }}>
                      Associated with {' '}
                      <i>
                        {note.user.name}
                      </i>
                    </span>
                  </div>
                  <br />
                  <br />
                </li>
              ))
            ) : (
                  <span>No Actions yet</span>
                )}
          </ul>
        </div>
      </div>
    </Fragment>
  );
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
