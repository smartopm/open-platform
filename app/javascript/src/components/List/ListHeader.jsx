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
    >
      {headers.map((header, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Typography key={`${header}-${index}`} className={classes.typography}>
          {header}
        </Typography>
      ))}
    </Grid>
  );
}

ListHeader.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string).isRequired
};

const useStyles = makeStyles(() => ({
  heading: {
    backgroundColor: '#FFFFFF',
    padding: '15px 0',
    border: '1px solid #ECECEC'
  },
  typography: {
    width: '150px',
    marginLeft: ''
  }
}));
