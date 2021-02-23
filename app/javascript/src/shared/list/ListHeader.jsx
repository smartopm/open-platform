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
      {headers.map(header => (
        <Grid item xs={header.col || true} md={header.align === 'right' ? 1 : 2} key={header.title} style={{textAlign: header.align}}>
          <b>
            <Typography variant='body2' className={classes.typography}>
              {['Select', 'Menu'].includes(header.title) ? null : header.title}
            </Typography>
          </b>
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
    fontWeight: 'bold'
  }
}));
