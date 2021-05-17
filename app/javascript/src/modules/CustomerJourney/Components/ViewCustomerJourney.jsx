/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import TimelineIcon from '@material-ui/icons/Timeline';
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function ViewCustomerJourney({ translate }) {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:600px)')
  const history = useHistory();

  return (
    <div data-testid='customer' className={matches ? classes.viewMobile : classes.view} onClick={() => history.push('/users/stats')}>
      <TimelineIcon style={{color: '#66A59A', marginRight: '10px', verticalAlign: 'middle'}} />
      <Typography color='primary' style={{fontWeight: 600}} data-testid='view'>{translate('dashboard.view_customer_journey')}</Typography>
    </div>
  )
}

ViewCustomerJourney.propTypes = {
  translate: PropTypes.func.isRequired
};
const useStyles = makeStyles(() => ({
  view: {
    display: 'flex', 
    margin: '20px 0 0 79px', 
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 600,
    color: '#66A59A'
  },
  viewMobile: {
    display: 'flex', 
    margin: '20px 0 0 20px', 
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500
  }
}));