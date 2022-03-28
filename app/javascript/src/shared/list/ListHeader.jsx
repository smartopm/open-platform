import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';


// If headers has just title then we render the title if not then we render something else.
export default function ListHeader({ headers, color }) {
  const classes = useStyles();
  return (
    <Grid
      container
      direction="row"
      justifyContent="space-around"
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
  color: false
}

ListHeader.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      col: PropTypes.number.isRequired
    })
  ).isRequired,
  color: PropTypes.bool
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
