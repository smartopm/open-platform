import React, { Fragment, useState, useContext } from 'react'
import Nav from '../components/Nav'
import { StyleSheet, css } from 'aphrodite'
import { makeStyles } from "@material-ui/core/styles";
import { Context as AuthStateContext } from './Provider/AuthStateProvider.js'
import { useQuery, useMutation } from 'react-apollo'
import { formatDistance } from 'date-fns'
import { flaggedNotes } from '../graphql/queries'
import Loading from '../components/Loading'
import ErrorPage from '../components/Error'
import { UpdateNote } from '../graphql/mutations'
import { Grid, Typography, Checkbox, Divider, List, ListItem } from "@material-ui/core";


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    margin: "auto"
  }
}));


export default function Todo({ history }) {
  const classes = useStyles();
  const [isLoading, setLoading] = useState(false)
  const authState = useContext(AuthStateContext)
  const { loading, error, data, refetch } = useQuery(flaggedNotes)
  const [noteUpdate] = useMutation(UpdateNote)

  function todoAction(id, isCompleted) {
    setLoading(true)
    noteUpdate({ variables: { id, completed: !isCompleted } }).then(() => {
      setLoading(false)
      refetch()
    })
  }
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
                      style={{ textDecoration: note.completed && 'line-through', fontSize: 17 }}
                    >
                      {note.body}  {'  '}
                      <br />
                      <br />
                      <span>
                        By {' '}
                        <i>
                          {note.author.name}
                        </i>
                      </span>
                    </label>
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
    </Fragment>
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
