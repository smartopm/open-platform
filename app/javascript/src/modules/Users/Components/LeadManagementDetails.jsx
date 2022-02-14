/* eslint-disable no-use-before-define */
import React, { useState } from 'react'
import { Grid,Typography } from '@mui/material';
import { makeStyles } from '@material-ui/styles';
import { useHistory, useParams } from 'react-router';
import Container from '@mui/material/Container';
import PropTypes from 'prop-types'
import LeadManagementForm from './LeadManagementForm';
import { objectAccessor, useParamsQuery } from '../../../utils/helpers'

import { StyledTabs, StyledTab, TabPanel, a11yProps } from '../../../components/Tabs'


export default function LeadManagementDetails({ userId }){
  const path = useParamsQuery();
  const [tabValue, setTabValue] = useState(0);

  const TAB_VALUES = {
    details: 0,
    task: 1,
    notes: 2
  };
  function handleTabValueChange(_event, newValue) {
    setTabValue(Number(newValue));
  }

  return (
    <Container maxWidth='xl'>
      <Grid container style={{ display: 'flex', justifyContent: 'center' }}>
        <Grid item md={10} xs={12}>
          <Typography variant="h5">Lead Management</Typography>

          <StyledTabs
            value={tabValue}
            onChange={handleTabValueChange}
            aria-label="lead-management-tabs"
            variant="standard"
            style={{ borderBottom: 'solid 1px #ececea' }}
          >
            <StyledTab
              label="DETAILS"
              style={tabValue === objectAccessor(TAB_VALUES, 'details')
                ? { fontSize: '12px', textAlign: 'left', borderBottom: 'solid 1px' }
                : { fontSize: '12px', textAlign: 'left' }}
              {...a11yProps(0)}
            />
            <StyledTab
              label="TASK"
              style={tabValue ===  objectAccessor(TAB_VALUES, 'task') ?
                { fontSize: '12px', borderBottom: 'solid 1px' }
                : { fontSize: '12px' }}
              {...a11yProps(1)}
            />
            <StyledTab
              label="NOTES"
              style={tabValue ===  objectAccessor(TAB_VALUES, 'notes') ?
                { fontSize: '12px', borderBottom: 'solid 1px' }
                : { fontSize: '12px' }}
              {...a11yProps(2)}
            />
          </StyledTabs>


          <TabPanel value={tabValue} index={0}>
            <LeadManagementForm userId={userId} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <h1>Tasks</h1>
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <h1>Notes</h1>
          </TabPanel>
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