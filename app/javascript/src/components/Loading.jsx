import React from 'react'
import { StyleSheet, css } from 'aphrodite'

export default function Loading() {
  return (
    <div className={css(styles.todoSection)}>
      <div className="d-flex w-100 justify-content-center align-self-center">
        <div className="lds-ripple">
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
  todoSection: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }
})
