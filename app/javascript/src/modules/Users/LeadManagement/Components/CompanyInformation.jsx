import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { MenuItem, Select, InputLabel, FormControl } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { userProps } from '../../utils';
import {
  internationalizationLevels,
  industrySubSectorOptions,
  industryCategoryOptions,
  industryBusinessActivityOptions,
  regionOptions,
  countries
} from '../../../../utils/constants';

export default function CompanyInformation({ leadFormData, handleChange }) {
  const { t } = useTranslation('common');

  const useStyles = makeStyles(theme => ({
    formControl: {
      margin: theme.spacing(1)
    },
    selectEmpty: {
      marginTop: theme.spacing(2)
    },
    menuPaper: {
      maxHeight: 400,
      padding: 4
    },

    input: {
      height: 40
    }
  }));

  const classes = useStyles();

  return (
    <div data-testid="lead-management-company-section">
      <Typography variant="h6">
        {t('lead_management.company_information_section_header')}
      </Typography>
      <TextField
        name="companyName"
        label={t('lead_management.company_name')}
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
      />
      <TextField
        name="companyDescription"
        label={t('lead_management.company_description')}
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
      />

      <TextField
        name="companyLinkedin"
        label={t('lead_management.company_linkedin')}
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
      />

      <TextField
        name="companyWebsite"
        label={t('lead_management.company_website')}
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
      />

      <TextField
        name="relevantLink"
        label={t('lead_management.relevant_link')}
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
      />

      <br />
      <br />

      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel id="country">{t('lead_management.country')}</InputLabel>
            <Select
              id="country"
              value={leadFormData?.user?.country}
              onChange={handleChange}
              name="country"
              fullWidth
              variant="outlined"
              MenuProps={{ classes: { paper: classes.menuPaper } }}
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
          <FormControl fullWidth size="small">
            <InputLabel id="industryBusinessActivity">
              {t('lead_management.industry_business_activity')}
            </InputLabel>
            <Select
              id="industryBusinessActivity"
              value={leadFormData?.user?.industryBusinessActivity}
              onChange={handleChange}
              name="industryBusinessActivity"
              fullWidth
              variant="outlined"
              MenuProps={{ classes: { paper: classes.menuPaper } }}
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
            <InputLabel id="region">{t('lead_management.region')}</InputLabel>
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
          <FormControl variant="standard" fullWidth size="small">
            <InputLabel id="level_of_internationalization">
              {t('lead_management.level_of_internationalization')}
            </InputLabel>
            <Select
              id="level_of_internationalization"
              value={leadFormData?.user?.levelOfInternationalization}
              onChange={handleChange}
              name="levelOfInternationalization"
              fullWidth
              variant="outlined"
              MenuProps={{ classes: { paper: classes.menuPaper } }}
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
          <FormControl variant="standard" fullWidth size="small">
            <InputLabel id="industry">{t('lead_management.industry_sector')}</InputLabel>
            <Select
              id="industry"
              value={leadFormData?.user?.industry}
              onChange={handleChange}
              name="industry"
              fullWidth
              variant="outlined"
              MenuProps={{ classes: { paper: classes.menuPaper } }}
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
            label={t('lead_management.number_of_employees')}
            style={{ width: '100%' }}
            onChange={handleChange}
            value={leadFormData?.user?.companyEmployees}
            variant="outlined"
            fullWidth
            InputProps={{
              className: classes.input,
              'aria-label': 'number_of_employees'
            }}
            rows={2}
            size="small"
          />
        </Grid>

        <Grid item md={6} xs={12}>
          <FormControl variant="standard" fullWidth size="small">
            <InputLabel id="industrySubSector">
              {t('lead_management.industry_sub_sector')}
            </InputLabel>
            <Select
              id="industrySubSector"
              value={leadFormData?.user?.industrySubSector}
              onChange={handleChange}
              name="industrySubSector"
              fullWidth
              variant="outlined"
              MenuProps={{ classes: { paper: classes.menuPaper } }}
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
            label={t('lead_management.annual_revenue')}
            style={{ width: '100%' }}
            onChange={handleChange}
            value={leadFormData?.user?.companyAnnualRevenue}
            variant="outlined"
            fullWidth
            rows={2}
            size="small"
            InputProps={{
              className: classes.input,
              'aria-label': 'number_of_employees'
            }}
          />
        </Grid>

        <Grid item md={12} xs={12}>
          <TextField
            name="africanPresence"
            label={t('lead_management.african_presence')}
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
