import React, { Fragment, useState, useContext } from 'react'
import Nav from '../components/Nav'
import { StyleSheet, css } from 'aphrodite'
import { Context as AuthStateContext } from './Provider/AuthStateProvider.js'

import { useQuery /*useMutation */ } from 'react-apollo'
import { flaggedNotes } from '../graphql/queries'
import Loading from '../components/Loading'
import ErrorPage from '../components/Error'
// } from '../graphql/mutations'

export default function Todo({ history }) {
  const [checked, setChecked] = useState(false)
  const authState = useContext(AuthStateContext)
  const { loading, error, data } = useQuery(flaggedNotes)

  function todoAction(id) {
    setChecked(!checked)
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
          {data.flaggedNotes.map(note => (
            <li key={note.id} className={css(styles.listItem)}>
              <div className="custom-control custom-checkbox text">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => todoAction(note.id)}
                  className="custom-control-input"
                  id={`todo-check-${note.id}`}
                />
                <label
                  className="custom-control-label"
                  htmlFor={`todo-check-${note.id}`}
                  style={{ textDecoration: checked && 'line-through' }}
                >
                  {note.body}
                </label>
              </div>
            </li>
          ))}
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
  },

})
