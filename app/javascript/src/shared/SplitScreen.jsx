import React from 'react'
import PropTypes from 'prop-types';
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import { makeStyles, useTheme } from '@mui/styles';

export default function SplitScreen({ children, open, onClose }) {
  const classes = useStyles();
  const theme = useTheme();
  const matchesSm = useMediaQuery(theme.breakpoints.only('sm'));
  const matchesxs = useMediaQuery(theme.breakpoints.only('xs'));
  const matchesMd = useMediaQuery(theme.breakpoints.only('md'));
  const matchesLg = useMediaQuery(theme.breakpoints.only('lg'));
  function drawerStyles() {
    if (matchesSm) {
      return classes.drawerPaperMobile
    }
    if (matchesMd) {
      return classes.mdDrawerPaper
    }
    if (matchesLg) {
      return classes.drawerPaper
    }
    if (matchesxs) {
      return classes.drawerPaperMobile
    }

    return classes.drawerPaper
  }

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={open}
      onClose={onClose}
      data-testid='drawer'
      elevation={0}
      classes={{ paper: drawerStyles() }}
    >
      {children}
    </Drawer>
  )
}

const useStyles = makeStyles(() => ({
  drawerPaper: {
    width: '48%',
    marginTop: '50px',
    background: '#FAFAFA !important',
    border: '0px !important',
    zIndex: 10
  },
  drawerPaperMobile: {
    width: '100%',
    background: '#FFFFFF !important',
    marginTop: '50px'
  },
  mdDrawerPaper: {
    width: '40%',
    marginTop: '50px',
    background: '#FAFAFA !important',
    border: '0px !important'
  },
  campaignList: {
    overflowX: 'hidden',
    overflowY: 'auto'
  }
}));

SplitScreen.defaultProps = {
  onClose: () => {}
}

SplitScreen.propTypes = {
  open: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func,
};
