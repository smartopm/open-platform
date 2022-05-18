/* eslint-disable complexity */
import React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import { objectAccessor } from '../../../../utils/helpers';

export default function ScoreCard({ data, statusCard, currentStatus }) {
  const classes = useStyles();
  const years = {
    '01': "Jan",
    "02": "Feb",
    "03": "Mar",
    "11": 'Apr',
    "12": "May",
    "13": "Jun",
    "21": "Jul",
    "22": "Aug",
    "23": "Sep",
    "31": "Oct",
    "32": "Nov",
    "33": "Dec" 
  }
  return (
    <div className={classes.container}>
      {!currentStatus ? (
        <Grid container>
          {data.score.map((score, index) => (
            <Grid item md={12} key={score.col1}>
              <Grid container>
                <Grid
                  item
                  md={3}
                  className={`${classes.rightBorder} ${
                    index % 2 === 0 ? undefined : classes.columnColor
                  } ${classes.colPadding} ${statusCard ? classes.padRow : undefined}`}
                >
                  <Typography color={index !== 0 ? 'text.secondary' : undefined}>
                    {score.col1}
                  </Typography>
                </Grid>
                <Grid
                  item
                  md={3}
                  className={`${classes.alignCenter} ${classes.rightBorder} ${
                    index % 2 === 0 ? undefined : classes.columnColor
                  } ${index === 0 ? undefined : classes.textColor} ${
                    statusCard ? classes.padRow : undefined
                  }`}
                >
                  {statusCard && (
                    <Typography variant='caption' color='text.secondary'>{objectAccessor(years, `${index}1`)}</Typography>
                  )}
                  <Typography
                    color={index === 0 ? 'text.secondary' : undefined}
                    variant={!statusCard && index === 0 ? 'caption' : undefined}
                  >
                    {score.col2}
                  </Typography>
                </Grid>
                <Grid
                  item
                  md={3}
                  className={`${classes.alignCenter} ${classes.rightBorder} ${
                    index % 2 === 0 ? undefined : classes.columnColor
                  } ${index === 0 ? undefined : classes.textColor} ${
                    statusCard ? classes.padRow : undefined
                  }`}
                >
                  {statusCard && (
                    <Typography variant='caption' color='text.secondary'>{objectAccessor(years, `${index}2`)}</Typography>
                  )}
                  <Typography
                    color={index === 0 ? 'text.secondary' : undefined}
                    variant={!statusCard && index === 0 ? 'caption' : undefined}
                  >
                    {score.col3}
                  </Typography>
                </Grid>
                <Grid
                  item
                  md={3}
                  className={`${classes.alignCenter} ${
                    index % 2 === 0 ? undefined : classes.columnColor
                  } ${index === 0 ? undefined : classes.textColor} ${
                    statusCard ? classes.padRow : undefined
                  }`}
                >
                  {statusCard && (
                    <Typography variant='caption' color='text.secondary'>{objectAccessor(years, `${index}3`)}</Typography>
                  )}
                  <Typography
                    color={index === 0 ? 'text.secondary' : undefined}
                    variant={!statusCard && index === 0 ? 'caption' : undefined}
                  >
                    {score.col4}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container>
          {data.score.map((score, index) => (
            <Grid item md={12} key={score.col1}>
              <Grid container>
                <Grid item md={10} className={`${classes.colPadding} ${index % 2 === 0 ? undefined : classes.columnColor} ${classes.textColor}`}>
                  {score.col1}
                </Grid>
                <Grid item md={2} className={`${index % 2 === 0 ? undefined : classes.columnColor} ${classes.textColor}`}>
                  {score.col2}
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
}

const useStyles = makeStyles(() => ({
  alignCenter: {
    textAlign: 'center'
  },
  rightBorder: {
    borderRight: '1px solid #ECEBEB'
  },
  container: {
    border: '1px solid #89A2C1',
    borderRadius: '10px',
    padding: '5px 0',
    marginBottom: '20px'
  },
  columnColor: {
    background: '#F0F8FA'
  },
  colPadding: {
    paddingLeft: '10px'
  },
  textColor: {
    color: '#69ADC6'
  },
  padRow: {
    paddingTop: '15px',
    paddingBottom: '15px'
  }
}));

ScoreCard.defaultProps = {
  statusCard: false,
  currentStatus: false
}

ScoreCard.propTypes = {
  data: PropTypes.shape({
    score: PropTypes.arrayOf({
      col1: PropTypes.string,
      col2: PropTypes.string,
      col3: PropTypes.string,
      col4: PropTypes.string
    })
  }).isRequired,
  statusCard: PropTypes.bool,
  currentStatus: PropTypes.bool
};
