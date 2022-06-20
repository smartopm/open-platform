/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import InputAdornment from '@mui/material/InputAdornment';
import { useMutation, useQuery } from 'react-apollo';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import { Grid, Typography, useMediaQuery } from '@mui/material';

import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';
import { DealDetailsQuery, LeadInvestmentsQuery, InvestmentStatsQuery } from '../graphql/queries';
import CreateEvent from '../graphql/mutations';
import { Spinner } from '../../../../shared/Loading';
import MessageAlert from '../../../../components/MessageAlert';
import { formatError } from '../../../../utils/helpers';
import { dateToString } from '../../../../components/DateContainer';
import ButtonComponent from '../../../../shared/buttons/Button';
import CenteredContent from '../../../../shared/CenteredContent';

export default function Investments({ userId }) {
  const { t } = useTranslation('common');
  const mobile = useMediaQuery('(max-width:800px)');
  const [dealSize, setDealSize] = useState('');
  const [investmentTarget, setInvestmentTarget] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState({ isError: false, detail: '' });
  const [eventCreate, { loading: isLoading }] = useMutation(CreateEvent);

  function handleSubmitInvestment(e) {
    e.preventDefault();
    const type = 'deal_details';
    handleSubmit({ logType: type, dealSize, investmentTarget });
  }

  function handleSubmitInvestmentSize(e) {
    e.preventDefault();
    const type = 'investment';
    handleSubmit({ logType: type, name: description, amount });
  }

  const {
    data: dealDetailsData,
    loading: dealDetailsLoading,
    refetch: refetchDealDetails,
    error: dealDetailsError
  } = useQuery(DealDetailsQuery, {
    variables: { userId, logType: 'deal_details' },
    fetchPolicy: 'cache-and-network'
  });

  function validateForm(event) {
    event.preventDefault();
  }

  const {
    data: leadInvestmentData,
    loading: leadInvestmentsLoading,
    refetch: refetchLeadInvestments,
    error: leadInvestmentsError
  } = useQuery(LeadInvestmentsQuery, {
    variables: { userId, logType: 'investment' },
    fetchPolicy: 'cache-and-network'
  });

  const {
    data: investmentStatsData,
    loading: investmentStatsLoading,
    refetch: refetchInvestmentStats,
    error: investmentStatsError
  } = useQuery(InvestmentStatsQuery, {
    variables: { userId },
    fetchPolicy: 'cache-and-network'
  });

  function handleSubmit({ name = '', logType = '' }) {
    if (logType === 'deal_details') {
      eventCreate({
        variables: {
          userId,
          logType,
          // given 23 000, remove spaces and submit 23000
          dealSize: parseFloat(dealSize.replace(/ /g, '')),
          // given 23 000, remove spaces and submit 23000
          investmentTarget: parseFloat(investmentTarget.replace(/ /g, ''))
        }
      })
        .then(() => {
          setMessage({
            ...message,
            isError: false,
            detail: t('common:misc.misc_successfully_created', {
              type: t('common:menu.investment')
            })
          });
          setInvestmentTarget('');
          setDealSize('');
          refetchDealDetails();
          refetchLeadInvestments();
        })
        .catch(err => {
          setMessage({ ...message, isError: true, detail: formatError(err.message) });
        });
    }
    if (logType === 'investment') {
      eventCreate({
        variables: {
          userId,
          logType,
          name,
          // given 23 000, remove spaces and submit 23000
          amount: parseFloat(amount.replace(/ /g, ''))
        }
      })
        .then(() => {
          setMessage({
            ...message,
            isError: false,
            detail: t('common:misc.misc_successfully_created', {
              type: t('common:menu.investment_expense')
            })
          });
          setDescription('');
          setAmount('');
          refetchLeadInvestments();
          refetchInvestmentStats();
        })
        .catch(err => {
          setMessage({ ...message, isError: true, detail: formatError(err.message) });
        });
    }
  }

  const err = dealDetailsError || leadInvestmentsError || investmentStatsError || null;

  if (err) return err.message;

  if (isLoading || dealDetailsLoading || leadInvestmentsLoading || investmentStatsLoading)
    return <Spinner />;

  return (
    <>
      <MessageAlert
        type={message.isError ? 'error' : 'success'}
        message={message.detail}
        open={!!message.detail}
        handleClose={() => setMessage({ ...message, detail: '' })}
      />
      <Grid container>
        <Grid item md={12} xs={12} style={{ marginBottom: '30px' }}>
          <Grid item md={12} xs={12}>
            <Typography variant="h6" data-testid="investment">
              {t('lead_management.investment')}
            </Typography>

            <Typography variant="body2" data-testid="investment_header">
              {t('lead_management.investment_header')}
            </Typography>
          </Grid>
        </Grid>

        <Grid item md={12} xs={12}>
          <Grid container spacing={2}>
            <Grid item md={6} xs={5}>
              <Typography variant="body1" data-testid="deal_details">
                {t('lead_management.deal_details')}
              </Typography>
            </Grid>

            <Grid item md={6} xs={7} style={{ textAlign: 'right' }}>
              <Typography variant="body2" data-testid="deal_details_header">
                {investmentStatsData?.investmentStats?.percentage_of_target_used !== undefined
                  ? `${t('lead_management.percent_target_used')}  ${
                      investmentStatsData?.investmentStats?.percentage_of_target_used
                    }`
                  : `${t('lead_management.percent_target_used')} 0`}
              </Typography>
            </Grid>
            <Grid item md={12} xs={12}>
              <Typography variant="body2" data-testid="deal_details_header">
                {t('lead_management.deal_details_header')}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={2} style={{ marginBottom: '20px' }}>
          <Grid item md={5} xs={12}>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel htmlFor="outlined-adornment-deal-size">
                {t('lead_management.deal_size')}
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-deal_size"
                name="dealSize"
                onChange={event => setDealSize(event.target.value)}
                value={dealSize || ''}
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                label={t('lead_management.deal_size')}
                size="small"
                inputProps={{
                  'aria-label': t('lead_management.deal_size')
                }}
              />
            </FormControl>
          </Grid>

          <Grid item md={6} xs={10}>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel htmlFor="outlined-adornment-investment-target">
                {t('lead_management.investment_target')}
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-investment_target"
                name="investmentTarget"
                style={{ width: mobile ? '85%' : '95%' }}
                required
                onChange={event => setInvestmentTarget(event.target.value)}
                value={investmentTarget || ''}
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                label={t('lead_management.investment_target')}
                inputProps={{
                  'aria-label': t('lead_management.investment_target')
                }}
                size="small"
              />
            </FormControl>
          </Grid>
          <Grid
            item
            md={1}
            xs={1}
            style={{
              paddingTop: '33px',
              paddingLeft: 0,
              marginLeft: mobile && '-12px'
            }}
          >
            <ButtonComponent
              variant="contained"
              color="primary"
              fullWidth
              buttonText={t('lead_management.add')}
              handleClick={handleSubmitInvestment}
              disabled={!investmentTarget && !dealSize}
              disableElevation
              testId="add-investment-button"
            />
          </Grid>
        </Grid>
      </Grid>

      {dealDetailsData?.leadLogs.length > 0 ? (
        <div>
          {dealDetailsData?.leadLogs.map(dealDetails => (
            <div
              key={dealDetails.id}
              style={{
                marginBottom: '20px'
              }}
            >
              <div>
                <>
                  <Grid container>
                    <Grid item md={12} xs={12}>
                      <Grid
                        container
                        style={{
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Grid item md={3} xs={12}>
                          <Typography variant="body2" data-testid="investment-deal-size">
                            $ {dealDetails?.dealSize}
                          </Typography>
                        </Grid>

                        <Grid item md={4} xs={12} style={{ textAlign: !mobile && 'right' }}>
                          <Typography variant="body2" data-testid="investment_target_value">
                            {`${t('lead_management.investment_target_value')}  ${
                              dealDetails?.investmentTarget
                            }`}
                          </Typography>
                        </Grid>

                        <Grid item md={2} xs={12} style={{ textAlign: !mobile && 'right' }}>
                          <Typography variant="body2" data-testid="event-date">
                            {dateToString(dealDetails?.createdAt)}
                          </Typography>
                        </Grid>
                        <Grid item md={3} xs={12} style={{ textAlign: !mobile && 'right' }}>
                          <Typography variant="body2" data-testid="investment-created-by">
                            {`${t('lead_management.entered_by')}  ${dealDetails?.actingUser?.name}`}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <CenteredContent>{t('lead_management.no_investments')}</CenteredContent>
      )}

      <Grid container style={{ marginBottom: '20px' }}>
        <Grid container spacing={2}>
          <Grid item md={6} xs={6}>
            <Typography variant="body1" data-testid="investment_size_input">
              {t('lead_management.investment_size_input')}
            </Typography>
          </Grid>

          <Grid item md={6} xs={6} style={{ textAlign: 'right', marginRight: mobile && '-25px' }}>
            <Typography variant="body2" data-testid="total_spent">
              {investmentStatsData?.investmentStats?.total_spent !== undefined
                ? `${t('lead_management.total_spent')}  ${
                    investmentStatsData?.investmentStats?.total_spent
                  }`
                : `${t('lead_management.investment_target_value')} 0`}
            </Typography>
          </Grid>
        </Grid>

        <Grid item md={12} xs={12}>
          <Typography variant="body2" data-testid="investment_size_header">
            {t('lead_management.investment_size_header')}
          </Typography>
        </Grid>
        <Grid container spacing={2}>
          <Grid item md={5} xs={12}>
            <TextField
              name="description"
              label={t('lead_management.description')}
              style={{ width: '100%' }}
              onChange={event => setDescription(event.target.value)}
              value={description || ''}
              variant="outlined"
              fullWidth
              size="small"
              margin="normal"
              inputProps={{
                'aria-label': t('lead_management.description'),
                style: { fontSize: '15px' }
              }}
              InputLabelProps={{ style: { fontSize: '12px' } }}
            />
          </Grid>

          <Grid
            item
            md={6}
            xs={10}
            style={{
              paddingTop: mobile && '10px'
            }}
          >
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel htmlFor="outlined-adornment-amount">
                {t('lead_management.amount')}
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                name="amount"
                style={{ width: mobile ? '85%' : '95%' }}
                onChange={event => setAmount(event.target.value)}
                value={amount || ''}
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                label={t('lead_management.amount')}
                inputProps={{
                  'aria-label': t('lead_management.amount')
                }}
                size="small"
              />
            </FormControl>
          </Grid>
          <Grid
            item
            md={1}
            xs={1}
            style={{
              paddingTop: mobile ? '25px' : '33px',
              paddingLeft: 0,
              marginLeft: mobile && '-12px'
            }}
          >
            <ButtonComponent
              variant="contained"
              color="primary"
              fullWidth
              buttonText={t('lead_management.add')}
              handleClick={handleSubmitInvestmentSize}
              disabled={!amount}
              disableElevation
              testId="add-investment-size-button"
            />
          </Grid>
        </Grid>
      </Grid>
      {leadInvestmentData?.leadLogs.length > 0 ? (
        <div>
          {leadInvestmentData?.leadLogs.map(leadInvestment => (
            <div
              key={leadInvestment.id}
              style={{
                marginBottom: '20px'
              }}
            >
              <div>
                <>
                  <Grid container>
                    <Grid item md={12} xs={12}>
                      <Grid
                        container
                        style={{
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Grid item md={2} xs={12}>
                          <Typography variant="body2" data-testid="event-name">
                            $ {leadInvestment?.amount}
                          </Typography>
                        </Grid>
                        <Grid item md={4} xs={12}>
                          <Typography variant="body2" data-testid="event-name">
                            {leadInvestment?.name}
                          </Typography>
                        </Grid>
                        <Grid item md={2} xs={12} style={{ textAlign: !mobile && 'right' }}>
                          <Typography variant="body2" data-testid="event-date">
                            {dateToString(leadInvestment?.createdAt)}
                          </Typography>
                        </Grid>
                        <Grid item md={4} xs={12} style={{ textAlign: !mobile && 'right' }}>
                          <Typography variant="body2" data-testid="event-created-by">
                            {`${t('lead_management.entered_by')}  ${
                              leadInvestment?.actingUser?.name
                            }`}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <CenteredContent>{t('lead_management.no_investments_expenses')}</CenteredContent>
      )}
    </>
  );
}

Investments.propTypes = {
  userId: PropTypes.string.isRequired
};
