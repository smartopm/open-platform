/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react'
import { Grid,Typography } from '@mui/material';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { makeStyles } from '@material-ui/styles';
import { useMediaQuery, useTheme } from '@mui/material';
import Container from '@mui/material/Container';
import PropTypes from 'prop-types'
import LeadManagementForm from './LeadManagementForm';


export default function LeadManagementDetails({ userId, tabValue }){
  useEffect(() => {
    if (tabValue === 'Lead Management') {
      console.log("Am in lead management page")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabValue])
  // const classes = useStyles();
  const theme = useTheme();

  const [value, setValue] = React.useState('1');
  const matches = useMediaQuery('(max-width:1200px)');
  // const matchesSmall = useMediaQuery(theme.breakpoints.down('md'));

  const handleChange = (_event, newValue) => {
    setValue(newValue);
  };
  return (
    <Container maxWidth='xl' >
      <Grid container style={{ display: 'flex', justifyContent: 'center' }}>
        <Grid item md={10} xs ={12}>
        <Typography variant="h5">Lead Management</Typography>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} fullWidth >
                  <Tab label="DETAILS" value="1" />
                  <Tab label="TASK" value="2" />
                  <Tab label="NOTES" value="3" />
              </TabList>
            </Box>

          <Box style={{ padding: 0 }} p={3}>
              <TabPanel value="1"><LeadManagementForm userId={userId}/></TabPanel>
              <TabPanel value="2">Item Two</TabPanel>
              <TabPanel value="3">Item Three</TabPanel>
          </Box>
          </TabContext>
        </Grid>
     </Grid>
    </Container>
  )
}

LeadManagementDetails.propTypes = {
  tabValue: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired
}


const useStyles = makeStyles(() => ({
    mainBody: {
      padding: '0.5%',

    },
    tabPanel: {
        padding: '0'
    }
  }));