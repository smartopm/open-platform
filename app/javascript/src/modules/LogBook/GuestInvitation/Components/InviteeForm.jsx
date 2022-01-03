import React, { useContext } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import PhoneInput from 'react-phone-input-2';
import { useTranslation } from 'react-i18next';
import { extractCountry } from '../../../../utils/helpers';
import { Context } from '../../../../containers/Provider/AuthStateProvider';

export default function InviteeForm({
  guestData,
  handlePhoneNumber,
  handleInputChange,
  ...otherProps
}) {
  const { t } = useTranslation('common');
  const authState = useContext(Context);
  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <TextField
          variant="outlined"
          type="text"
          value={guestData.name}
          label={t('form_fields.full_name')}
          onChange={handleInputChange}
          name="name"
          inputProps={{ 'data-testid': 'guest_entry_name' }}
          margin="normal"
          fullWidth
          required
          {...otherProps}
        />
      </Grid>
      <Grid item xs={4}>
        <PhoneInput
          value={guestData.phoneNumber}
          containerStyle={{ marginTop: 17 }}
          inputStyle={{ height: '3.96em' }}
          country={extractCountry(authState.user.community?.locale)}
          placeholder={t('form_placeholders.phone_number')}
          onChange={handlePhoneNumber}
          preferredCountries={['hn', 'ke', 'zm', 'ng', 'in', 'us']}
          inputProps={{ 'data-testid': 'guest_entry_phone_number' }}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          variant="outlined"
          type="email"
          value={guestData.email}
          label={t('form_fields.email')}
          onChange={handleInputChange}
          name="email"
          inputProps={{ 'data-testid': 'guest_entry_email' }}
          margin="normal"
          {...otherProps}
          fullWidth
        />
      </Grid>
    </Grid>
  );
}

InviteeForm.propTypes = {
  guestData: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handlePhoneNumber: PropTypes.func.isRequired,
};
