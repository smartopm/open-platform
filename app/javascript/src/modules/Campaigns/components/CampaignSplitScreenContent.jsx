/* eslint-disable complexity */
/* eslint-disable max-statements */
/* eslint-disable max-lines */
import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useMutation } from 'react-apollo';
import { makeStyles, useTheme } from '@material-ui/styles';
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
import CampaignStatCard from './CampaignStatCard';

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

export default function CampaignSplitScreenContent({ refetch, campaign, handleClose }) {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const breadCrumbShow = useMediaQuery(theme.breakpoints.up('md'));
  const [formData, setFormData] = useState(initData);
  const [mailListType, setMailListType] = useState('label');
  const [label, setLabel] = useState([]);
  const [isSuccessAlert, setIsSuccessAlert] = useState(false);
  const [mutationLoading, setLoading] = useState(false);
  const [campaignCreate] = useMutation(CampaignCreate);
  const [messageAlert, setMessageAlert] = useState('');
  const [campaignLabelRemove] = useMutation(CampaignLabelRemoveMutation);
  const [campaignUpdate] = useMutation(CampaignUpdateMutation);
  const { t } = useTranslation(['campaign', 'common']);
  const { state } = useLocation();

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
    const labels = campaign ? [...label, ...getJustLabels(formData.labels)] : label;
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
    if (state?.from === '/users') {
      setMailListType('idlist')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign]);
  return (
    <Grid
      container
      data-testid="container"
      className={matches ? classes.container : classes.containerMobile}
    >
      {!breadCrumbShow && (
        <Grid item xs={12} className={classes.breadCrumb}>
          <Breadcrumbs aria-label="breadcrumb">
            <Typography
              color="primary"
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              onClick={() => handleClose(false)}
            >
              <KeyboardBackspaceIcon style={{ marginRight: '4px' }} />
              {t('campaign.campaigns')}
            </Typography>
            <Typography>{t('campaign.campaign_detail')}</Typography>
          </Breadcrumbs>
        </Grid>
      )}
      <div className={classes.messageAlert}>
        <MessageAlert
          type={isSuccessAlert ? 'success' : 'error'}
          message={messageAlert}
          open={!!messageAlert}
          handleClose={() => setMessageAlert('')}
          style={{ marginTop: '30px' }}
        />
      </div>
      {campaign?.status === 'done' && <CampaignStatCard data={campaign.campaignMetrics} />}
      <Grid item sm={9} xs={6}>
        <Typography variant="h6" data-testid="title" className={classes.title}>
          {campaign ? t('actions.edit_campaign') : t('actions.new_campaign')}
        </Typography>
      </Grid>
      {campaign?.status !== 'done' && (
        <Grid item sm={3} xs={6} className={classes.buttonGrid}>
          <Button
            disableElevation
            disabled={mutationLoading}
            className={classes.button}
            variant="contained"
            data-testid="save-campaign"
            onClick={e => handleSubmit(e)}
          >
            {t('common:form_actions.save_changes')}
          </Button>
        </Grid>
      )}
      <Grid item sm={12} xs={12} className={classes.liveEvent} data-testid="name">
        <TextFieldLiveEdit
          placeHolderText={t('message.add_a_campaign')}
          textVariant="h5"
          textFieldVariant="outlined"
          text={formData.name}
          handleChange={handleInputChange}
          fullWidth
          name="name"
        />
      </Grid>
      <Grid container className={classes.topInfo}>
        <Grid item sm={3} xs={12}>
          <Typography variant="caption" color="textSecondary" data-testid="status">
            {t('common:table_headers.status')}
          </Typography>
        </Grid>
        <Grid item sm={9} xs={12}>
          <ButtonGroup color="primary" aria-label="status button">
            <Button onClick={() => handleStatusButtonClick('draft')} style={buttonStyle('draft')}>
              <Typography variant="body2">{t('form_fields.draft')}</Typography>
            </Button>
            <Button
              onClick={() => handleStatusButtonClick('scheduled')}
              style={buttonStyle('scheduled')}
            >
              <Typography variant="body2">{t('form_fields.scheduled')}</Typography>
            </Button>
            <Button style={buttonStyle('sending')}>
              <Typography variant="body2">{t('form_fields.sending')}</Typography>
            </Button>
            <Button style={buttonStyle('done')}>
              <Typography variant="body2">{t('form_fields.done')}</Typography>
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
      <Grid container className={classes.topInfo}>
        <Grid item sm={3} xs={12}>
          <Typography variant="caption" color="textSecondary" data-testid="batch-time">
            {t('form_fields.batch_time')}
          </Typography>
        </Grid>
        <Grid item sm={6} xs={12}>
          <DateAndTimePickers
            selectedDateTime={formData.batchTime}
            handleDateChange={handleDateChange}
            pastDate
          />
        </Grid>
      </Grid>
      <Grid item sm={12} xs={6}>
        <Grid container className={classes.topInfo}>
          <Grid item sm={3} xs={12}>
            <Typography variant="caption" color="textSecondary">
              {t('form_fields.campaign_type')}
            </Typography>
          </Grid>
          <Grid item sm={9} xs={12}>
            <ButtonGroup color="primary" aria-label="status button" data-testid="type">
              <Button style={buttonStyle('sms')} onClick={() => handleTypeButtonClick('sms')}>
                <Typography variant="body2">SMS</Typography>
              </Button>
              <Button style={buttonStyle('email')} onClick={() => handleTypeButtonClick('email')}>
                <Typography variant="body2">{t('common:form_fields.email')}</Typography>
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </Grid>
      <Grid item sm={12} xs={6}>
        <Grid container className={classes.topInfo}>
          <Grid item sm={3} xs={12}>
            <Typography variant="caption" color="textSecondary">
              {t('form_fields.link_reply')}
            </Typography>
          </Grid>
          <Grid item sm={9} xs={12}>
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
                  {t('form_fields.include_link')}
                </Typography>
              )}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item sm={12} xs={12}>
          <Typography variant="caption" color="textSecondary" data-testid="message">
            {t('form_fields.message')}
          </Typography>
        </Grid>
        <Grid item sm={12} xs={12} className={classes.liveField}>
          <TextFieldLiveEdit
            placeHolderText={t('message.add_a_message')}
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
        <Grid item sm={3} xs={12}>
          <Typography variant="caption" color="textSecondary" data-testid="mail-list">
            {t('form_fields.mailing_list')}
          </Typography>
        </Grid>
        <Grid item sm={9} xs={12}>
          <ButtonGroup color="primary" aria-label="mailing list button">
            <Button onClick={() => setMailListType('label')} style={buttonStyle('label')}>
              {t('actions.use_label')}
            </Button>
            <Button onClick={() => setMailListType('idlist')} style={buttonStyle('idlist')}>
              {t('actions.use_id_lists')}
            </Button>
          </ButtonGroup>
        </Grid>
        {mailListType === 'label' && (
          <Grid item sm={12} xs={12}>
            <Grid container style={{ paddingBottom: '30px' }}>
              <Grid item sm={4} xs={6} className={classes.labelText}>
                <CampaignLabels handleLabelSelect={handleLabelSelect} />
              </Grid>
              <Grid item sm={8} xs={6}>
                {Boolean(label.length) &&
                  label.map((labl, i) => (
                    <Chip
                      data-testid="campaignChip-label"
                      // eslint-disable-next-line react/no-array-index-key
                      key={i}
                      label={labl?.shortDesc || labl}
                      className={classes.chip}
                    />
                  ))}
                {Boolean(formData.labels?.length) &&
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
          <Grid item sm={12} xs={12} className={classes.listId}>
            <TextFieldLiveEdit
              placeHolderText={t('message.paste_userid_list')}
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
  containerMobile: {
    padding: '20px'
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
    color: '#797979'
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
  },
  breadCrumb: {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: '20px'
  }
}));

CampaignSplitScreenContent.defaultProps = {
  campaign: null
};

CampaignSplitScreenContent.propTypes = {
  campaign: PropTypes.shape({
    id: PropTypes.string,
    status: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    campaignMetrics: PropTypes.object
  }),
  refetch: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired
};
