import React from 'react'
import { makeStyles } from '@material-ui/core/styles';

export default function CustomerJourneyStatusBar({ coloured, indexValue, barCount }) {
  const classes = useStyles();
  return (
    <div
      style={coloured ? 
      {width: '146px', height: '28px', background: '#66A59A', marginRight: '1px'} : 
      {width: '146px', height: '28px', background: '#EBEBEB', marginRight: '1px'}}
      // eslint-disable-next-line no-nested-ternary
      className={coloured && indexValue === 0 ? classes.firstBar : !coloured && indexValue === barCount - 1 ? classes.lastBar :  null}
    >
      {console.log(indexValue)}
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