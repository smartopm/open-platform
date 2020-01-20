import React, { Fragment, useState } from 'react'
import Nav from '../components/Nav'
import { StyleSheet, css } from "aphrodite";

export default function Todo() {
  const [checked, setChecked] = useState(false)
  function todoAction() {
    setChecked(!checked)
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
