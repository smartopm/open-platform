import React, { Fragment, useState, useContext } from 'react'
import Nav from '../components/Nav'
import { StyleSheet, css } from 'aphrodite'
import { Context as AuthStateContext } from './Provider/AuthStateProvider.js'

import { useQuery, useMutation } from 'react-apollo'
import { flaggedNotes } from '../graphql/queries'
import Loading from '../components/Loading'
import ErrorPage from '../components/Error'
import { UpdateNote } from '../graphql/mutations'

export default function Todo({ history }) {
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
    return history.push('/')
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
              <li key={note.id} className={css(styles.listItem)}>
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
                    style={{ textDecoration: note.completed && 'line-through', fontSize: 19 }}
                  >
                    {note.body}
                  </label>
                  <br />
                  <br />
                  <span style={{ float: 'left' }}>
                    created by:
                    <i>
                      {note.author.name}
                    </i>
                  </span>
                  <span style={{ float: 'right' }}>
                    associated with:
                    <i>
                      {note.user.name}
                    </i>
                  </span>
                </div>
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
