import React from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { StyleSheet, css } from 'aphrodite'
import { useMutation, useQuery } from 'react-apollo'
import { TrackTime } from '../../graphql/mutations'
import { AllEventLogsQuery } from '../../graphql/queries'

// have mutations here for managing shifts
// have queries that checks if a specific shift is in progress
// have a user_id

// we can disable the start shift for a day once started
// most importantly we need to find a way to get the last or current shift for this user
export default function ShiftButtons({ userId }) {
  const [trackShift] = useMutation(TrackTime)
  const { loading, error, data, refetch } = useQuery(AllEventLogsQuery, {
    variables: { refId: userId, subject: "user_shift", refType: null }
  })


  function handleStartShift() {
    trackShift({
      variables: {
        userId,
        startDate: new Date()
      }
    }).then(data => {
      console.log(data)
    })
  }

  function handleEndShift() {
    trackShift({
      variables: {
        userId,
        endDate: new Date()
      }
    }).then(data => {
      console.log(data)
    })
  }

  console.log(loading)
  console.log(data)
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
