import React from 'react'
import { withStyles, Box, Tabs, Tab, Typography } from '@material-ui/core'

export function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  )
}

export const StyledTabs = withStyles({
  indicator: {
    backgroundColor: 'rgb(37, 192, 176)',
    '& > div': {
      maxWidth: 40,
      width: '100%',
      backgroundColor: 'rgb(37, 192, 176)'
    }
  }
})(props => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />)

export const StyledTab = withStyles({
  root: {
    textTransform: 'none',
    color: '#rgb(37, 192, 176)',
    display: 'flex',
    justifyContent: 'center'
  }
})(props => <Tab {...props} />)

export function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}
