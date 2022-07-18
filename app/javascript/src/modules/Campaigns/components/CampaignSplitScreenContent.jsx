/* eslint-disable max-statements */
/* eslint-disable max-lines */
import React, { useState, useEffect, useContext } from 'react';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import { useLocation, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useMediaQuery from '@mui/material/useMediaQuery';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useMutation, useQuery } from 'react-apollo';
import { makeStyles, useTheme } from '@mui/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
import TextFieldLiveEdit from '../../../shared/TextFieldLiveEdit';
import { DateAndTimePickers } from '../../../components/DatePickerDialog';
import CampaignLabels from './CampaignLabels';
import { getJustLabels, delimitorFormator, formatError } from '../../../utils/helpers';
import {
  CampaignCreate,
  CampaignUpdateMutation,
  CampaignLabelRemoveMutation
} from '../../../graphql/mutations';
import CampaignStatCard from './CampaignStatCard';
import TemplateList from '../../Emails/components/TemplateList';
import SearchInput from '../../../shared/search/SearchInput';
import useDebounce from '../../../utils/useDebounce';
import SearchID from '../graphql/campaign_query';
import { Spinner } from '../../../shared/Loading';
import CenteredContent from '../../../shared/CenteredContent';
import UserNameAvatar from '../../../shared/UserNameAvatar';
import { SnackbarContext } from '../../../shared/snackbar/Context';

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
  const history = useHistory();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const breadCrumbShow = useMediaQuery(theme.breakpoints.up('md'));
  const [formData, setFormData] = useState(initData);
  const [mailListType, setMailListType] = useState('label');
  const [label, setLabel] = useState([]);
  const [mutationLoading, setLoading] = useState(false);
  const [campaignCreate] = useMutation(CampaignCreate);
  const [campaignLabelRemove] = useMutation(CampaignLabelRemoveMutation);
  const [campaignUpdate] = useMutation(CampaignUpdateMutation);
  const { t } = useTranslation(['campaign', 'common']);
  const { state } = useLocation();
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText, 500);
  const { data, error, loading } = useQuery(SearchID, {
    variables: { query: debouncedSearchText, userIds: formData.userIdList.split(',') },
    fetchPolicy: 'cache-and-network'
  });

  const { showSnackbar, messageType } = useContext(SnackbarContext);

  function handleLabelDelete(labelId) {
    campaignLabelRemove({
      variables: { campaignId: campaign.id, labelId }
    })
      .then(() => refetch())
      .catch(err => {
        showSnackbar({ type: messageType.error, message: formatError(err.message) })
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

  function handleBreadCrumbClose() {
    handleClose(false);
    history.push('/campaigns');
  }

  async function createCampaignOnSubmit(campData) {
    setLoading(true);
    try {
      await campaignCreate({ variables: campData });
      showSnackbar({ type: messageType.success, message: t('message.campaign_successfully_created') })
      setFormData(initData);
      setLoading(false);
      refetch();
    } catch (err) {
      showSnackbar({ type: messageType.error, message: formatError(err.message) })
      setLoading(false);
    }
  }

  async function campaignUpdateOnSubmit(campData) {
    setLoading(true);
    try {
      await campaignUpdate({ variables: campData });
      showSnackbar({ type: messageType.success, message: t('message.campaign_successfully_updated') })
      setLoading(false);
      refetch();
    } catch (err) {
      showSnackbar({ type: messageType.error, message: formatError(err.message) })
      setLoading(false);
    }
  }

  function validateCampaignForm() {
    if (!formData.name) {
      showSnackbar({ type: messageType.error, message: t('message.include_name') })
      setLoading(false);
      return false;
    }
    if (!formData.batchTime) {
      showSnackbar({ type: messageType.error, message: t('message.include_batch_time') })
      setLoading(false);
      return false;
    }
    if (formData.status === 'scheduled') {
      if (!formData.message) {
        showSnackbar({ type: messageType.error, message: t('message.include_message') })
        setLoading(false);
        return false;
      }
      if (!formData.userIdList) {
        showSnackbar({ type: messageType.error, message: t('message.include_user_list') })
        setLoading(false);
        return false;
      }
    }
    if (formData.campaignType === 'email') {
      if (!formData.emailTemplatesId) {
        showSnackbar({ type: messageType.error, message: t('message.include_email_template') })
        setLoading(false);
        return false;
      }
    }
    return true;
  }

  function handleTemplateValue(event) {
    setFormData({
      ...formData,
      emailTemplatesId: event.target.value
    });
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
    if (!validateCampaignForm()) {
      return false;
    }

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

  useEffect(() => {
    if (state?.from === '/users' || formData.status === 'scheduled') {
      setMailListType('idlist');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.status]);
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
              onClick={() => handleBreadCrumbClose()}
            >
              <KeyboardBackspaceIcon style={{ marginRight: '4px' }} />
              {t('campaign.campaigns')}
            </Typography>
            <Typography>{t('campaign.campaign_detail')}</Typography>
          </Breadcrumbs>
        </Grid>
      )}
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
            color="primary"
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
          styles={{ margin: '0 -12px' }}
          fullWidth
          name="name"
          multiline
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
            <Button
              onClick={
                formData.status !== 'done' ? () => handleStatusButtonClick('draft') : undefined
              }
              style={buttonStyle('draft')}
            >
              <Typography variant="body2">{t('form_fields.draft')}</Typography>
            </Button>
            <Button
              onClick={
                formData.status !== 'done' ? () => handleStatusButtonClick('scheduled') : undefined
              }
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
            t={t}
          />
        </Grid>
      </Grid>
      <Grid item sm={12} xs={12}>
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
              <Button
                style={buttonStyle('email')}
                onClick={() => handleTypeButtonClick('email')}
                data-testid="email"
              >
                <Typography variant="body2">{t('common:form_fields.email')}</Typography>
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </Grid>
      <Grid item sm={6} xs={6} className={classes.topInfo} data-testid="email-template">
        {formData.campaignType === 'email' && (
          <>
            <TemplateList
              value={formData.emailTemplatesId || ''}
              handleValue={handleTemplateValue}
              isRequired
            />
          </>
        )}
      </Grid>
      <Grid item sm={12} xs={12}>
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
        <Grid item sm={12} xs={12} className={classes.liveEvent}>
          <TextFieldLiveEdit
            placeHolderText={t('message.add_a_message')}
            textVariant="body2"
            textFieldVariant="outlined"
            fullWidth
            multiline
            text={formData.message || ''}
            handleChange={handleInputChange}
            name="message"
            styles={{ margin: '0 -12px' }}
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
                  label.map((labl) => (
                    <Chip
                      data-testid="campaignChip-label"
                      key={labl}
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
          <Grid container style={{ paddingBottom: '50px' }}>
            <Grid item sm={12} xs={12} className={classes.liveEvent}>
              <TextFieldLiveEdit
                placeHolderText={t('message.paste_userid_list')}
                textVariant="body2"
                textFieldVariant="outlined"
                fullWidth
                multiline
                text={formData.userIdList}
                handleChange={handleInputChange}
                name="userIdList"
                styles={{ margin: '0 -12px' }}
                rows={!formData.userIdList ? undefined : 5}
              />
            </Grid>
            {formData.userIdList && (
              <>
                <Grid item sm={8} xs={12}>
                  <SearchInput
                    filterRequired={false}
                    title={t('common:misc.users')}
                    searchValue={searchText}
                    handleSearch={e => setSearchText(e.target.value)}
                    handleClear={() => setSearchText('')}
                  />
                </Grid>
                <Grid item sm={12} xs={12}>
                  {error && (
                    <CenteredContent>
                      <p>{error.message}</p>
                    </CenteredContent>
                  )}
                  {loading ? (
                    <Spinner />
                  ) : (
                    searchText && (
                      <Grid
                        container
                        spacing={2}
                        data-testid="search-result"
                        style={{ paddingTop: '10px' }}
                      >
                        {data?.searchUserIds.map(user => (
                          <Grid item sm={4} xs={8} key={user.id}>
                            <UserNameAvatar user={user} style={{ padding: '10px 0' }} />
                          </Grid>
                        ))}
                      </Grid>
                    )
                  )}
                </Grid>
              </>
            )}
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
    color: 'white',
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
    campaignMetrics: PropTypes.instanceOf(Object),
  }),
  refetch: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};
