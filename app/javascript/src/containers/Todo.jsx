import React, { Fragment, useState, useContext } from 'react'
import Nav from '../components/Nav'
import { StyleSheet, css } from "aphrodite";
import { Context as AuthStateContext } from './Provider/AuthStateProvider.js'

export default function Todo({ history }) {
  const [checked, setChecked] = useState(false)
  const authState = useContext(AuthStateContext)
  function todoAction() {
    setChecked(!checked)
  }
  if (authState.user.userType !== 'admin') {
    // re-route to home
    history.push('/')
  }
  
  return (
    <Fragment>
      <Nav navName="Todo" menuButton="back" />
      <div className='container'>
          <ul className={css(styles.list)}>
              <li className={css(styles.listItem)}>
                  <div className="custom-control custom-checkbox text">
                    <input type="checkbox" checked={checked} onChange={todoAction}  className="custom-control-input" id="todo-check"/>
                    <label className="custom-control-label" htmlFor="todo-check" style={{ textDecoration: checked && 'line-through' }}>Action Todo 1</label>
                  </div>
              </li>
          </ul>
      </div>
    </Fragment>
  )
}

const styles = StyleSheet.create({
    list: {
        margin: 0,
        padding: 0,
        background: 'white',
    },
    listItem: {
        position: 'relative',
        listStyle:'none',
        padding: 15,
    },
})
