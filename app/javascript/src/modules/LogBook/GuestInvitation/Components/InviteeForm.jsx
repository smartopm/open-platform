import React, { useContext } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import PhoneInput from 'react-phone-input-2';
import { useTranslation } from 'react-i18next';
import { extractCountry } from '../../../../utils/helpers';
import { useStyles } from '../styles'
import { Context } from '../../../../containers/Provider/AuthStateProvider';

export default function InviteeForm({
  guestData,
  handlePhoneNumber,
  handleInputChange,
  handleRemoveUser,
  handleAddUser,
  guestCount
}) {
  const { t } = useTranslation(['common', 'logbook']);
  const authState = useContext(Context);
  const theme = useTheme();
  const classes = useStyles()
  const matchesSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const largerScreens = useMediaQuery(theme.breakpoints.up('md'));
  return (
    <div className={guestData && classes.inviteForm}>
      <Typography>{`${t('logbook:guest_book.guest')} #${guestCount}`}</Typography>
      <Grid container spacing={matchesSmall ? 0 : 1}>
        <Grid item xs={12} md={4} sm={6}>
          <TextField
            variant="outlined"
            type="text"
            value={guestData.firstName}
            label={t('form_fields.first_name')}
            onChange={handleInputChange}
            name="firstName"
            inputProps={{ 'data-testid': 'guest_entry_first_name' }}
            margin="dense"
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} md={4} sm={6}>
          <TextField
            variant="outlined"
            type="text"
            value={guestData.lastName}
            label={t('form_fields.last_name')}
            onChange={handleInputChange}
            name="lastName"
            inputProps={{ 'data-testid': 'guest_entry_last_name' }}
            margin="dense"
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} md={3} sm={10}>
          <PhoneInput
            value={guestData.phoneNumber}
            // eslint-disable-next-line no-nested-ternary
            containerStyle={{ marginTop: largerScreens ? 8 : matchesSmall ? 9 : 0  }}
            inputStyle={{ height: '3.96em', width: '100%' }}
            country={extractCountry(authState.user.community?.locale)}
            placeholder={t('form_placeholders.phone_number')}
            onChange={handlePhoneNumber}
            preferredCountries={['hn', 'ke', 'zm', 'ng', 'in', 'us']}
            inputProps={{ 'data-testid': 'guest_entry_phone_number' }}
          />
        </Grid>
        <Grid item xs={12} md={1} sm={2} style={{ marginTop: largerScreens ? 17 : 10 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={guestData.isAdded ? handleRemoveUser : handleAddUser}
            data-testid="add_remove_guest_btn"
          >
            { guestData.isAdded ? t('misc.remove') : t('misc.add')}
          </Button>
        </Grid>
      </Grid>
      <br />
    </div>
  );
}

InviteeForm.propTypes = {
  guestData: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    phoneNumber: PropTypes.string,
    isAdded: PropTypes.bool,
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handlePhoneNumber: PropTypes.func.isRequired,
  handleRemoveUser: PropTypes.func.isRequired,
  handleAddUser: PropTypes.func.isRequired,
  guestCount: PropTypes.number.isRequired,
}