import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Typography from '@material-ui/core/Typography';
import TextFieldLiveEdit from '../../../shared/TextFieldLiveEdit';
import DatePickerDialog from '../../../components/DatePickerDialog';

export default function CampaignSplitScreenContent() {
  const classes = useStyles();
  const [,selectedDate] = useState('');
  return (
    <Grid container className={classes.container}>
      <Grid item sm={9}>
        <Typography variant="h6" className={classes.title}>
          New Campaign
        </Typography>
      </Grid>
      <Grid item sm={3} className={classes.buttonGrid}>
        <Button disableElevation className={classes.button} variant="contained">
          Save Changes
        </Button>
      </Grid>
      <Grid item sm={12} className={classes.liveEvent}>
        <TextFieldLiveEdit
          text="Add a Campaign Title"
          textVariant="h5"
          textFieldVariant="outlined"
          fullWidth
        />
      </Grid>
      <Grid container className={classes.topInfo}>
        <Grid item sm={3}>
          <Typography variant="caption" color="textSecondary">
            Status
          </Typography>
        </Grid>
        <Grid item sm={9}>
          <ButtonGroup color="primary" aria-label="status button">
            <Button>Draft</Button>
            <Button>Scheduled</Button>
            <Button>Sending</Button>
            <Button>Done</Button>
          </ButtonGroup>
        </Grid>
      </Grid>
      <Grid container className={classes.topInfo}>
        <Grid item sm={3}>
          <Typography variant="caption" color="textSecondary">
            Batch Time
          </Typography>
        </Grid>
        <Grid item sm={6}>
          <DatePickerDialog
            handleDateChange={() => {}}
            selectedDate={selectedDate}
          />
        </Grid>
      </Grid>
      <Grid container className={classes.topInfo}>
        <Grid item sm={3}>
          <Typography variant='caption'>Campaign Type</Typography>
        </Grid>
        <Grid item sm={9}>
          <ButtonGroup color="primary" aria-label="status button">
            <Button>SMS</Button>
            <Button>Email</Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles(() => ({
  container: {
    padding: '50px 40px'
  },
  title: {
    color: '#616161',
    fontWeight: 400
  },
  button: {
    color: '#A3A3A3',
    backgroundColor: '#DCDCDC',
    fontWeight: 300
  },
  buttonGrid: {
    textAlign: 'right'
  },
  liveEvent: {
    paddingBottom: '30px'
  },
  topInfo: {
    marginBottom: '20px'
  }
}));
