import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Typography from '@material-ui/core/Typography';
import TextFieldLiveEdit from '../../../shared/TextFieldLiveEdit';
import { DateAndTimePickers } from '../../../components/DatePickerDialog';

const initData = {
  id: '',
  name: '',
  campaignType: 'sms',
  status: 'draft',
  emailTemplatesId: null,
  message: '',
  batchTime: new Date(),
  userIdList: '',
  loaded: false,
  labels: [],
  includeReplyLink: false
};

export default function CampaignSplitScreenContent() {
  const classes = useStyles();
  const [formData, setFormData] = useState(initData);
  const [mailListType, setMailListType] = useState('label')

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  function buttonStyle(type) {
    if (type === formData.status || type === formData.campaignType || type === mailListType) {
      return { backgroundColor: '#EDF3F5' };
    }
    return undefined;
  }

  function handleDateChange(date) {
    setFormData({
      ...formData,
      batchTime: date
    });
  }

  function handleStatusButtonClick(status) {
    setFormData({
      ...formData,
      status
    });
  }

  function handleTypeButtonClick(campaignType) {
    setFormData({
      ...formData,
      campaignType
    });
  }
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
          placeHolderText="Add a Campaign Title"
          textVariant="h5"
          textFieldVariant="outlined"
          text={formData.name}
          handleChange={handleInputChange}
          fullWidth
          name="name"
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
            <Button onClick={() => handleStatusButtonClick('draft')} style={buttonStyle('draft')}>
              Draft
            </Button>
            <Button
              onClick={() => handleStatusButtonClick('scheduled')}
              style={buttonStyle('scheduled')}
            >
              Scheduled
            </Button>
            <Button
              onClick={() => handleStatusButtonClick('sending')}
              style={buttonStyle('sending')}
            >
              Sending
            </Button>
            <Button onClick={() => handleStatusButtonClick('done')} style={buttonStyle('done')}>
              Done
            </Button>
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
          <DateAndTimePickers
            selectedDateTime={formData.batchTime}
            handleDateChange={handleDateChange}
            pastDate
          />
        </Grid>
      </Grid>
      <Grid container className={classes.topInfo}>
        <Grid item sm={3}>
          <Typography variant="caption" color="textSecondary">
            Campaign Type
          </Typography>
        </Grid>
        <Grid item sm={9}>
          <ButtonGroup color="primary" aria-label="status button">
            <Button style={buttonStyle('sms')} onClick={() => handleTypeButtonClick('sms')}>
              SMS
            </Button>
            <Button style={buttonStyle('email')} onClick={() => handleTypeButtonClick('email')}>
              Email
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
      <Grid container className={classes.topInfo}>
        <Grid item sm={3}>
          <Typography variant="caption" color="textSecondary">
            Reply Link
          </Typography>
        </Grid>
        <Grid item sm={9}>
          <FormControlLabel
            control={(
              <Checkbox
                classes={{root: classes.root}}
                name="include_link_check"
                checked={formData.includeReplyLink}
                color="default"
                size='small'
                onChange={event =>
                  setFormData({ ...formData, includeReplyLink: event.target.checked })
                }
              />
            )}
            label={<Typography variant='caption' color='textSecondary'>Include Link</Typography>}
          />
        </Grid>
      </Grid>
      <Grid container className={classes.topInfo}>
        <Grid item sm={12}>
          <Typography variant="caption" color="textSecondary">
            Message
          </Typography>
        </Grid>
        <Grid item sm={12}>
          <TextFieldLiveEdit
            placeHolderText="Add a message"
            textVariant="body2"
            textFieldVariant="outlined"
            fullWidth
            text={formData.message}
            handleChange={handleInputChange}
            name="message"
          />
        </Grid>
      </Grid>
      <Grid container className={classes.mailingList}>
        <Grid item sm={3}>
          <Typography variant="caption" color="textSecondary">
            Setup Mailing List
          </Typography>
        </Grid>
        <Grid item sm={9}>
          <ButtonGroup color="primary" aria-label="mailing list button">
            <Button onClick={() => setMailListType('label')} style={buttonStyle('label')}>USE LABEL</Button>
            <Button onClick={() => setMailListType('idlist')} style={buttonStyle('idlist')}>USE ID LIST</Button>
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
  },
  mailingList: {
    marginTop: '30px'
  },
  label: {
    fontSize: '14px'
  },
  root: {
    color: '#797979',
    '&$checked': {
      color: '#797979',
    },
  }
}));
