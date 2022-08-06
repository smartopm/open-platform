import React, { useState, useEffect, useContext } from 'react';
import {
  Button,
  TextField,
  CircularProgress,
  Typography,
  Divider,
  Grid,
  Container,
} from '@mui/material';
import { StyleSheet, css } from 'aphrodite';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FacebookIcon from '@mui/icons-material/Facebook';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmailIcon from '@mui/icons-material/Email';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import PhoneInput from 'react-phone-input-2';
import PropTypes from 'prop-types'
import { getAuthToken, AUTH_FORWARD_URL_KEY } from '../../utils/apollo';
import GoogleIcon from '../../../../assets/images/google_icon.svg';
import {
  loginPhoneMutation,
  loginEmailMutation,
  loginUsernamePasswordMutation,
} from '../../graphql/mutations';
import { extractCountry } from '../../utils/helpers';
import CenteredContent from '../../shared/CenteredContent';
import SignupDialog from './SignupDialog';
import PasswordInput from '../../shared/PasswordInput';
import useMutationWrapper from '../../shared/hooks/useMutationWrapper';
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider';
import ImageAuth from '../../shared/ImageAuth';

export default function LoginScreen({ currentCommunity }) {
  const { state } = useLocation();
  const history = useHistory();
  const { t } = useTranslation(['login', 'common']);
  const [userLogin, setUserLogin] = useState({ email: '', phone: '' });
  const [emailLoginSent, setEmailLoginSet] = useState(false);
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({
    username: '',
    password: '',
    showPassword: false,
  });

  const [
    loginWithUsernamePassword,
    passwordLoginLoading,
  ] = useMutationWrapper(loginUsernamePasswordMutation, data => handleUserRouting(data));
  const [loginWithEmail, emailLoginLoading] = useMutationWrapper(loginEmailMutation, () =>
    setEmailLoginSet(true)
  );
  const [loginWithPhone, phoneLoginLoading] = useMutationWrapper(
    loginPhoneMutation,
    routeToConfirmCode
  );

  const authState = useContext(AuthStateContext);

  function routeToConfirmCode(data) {
    history.push({
      pathname: `/code/${data.loginPhoneStart.user.id}`,
      state: {
        phoneNumber: userLogin.phone,
        from: `${!state ? '/' : state.from.pathname}`,
      },
    });
  }

  function handleUserRouting(data) {
    if (data?.loginUsernamePassword?.user?.hasResetPassword === false) {
      history.push({
        pathname: `/password_setup/${data?.loginUsernamePassword?.user?.id}`,
        state: {
          firstTimeLogin: true,
        },
      });
    } else {
      authState.setToken({
        type: 'update',
        token: data?.loginUsernamePassword?.authToken,
      });
    }
  }

  useEffect(() => {
    // check if user is logged in
    const token = getAuthToken();
    if (token) {
      // return to home
      history.push(`${!state ? '/' : state.from.pathname}`);
    }
  }, []);

  function handleModal() {
    setOpen(!open);
  }

  function handleUserLogin(event, type = 'input') {
    // submit on both click and Enter Key pressed
    if (event.keyCode === 13 || type === 'btnClick') {
      if (userLogin.email) {
        // handle login with email
        return loginWithEmail({ email: userLogin.email.trim() });
      }

      if (userLogin.phone) {
        // handle login with phone
        return loginWithPhone({ phoneNumber: userLogin.phone.trim() });
      }
      if (values.password && values.username) {
        return loginWithUsernamePassword({
          username: values.username.trim(),
          password: values.password,
        });
      }
    }
    return false;
  }

  function handleOAuthLogin(url) {
    if (history.location.search) {
      sessionStorage.setItem(AUTH_FORWARD_URL_KEY, state.from.pathname);
    }

    window.location.assign(url);
  }

  const isLoggingIn = phoneLoginLoading || emailLoginLoading || passwordLoginLoading;
  const isLoginBtnDisabled =
    (!userLogin.email && !userLogin.phone && !values.password && !values.username) ||
    isLoggingIn ||
    emailLoginSent;

  return (
    <div style={{ overflow: 'hidden' }}>
      {/* Signup Dialog */}
      <SignupDialog
        t={t}
        open={open}
        setOpen={setOpen}
        handleModal={handleModal}
        currentCommunity={currentCommunity}
      />

      <Container maxWidth="sm">
        <CenteredContent>
          <ImageAuth
            imageLink={currentCommunity?.imageUrl}
            className={css(styles.logo)}
            alt="community logo"
            style={{ marginTop: 25, marginBottom: -17 }}
          />
        </CenteredContent>
        <br />
        <Typography
          textAlign="center"
          component="div"
          marginBottom="-30px"
          marginTop="20px"
          variant="h6"
        >
          {
            t('login.welcome', { appName: currentCommunity?.name })
          }
        </Typography>
        <br />
        <br />
        <Grid container className="justify-content-center">
          <Grid item xs={12}>
            <Typography color="textSecondary" variant="body2">
              {t('login.login_text')}
            </Typography>
            <div className={`${css(styles.phoneNumberInput)}`}>
              <PhoneInput
                value={userLogin.phone}
                containerStyle={{ width: '100%' }}
                inputClass="phone-login-input"
                inputStyle={{ width: '100%', height: '2.5em' }}
                country={extractCountry(currentCommunity?.locale)}
                enableSearch
                placeholder={t('common:form_placeholders.phone_number')}
                onChange={value => setUserLogin({ phone: value, email: '' })}
                preferredCountries={['hn', 'ke', 'zm', 'cr', 'ng', 'in', 'us']}
              />
            </div>
          </Grid>
          <Grid item xs={12}>
            <Divider style={{ marginTop: 16, marginBottom: 10 }}>{t('common:misc:or')}</Divider>
          </Grid>
          <Grid item xs={12}>
            <TextField
              data-testid="username-field"
              id="username-field"
              name="username"
              label={t('common:form_fields.username')}
              value={values.username}
              onChange={event => setValues({ ...values, username: event.target.value })}
              style={{ marginBottom: 14 }}
              variant="outlined"
              margin="dense"
              size='small'
              fullWidth
            />
            <PasswordInput
              data-testid="password-field"
              label={t('common:form_fields.password')}
              type="password"
              size="small"
              passwordValue={values}
              setPasswordValue={setValues}
            />
          </Grid>
          <br />
          <Grid item xs={12}>
            <Divider style={{ marginTop: 10, marginBottom: 16 }}>{t('common:misc:or')}</Divider>
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={() => handleOAuthLogin('/fb_oauth')}
              variant="outlined"
              data-testid="login-with-facebook-btn"
              startIcon={<FacebookIcon className={`${css(styles.socialLoginButtonIcons)}`} />}
              size="small"
              fullWidth
              className={`${css(styles.facebookOAuthButton)}`}
            >
              {t('login.login_facebook')}
            </Button>
            <Button
              onClick={() => handleOAuthLogin('/login_oauth')}
              data-testid="login-with-google-btn"
              variant="outlined"
              startIcon={(
                <img
                  src={GoogleIcon}
                  alt="google-icon"
                  className={`${css(styles.socialLoginButtonIcons)}`}
                />
              )}
              className={`${css(styles.googleOAuthButton)} google-sign-in-btn`}
              size="small"
              fullWidth
            >
              {t('login.login_google')}
            </Button>
            <TextField
              value={userLogin.email}
              variant="outlined"
              fullWidth
              type="email"
              name="email_login"
              data-testid="email_text_input"
              className={`${css(styles.emailLoginTextField)}`}
              placeholder={t('login.login_email')}
              label={t('login.login_email')}
              onChange={event => setUserLogin({ email: event.target.value, phone: '' })}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton size="small">
                      <EmailIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
        <CenteredContent>
          <Button
            data-testid="login-btn"
            variant="contained"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            className={`${css(styles.getStartedButton)} enz-lg-btn next-btn`}
            onClick={event => handleUserLogin(event, 'btnClick')}
            disabled={isLoginBtnDisabled}
          >
            {isLoggingIn ? (
              <CircularProgress size={25} color="primary" />
            ) : (
              <span>
                {emailLoginSent ? t('login.email_otp_text') : t('login.continue_button_text')}
              </span>
            )}
          </Button>
        </CenteredContent>
        <br />

        <CenteredContent>
          <Button
            size="medium"
            id="trigger-modal-dialog"
            data-testid="trouble-logging-in-btn"
            onClick={handleModal}
            style={{ textTransform: 'none' }}
          >
            <u>
              <strong>{t('login.request_account')}</strong>
            </u>
          </Button>
        </CenteredContent>
      </Container>
    </div>
  );
}

LoginScreen.propTypes = {
  currentCommunity: PropTypes.shape({
    name: PropTypes.string,
    imageUrl: PropTypes.string,
    locale: PropTypes.string,
  }).isRequired
}

const styles = StyleSheet.create({
  getStartedButton: {
    color: '#FFF',
    width: '55%',
    boxShadow: 'none',
    marginTop: 20,
  },
  phoneNumberInput: {
    marginTop: '0.5em',
  },
  emailLoginTextField: {
    marginTop: 14,
  },
  facebookOAuthButton: {
    backgroundColor: 'white',
    textTransform: 'none',
    color: '#3b5998',
    display: 'flex',
    justifyContent: 'left',
  },
  googleOAuthButton: {
    backgroundColor: 'white',
    textTransform: 'none',
    marginTop: '0.5em',
    display: 'flex',
    justifyContent: 'left',
  },
  socialLoginButtonIcons: {
    marginLeft: '0.5em',
    marginRight: '0.5em',
  },
  "[type='number']": {
    fontSize: 30,
  },
  logo: {
    height: 50,
  },
});
