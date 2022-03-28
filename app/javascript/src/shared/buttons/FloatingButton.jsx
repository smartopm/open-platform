import React from 'react';
import { Fab } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import AddIcon from '@mui/icons-material/Add'

export default function FloatingButton({ variant, color, handleClick, size, ...otherProps}) {
  const classes = useStyles();
  return (
    <>
      <Fab
        {...otherProps}
        variant={variant}
        onClick={handleClick}
        color={color}
        size={size}
        className={classes.root}
      >
        <AddIcon />
      </Fab>
    </>
  )
}

FloatingButton.defaultProps = {
  variant: 'extended',
  color: 'primary',
  size: 'large'
 }

FloatingButton.propTypes = {
  variant: PropTypes.string,
  color: PropTypes.string,
  handleClick: PropTypes.func.isRequired,
  size: PropTypes.string
}

const useStyles = makeStyles(() => ({
  root: {
    height: 51,
    width: 51,
    boxShadow: 'none',
    position: 'fixed',
    top: 60,
    right: 11,
    color: '#FFFFFF'
  }
}));
