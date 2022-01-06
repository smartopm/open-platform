import React, { useContext } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import CancelIcon from '@mui/icons-material/Cancel';
import PropTypes from 'prop-types';
import PhoneInput from 'react-phone-input-2';
import { useTranslation } from 'react-i18next';
import { extractCountry } from '../../../../utils/helpers';
import { Context } from '../../../../containers/Provider/AuthStateProvider';

export default function InviteeForm({
  guestData,
  handlePhoneNumber,
  handleInputChange,
  handleRemoveUser,
  handleAddUser,
}) {
  const { t } = useTranslation('common');
  const authState = useContext(Context);
  const theme = useTheme();
  const matchesMedium = useMediaQuery(theme.breakpoints.down('md'));
  const matchesSmall = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Grid container direction="row">
      <Grid container spacing={matchesSmall ? 0 : 1}>
        <Grid item xs={12} md={3} sm={6}>
          <TextField
            variant="outlined"
            type="text"
            value={guestData.firstName}
            label={t('form_fields.first_name')}
            onChange={handleInputChange}
            name="firstName"
            inputProps={{ 'data-testid': 'guest_entry_first_name' }}
            margin="normal"
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} md={3} sm={6}>
          <TextField
            variant="outlined"
            type="text"
            value={guestData.lastName}
            label={t('form_fields.last_name')}
            onChange={handleInputChange}
            name="lastName"
            inputProps={{ 'data-testid': 'guest_entry_last_name' }}
            margin="normal"
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} md={4} sm={6}>
          <PhoneInput
            value={guestData.phoneNumber}
            containerStyle={{ marginTop: !matchesMedium ? 17 : 0,  }}
            inputStyle={{ height: '3.96em', width: '100%' }}
            country={extractCountry(authState.user.community?.locale)}
            placeholder={t('form_placeholders.phone_number')}
            onChange={handlePhoneNumber}
            preferredCountries={['hn', 'ke', 'zm', 'ng', 'in', 'us']}
            inputProps={{ 'data-testid': 'guest_entry_phone_number' }}
          />
        </Grid>
        <Grid item xs={12} md={2} sm={6} style={{ marginTop: !matchesMedium ? 26 : 10 }}>
          {
            guestData.isAdded
            ? (
              <IconButton onClick={handleRemoveUser} aria-label="remove">
                <CancelIcon color="primary" />
              </IconButton>
            )
            : (
              <Button variant="outlined" onClick={handleAddUser}>
                Add
              </Button>
            )
          }
        </Grid>
      </Grid>
    </Grid>
  );
}

InviteeForm.propTypes = {
  guestData: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    isAdded: PropTypes.bool,
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handlePhoneNumber: PropTypes.func.isRequired,
  handleRemoveUser: PropTypes.func.isRequired,
  handleAddUser: PropTypes.func.isRequired,
}