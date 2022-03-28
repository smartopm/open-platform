import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { StyleSheet, css } from 'aphrodite'
import { useMutation, useQuery } from 'react-apollo'
import { PropTypes } from 'prop-types'
import  Typography from '@mui/material/Typography'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { useTranslation } from 'react-i18next'
import { Spinner } from '../../../shared/Loading'
import { useWindowDimensions } from '../../../utils/customHooks'
import { lastDayOfTheMonth } from '../../../utils/dateutil'
import { LastUserTimeSheetQuery } from '../graphql/timecard_queries'
import { ManageShiftMutation } from '../graphql/timecard_mutations'

export default function ShiftButtons({ userId }) {
  const [manageShift] = useMutation(ManageShiftMutation)
  const { loading, data, error } = useQuery(LastUserTimeSheetQuery, {
    variables: {
      userId,
      dateTo: lastDayOfTheMonth.toUTCString()
    },
    fetchPolicy: 'network-only',
    errorPolicy: 'all'
  })
  const [message, setMessage] = useState("")
  const [isInProgress, setInProgress] = useState(false)
  const { width } = useWindowDimensions() // 767
  const { t } = useTranslation('timecard')

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
      .then(() => {})
      .catch(err => setMessage(err.message))
  }

  function handleEndShift() {
    if (!isInProgress) {
      setMessage(t('timecard.shift_end_error'))
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
      .then(() => {})
      .catch(err => setMessage(err.message))
  }
  if (loading) return <Spinner />
  if (error && !error.message.includes('permission')) {
    return error.message
  }

  return (
    <Grid
      container
      spacing={1}
      direction="row"
      justifyContent="space-around"
      alignItems="center"
    >
      <Grid item xs={6} container justifyContent="flex-end">
        <Button onClick={handleStartShift} className={`${css(styles.startBtn)} start-shift-btn`} disabled={isInProgress}>
          {
            // eslint-disable-next-line no-nested-ternary
            (width <= 767 && !isInProgress)
              ? <PlayArrowIcon /> : (width <= 767 && isInProgress)
                ? <Spinner /> : !isInProgress && t('timecard.start_shift') || t('timecard.shift_in_progress')
          }
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button onClick={handleEndShift} className={`${css(styles.endBtn)} end-shift-btn`}>
          {width <= 767 ?  <StopIcon /> : t('timecard.end_shift')}
        </Button>
        {
            Boolean(message.length) && <Typography color="secondary">{message}</Typography>
          }
      </Grid>
    </Grid>
  );
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


ShiftButtons.propTypes = {
  userId: PropTypes.string.isRequired
}