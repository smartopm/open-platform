import React from 'react';
import { Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import makeStyles from '@mui/styles/makeStyles';
import { objectAccessor } from '../../../../utils/helpers';

export default function PlanMobileDataList({ keys, data }) {
  const classes = useStyles();

  return (
    <div>
      {data.map((item, index) => (
        <div key={item.id || index}>
          <Grid container data-testid='title'>
            <Grid item xs={6}>
              {objectAccessor(item, keys[3].title)}
            </Grid>
            <Grid item xs={4} style={{ textAlign: 'right' }}>
              {objectAccessor(item, keys[4].title)}
            </Grid>
            <Grid item xs={2} style={{ textAlign: 'right' }}>
              {objectAccessor(item, keys[5].title)}
            </Grid>
          </Grid>
          <Grid container style={{ marginTop: '23px' }} data-testid='content'>
            <Grid item xs={5} className={classes.title}>
              <Typography style={{fontWeight: 500, fontSize: '12px'}}>Payment Plan</Typography>
              {objectAccessor(item, keys[1].title)}
            </Grid>
            <Grid item xs={4} className={classes.title}>
              <Typography style={{fontWeight: 500, fontSize: '12px'}}>Plot Number</Typography>
              {objectAccessor(item, keys[0].title)}
            </Grid>
            <Grid item xs={3} className={classes.title}>
              <Typography style={{fontWeight: 500, fontSize: '12px'}}>Start Date</Typography>
              {objectAccessor(item, keys[2].title)}
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <KeyboardArrowDownIcon />
          </Grid>
        </div>
      ))}
    </div>
  );
}

export function PaymentMobileDataList({ keys, data, handleClick }) {
  const classes = useStyles();

  return (
    <div>
      {data.map((item, index) => (
        <Grid key={item.id || index} className={classes.body} onClick={() => handleClick(item)} data-testid='title'>
          <Grid container>
            <Grid item xs={4}>
              <Typography style={{fontWeight: 500, fontSize: '12px'}}>Payment Date</Typography>
              {objectAccessor(item, keys[0].title)}
            </Grid>
            <Grid item xs={4} style={{ textAlign: 'right' }}>
              <Typography style={{fontWeight: 500, fontSize: '12px'}}>Amount</Typography>
              {objectAccessor(item, keys[2].title)}
            </Grid>
            <Grid item xs={4} style={{ textAlign: 'right' }}>
              {objectAccessor(item, keys[4].title)}
            </Grid>
          </Grid>
          <Grid container style={{ marginTop: '23px' }} data-testid='content'>
            <Grid item xs={6} className={classes.title}>
              <Typography style={{fontWeight: 500, fontSize: '12px'}}>Payment Type</Typography>
              {objectAccessor(item, keys[1].title)}
            </Grid>
            <Grid item xs={6} className={classes.title}>
              {objectAccessor(item, keys[3].title)}
            </Grid>
          </Grid>
        </Grid>
      ))}
    </div>
  );
}

export function TransactionMobileDataList({ keys, data, handleClick }) {
  const classes = useStyles();

  return (
    <div>
      {data.map((item, index) => (
        <Grid key={item.id || index} className={classes.body} onClick={() => handleClick(item)} data-testid='title'>
          <Grid container>
            <Grid item xs={6}>
              <Typography style={{fontWeight: 500, fontSize: '12px'}}>Payment Date</Typography>
              {objectAccessor(item, keys[0].title)}
            </Grid>
            <Grid item xs={6} style={{ textAlign: 'right' }}>
              {objectAccessor(item, keys[4].title)}
            </Grid>
          </Grid>
          <Grid container style={{ marginTop: '23px' }} data-testid='content'>
            <Grid item xs={4}>
              <Typography style={{fontWeight: 500, fontSize: '12px'}}>Amount Paid</Typography>
              {objectAccessor(item, keys[3].title)}
            </Grid>
            <Grid item xs={4} className={classes.title}>
              <Typography style={{fontWeight: 500, fontSize: '12px'}}>Payment Type</Typography>
              {objectAccessor(item, keys[2].title)}
            </Grid>
            <Grid item xs={4} className={classes.title}>
              <Typography style={{fontWeight: 500, fontSize: '12px'}}>Recorded By</Typography>
              {objectAccessor(item, keys[1].title)}
            </Grid>
          </Grid>
        </Grid>
      ))}
    </div>
  );
}

const useStyles = makeStyles(() => ({
  title: {
    fontSize: '10px',
    fontWeight: 300,
    color: '#141414'
  },
  content: {
    fontWeight: 400,
    fontSize: '13px'
  },
  body: {
    padding: '20px',
    border: '1px solid #F4F4F4',
    borderRadius: '2px'
  }
}));

PlanMobileDataList.defaultProps = {
  keys: [{}],
  data: [{}]
}

PaymentMobileDataList.defaultProps = {
  handleClick: () => {},
  keys: [{}],
  data: [{}]
}

TransactionMobileDataList.defaultProps = {
  handleClick: () => {},
  keys: [{}],
  data: [{}]
}

PlanMobileDataList.propTypes = {
  keys: PropTypes.arrayOf(PropTypes.shape()),
  data: PropTypes.arrayOf(PropTypes.shape())
};

PaymentMobileDataList.propTypes = {
  keys: PropTypes.arrayOf(PropTypes.shape()),
  data: PropTypes.arrayOf(PropTypes.shape()),
  handleClick: PropTypes.func
};

TransactionMobileDataList.propTypes = {
  keys: PropTypes.arrayOf(PropTypes.shape()),
  data: PropTypes.arrayOf(PropTypes.shape()),
  handleClick: PropTypes.func
};
