import React, { useContext, useState } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import PropTypes from 'prop-types';
import PhoneInput from 'react-phone-input-2';
import { useTranslation } from 'react-i18next';
import { ButtonGroup } from '@mui/material';
import { extractCountry } from '../../../../utils/helpers';
import { useStyles } from '../styles';
import { Context } from '../../../../containers/Provider/AuthStateProvider';

export default function InviteeForm({
  guestData,
  handlePhoneNumber,
  handleInputChange,
  handleAction,
  guestCount,
  primary
}) {
  const { t } = useTranslation(['common', 'logbook']);
  const authState = useContext(Context);
  const theme = useTheme();
  const classes = useStyles();
  const matchesSmall = useMediaQuery(theme.breakpoints.down('md'));
  const largerScreens = useMediaQuery(theme.breakpoints.up('md'));
  const [isCompany, setIsCompany] = useState(false);

  function handleIsCompany(type) {
    setIsCompany(type);
  };

  return (
    <div className={guestData && classes.inviteForm}>
      {
        primary && (
          <div className={classes.guestType}>
            <Typography 
              variant="caption"
              data-testid="guest_type"
            >
              {t('logbook:guest.guest_type')}
            </Typography> 
            {"  "}
            <ButtonGroup 
              className={classes.guestTypeToggleButtons}
              color="primary"
              aria-label="Switch to company mode"
            >
              <Button 
                variant={!isCompany ? 'contained' : 'outlined'}
                onClick={() => handleIsCompany(false)}
                data-testid="person_mode"
                disableElevation
              >
                {t('misc.person')}
              </Button>
              <Button 
                variant={isCompany ? 'contained' : 'outlined'}
                onClick={() => handleIsCompany(true)}
                data-testid="company_mode"
                disableElevation
              >
                {t('misc.company')}
              </Button>
            </ButtonGroup>
            <br />
          </div>
        )
      }
      {!primary ? (
        <Typography variant="caption">
          {`${t('logbook:guest_book.new_guest', {
          count: 1
        })} #${guestCount}`}

        </Typography>
      ) : null}


      <Grid container spacing={matchesSmall ? 0 : 1} alignItems="center">
        {
        (!isCompany && !guestData.companyName) && (
          <>
            <Grid item xs={12} md={4} sm={6}>
              <TextField
                variant="outlined"
                type="text"
                value={guestData.firstName}
                label={t('form_fields.full_first_name')}
                onChange={handleInputChange}
                name="firstName"
                inputProps={{ 'data-testid': 'guest_entry_first_name' }}
                margin="dense"
                fullWidth
                required
              />
            </Grid>
            <Grid 
              item
              xs={12}
              md={4}
              sm={6}
              order={{ xs: 2, sm: 2, md: 2 , lg: 2  }}
            >
              <TextField
                variant="outlined"
                type="text"
                value={guestData.lastName}
                label={t('form_fields.full_last_name')}
                onChange={handleInputChange}
                name="lastName"
                inputProps={{ 'data-testid': 'guest_entry_last_name' }}
                margin="dense"
                fullWidth
                required
              />
            </Grid>
          </>
        )
      }
        {
          (isCompany || guestData.companyName) && (
            <Grid
              item
              xs={12}
              md={4}
              sm={12} 
              order={{ xs: 1, sm: 1, md: 1, lg: 1 }}
            >
              <TextField
                variant="outlined"
                type="text"
                value={guestData.companyName}
                label={t('form_fields.company_name')}
                onChange={handleInputChange}
                name="companyName"
                inputProps={{ 'data-testid': 'company_name' }}
                margin="dense"
                fullWidth
                required
              />
            </Grid>
          )
        }
        <Grid
          item
          xs={12}
          md={3}
          sm={10} 
          order={{ xs: 3, sm: 3, md: 3, lg: 3 }}
        >
          <PhoneInput
            value={guestData.phoneNumber}
            containerStyle={{ marginTop: largerScreens ? 8 : matchesSmall ? 9 : 0 }}
            inputStyle={{ height: '3.96em', width: '100%' }}
            country={extractCountry(authState.user.community?.locale)}
            placeholder={t('form_placeholders.phone_number')}
            onChange={handlePhoneNumber}
            preferredCountries={['hn', 'ke', 'zm', 'ng', 'in', 'us']}
            inputProps={{ 'data-testid': 'guest_entry_phone_number' }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={1}
          sm={2}
          order={{ xs: 5, sm: 5, md: 5, lg: 5 }}
          style={{ marginTop: matchesSmall ? 10 : 0 }}
        >
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleAction(guestData)}
            data-testid="add_remove_guest_btn"
            disableElevation
          >
            {primary ? t('misc.add') : t('misc.remove')}
          </Button>
        </Grid>
      </Grid>
      <br />
      {matchesSmall && <Divider />}
    </div>
  );
}

InviteeForm.defaultProps = {
  primary: false,
  guestCount: 0
};
InviteeForm.propTypes = {
  guestData: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    companyName: PropTypes.string,
    phoneNumber: PropTypes.string,
    isAdded: PropTypes.bool
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handlePhoneNumber: PropTypes.func.isRequired,
  handleAction: PropTypes.func.isRequired,
  guestCount: PropTypes.number,
  primary: PropTypes.bool
};
