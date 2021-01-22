import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

export default function ListHeader({ headers }) {
  const classes = useStyles();
  return (
    <Grid
      container
      direction="row"
      justify="space-around"
      alignItems="center"
      className={classes.heading}
      // spacing={3}
    >
      {headers.map(header => (
        <Grid item xs={header.col} key={header.title}>
          <Typography className={classes.typography}>
            {['Select', 'Menu'].includes(header.title) ? null : header.title}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
}

ListHeader.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      col: PropTypes.number.isRequired
    })
  ).isRequired
};

const useStyles = makeStyles(() => ({
  heading: {
    backgroundColor: '#FFFFFF',
    padding: '15px 0',
    border: '1px solid #ECECEC'
  },
  typography: {
    // width: '150px',
    marginLeft: 30
  }
}));
