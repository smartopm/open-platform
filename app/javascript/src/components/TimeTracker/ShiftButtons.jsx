import React from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { StyleSheet, css } from 'aphrodite'
import { useState } from 'react'

export default function ShiftButtons() {
  const [shift, setShift] = useState({
    shiftEnd: false,
    shiftStart: false
  })
  function handleStartShift() {
    setShift({
      ...shift,
      shiftStart: true
    })
  }

  function handleEndShift() {
    setShift({
      ...shift,
      shiftEnd: true
    })
  }
  return (
    <Grid
      container
      spacing={1}
      direction="row"
      justify="space-around"
      alignItems="center"
    >
      <Grid item xs>
        <Button onClick={handleStartShift} className={css(styles.startBtn)}>
          Start Shift
        </Button>
      </Grid>
      <Grid item xs>
        <Button onClick={handleEndShift} className={css(styles.endBtn)}>
          End Shift
        </Button>
      </Grid>
    </Grid>
  )
}

const styles = StyleSheet.create({
  startBtn: {
    backgroundColor: '#7DCEA0',
    color: '#FFF',
    width: '35%'
  },
  endBtn: {
    backgroundColor: '#EB984E',
    color: '#FFF',
    width: '35%'
  }
})
