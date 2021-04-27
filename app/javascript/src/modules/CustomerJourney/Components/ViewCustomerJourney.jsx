/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import TimelineIcon from '@material-ui/icons/Timeline';
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';

export default function ViewCustomerJourney() {
  const matches = useMediaQuery('(max-width:600px)')
  const history = useHistory();
  return (
    <div data-testid='customer' style={matches ? {display: 'flex', margin: '20px 0 0 20px', cursor: 'pointer'} :{display: 'flex', margin: '20px 0 0 79px', cursor: 'pointer'}} onClick={() => history.push('/users/stats')}>
      <TimelineIcon style={{color: '#66A59A', marginRight: '10px', verticalAlign: 'middle'}} />
      <Typography color='primary' variant='caption' data-testid='view'>View Customer Journey</Typography>
    </div>
  )
}