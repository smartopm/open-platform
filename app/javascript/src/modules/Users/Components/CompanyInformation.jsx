import React from 'react';
import TextField from '@material-ui/core/TextField';
import { Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// import { useTranslation } from 'react-i18next';
import { userProps } from '../utils';
import {
  internationalizationLevels,
  industrySubSectorOptions,
  industryCategoryOptions,
  industryBusinessActivityOptions,
  regionOptions,
  countries
} from '../../../utils/constants';

export default function CompanyInformation({ leadFormData, handleChange }) {
  return (
    <div data-testid="lead-management-company-section">
      <Typography variant="h6">Company Information</Typography>
      <TextField
        name="companyName"
        label="Company Name"
        style={{ width: '100%' }}
        onChange={handleChange}
        value={leadFormData?.user?.companyName}
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'company_name'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />
      <TextField
        name="companyDescription"
        label="Company Description"
        style={{ width: '100%' }}
        onChange={handleChange}
        value={leadFormData?.user?.companyDescription}
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'company_description'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />

      <TextField
        name="companyLinkedin"
        label="Company Linkedin"
        style={{ width: '100%' }}
        onChange={handleChange}
        value={leadFormData?.user?.companyLinkedin}
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'company_linkedin'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />

      <TextField
        name="companyWebsite"
        label="Company Website"
        style={{ width: '100%' }}
        onChange={handleChange}
        value={leadFormData?.user?.companyWebsite}
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'company_website'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />

      <TextField
        name="relevantLink"
        label="Relevant Links/News"
        style={{ width: '100%' }}
        onChange={handleChange}
        value={leadFormData?.user?.relevantLink}
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'news'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />

      <br />
      <br />

      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel id="country">Country</InputLabel>
            <Select
              id="country"
              value={leadFormData?.user?.country}
              onChange={handleChange}
              name="country"
              fullWidth
              variant="outlined"
            >
              {Object.entries(countries).map(([key, val]) => (
                <MenuItem key={key} value={key}>
                  {val}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item md={6} xs={12}>
          <FormControl fullWidth>
            <InputLabel id="industryBusinessActivity">Industry Business Activity</InputLabel>
            <Select
              id="industryBusinessActivity"
              value={leadFormData?.user?.industryBusinessActivity}
              onChange={handleChange}
              name="industryBusinessActivity"
              fullWidth
              variant="outlined"
            >
              {Object.entries(industryBusinessActivityOptions).map(([key, val]) => (
                <MenuItem key={key} value={key}>
                  {val}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item md={6} xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel id="region">Region</InputLabel>
            <Select
              id="region"
              value={leadFormData?.user?.region}
              onChange={handleChange}
              name="region"
              fullWidth
              variant="outlined"
            >
              {Object.entries(regionOptions).map(([key, val]) => (
                <MenuItem key={key} value={key}>
                  {val}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item md={6} xs={12}>
          <FormControl variant="standard" fullWidth>
            <InputLabel id="level_of_internationalization">
              Level of Internationalization
            </InputLabel>
            <Select
              id="level_of_internationalization"
              value={leadFormData?.user?.levelOfInternationalization}
              onChange={handleChange}
              name="levelOfInternationalization"
              fullWidth
              variant="outlined"
            >
              {Object.entries(internationalizationLevels).map(([key, val]) => (
                <MenuItem key={key} value={key}>
                  {val}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item md={6} xs={12}>
          <FormControl variant="standard" fullWidth>
            <InputLabel id="industry">Industry Sector</InputLabel>
            <Select
              id="industry"
              value={leadFormData?.user?.industry}
              onChange={handleChange}
              name="industry"
              fullWidth
              variant="outlined"
            >
              {Object.entries(industryCategoryOptions).map(([key, val]) => (
                <MenuItem key={key} value={key}>
                  {val}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item md={6} xs={12}>
          <TextField
            name="companyEmployees"
            label="Number Of Employees"
            style={{ width: '100%' }}
            onChange={handleChange}
            value={leadFormData?.user?.companyEmployees}
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            size="small"
            inputProps={{
              'aria-label': 'number_of_employees'
            }}
          />
        </Grid>

        <Grid item md={6} xs={12}>
          <FormControl variant="standard" fullWidth>
            <InputLabel id="industrySubSector">Industry Sub Sector</InputLabel>
            <Select
              id="industrySubSector"
              value={leadFormData?.user?.industrySubSector}
              onChange={handleChange}
              name="industrySubSector"
              fullWidth
              variant="outlined"
            >
              {Object.entries(industrySubSectorOptions).map(([key, val]) => (
                <MenuItem key={key} value={key}>
                  {val}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item md={6} xs={12}>
          <TextField
            name="companyAnnualRevenue"
            label="Annual Revenue"
            style={{ width: '100%' }}
            onChange={handleChange}
            value={leadFormData?.user?.companyAnnualRevenue}
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            size="small"
            inputProps={{
              'aria-label': 'annual_revenue'
            }}
          />
        </Grid>

        <Grid item md={12} xs={12}>
          <TextField
            name="africanPresence"
            label="African Presence"
            style={{ width: '100%' }}
            onChange={handleChange}
            value={leadFormData?.user?.africanPresence}
            variant="outlined"
            fullWidth
            rows={2}
            size="small"
            inputProps={{
              'aria-label': 'african_presence'
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
}

CompanyInformation.propTypes = {
  leadFormData: PropTypes.shape({ user: userProps }).isRequired,
  handleChange: PropTypes.func.isRequired
};
