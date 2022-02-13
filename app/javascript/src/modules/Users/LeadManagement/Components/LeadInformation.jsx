import React from 'react';
import TextField from '@material-ui/core/TextField';
import { MenuItem, Select, InputLabel, FormControl } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import DatePickerDialog from '../../../../components/DatePickerDialog';
import { userProps } from '../../utils';
import {
  clientCategories,
  leadTemperatureOptions,
  leadStatusOptions,
  leadSourceOptions,
  leadTypeOptions
} from '../../../../utils/constants';

export default function LeadInformation({ leadFormData, handleChange, handleTimeInputChange }) {
  const { t } = useTranslation('common');

  const useStyles = makeStyles(theme => ({
    formControl: {
      margin: theme.spacing(1)
    },
    selectEmpty: {
      marginTop: theme.spacing(2)
    },
    menuPaper: {
      maxHeight: 400
    },

    input: {
      height: 40
    }
  }));

  const classes = useStyles();

  return (
    <>
      <Typography variant="h6" data-testid="lead-management-lead-information-header">
        {t('lead_management.lead_section_header')}
      </Typography>
      <br />
      <Grid container spacing={2} data-testid="lead-management-lead-information-section">
        <Grid item md={6} xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel id="lead_temperature">{t('lead_management.lead_temperature')}</InputLabel>
            <Select
              id="leadTemperature"
              value={leadFormData?.user?.leadTemperature}
              onChange={handleChange}
              name="leadTemperature"
              fullWidth
              variant="outlined"
              MenuProps={{ classes: { paper: classes.menuPaper } }}
            >
              {Object.entries(leadTemperatureOptions).map(([key, val]) => (
                <MenuItem key={key} value={key}>
                  {val}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={6} xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel id="leadStatus">{t('lead_management.lead_status')}</InputLabel>
            <Select
              id="leadStatus"
              value={leadFormData?.user?.leadStatus}
              onChange={handleChange}
              name="leadStatus"
              fullWidth
              variant="outlined"
              MenuProps={{ classes: { paper: classes.menuPaper } }}
            >
              {Object.entries(leadStatusOptions).map(([key, val]) => (
                <MenuItem key={key} value={key}>
                  {val}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item md={6} xs={12}>
          <FormControl variant="standard" fullWidth size="small">
            <InputLabel id="lead_source">{t('lead_management.lead_source')}</InputLabel>
            <Select
              id="lead_source"
              value={leadFormData?.user?.leadSource}
              onChange={handleChange}
              name="leadSource"
              fullWidth
              variant="outlined"
              MenuProps={{ classes: { paper: classes.menuPaper } }}
            >
              {Object.entries(leadSourceOptions).map(([key, val]) => (
                <MenuItem key={key} value={key}>
                  {val}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item md={6} xs={12}>
          <TextField
            name="companyContacted"
            label={t('lead_management.company_contacted')}
            style={{ width: '100%' }}
            onChange={handleChange}
            value={leadFormData?.user?.companyContacted}
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
          <FormControl fullWidth size="small">
            <InputLabel id="client_category">{t('lead_management.client_category')}</InputLabel>
            <Select
              id="client_category"
              value={leadFormData?.user?.clientCategory}
              onChange={handleChange}
              name="clientCategory"
              fullWidth
              variant="outlined"
              MenuProps={{ classes: { paper: classes.menuPaper } }}
            >
              {Object.entries(clientCategories).map(([key, val]) => (
                <MenuItem key={key} value={key}>
                  {val}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item md={6} xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel id="lead_type">{t('lead_management.lead_type')}</InputLabel>
            <Select
              id="lead_type"
              value={leadFormData?.user?.leadType}
              onChange={handleChange}
              name="leadType"
              fullWidth
              variant="outlined"
              MenuProps={{ classes: { paper: classes.menuPaper } }}
            >
              {Object.entries(leadTypeOptions).map(([key, val]) => (
                <MenuItem key={key} value={key}>
                  {val}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <br />

      <TextField
        name="nextSteps"
        label={t('lead_management.next_steps')}
        style={{ width: '100%' }}
        onChange={handleChange}
        value={leadFormData?.user?.nextSteps}
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'next_steps'
        }}
      />

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
          <TextField
            name="leadOwner"
            label={t('lead_management.lead_owner')}
            style={{ width: '100%' }}
            onChange={handleChange}
            value={leadFormData?.user?.leadOwner}
            variant="outlined"
            multiline
            fullWidth
            rows={2}
            size="small"
            margin="normal"
            inputProps={{
              'aria-label': 'lead_owner'
            }}
          />
        </Grid>

        <Grid item md={6} xs={12}>
          <DatePickerDialog
            label={t('lead_management.first_contact_date')}
            handleDateChange={date =>
              handleTimeInputChange({ target: { name: 'firstContactDate', value: date } })
            }
            selectedDate={leadFormData?.user?.firstContactDate}
            inputProps={{ 'data-testid': 'start_time_input' }}
            inputVariant="outlined"
          />
        </Grid>

        <Grid item md={6} xs={12}>
          <TextField
            name="createdBy"
            label={t('lead_management.created_by')}
            style={{ width: '100%' }}
            onChange={handleChange}
            value={leadFormData?.user?.createdBy}
            variant="outlined"
            multiline
            fullWidth
            rows={2}
            size="small"
            margin="normal"
            inputProps={{
              'aria-label': 'created_by'
            }}
          />
        </Grid>

        <Grid item md={6} xs={12}>
          <DatePickerDialog
            label={t('lead_management.last_contact_date')}
            inputProps={{ 'data-testid': 'last_contact_date_input' }}
            handleDateChange={date =>
              handleTimeInputChange({ target: { name: 'lastContactDate', value: date } })
            }
            selectedDate={leadFormData?.user?.lastContactDate}
            inputVariant="outlined"
          />
        </Grid>

        <Grid item md={6} xs={12}>
          <TextField
            name="modifiedBy"
            label={t('lead_management.modified_by')}
            style={{ width: '100%' }}
            onChange={handleChange}
            value={leadFormData?.user?.modifiedBy}
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            size="small"
            margin="normal"
            inputProps={{
              'aria-label': 'modified_by'
            }}
          />
        </Grid>

        <Grid item md={6} xs={12}>
          <DatePickerDialog
            label={t('lead_management.date_follow_up')}
            inputProps={{ 'data-testid': 'date_follow_up_input' }}
            handleDateChange={date =>
              handleTimeInputChange({ target: { name: 'followupAt', value: date } })
            }
            selectedDate={leadFormData?.user?.followupAt}
            inputVariant="outlined"
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
