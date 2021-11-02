import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import { StyledTabs, StyledTab, TabPanel, a11yProps } from '../../../components/Tabs';
import { useParamsQuery } from '../../../utils/helpers';
import LogEvents from './LogEvents'
import VisitView from './VisitView'
import SpeedDial from '../../../shared/buttons/SpeedDial';

export default function LogBook() {
  // function handleChange(_event, newValue) {
  //   setvalue(newValue);
  //   setSearchTerm('');
  //   // reset pagination after changing the tab
  //   history.push(`/entry_logs?tab=${newValue}&offset=${0}`);
  // }
  const path = useParamsQuery();
  const tabValue = path.get('tab');
  const [value, setvalue] = useState(Number(tabValue) || 0);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const actions = [
    { icon: <FileCopyIcon />, name: 'Copy' },
    { icon: <SaveIcon />, name: 'Save' },
  ];
  return (
    <>
      <Grid container className={classes.container}>
        <Grid item sm={6}>
          <Typography variant='h4'>Log Book</Typography>
        </Grid>
        <Grid item sm={6}>
          <Grid container>
            <Grid item sm={9} />
            <Grid item sm={3}>
              <SpeedDial
                open={open}
                handleClose={() => setOpen(false)}
                handleOpen={() => setOpen(true)}
                direction='down'
                actions={actions}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <StyledTabs
        value={value}
        onChange={(_event, newValue) => setvalue(newValue)}
        aria-label="simple tabs example"
        // variant={!matches ? 'scrollable' : 'standard'}
        // scrollButtons={!matches ? 'on' : 'off'}
        // centered={matches}
      >
        <StyledTab label='LOG VIEW' {...a11yProps(0)} />
        <StyledTab label='VISIT VIEW' {...a11yProps(1)} />
      </StyledTabs>
      <TabPanel value={value} index={0}>
        <LogEvents />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <VisitView />
      </TabPanel>
    </>
  )
}

const useStyles = makeStyles(() => ({
  container: {
    margin: "50px  20px 50px 50px"
  }
}));