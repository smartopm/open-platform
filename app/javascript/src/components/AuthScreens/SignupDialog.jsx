import React, { useEffect, useState } from 'react';
import {
  Button,
  TextField,
  Select,
  Divider,
  FormControl,
  MenuItem,
  InputLabel,
  Typography,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import ReactGA from 'react-ga';
import { StyleSheet, css } from 'aphrodite';
import PropTypes from 'prop-types';
import { ModalDialog } from '../Dialog';
import GoogleIcon from '../../../../assets/images/google_icon.svg';

export default function SignupDialog({ t, handleModal, open, currentCommunity, setOpen }) {
  const initialValues = {
    username: '',
    phone: '',
    email: '',
    interest: '',
    impact: '',
  }
  const [value, setValue] = useState(initialValues)

  const communityName = currentCommunity?.name || 'DoubleGDP';
  const communitySupportEmail =
    currentCommunity?.supportEmail?.find(({ category }) => category === 'customer_care')?.email ||
    'support@doublegdp.com';
  const AppLoginRequestSurvey = {
    interest: {
      question: `Why are you interested in ${communityName}?`,
      responses: [
        `I own property at ${communityName}`,
        `I want to own property at ${communityName}`,
        `I want to learn more about ${communityName}`,
      ],
    },
    impact: {
      question: `How did you hear about ${communityName}?`,
      responses: [
        'Artists in Residence (AIR) Program',
        'Hackers in Residence (HIR) Program',
        'Social Media',
        'Friend/Family',
        'Newspaper/Radio/Television',
        'Event',
        'Other',
      ],
    },
  };

  /* eslint-disable security/detect-non-literal-fs-filename */
  function handleClick() {
    const { username, email, phone, impact, interest } = value
    // Google Analytics tracking
    ReactGA.event({
      category: 'LoginPage',
      action: 'TroubleLogging',
      eventLabel: 'Trouble Logging on Login Page',
      nonInteraction: true,
    });
    window.open(
      `mailto:${communitySupportEmail}?subject=${communityName} App Login Request&body=Hi,
           I would like access to the ${communityName} app. Please provide me with my login credentials.
           Full Name: ${username}, Email: ${email}, Phone Number: ${phone}, Why are you interested in ${communityName}?: ${interest},
           How did you hear about ${communityName}?: ${impact}`,
      'emailWindow'
    );
    setOpen(!open);
  }

  useEffect(() => {
    setValue(initialValues)
  }, [open])

  return (
    <ModalDialog
      open={open}
      handleClose={handleModal}
      handleConfirm={handleClick}
      action={t('common:form_actions.send_email')}
    >
      <div className="container">
        <div className="d-flex row justify-content-center ">
          <Button
            href="/login_oauth"
            style={{ backgroundColor: 'white', textTransform: 'none' }}
            variant="contained"
            startIcon={<img src={GoogleIcon} alt="google-icon" />}
          >
            {t('login.login_google')}
          </Button>
          <Button
            href="/fb_oauth"
            variant="contained"
            startIcon={<FacebookIcon />}
            className={css(styles.signUpBtns)}
          >
            {t('login.login_facebook')}
          </Button>
        </div>
      </div>
      <Divider>
        {t('common:misc:or')}
      </Divider>
      <br />
      <Typography variant="h6" align='center'>
        {t('login.request_login', { communityEmail: communitySupportEmail })}
      </Typography>
      <br />
      <TextField
        variant="outlined"
        required
        fullWidth
        name="username"
        value={value.username}
        label={t('common:form_fields.full_name')}
        onChange={event => setValue({...value, username: event.target.value})}
      />

      <TextField
        variant="outlined"
        margin="normal"
        type="email"
        required
        fullWidth
        name="email"
        value={value.email}
        label={t('common:form_fields.email')}
        onChange={event => setValue({...value, email: event.target.value})}
      />
      <TextField
        variant="outlined"
        margin="normal"
        type="number"
        required
        fullWidth
        name="phone"
        value={value.phone}
        label={t('common:form_fields.phone_number')}
        onChange={event => setValue({...value, phone: event.target.value})}
      />
      <FormControl className={css(styles.formControl)}>
        <InputLabel id="demo-simple-select-outlined-label">
          {AppLoginRequestSurvey.interest.question}
        </InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          data-testid="interest"
          value={value.interest}
          onChange={event => setValue({...value, interest: event.target.value})}
          label="interest"
          required
        >
          {AppLoginRequestSurvey.interest.responses.map(val => (
            <MenuItem value={val} key={val}>
              {val}
            </MenuItem>
          ))}
        </Select>
        <br />
      </FormControl>
      <FormControl className={css(styles.formControl)}>
        <InputLabel id="demo-simple-select-outlined-label">
          {AppLoginRequestSurvey.impact.question}
        </InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          data-testid="impact"
          value={value.impact}
          onChange={event => setValue({...value, impact: event.target.value})}
          label="impact"
          required
        >
          {AppLoginRequestSurvey.impact.responses.map(val => (
            <MenuItem value={val} key={val}>
              {val}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </ModalDialog>
  );
}

SignupDialog.defaultProps = {
  currentCommunity: {
    name: '',
    supportEmail: []
  }
}
SignupDialog.propTypes = {
  t: PropTypes.func.isRequired,
  handleModal: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  currentCommunity: PropTypes.shape({
    name: PropTypes.string,
    supportEmail: PropTypes.arrayOf(PropTypes.object),
  }),
  setOpen: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  "[type='number']": {
    fontSize: 30,
  },
  signUpBtns: {
    backgroundColor: 'white',
    textTransform: 'none',
    color: '#3b5998',
    marginLeft: 20,
    '@media (max-width: 520px)': {
      marginTop: 12,
      marginLeft: 0,
    },
  },
  formControl: {
    minWidth: 120,
    width: '100%',
  },
});
