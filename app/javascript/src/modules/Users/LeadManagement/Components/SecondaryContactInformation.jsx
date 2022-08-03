import React from 'react';
import TextField from '@mui/material/TextField';
import { Divider , Grid, Typography } from '@mui/material';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { secondaryInfoUserObject } from '../../utils';

export default function SecondaryCcntactInformation({
  leadFormData,
  handleSecondaryContact1Change,
  handleSecondaryContact2Change
}) {
  const { t } = useTranslation('common');
  return (
    <>
      <Typography variant="h6" data-testid="lead-management-secondary-info-section-header">
        {' '}
        {t('lead_management.secondary_contact_section1_header')}
      </Typography>
      <TextField
        name="name"
        label={t('lead_management.name')}
        style={{ width: '100%' }}
        onChange={handleSecondaryContact1Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact1?.name || ""}
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'name'
        }}
      />

      <TextField
        name="title"
        label={t('lead_management.title')}
        style={{ width: '100%' }}
        onChange={handleSecondaryContact1Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact1?.title || ""}
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'title'
        }}
      />
      <TextField
        name="primaryEmail"
        label={t('lead_management.primary_email')}
        style={{ width: '100%' }}
        onChange={handleSecondaryContact1Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact1?.primaryEmail || ""}
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
        onChange={handleSecondaryContact1Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact1?.secondaryEmail || ""}
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
        name="primaryPhoneNumber"
        label={t('lead_management.primary_phone')}
        style={{ width: '100%' }}
        onChange={handleSecondaryContact1Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact1?.primaryPhoneNumber || ""}
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
        onChange={handleSecondaryContact1Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact1?.secondaryPhoneNumber || ""}
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'secondary_phone_number/mobile'
        }}
      />

      <TextField
        name="linkedinUrl"
        label={t('lead_management.linkedin_url')}
        style={{ width: '100%' }}
        onChange={handleSecondaryContact1Change}
        value={leadFormData?.user?.contactDetails.secondaryContact1?.linkedinUrl || ""}
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'linkedin'
        }}
      />

      <br />
      <br />
      <Grid item md={12} xs={12} style={{ marginBottom: '2px' }}>
        <Divider />
      </Grid>
      <br />

      <Typography variant="h6">
        {' '}
        {t('lead_management.secondary_contact_section2_header')}
      </Typography>

      <TextField
        name="name"
        label={t('lead_management.name')}
        style={{ width: '100%' }}
        onChange={handleSecondaryContact2Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact2?.name || ""}
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'name'
        }}
      />

      <TextField
        name="title"
        label={t('lead_management.title')}
        style={{ width: '100%' }}
        onChange={handleSecondaryContact2Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact2?.title || ""}
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'title'
        }}
      />

      <TextField
        name="primaryEmail"
        label={t('lead_management.primary_email')}
        style={{ width: '100%' }}
        onChange={handleSecondaryContact2Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact2?.primaryEmail || ""}
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
        onChange={handleSecondaryContact2Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact2?.secondaryEmail || ""}
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
        name="primaryPhoneNumber"
        label={t('lead_management.primary_phone')}
        style={{ width: '100%' }}
        onChange={handleSecondaryContact2Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact2?.primaryPhoneNumber || ""}
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
        onChange={handleSecondaryContact2Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact2?.secondaryPhoneNumber || ""}
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'secondary_phone_number/mobile'
        }}
      />

      <TextField
        name="linkedinUrl"
        label={t('lead_management.linkedin_url')}
        style={{ width: '100%' }}
        onChange={handleSecondaryContact2Change}
        value={leadFormData?.user?.contactDetails.secondaryContact2?.linkedinUrl || ""}
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
  );
}

SecondaryCcntactInformation.propTypes = {
  leadFormData: PropTypes.shape({ user: secondaryInfoUserObject }).isRequired,
  handleSecondaryContact1Change: PropTypes.func.isRequired,
  handleSecondaryContact2Change: PropTypes.func.isRequired
};
