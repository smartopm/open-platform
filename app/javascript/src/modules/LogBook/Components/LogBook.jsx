import React, { useState } from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import SaveIcon from '@material-ui/icons/Save';
import { StyledTabs, StyledTab, TabPanel, a11yProps } from '../../../components/Tabs';
import { useParamsQuery } from '../../../utils/helpers';
import LogEvents from './LogEvents'
import VisitView from './VisitView'

export default function LogBook() {
  // function handleChange(_event, newValue) {
  //   setvalue(newValue);
  //   setSearchTerm('');
  //   // reset pagination after changing the tab
  //   history.push(`/entry_logs?tab=${newValue}&offset=${0}`);
  // }
  const actions = [
    { icon: <FileCopyIcon />, name: 'Copy' },
    { icon: <SaveIcon />, name: 'Save' },
  ];
  const path = useParamsQuery();
  const tabValue = path.get('tab');
  const [value, setvalue] = useState(Number(tabValue) || 0);
  const classes = useStyles();
  const [direction, setDirection] = React.useState('down');
  const [open, setOpen] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);

  const handleDirectionChange = (event) => {
    setDirection(event.target.value);
  };

  const handleHiddenChange = (event) => {
    setHidden(event.target.checked);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  return (
    <>
      <Grid container>
        <Grid item sm={6}>
          <Typography variant='h5'>Log Book</Typography>
        </Grid>
        <Grid item sm={6}>
          
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

const useStyles = makeStyles((theme) => ({
  root: {
    // transform: 'translateZ(0px)',
    // flexGrow: 1,
  },
  exampleWrapper: {
    // position: 'relative',
    // marginTop: theme.spacing(3),
    // height: 380,
  },
  radioGroup: {
    margin: theme.spacing(1, 0),
  },
  // speedDial: {
  //   // position: 'absolute',
  //   '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
  //     bottom: theme.spacing(2),
  //     right: theme.spacing(2),
  //   },
  //   '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
  //     top: theme.spacing(2),
  //     left: theme.spacing(2),
  //   },
  // },
}));