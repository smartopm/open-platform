import React from 'react';
import TextField from '@material-ui/core/TextField';
import { Grid, Typography } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
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
  return (
    <>
      <Typography variant="h6" data-testid="lead-management-lead-information-header">
        {t('lead_management.lead_section_header')}
      </Typography>
      <br />
      <Grid
        container
        spacing={2}
        style={{ display: 'flex', justifyContent: 'center' }}
        data-testid="lead-management-lead-information-section"
      >
        <Grid item md={6} xs={12}>
          <FormControl fullWidth>
            <InputLabel id="lead_temperature">{t('lead_mana')}</InputLabel>
            <Select
              id="leadTemperature"
              value={leadFormData?.user?.leadTemperature}
              onChange={handleChange}
              name="leadTemperature"
              fullWidth
              variant="outlined"
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
          <FormControl fullWidth>
            <InputLabel id="leadStatus">Lead Status</InputLabel>
            <Select
              id="leadStatus"
              value={leadFormData?.user?.leadStatus}
              onChange={handleChange}
              name="leadStatus"
              fullWidth
              variant="outlined"
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
          <FormControl fullWidth>
            <InputLabel id="leadSource">Lead Source</InputLabel>
            <Select
              id="lead_source"
              value={leadFormData?.user?.leadSource}
              onChange={handleChange}
              name="leadSource"
              fullWidth
              variant="outlined"
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
            label="Company Contacted"
            style={{ width: '100%' }}
            onChange={handleChange}
            value={leadFormData?.user?.companyContacted}
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

        <Grid item md={6} xs={12}>
          <FormControl fullWidth>
            <InputLabel id="client_category">Client Category</InputLabel>
            <Select
              id="client_category"
              value={leadFormData?.user?.clientCategory}
              onChange={handleChange}
              name="clientCategory"
              fullWidth
              variant="outlined"
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
          <FormControl fullWidth>
            <InputLabel id="lead_type">Lead Type</InputLabel>
            <Select
              id="lead_type"
              value={leadFormData?.user?.leadType}
              onChange={handleChange}
              name="leadType"
              fullWidth
              variant="outlined"
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
        label="Next Steps"
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
            label="Lead Owner"
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
            label="First Contact Date"
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
            label="Created By"
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
            label="Last Contact Date"
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
            label="Modified By"
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
            label="Date Follow Up"
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
