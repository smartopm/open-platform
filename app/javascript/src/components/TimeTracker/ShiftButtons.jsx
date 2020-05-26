import React, { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { StyleSheet, css } from 'aphrodite'
import { useMutation, useQuery } from 'react-apollo'
import { PropTypes } from 'prop-types'
import { ManageShiftMutation } from '../../graphql/mutations'
import { lastUserTimeSheet } from '../../graphql/queries'
import  Typography from '@material-ui/core/Typography'
import { Spinner } from '../Loading'
import { useWindowDimensions } from '../../utils/customHooks'
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import { lastDayOfTheMonth } from '../../utils/dateutil'


export default function ShiftButtons({ userId }) {
  const [manageShift] = useMutation(ManageShiftMutation)
  const { loading, data, error } = useQuery(lastUserTimeSheet, {
    variables: {
      userId,
      dateTo: lastDayOfTheMonth.toUTCString()
    },
    fetchPolicy: 'network-only'
  })
  const [message, setMessage] = useState("")
  const [isInProgress, setInProgress] = useState(false)
  const { width } = useWindowDimensions() // 767

  useEffect(() => {
      if (!loading && data && data.userLastShift) {
        const {startedAt, endedAt} = data.userLastShift
          if (startedAt && endedAt === null) {
            setInProgress(true)
            return
          }
          setInProgress(false)
      }
  }, [loading, data])

  function handleStartShift() {
    setInProgress(true)
    setMessage("")
    manageShift({
      variables: {
        userId,
        eventTag: 'shift_start'
      }
    })
      .then(data => data)
      .catch(err => console.log(err.message))
  }

  function handleEndShift() {
    if (!isInProgress) {
      setMessage('You can\'t end shift that is not in progress')
      return 
    }
    setMessage("")
    setInProgress(false)
    manageShift({
      variables: {
        userId,
        eventTag: 'shift_end'
      }
    })
      .then(data => data)
      .catch(err => setMessage(err.message))
  }
  if (loading) return <Spinner />
  if (error) return setMessage(error.message)

  return (
    <Grid
      container
      spacing={1}
      direction="row"
      justify="space-around"
      alignItems="center"
    >
      <Grid item xs={6} container justify="flex-end">
        <Button onClick={handleStartShift} className={css(styles.startBtn)} disabled={isInProgress}>
          {
          width <= 767 ? <PlayArrowIcon />  : !isInProgress && 'Start Shift' || 'Shift In-Progress'
          }
        </Button>
      </Grid>
      <Grid item xs={6} >
        <Button onClick={handleEndShift} className={css(styles.endBtn)}>
          {width <= 767 ?  <StopIcon /> : 'End Shift'}
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


ShiftButtons.prototype = {
  userId: PropTypes.string.isRequired
}