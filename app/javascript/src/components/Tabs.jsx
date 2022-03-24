/* eslint-disable react/prop-types */
import React from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';

import withStyles from '@mui/styles/withStyles';

export function TabPanel(props) {
  const { children, value, index, pad, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={pad ? 0 : 3}>{children}</Box>
    </Typography>
  );
}

export const StyledTabs = withStyles(theme => ({
  indicator: {
    backgroundColor: theme.palette.primary.main,
    '& > div': {
      maxWidth: 40,
      width: '100%',
    }
  }
}))(props => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />);

export const StyledTab = withStyles({
  root: {
    textTransform: 'none',
    display: 'flex',
    justifyContent: 'center'
  }
})(props => <Tab {...props} />);

export function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'data-testid': `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}
