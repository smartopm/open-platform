import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { Grid, Typography, Divider } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import CreateEvent from '../graphql/mutations';
import { UserMeetingsQuery, UserSignedDealsQuery } from '../graphql/queries';
import { UpdateUserMutation } from '../../../../graphql/mutations/user';
import CenteredContent from '../../../../shared/CenteredContent';
import { Spinner } from '../../../../shared/Loading';
import MessageAlert from '../../../../components/MessageAlert';
import { formatError } from '../../../../utils/helpers';
import LeadEvent from './LeadEvent';
import ButtonComponent from '../../../../shared/buttons/Button';
import { MenuProps, initialLeadFormData, secondaryInfoUserObject } from '../../utils';
import { divionOptions } from '../../../../utils/constants';

export default function LeadEvents({ userId, data }) {
  const [meetingName, setMeetingName] = useState('');
  const [leadData, setLeadData] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [dealName, setDealName] = useState('');
  const [message, setMessage] = useState({ isError: false, detail: '' });
  const [leadFormData, setLeadFormData] = useState(initialLeadFormData);
  const [eventCreate, { loading: isLoading }] = useMutation(CreateEvent);
  const [leadDataUpdate, { loading: divisionLoading }] = useMutation(UpdateUserMutation);
  const { t } = useTranslation('common');
  const {
    data: meetingsData,
    loading: meetingsLoading,
    refetch: refetchMeetings,
    error: meetingsError
  } = useQuery(UserMeetingsQuery, {
    variables: { userId },
    fetchPolicy: 'cache-and-network'
  });

  const {
    data: signedDealsData,
    loading: signedDealsLoading,
    refetch: refetchSignedDeals,
    error: signedDealsError
  } = useQuery(UserSignedDealsQuery, {
    variables: { userId },
    fetchPolicy: 'cache-and-network'
  });

  function handleDivisionChange(event) {
    setLeadData(true);
    setDisabled(false);
    const { name, value } = event.target;
    setLeadFormData({
      user: { ...leadFormData?.user, [name]: value }
    });
  }

  function handleMeetingNameChange(event) {
    setMeetingName(event.target.value);
  }

  function handleDealNameChange(event) {
    setDealName(event.target.value);
  }

  function handleSubmitDivision(e) {
    e.preventDefault();
    handleSubmit();
    setDisabled(true);
  }

  function handleSubmitMeeting(e) {
    e.preventDefault();
    const type = 'meeting';
    handleSubmit(meetingName, type);
    setMeetingName('');
  }

  function handleSubmitDeal(e) {
    e.preventDefault();
    const type = 'signed_deal';
    handleSubmit(dealName, type);
    setDealName('');
  }
  useEffect(() => {
    if (data?.user) {
      setLeadFormData({
        user: {
          ...data.user,
          contactDetails: {
            ...data.user.contactDetails,
            secondaryContact1: {
              ...data.user.contactDetails?.secondaryContact1
            },
            secondaryContact2: {
              ...data.user.contactDetails?.secondaryContact2
            }
          }
        }
      });
    }
  }, [data]);

  function handleSubmit(name = '', logType = '') {
    if (leadData) {
      leadDataUpdate({
        variables: {
          ...leadFormData?.user,
          secondaryInfo: leadFormData?.user?.contactInfos,
          id: userId
        }
      })
        .then(() => {
          setMessage({
            ...message,
            isError: false,
            detail: t('common:misc.misc_successfully_added', { type: t('common:menu.division') })
          });
        })
        .catch(err => {
          setMessage({ ...message, isError: true, detail: formatError(err.message) });
        });
    } else {
      eventCreate({ variables: { userId, name, logType } })
        .then(() => {
          setMessage({
            ...message,
            isError: false,
            detail: t('common:misc.misc_successfully_created', { type: t('common:menu.event') })
          });
          refetchMeetings();
          refetchSignedDeals();
        })
        .catch(err => {
          setMessage({ ...message, isError: true, detail: formatError(err.message) });
        });
    }
  }

  const err = meetingsError || signedDealsError || null;

  if (err) return err.message;

  if (isLoading || divisionLoading || signedDealsLoading || meetingsLoading) return <Spinner />;

  return (
    <div style={{ marginLeft: -23, marginRight: -24 }}>
      <MessageAlert
        type={message.isError ? 'error' : 'success'}
        message={message.detail}
        open={!!message.detail}
        handleClose={() => setMessage({ ...message, detail: '' })}
      />
      <Grid container>
        <Grid item md={12} xs={12}>
          <Grid container style={{ display: 'flex', alignItems: 'center', width: '90%' }}>
            <Grid item md={6} xs={12}>
              <Typography variant="h6" data-testid="division">
                {t('lead_management.division')}
              </Typography>

              <Typography variant="body2" data-testid="division_header">
                {t('lead_management.division_header')}
              </Typography>
            </Grid>
            <Grid item md={6} xs={12}>
              <Grid
                container
                spacing={2}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  paddingTop: 10
                }}
              >
                <Grid item md={10} xs={10}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="division">{t('lead_management.set_division')}</InputLabel>
                    <Select
                      labelId="demo-multiple-name-label"
                      id="division"
                      name="division"
                      value={leadFormData?.user?.division || ''}
                      onChange={handleDivisionChange}
                      input={<OutlinedInput label={t('lead_management.set_division')} />}
                      MenuProps={MenuProps}
                    >
                      <MenuItem value="" />
                      {divionOptions.map(val => (
                        <MenuItem key={val} value={val}>
                          {val}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item md={2} xs={2}>
                  <ButtonComponent
                    variant="contained"
                    color="primary"
                    buttonText={t('lead_management.add')}
                    handleClick={handleSubmitDivision}
                    disabled={disabled}
                    disableElevation
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid item md={12} xs={12} style={{ marginBottom: '10px', marginTop: '10px' }}>
        <Divider />
      </Grid>

      {/* Lead Meetings section */}

      <Grid container>
        <Grid item md={12} xs={12}>
          <Grid item md={12} xs={12}>
            <Typography variant="h6" data-testid="meetings">
              {t('lead_management.meetings')}
            </Typography>

            <Typography variant="body2" data-testid="meetings_header">
              {t('lead_management.meetings_header')}
            </Typography>
          </Grid>
          <Grid item md={12} xs={12}>
            <Grid
              container
              spacing={2}
              style={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Grid item md={10} xs={10}>
                <TextField
                  name="meetingName"
                  label={t('lead_management.meeting_name')}
                  style={{ width: '100%' }}
                  onChange={handleMeetingNameChange}
                  value={meetingName || ''}
                  variant="outlined"
                  fullWidth
                  size="small"
                  margin="normal"
                  required
                  inputProps={{
                    'aria-label': t('lead_management.meeting_name'),
                    style: { fontSize: '15px' }
                  }}
                  InputLabelProps={{ style: { fontSize: '12px' } }}
                />
              </Grid>

              <Grid
                item
                md={2}
                xs={2}
                style={{
                  paddingTop: '25px'
                }}
              >
                <ButtonComponent
                  variant="contained"
                  color="primary"
                  buttonText={t('lead_management.add')}
                  handleClick={handleSubmitMeeting}
                  disabled={!meetingName.trim()}
                  disableElevation
                  testId="add-meeting-button"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <br />
      {/* Lead Meetings Listing */}
      {meetingsData?.leadMeetings.length > 0 ? (
        <div>
          {meetingsData?.leadMeetings.map(leadMeeting => (
            <div
              key={leadMeeting.id}
              style={{
                marginBottom: '20px'
              }}
            >
              <LeadEvent key={leadMeeting?.id} leadEvent={leadMeeting} />
            </div>
          ))}
        </div>
      ) : (
        <CenteredContent>{t('lead_management.no_lead_meetings')}</CenteredContent>
      )}

      <Grid item md={12} xs={12} style={{ marginBottom: '10px', marginTop: '10px' }}>
        <Divider />
      </Grid>

      {/* Lead Deals section */}

      <Grid container>
        <Grid item md={12} xs={12}>
          <Grid item md={12} xs={12}>
            <Typography variant="h6" data-testid="deals">
              {t('lead_management.signed_deal')}
            </Typography>

            <Typography variant="body2" data-testid="deals_header">
              {t('lead_management.signed_deal_header')}
            </Typography>
          </Grid>
          <Grid item md={12} xs={12}>
            <Grid
              container
              spacing={2}
              style={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Grid item md={10} xs={10}>
                <TextField
                  name="dealName"
                  label={t('lead_management.deal_name')}
                  style={{ width: '100%' }}
                  onChange={handleDealNameChange}
                  value={dealName || ''}
                  variant="outlined"
                  fullWidth
                  size="small"
                  margin="normal"
                  required
                  inputProps={{
                    'aria-label': t('lead_management.deal_name'),
                    style: { fontSize: '15px' }
                  }}
                  InputLabelProps={{ style: { fontSize: '12px' } }}
                />
              </Grid>

              <Grid
                item
                md={2}
                xs={2}
                style={{
                  paddingTop: '25px'
                }}
              >
                <ButtonComponent
                  variant="contained"
                  color="primary"
                  buttonText={t('lead_management.add')}
                  handleClick={handleSubmitDeal}
                  disabled={!dealName.trim()}
                  disableElevation
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <br />
      {/* Lead Deals Listing */}
      {signedDealsData?.signedDeals.length > 0 ? (
        <div>
          {signedDealsData?.signedDeals.map(signedDeal => (
            <div
              key={signedDeal.id}
              style={{
                marginBottom: '20px'
              }}
            >
              <LeadEvent key={signedDeal?.id} leadEvent={signedDeal} />
            </div>
          ))}
        </div>
      ) : (
        <CenteredContent>{t('lead_management.no_lead_deal')}</CenteredContent>
      )}
    </div>
  );
}

LeadEvents.propTypes = {
  userId: PropTypes.string.isRequired,
  data: PropTypes.shape({ user: secondaryInfoUserObject }).isRequired
};
