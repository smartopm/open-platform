import React, { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { StyleSheet, css } from 'aphrodite'
import { useMutation, useQuery } from 'react-apollo'
import { StartShiftMutation, EndShiftMutation } from '../../graphql/mutations'
import { AllEventLogsQuery } from '../../graphql/queries'
import  Typography from '@material-ui/core/Typography'

// have mutations here for managing shifts
// have queries that checks if a specific shift is in progress
// have a user_id

// we can disable the start shift for a day once started
// most importantly we need to find a way to get the last or current shift for this user
export default function ShiftButtons({ userId }) {
  const [startShift] = useMutation(StartShiftMutation)
  const [endShift] = useMutation(EndShiftMutation)
  const { loading, data, error } = useQuery(AllEventLogsQuery, {
    variables: { refId: userId, subject: "user_shift", refType: null, limit: 1, offset: 0 }
  })
  const [message, setMessage] = useState("")
  const [isInProgress, setInProgress] = useState(false)

  useEffect(() => {
      if (!loading && data && data.result.length) {
        const {start_date, end_date} = data.result[0].data.shift
          if (start_date && end_date === null) {
            console.log(end_date)
            setInProgress(true)
          }
        return
      }
  })

  function handleStartShift() {
    setInProgress(true)
    startShift({
      variables: {
        userId,
        startDate: new Date()
      }
    }).then(data => {
      console.log(data)
    })
  }

  function handleEndShift() {
    const [ log ] = data.result
    if (!log) {
      setMessage('You can\'t end shift that is not in progress')
      return 
    }
    setInProgress(false)
    endShift({
      variables: {
        logId: log.id,
        endDate: new Date()
      }
    }).then(data => {
      console.log(data)
      
    })
  }
  if (loading) return '<Loading />'
  if (error) return console.log(error.message)


  return (
    <Grid
      container
      spacing={1}
      direction="row"
      justify="space-around"
      alignItems="center"
    >
      <Grid item xs>
        <Button onClick={handleStartShift} className={css(styles.startBtn)} disabled={isInProgress}>
          {
           !isInProgress && 'Start Shift' || 'Shift In-Progress'
          }
        </Button>
      </Grid>
      <Grid item xs>
        <Button onClick={handleEndShift} className={css(styles.endBtn)}>
          End Shift
        </Button>
          {
            Boolean(message.length) && <Typography color={'secondary'}>{message}</Typography>
          }
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
