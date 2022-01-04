import React, { useContext } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
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
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Grid container direction="row">
      <Grid container spacing={1}>
        <Grid item xs={12} md={3} sm={6}>
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
            fullWidth
            {...otherProps}
          />
        </Grid>
        <Grid item xs={12} md={3} sm={6}>
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
            fullWidth
            {...otherProps}
          />
        </Grid>

        <Grid item xs={12} md={3} sm={6}>
          <TextField
            variant="outlined"
            type="email"
            value={guestData.email}
            label={t('form_fields.email')}
            onChange={handleInputChange}
            name="email"
            inputProps={{ 'data-testid': 'guest_entry_email' }}
            margin="normal"
            fullWidth
            {...otherProps}
          />
        </Grid>
        <Grid item xs={12} md={2} sm={6}>
          {/* <PhoneInput
            value={guestData.phoneNumber}
            containerStyle={{ marginTop: 17, width: '100%' }}
            inputStyle={{ height: '3.96em' }}
            country={extractCountry(authState.user.community?.locale)}
            placeholder={t('form_placeholders.phone_number')}
            onChange={handlePhoneNumber}
            preferredCountries={['hn', 'ke', 'zm', 'ng', 'in', 'us']}
            inputProps={{ 'data-testid': 'guest_entry_phone_number' }}
          /> */}
          <TextField
            variant="outlined"
            type="email"
            value={guestData.phoneNumber}
            label={t('form_fields.phone_number')}
            onChange={handleInputChange}
            name="email"
            inputProps={{ 'data-testid': 'guest_entry_email' }}
            margin="normal"
            fullWidth
            {...otherProps}
          />
        </Grid>
        <Grid item xs={12} md={1} sm={6}>
          {/* <IconButton onClick={handleRemoveOption} aria-label="remove">
            <DeleteOutline color="secondary" />
          </IconButton> */}
          <Button variant="outlined" style={{ marginTop: !matches ? 26 : 0 }}>
            Add
          </Button>
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
