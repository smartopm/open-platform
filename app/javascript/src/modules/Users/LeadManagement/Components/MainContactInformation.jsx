import React from 'react';
import TextField from '@mui/material/TextField';
import { Button , Grid, Typography } from '@mui/material';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import useMediaQuery from '@mui/material/useMediaQuery';
import { userProps } from '../../utils';

export default function MainContactInformation({ leadFormData, handleChange, disabled }) {
  const { t } = useTranslation('common');
  const matches = useMediaQuery('(max-width:800px)');
  return (
    <>
      {/* TODO: Shouldn't the user be able to see something if there is no leadFormData */}
      {leadFormData && (
        <>
          <Grid container data-testid="lead-management-main-contact-section">
            <Grid item md={6} xs={6}>
              <Typography variant="h6" data-testid="contact_info">
                {matches ? t('lead_management.contact_info') : t('lead_management.primary_info')}
              </Typography>
            </Grid>
            <Grid
              item
              md={6}
              xs={6}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                padding: 0
              }}
            >
              <Button
                variant="contained"
                type="submit"
                disabled={disabled}
                color="primary"
                aria-label="lead_management_button"
                data-testid="lead_management_button"
              >
                {matches ? t('lead_management.save') : t('lead_management.save_updates')}
              </Button>
            </Grid>
          </Grid>
          <br />
          <TextField
            name="name"
            label={t('lead_management.name')}
            style={{ width: '100%' }}
            onChange={handleChange}
            value={leadFormData?.user?.name || ''}
            data-testid="lead_management_main_section_name"
            variant="outlined"
            fullWidth
            rows={2}
            size="small"
            margin="normal"
            required
          />

          <TextField
            name="title"
            label={t('lead_management.title')}
            style={{ width: '100%' }}
            onChange={handleChange}
            value={leadFormData?.user?.title || ''}
            variant="outlined"
            fullWidth
            rows={2}
            size="small"
            margin="normal"
            inputProps={{
              'aria-label': t('lead_management.title'),
              'data-testid': 'main-section-title-input'
            }}
          />

          <TextField
            name="email"
            label={t('lead_management.primary_email')}
            style={{ width: '100%' }}
            onChange={handleChange}
            value={leadFormData?.user?.email || ''}
            variant="outlined"
            fullWidth
            rows={2}
            size="small"
            margin="normal"
            inputProps={{
              'aria-label': 'primary_email'
            }}
          />

          <TextField
            name="secondaryEmail"
            label={t('lead_management.secondary_email')}
            style={{ width: '100%' }}
            onChange={handleChange}
            value={leadFormData?.user?.secondaryEmail || ''}
            variant="outlined"
            fullWidth
            rows={2}
            size="small"
            margin="normal"
            inputProps={{
              'aria-label': 'secondary_email'
            }}
          />

          <TextField
            name="phoneNumber"
            label={t('form_fields.phone_number')}
            style={{ width: '100%' }}
            onChange={handleChange}
            value={leadFormData?.user?.phoneNumber || ''}
            variant="outlined"
            fullWidth
            rows={2}
            size="small"
            margin="normal"
            inputProps={{
              'aria-label': 'primary_phone_number/mobile'
            }}
          />

          <TextField
            name="secondaryPhoneNumber"
            label={t('lead_management.secondary_phone')}
            style={{ width: '100%' }}
            onChange={handleChange}
            value={leadFormData?.user?.secondaryPhoneNumber || ''}
            variant="outlined"
            fullWidth
            rows={2}
            size="small"
            margin="normal"
            inputProps={{
              'aria-label': 'secondary_phone/mobile'
            }}
          />

          <TextField
            name="linkedinUrl"
            label={t('lead_management.linkedin_url')}
            style={{ width: '100%' }}
            onChange={handleChange}
            value={leadFormData?.user?.linkedinUrl || ''}
            variant="outlined"
            fullWidth
            rows={2}
            size="small"
            margin="normal"
            inputProps={{
              'aria-label': 'linkedin'
            }}
          />
        </>
      )}
    </>
  );
}
MainContactInformation.propTypes = {
  leadFormData: PropTypes.shape({ user: userProps }).isRequired,
  handleChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};
