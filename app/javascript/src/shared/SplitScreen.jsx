import React from 'react'
import PropTypes from 'prop-types';
import Drawer from '@mui/material/Drawer';

export default function SplitScreen({ children, open, onClose, classes }) {
  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={open}
      onClose={onClose}
      classes={classes}
    >
      {children}
    </Drawer>
  )
}

SplitScreen.defaultProps = {
  classes: {}
}

SplitScreen.propTypes = {
  open: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object,
};
