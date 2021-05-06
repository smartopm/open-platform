/* eslint-disable react/no-array-index-key */
/* eslint-disable prefer-spread */
import React from 'react'
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Link } from 'react-router-dom'
import Typography from '@material-ui/core/Typography';
import HeadsetMicIcon from '@material-ui/icons/HeadsetMic';
import { customerJourneyBar, customerJourneyStatus, customerJourneyLink } from "../../../utils/constants"
import CustomerJourneyStatusBar from './CustomerJourneyStatusBar'
import { propAccessor } from '../../../utils/helpers';

export default function CustomerJourneyStatus({ subStatus, communityName }){
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:600px)')
  const barCount = propAccessor(customerJourneyBar, subStatus)
  const coloredBarArray = Array.apply(null, Array(barCount))
  const nonColoredBarArray = Array.apply(null, Array(6 - barCount))
  return (
    <div>
      <div style={matches ? {display: 'flex', margin: '40px 30px 5px 20px'} : {display: 'flex', margin: '40px 79px 20px 79px'}}>
        <Typography className={matches ? classes.titleMobile : classes.title} data-testid='customer'>Your Customer Journey</Typography>
        <Typography className={matches ? classes.countMobile : classes.count}>
          {barCount}
          /6 Steps
        </Typography>
      </div>
      <Grid container style={matches ? {margin: '5px 30px 5px 20px'} : {margin: '20px 79px 20px 79px'}}>
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
              <CustomerJourneyStatusBar indexValue={index} barCount={6 - barCount} />
            </div>
          ))
        )}
      </Grid>
      <div style={matches ? {margin: '5px 20px 20px 20px'} : {display: 'flex', margin: '20px 79px 40px 79px'}}>
        <Typography className={matches ? classes.statusMobile : classes.status}>{propAccessor(customerJourneyStatus, subStatus)}</Typography>
        {communityName === 'Nkwashi' && (
          <div style={{display: 'flex', marginLeft: 'auto'}}>
            <HeadsetMicIcon style={matches ? 
              {color: '#66A59A', verticalAlign: 'middle', height: '15.4px', width: '11.9px', marginRight: '7px'} : 
              {color: '#66A59A', verticalAlign: 'middle', height: '22.18px', width: '17.14px', marginRight: '17px'}} 
            />
            <Typography className={matches ? classes.helpMobile : classes.help}>
              <Link to={propAccessor(customerJourneyLink, subStatus)}>I need help in moving to the next stage</Link>
            </Typography>
          </div>
        )}
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
  },
  titleMobile: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#141414'
  },
  countMobile: {
    fontSize: '11px',
    fontWeight: 400,
    lineHeight: 1.5,
    color: '#9C9C9C',
    marginLeft: 'auto',
  },
  statusMobile: {
    fontSize: '11px',
    fontWeight: 500,
    lineHeight: 1.5,
    color: '#141414'
  },
  helpMobile: {
    fontSize: '10px',
    fontWeight: 500,
    color: '#66A59A',
    lineHeight: 1.65
  }
}));


CustomerJourneyStatus.propTypes = {
  subStatus: PropTypes.string.isRequired,
  communityName: PropTypes.string.isRequired
};