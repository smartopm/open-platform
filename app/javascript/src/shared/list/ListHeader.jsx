import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';


// If headers has just title then we render the title if not then we render something else.
export default function ListHeader({ headers, color }) {
  const classes = useStyles();
  return (
    <Grid
      container
      direction="row"
      justify="space-around"
      alignItems="center"
      className={classes.heading}
      style={color ? {backgroundColor: '#FDFDFD'} : null}
    >
      {headers.map(header => (
        <Grid item xs={header.col || true} md={header.title === 'Menu' ? 1 : 2} key={header.title}>
          <b>
            <Typography variant='body2' className={classes.typography}>
              {['Select', 'Menu'].includes(header.value || header.title) ? null : header.value || header.title}
            </Typography>
          </b>
        </Grid>
      ))}
    </Grid>
  );
}

ListHeader.defaultProps = {
  color: ''
}

ListHeader.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      col: PropTypes.number.isRequired
    })
  ).isRequired,
  color: PropTypes.string
};

const useStyles = makeStyles(() => ({
  heading: {
    backgroundColor: '#FFFFFF',
    padding: '15px 0',
    border: '1px solid #ECECEC',
    width: '100%',
    marginLeft: '1px'
  },
  typography: {
    fontWeight: 'bold'
  }
}));
