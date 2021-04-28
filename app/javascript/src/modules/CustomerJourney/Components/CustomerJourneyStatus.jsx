/* eslint-disable react/no-array-index-key */
/* eslint-disable prefer-spread */
import React from 'react'
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'
import Typography from '@material-ui/core/Typography';
import HeadsetMicIcon from '@material-ui/icons/HeadsetMic';
import { customerJourneyBar, customerJourneyStatus } from "../../../utils/constants"
import CustomerJourneyStatusBar from './CustomerJourneyStatusBar'
import { propAccessor } from '../../../utils/helpers';

export default function CustomerJourneyStatus({ subStatus }){
  const classes = useStyles();
  const barCount = propAccessor(customerJourneyBar, subStatus)
  const coloredBarArray = Array.apply(null, Array(barCount))
  const nonColoredBarArray = Array.apply(null, Array(7 - barCount))
  return (
    <div>
      <div style={{display: 'flex', margin: '40px 79px 20px 79px'}}>
        <Typography className={classes.title}>Your Customer Journey</Typography>
        <Typography className={classes.count}>
          {barCount}
          /7 Steps
        </Typography>
      </div>
      <Grid container style={{margin: '20px 79px 20px 79px'}}>
        {
          coloredBarArray.map((item, index) => (
            <div key={index}>
              <CustomerJourneyStatusBar indexValue={index} coloured />
            </div>
          ))
        }
        {nonColoredBarArray !== 0 && (
          nonColoredBarArray.map((item, index) => (
            <div key={index}>
              <CustomerJourneyStatusBar indexValue={index} barCount={7 - barCount} />
            </div>
          ))
        )}
      </Grid>
      <div style={{display: 'flex', margin: '20px 79px 40px 79px'}}>
        <Typography className={classes.status}>{propAccessor(customerJourneyStatus, subStatus)}</Typography>
        <div style={{display: 'flex', marginLeft: 'auto'}}>
          <HeadsetMicIcon style={{color: '#66A59A', verticalAlign: 'middle', height: '22.18px', width: '17.14px', marginRight: '17px' }} />
          <Typography className={classes.help}>
            <Link to='/'>I need help in moving to the next stage</Link>
          </Typography>
        </div>
      </div>
    </div>
  )
}

const useStyles = makeStyles(() => ({
  title: {
    fontWeight: 500,
    fontSize: '22px',
    color: '#141414',
  },
  count: {
    fontWeight: 400,
    fontSize: '17px',
    color: '#9C9C9C',
    lineHeight: 0.975,
    marginLeft: 'auto',
    marginTop: '9px'
  },
  status: {
    fontSize: '17px',
    fontWeight: 400,
    lineHeight: 0.975,
    color: '#141414'
  },
  help: {
    fontSize: '17px',
    fontWeight: 500,
    lineHeight: 0.975,
    color: '#66A59A',
    marginTop: '3px'
  }
}));