import React, { useContext } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PropTypes from 'prop-types';
import PhoneInput from 'react-phone-input-2';
import { useTranslation } from 'react-i18next';
import { extractCountry } from '../../../../utils/helpers';
import { Context } from '../../../../containers/Provider/AuthStateProvider';

export default function InviteeForm({
  guestData,
  handlePhoneNumber,
  handleInputChange,
  handleRemoveOption,
  ...otherProps
}) {
  const { t } = useTranslation('common');
  const authState = useContext(Context);
  return (
    <Grid container spacing={2} justifyContent="flex-end">
      <Grid item xs={6} sm={3}>
        <TextField
          variant="outlined"
          type="text"
          value={guestData.name}
          label={t('form_fields.full_name')}
          onChange={handleInputChange}
          name="name"
          inputProps={{ 'data-testid': 'guest_entry_name' }}
          margin="normal"
          required
          {...otherProps}
        />
      </Grid>

      <Grid item xs={6} sm={3}>
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
        />
      </Grid>
      <Grid item xs={6} sm={4}>
        <PhoneInput
          value={guestData.phoneNumber}
          containerStyle={{ marginTop: 17, width: '100%' }}
          inputStyle={{ height: '3.96em' }}
          country={extractCountry(authState.user.community?.locale)}
          placeholder={t('form_placeholders.phone_number')}
          onChange={handlePhoneNumber}
          preferredCountries={['hn', 'ke', 'zm', 'ng', 'in', 'us']}
          inputProps={{ 'data-testid': 'guest_entry_phone_number' }}
        />
      </Grid>
      <Grid item xs={6} sm={2}>
        <Grid container style={{ marginTop: 22 }}>
          {/* <Grid item xs>
            <IconButton onClick={handleRemoveOption} aria-label="add">
              <AddCircleOutlineIcon color="primary" />
            </IconButton>
          </Grid> */}
          <Grid item xs>
            <IconButton onClick={handleRemoveOption} aria-label="remove">
              <DeleteOutline color="secondary" />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

InviteeForm.propTypes = {
  guestData: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handlePhoneNumber: PropTypes.func.isRequired,
  // eslint-disable-next-line react/require-default-props
  handleRemoveOption: PropTypes.func // TODO: @olivier: Fix this when done
};
