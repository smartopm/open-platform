/* eslint-disable max-statements */
/* eslint-disable max-lines */
import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { useMutation } from 'react-apollo';
import { makeStyles } from '@material-ui/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Typography from '@material-ui/core/Typography';
import TextFieldLiveEdit from '../../../shared/TextFieldLiveEdit';
import { DateAndTimePickers } from '../../../components/DatePickerDialog';
import CampaignLabels from './CampaignLabels';
import { getJustLabels, delimitorFormator, formatError } from '../../../utils/helpers';
import {
  CampaignCreate,
  CampaignUpdateMutation,
  CampaignLabelRemoveMutation
} from '../../../graphql/mutations';
import MessageAlert from '../../../components/MessageAlert';

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

export default function CampaignSplitScreenContent({ refetch, campaign }) {
  const classes = useStyles();
  const [formData, setFormData] = useState(initData);
  const [mailListType, setMailListType] = useState('label');
  const [label, setLabel] = useState([]);
  const [isSuccessAlert, setIsSuccessAlert] = useState(false);
  const [mutationLoading, setLoading] = useState(false);
  const [campaignCreate] = useMutation(CampaignCreate);
  const [messageAlert, setMessageAlert] = useState('');
  const [campaignLabelRemove] = useMutation(CampaignLabelRemoveMutation);
  const [campaignUpdate] = useMutation(CampaignUpdateMutation);

  function handleLabelDelete(labelId) {
    campaignLabelRemove({
      variables: { campaignId: campaign.id, labelId }
    })
      .then(() => refetch())
      .catch(err => {
        setIsSuccessAlert(false);
        setMessageAlert(formatError(err.message));
      });
  }

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

  function handleLabelSelect(value) {
    setLabel([...getJustLabels(value)]);
  }

  async function createCampaignOnSubmit(campData) {
    setLoading(true);
    try {
      await campaignCreate({ variables: campData });
      setIsSuccessAlert(true);
      setFormData(initData);
      setLoading(false);
      setMessageAlert('Campaign succesfully created');
      refetch();
    } catch (err) {
      setIsSuccessAlert(false);
      setMessageAlert(formatError(err.message));
      setLoading(false);
    }
  }

  async function campaignUpdateOnSubmit(campData) {
    setLoading(true);
    try {
      await campaignUpdate({ variables: campData });
      setIsSuccessAlert(true);
      setLoading(false);
      setMessageAlert('Campaign succesfully updated');
      refetch();
    } catch (err) {
      setIsSuccessAlert(false);
      setMessageAlert(formatError(err.message));
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    // validateFormDataFields(formData)
    // if creating a campaign don't spread
    const labels = campaign ? [...label, ...getJustLabels(formData.labels)] : label
    const campaignData = {
      id: formData.id,
      name: formData.name,
      campaignType: formData.campaignType,
      status: formData.status,
      emailTemplatesId: formData.emailTemplatesId,
      message: formData.message,
      batchTime: formData.batchTime,
      userIdList: delimitorFormator(formData.userIdList).toString(),
      labels: labels.toString(),
      includeReplyLink: formData.includeReplyLink
    };
    if (campaign) {
      return campaignUpdateOnSubmit(campaignData);
    }
    return createCampaignOnSubmit(campaignData);
  }

  useEffect(() => {
    if (campaign) {
      setFormData(campaign);
    }
  }, [campaign]);
  return (
    <Grid container className={classes.container}>
      <div className={classes.messageAlert}>
        <MessageAlert
          type={isSuccessAlert ? 'success' : 'error'}
          message={messageAlert}
          open={!!messageAlert}
          handleClose={() => setMessageAlert('')}
          style={{ marginTop: '30px' }}
        />
      </div>
      <Grid item sm={9}>
        <Typography variant="h6" className={classes.title}>
          {campaign ? 'Edit Campaign' : 'New Campaign'}
        </Typography>
      </Grid>
      <Grid item sm={3} className={classes.buttonGrid}>
        <Button
          disableElevation
          disabled={mutationLoading}
          className={classes.button}
          variant="contained"
          onClick={e => handleSubmit(e)}
        >
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
                classes={{ root: classes.root }}
                name="include_link_check"
                checked={formData.includeReplyLink}
                color="default"
                size="small"
                onChange={event =>
                  setFormData({ ...formData, includeReplyLink: event.target.checked })
                }
              />
            )}
            label={(
              <Typography variant="caption" color="textSecondary">
                Include Link
              </Typography>
            )}
          />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item sm={12}>
          <Typography variant="caption" color="textSecondary">
            Message
          </Typography>
        </Grid>
        <Grid item sm={12} className={classes.liveField}>
          <TextFieldLiveEdit
            placeHolderText="Add a message"
            textVariant="body2"
            textFieldVariant="outlined"
            fullWidth
            text={formData.message || ''}
            handleChange={handleInputChange}
            name="message"
          />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item sm={3}>
          <Typography variant="caption" color="textSecondary">
            Setup Mailing List
          </Typography>
        </Grid>
        <Grid item sm={9}>
          <ButtonGroup color="primary" aria-label="mailing list button">
            <Button onClick={() => setMailListType('label')} style={buttonStyle('label')}>
              USE LABEL
            </Button>
            <Button onClick={() => setMailListType('idlist')} style={buttonStyle('idlist')}>
              USE ID LIST
            </Button>
          </ButtonGroup>
        </Grid>
        {mailListType === 'label' && (
          <Grid item sm={12}>
            <Grid container>
              <Grid item sm={4} className={classes.labelText}>
                <CampaignLabels handleLabelSelect={handleLabelSelect} />
              </Grid>
              <Grid item sm={8}>
                {label.map((labl, i) => (
                  <Chip
                    data-testid="campaignChip-label"
                    // eslint-disable-next-line react/no-array-index-key
                    key={i}
                    label={labl?.shortDesc || labl}
                    className={classes.chip}
                  />
                ))}
                {Boolean(formData.labels.length) &&
                  formData.labels.map(labl => (
                    <Chip
                      data-testid="campaignChip-label"
                      key={labl.id}
                      size="medium"
                      onDelete={() => handleLabelDelete(labl.id)}
                      label={labl.shortDesc}
                      className={classes.chip}
                    />
                  ))}
              </Grid>
            </Grid>
          </Grid>
        )}
        {mailListType === 'idlist' && (
          <Grid item sm={12} className={classes.listId}>
            <TextFieldLiveEdit
              placeHolderText="Paste User ID list from User's page here to build a mailing list"
              textVariant="body2"
              textFieldVariant="outlined"
              fullWidth
              multiline
              text={formData.userIdList}
              handleChange={handleInputChange}
              rows={4}
              name="userIdList"
            />
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles(() => ({
  container: {
    padding: '40px'
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
    paddingBottom: '30px',
    height: '100px'
  },
  topInfo: {
    marginBottom: '20px'
  },
  label: {
    fontSize: '14px'
  },
  root: {
    color: '#797979',
    '&$checked': {
      color: '#797979'
    }
  },
  chip: {
    margin: '20px 10px 0 10px'
  },
  labelText: {
    paddingRight: '10px'
  },
  listId: {
    paddingBottom: '30px',
    height: '150px'
  },
  liveField: {
    height: '100px'
  }
}));
