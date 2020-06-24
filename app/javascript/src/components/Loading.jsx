import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import { withStyles } from '@material-ui/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function Loading() {
  return (
    <div className={css(styles.todoSection)} data-testid="loader">
      <div className="d-flex w-100 justify-content-center align-self-center">
        <div className="lds-ripple">
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  )
}

const ColorCircularProgress = withStyles({
  root: {
    color: '#00695c',
  },
})(CircularProgress);

export function Spinner(){
  return <ColorCircularProgress size={30} thickness={5} />
}

const styles = StyleSheet.create({
  todoSection: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }
})
