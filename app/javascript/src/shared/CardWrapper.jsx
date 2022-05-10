import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';

export default function CardWrapper({ children }) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {children}
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  container: {
    padding: '20px',
    border: `2px solid ${theme.palette.secondary.main}`,
    borderRadius: '5px',
    background: '#FBFBFA'
  },
}));

CardWrapper.propTypes = {
  children: PropTypes.node.isRequired
};