import React from 'react';
import TextField from '@mui/material/TextField';
import makeStyles from '@mui/styles/makeStyles';
import { Grid, Typography , useMediaQuery } from '@mui/material';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';

import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DatePickerDialog from '../../../../components/DatePickerDialog';
import { userProps, MenuProps } from '../../utils';
import {
  clientCategories,
  leadTemperatureOptions,
  leadStatusOptions,
  leadSourceOptions,
  leadTypeOptions
} from '../../../../utils/constants';

export default function LeadInformation({ leadFormData, handleChange, handleTimeInputChange }) {
  const { t } = useTranslation('common');
  const matches = useMediaQuery('(max-width:800px)');
  const useStyles = makeStyles(() => ({
    input: {
      height: 40
    }
  }));

  const classes = useStyles();

  return (
    <>
      <Grid
        container
        spacing={2}
        style={{ alignItems: 'center' }}
        data-testid="lead-management-lead-information-section"
      >
        <Grid item md={12} xs={12}>
          <Typography variant="h6" data-testid="lead-management-lead-information-header">
            {t('lead_management.lead_section_header')}
          </Typography>
        </Grid>
        <Grid item md={6} xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel id="lead_temperature">{t('lead_management.lead_temperature')}</InputLabel>
            <Select
              id="leadTemperature"
              value={leadFormData?.user?.leadTemperature || ''}
              onChange={handleChange}
              name="leadTemperature"
              fullWidth
              input={<OutlinedInput label={t('lead_management.lead_temperature')} />}
              MenuProps={MenuProps}
            >
              <MenuItem value="" />
              {leadTemperatureOptions.map(val => (
                <MenuItem key={val} value={val}>
                  {val}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={6} xs={12} style={{ paddingRight: 0 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="leadStatus">{t('lead_management.lead_status')}</InputLabel>
            <Select
              id="leadStatus"
              value={leadFormData?.user?.leadStatus || ''}
              onChange={handleChange}
              name="leadStatus"
              fullWidth
              input={<OutlinedInput label={t('lead_management.lead_status')} />}
              MenuProps={MenuProps}
            >
              <MenuItem value="" />

              {leadStatusOptions.map(val => (
                <MenuItem key={val} value={val}>
                  {val}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item md={6} xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel id="client_category">{t('lead_management.client_category')}</InputLabel>
            <Select
              id="client_category"
              value={leadFormData?.user?.clientCategory || ''}
              onChange={handleChange}
              name="clientCategory"
              fullWidth
              input={<OutlinedInput label={t('lead_management.client_category')} />}
              MenuProps={MenuProps}
            >
              <MenuItem value="" />
              {clientCategories.map(val => (
                <MenuItem key={val} value={val}>
                  {val}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item md={6} xs={12} style={{ paddingRight: 0 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="lead_type">{t('lead_management.lead_type')}</InputLabel>
            <Select
              id="lead_type"
              value={leadFormData?.user?.leadType || ''}
              onChange={handleChange}
              name="leadType"
              fullWidth
              input={<OutlinedInput label={t('lead_management.lead_type')} />}
              MenuProps={MenuProps}
            >
              <MenuItem value="" />
              {leadTypeOptions.map(val => (
                <MenuItem key={val} value={val}>
                  {val}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item md={6} xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel id="lead_source">{t('lead_management.lead_source')}</InputLabel>
            <Select
              id="lead_source"
              value={leadFormData?.user?.leadSource || ''}
              onChange={handleChange}
              name="leadSource"
              fullWidth
              input={<OutlinedInput label={t('lead_management.lead_source')} />}
              MenuProps={MenuProps}
            >
              <MenuItem value="" />
              {leadSourceOptions.map(val => (
                <MenuItem key={val} value={val}>
                  {val}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item md={6} xs={12} style={{ paddingRight: 0 }}>
          <TextField
            name="companyContacted"
            label={t('lead_management.company_contacted')}
            style={{ width: '100%' }}
            onChange={handleChange}
            value={leadFormData?.user?.companyContacted || ''}
            variant="outlined"
            fullWidth
            InputProps={{
              className: classes.input,
              'aria-label': 'company_contacted'
            }}
            rows={2}
            size="small"
          />
        </Grid>

        <Grid item md={6} xs={12}>
          <FormControl fullWidth sx={{ m: 0 }}>
            <InputLabel htmlFor="outlined-adornment-amount">
              {t('lead_management.capex_amount')}
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              name="capexAmount"
              onChange={handleChange}
              value={leadFormData?.user?.capexAmount || ''}
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
              label={t('lead_management.capex_amount')}
              size="small"
            />
          </FormControl>
        </Grid>

        <Grid item md={6} xs={12} style={{ paddingRight: 0 }}>
          <DatePickerDialog
            label={t('lead_management.kick_off_date')}
            inputProps={{ 'data-testid': 'kick_off_date' }}
            handleDateChange={date =>
              handleTimeInputChange({ target: { name: 'kickOffDate', value: date } })
            }
            selectedDate={leadFormData?.user?.kickOffDate}
            inputVariant="outlined"
            size="small"
          />
        </Grid>

        <Grid item md={6} xs={12}>
          <Typography variant="body1">
            {t('lead_management.investiment_created_over_time')}
          </Typography>
          <Grid container spacing={2}>
            <Grid item md={6} xs={6}>
              <TextField
                name="investmentSize"
                label={t('lead_management.investment_size')}
                style={{ width: '100%' }}
                onChange={handleChange}
                value={leadFormData?.user?.investmentSize || ''}
                variant="outlined"
                fullWidth
                size="small"
                margin="normal"
                inputProps={{
                  'aria-label': 'investmentSize',
                  style: { fontSize: matches && '15px' }
                }}
              />
            </Grid>

            <Grid item md={6} xs={6} style={{ paddingRight: 0 }}>
              <TextField
                name="investmentTimeline"
                label={t('lead_management.investiment_timeline')}
                style={{ width: '100%' }}
                onChange={handleChange}
                value={leadFormData?.user?.investmentTimeline || ''}
                variant="outlined"
                fullWidth
                size="small"
                margin="normal"
                inputProps={{
                  'aria-label': 'investment Timeline',
                  style: { fontSize: matches && '15px' }
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item md={6} xs={12} style={{ paddingRight: 0 }}>
          <Typography variant="body1">{t('lead_management.jobs_created_over_time')}</Typography>
          <Grid container spacing={2}>
            <Grid item md={6} xs={6}>
              <TextField
                name="jobsCreated"
                label={t('lead_management.jobs_created')}
                style={{ width: '100%' }}
                onChange={handleChange}
                value={leadFormData?.user?.jobsCreated || ''}
                variant="outlined"
                fullWidth
                size="small"
                margin="normal"
                inputProps={{
                  'aria-label': 'jobsCreated',
                  style: { fontSize: '15px' }
                }}
                InputLabelProps={{ style: { fontSize: '12px' } }}
              />
            </Grid>
            <Grid item md={6} xs={6} style={{ paddingRight: 0 }}>
              <TextField
                name="jobsTimeline"
                label={t('lead_management.jobs_timeline')}
                style={{ width: '100%' }}
                onChange={handleChange}
                value={leadFormData?.user?.jobsTimeline || ''}
                variant="outlined"
                fullWidth
                size="small"
                margin="normal"
                inputProps={{
                  'aria-label': 'jobsTimeline',
                  style: { fontSize: matches && '15px' }
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={12} xs={12} style={{ paddingRight: 0 }}>
          <TextField
            name="decisionTimeline"
            label={t('lead_management.decision_making_timeline')}
            style={{ width: '100%' }}
            onChange={handleChange}
            value={leadFormData?.user?.decisionTimeline || ''}
            variant="outlined"
            fullWidth
            rows={2}
            size="small"
            margin="normal"
            inputProps={{
              'aria-label': 'decision_making_timeline',
              style: { fontSize: matches && '15px' }
            }}
          />
        </Grid>

        <Grid item md={12} xs={12} style={{ paddingRight: 0 }}>
          <TextField
            name="nextSteps"
            label={t('lead_management.next_steps')}
            style={{ width: '100%' }}
            onChange={handleChange}
            value={leadFormData?.user?.nextSteps || ''}
            variant="outlined"
            fullWidth
            rows={2}
            size="small"
            margin="normal"
            inputProps={{
              'aria-label': 'next_steps'
            }}
          />
        </Grid>
      </Grid>
      <br />
      <Grid
        container
        spacing={2}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          placeContent: 'center'
        }}
      >
        <Grid item md={6} xs={12}>
          <FormControl fullWidth sx={{ m: 0 }}>
            <InputLabel htmlFor="outlined-lead-owner">{t('lead_management.lead_owner')}</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              name="leadOwner"
              label={t('lead_management.lead_owner')}
              onChange={handleChange}
              value={leadFormData?.user?.leadOwner || ''}
              size="small"
            />
          </FormControl>
        </Grid>

        <Grid item md={6} xs={12} style={{ paddingRight: 0 }}>
          <DatePickerDialog
            label={t('lead_management.first_contact_date')}
            handleDateChange={date =>
              handleTimeInputChange({ target: { name: 'firstContactDate', value: date } })
            }
            selectedDate={leadFormData?.user?.firstContactDate}
            inputProps={{ 'data-testid': 'start_time_input' }}
            inputVariant="outlined"
            size="small"
          />
        </Grid>

        <Grid item md={6} xs={12}>
          <FormControl fullWidth sx={{ m: 0 }}>
            <InputLabel htmlFor="outlined-created-by">{t('lead_management.created_by')}</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              name="createdBy"
              label={t('lead_management.created_by')}
              onChange={handleChange}
              value={leadFormData?.user?.createdBy || ''}
              size="small"
            />
          </FormControl>
        </Grid>

        <Grid item md={6} xs={12} style={{ paddingRight: 0 }}>
          <DatePickerDialog
            label={t('lead_management.last_contact_date')}
            inputProps={{ 'data-testid': 'last_contact_date_input' }}
            handleDateChange={date =>
              handleTimeInputChange({ target: { name: 'lastContactDate', value: date } })
            }
            selectedDate={leadFormData?.user?.lastContactDate}
            inputVariant="outlined"
            size="small"
          />
        </Grid>

        <Grid item md={6} xs={12}>
          <FormControl fullWidth sx={{ m: 0 }}>
            <InputLabel htmlFor="outlined-created-by">
              {t('lead_management.modified_by')}
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              name="modifiedBy"
              label={t('lead_management.modified_by')}
              onChange={handleChange}
              value={leadFormData?.user?.modifiedBy || ''}
              size="small"
            />
          </FormControl>
        </Grid>

        <Grid item md={6} xs={12} style={{ paddingRight: 0 }}>
          <DatePickerDialog
            label={t('lead_management.date_follow_up')}
            inputProps={{ 'data-testid': 'date_follow_up_input' }}
            handleDateChange={date =>
              handleTimeInputChange({ target: { name: 'followupAt', value: date } })
            }
            selectedDate={leadFormData?.user?.followupAt}
            inputVariant="outlined"
            size="small"
          />
        </Grid>
      </Grid>
    </>
  );
}

LeadInformation.propTypes = {
  leadFormData: PropTypes.shape({ user: userProps }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleTimeInputChange: PropTypes.func.isRequired
};
