/* eslint-disable no-nested-ternary */
import React from 'react'
import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';

export default function CustomerJourneyStatusBar({ coloured, indexValue, barCount }) {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:600px)')
  return (
    <div
      data-testid='bar'
      style={matches && coloured ? {width: '53px', height: '6px', background: '#66A59A', marginRight: '1px'} : 
      !matches && coloured ? 
      {width: '170px', height: '28px', background: '#66A59A', marginRight: '1px'} : 
      matches && !coloured ? {width: '53px', height: '6px', background: '#EBEBEB', marginRight: '1px'} : 
      {width: '170px', height: '28px', background: '#EBEBEB', marginRight: '1px'}}
      className={coloured && indexValue === 0 ? classes.firstBar : !coloured && indexValue === barCount - 1 ? classes.lastBar :  null}
    >
      {' '}
    </div>
  )
}

const useStyles = makeStyles(() => ({
  firstBar: {
    borderRadius: '10px 0 0 10px'
  },
  lastBar: {
    borderRadius: '0 10px 10px 0'
  }
}));

CustomerJourneyStatusBar.defaultProps = {
  coloured: false,
  barCount: null
}

CustomerJourneyStatusBar.propTypes = {
  coloured: PropTypes.bool,
  indexValue: PropTypes.number.isRequired,
  barCount: PropTypes.number
};