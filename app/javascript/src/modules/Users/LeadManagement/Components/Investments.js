import React, { useState } from 'react';
import PropTypes from 'prop-types';
import InputAdornment from '@mui/material/InputAdornment';
import { Grid, Typography, useMediaQuery } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';
import { dateToString } from '../../../../components/DateContainer';
import ButtonComponent from '../../../../shared/buttons/Button';
import CenteredContent from '../../../../shared/CenteredContent';

export default function Investments({
  handleSubmit,
  dealDetailsData,
  investmentStatsData,
  leadInvestmentData
}) {
  const { t } = useTranslation('common');
  const mobile = useMediaQuery('(max-width:800px)');
  const [dealSize, setDealSize] = useState('');
  const [investmentTarget, setInvestmentTarget] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  function handleDealSizeChange(event) {
    setDealSize(event.target.value);
  }

  function handleInvestmentTargetChange(event) {
    setInvestmentTarget(event.target.value);
  }

  function handleDescriptionChange(event) {
    setDescription(event.target.value);
  }
  function handleAmountChange(event) {
    setAmount(event.target.value);
  }
  function handleSubmitInvestment(e) {
    e.preventDefault();
    const type = 'deal_details';
    handleSubmit({ logType: type, dealSize, investmentTarget });
    setInvestmentTarget('');
    setDealSize('');
  }

  function handleSubmitInvestmentSize(e) {
    e.preventDefault();
    const type = 'investment';
    handleSubmit({ logType: type, name: description, amount });
    setDescription('');
    setAmount('');
  }
  return (
    <>
      <Grid container>
        <Grid item md={12} xs={12} style={{ marginBottom: '40px' }}>
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
                  ? `${t('lead_management.% target_used')}  ${
                      investmentStatsData?.investmentStats?.percentage_of_target_used
                    }`
                  : `${t('lead_management.% target_used')} 0`}
              </Typography>
            </Grid>
            <Grid item md={12} xs={12}>
              <Typography variant="body2" data-testid="deal_details_header">
                {t('lead_management.deal_details_header')}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item md={5} xs={12}>
            <TextField
              name="dealSize"
              label={t('lead_management.deal_size')}
              style={{ width: '95%' }}
              onChange={handleDealSizeChange}
              value={dealSize || ''}
              variant="outlined"
              fullWidth
              type="number"
              size="small"
              margin="normal"
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>
              }}
              InputLabelProps={{ style: { fontSize: '12px' } }}
            />
          </Grid>

          <Grid item md={6} xs={10}>
            <TextField
              name="investmentTarget"
              label={t('lead_management.investment_target')}
              style={{ width: '95%', paadingLeft: 0 }}
              onChange={handleInvestmentTargetChange}
              value={investmentTarget || ''}
              variant="outlined"
              fullWidth
              type="number"
              size="small"
              margin="normal"
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>
              }}
              InputLabelProps={{ style: { fontSize: '12px' } }}
            />
          </Grid>
          <Grid
            item
            md={1}
            xs={1}
            style={{
              paddingTop: '32px',
              paddingLeft: 0
            }}
          >
            <ButtonComponent
              variant="contained"
              color="primary"
              fullWidth
              buttonText={t('lead_management.add')}
              handleClick={handleSubmitInvestment}
              disabled={!investmentTarget.trim() && !dealSize.trim()}
              disableElevation
              testId="add-investment-button"
            />
          </Grid>
        </Grid>
      </Grid>

      {dealDetailsData?.dealDetails.length > 0 ? (
        <div>
          {dealDetailsData?.dealDetails.map(dealDetails => (
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

      <Grid container>
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
              style={{ width: '95%' }}
              onChange={handleDescriptionChange}
              value={description || ''}
              variant="outlined"
              fullWidth
              size="small"
              margin="normal"
              required
              inputProps={{
                'aria-label': t('lead_management.description'),
                style: { fontSize: '15px' }
              }}
              InputLabelProps={{ style: { fontSize: '12px' } }}
            />
          </Grid>

          <Grid item md={6} xs={10}>
            <TextField
              name="amount"
              label={t('lead_management.amount')}
              style={{ width: '95%' }}
              onChange={handleAmountChange}
              value={amount || ''}
              variant="outlined"
              id="outlined-start-adornment"
              fullWidth
              size="small"
              margin="normal"
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>
              }}
              InputLabelProps={{ style: { fontSize: '12px' } }}
            />
          </Grid>
          <Grid
            item
            md={1}
            xs={1}
            style={{
              paddingTop: '32px',
              paddingLeft: 0
            }}
          >
            <ButtonComponent
              variant="contained"
              color="primary"
              fullWidth
              buttonText={t('lead_management.add')}
              handleClick={handleSubmitInvestmentSize}
              disabled={!amount.trim()}
              disableElevation
              testId="add-investment-button"
            />
          </Grid>
        </Grid>
      </Grid>
      {leadInvestmentData?.leadInvestments.length > 0 ? (
        <div>
          {leadInvestmentData?.leadInvestments.map(leadInvestment => (
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
                            {leadInvestment?.amount}
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
        <CenteredContent>{t('lead_management.no_investments')}</CenteredContent>
      )}
    </>
  );
}

const Investment = {
  id: PropTypes.string,
  amount: PropTypes.string,
  name: PropTypes.string,
  actingUser: PropTypes.shape({
    name: PropTypes.string
  })
};

const dealDetails = {
  id: PropTypes.string,
  name: PropTypes.string,
  dealSize: PropTypes.string,
  investmentTarget: PropTypes.string,
  actingUser: PropTypes.shape({
    name: PropTypes.string
  })
};

const investmentStats = {
  percentage_of_target_used: PropTypes.string,
  total_spent: PropTypes.string
};

Investments.propTypes = {
  leadInvestmentData: PropTypes.shape(leadInvestment).isRequired,
  dealDetailsData: PropTypes.shape(dealDetails).isRequired,
  investmentStatsData: PropTypes.shape(investmentStats).isRequired,
  handleSubmit: PropTypes.func.isRequired
};
