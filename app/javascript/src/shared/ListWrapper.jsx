import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';

export default function ListWrapper({ children, className }) {
  const classes = useStyles();
  return (
    <div className={`${classes.container} ${className}`}>
      {children}
    </div>
  );
}

const useStyles = makeStyles(() => ({
  container: {
    // TODO: Add this color to the default theme as a neutral background color
    background: '#F5F5F4', 
    padding: '10px 15px', 
    borderRadius: '10px'
  }
 }))

 ListWrapper.defaultProps = {
  className: ''
 }
ListWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
}