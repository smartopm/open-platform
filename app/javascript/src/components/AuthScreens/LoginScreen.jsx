import React, { useState, useEffect } from 'react';
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
import { useHistory, useLocation, Link } from 'react-router-dom';
import { useQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import FacebookIcon from '@mui/icons-material/Facebook';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmailIcon from '@mui/icons-material/Email';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import PhoneInput from 'react-phone-input-2';
import { getAuthToken } from '../../utils/apollo';
import GoogleIcon from '../../../../assets/images/google_icon.svg';
import {
  loginPhoneMutation,
  loginEmailMutation,
  loginUsernamePasswordMutation,
} from '../../graphql/mutations';
import { CurrentCommunityQuery } from '../../modules/Community/graphql/community_query';
import { Spinner } from '../../shared/Loading';
import { extractCountry } from '../../utils/helpers';
import CenteredContent from '../../shared/CenteredContent';
import SignupDialog from './SignupDialog';
import PasswordInput from '../../shared/PasswordInput';
import useMutationWrapper from '../../shared/hooks/useMutationWrapper';

export default function LoginScreen() {
  const { data: communityData, loading } = useQuery(CurrentCommunityQuery);
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

  const communityName = communityData?.currentCommunity?.name || 'DoubleGDP';
  const [loginWithUsernamePassword, passwordLoginLoading] = useMutationWrapper(
    loginUsernamePasswordMutation,
    (data) => console.log(data),
  )
  const [loginWithEmail, emailLoginLoading] = useMutationWrapper(
    loginEmailMutation,
    () => setEmailLoginSet(true),
  )
  const [loginWithPhone, phoneLoginLoading] = useMutationWrapper(
    loginPhoneMutation,
    routeToConfirmCode
  )

  function routeToConfirmCode(data) {
    history.push({
      pathname: `/code/${data.loginPhoneStart.user.id}`,
      state: {
        phoneNumber: userLogin.phone,
        from: `${!state ? '/' : state.from.pathname}`,
      },
    })
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
    return false
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
        currentCommunity={communityData?.currentCommunity}
      />

      {communityName === 'Nkwashi' && (
        <nav className={`${css(styles.navBar)} navbar`}>
          <Link to="/welcome" color="primary">
            <i className="material-icons" style={{ color: '#000000' }}>
              arrow_back
            </i>
          </Link>
        </nav>
      )}

      <Container maxWidth="sm">
        <Typography align="center">
          {loading ? (
            <Spinner />
          ) : (
            t('login.welcome', { appName: communityData?.currentCommunity?.name })
          )}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
          data-testid="tagline"
          id="tagline"
          align="center"
        >
          {communityData?.currentCommunity?.tagline}
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
                inputStyle={{ width: '100%', height: '4em' }}
                country={extractCountry(communityData?.currentCommunity?.locale)}
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
              name="username"
              label={t('common:form_fields.username')}
              value={values.username}
              onChange={event => setValues({ username: event.target.value })}
              style={{ marginBottom: 14 }}
              variant="outlined"
              margin="dense"
              fullWidth
            />
            <PasswordInput
              label={t('common:form_fields.password')}
              type="password"
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
              href="/fb_oauth"
              variant="outlined"
              startIcon={<FacebookIcon className={`${css(styles.socialLoginButtonIcons)}`} />}
              size="large"
              fullWidth
              className={`${css(styles.facebookOAuthButton)}`}
            >
              {t('login.login_facebook')}
            </Button>
            <Button
              href="/login_oauth"
              variant="outlined"
              startIcon={(
                <img
                  src={GoogleIcon}
                  alt="google-icon"
                  className={`${css(styles.socialLoginButtonIcons)}`}
                />
              )}
              className={`${css(styles.googleOAuthButton)} google-sign-in-btn`}
              size="large"
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton size="large">
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
                {emailLoginSent ? t('login.email_otp_text') : t('login.login_button_text')}
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

const styles = StyleSheet.create({
  getStartedButton: {
    color: '#FFF',
    width: '55%',
    height: 51,
    boxShadow: 'none',
    marginTop: 30,
  },
  linksSection: {
    marginTop: 20,
  },
  navBar: {
    boxShadow: 'none',
    backgroundColor: '#fafafa',
  },
  welcomeText: {
    marginTop: 33,
    color: '#1f2026',
  },
  flag: {
    display: 'inline-block',
    marginTop: 7,
  },
  countryCode: {
    display: 'inline-block',
    marginTop: -2,
    marginLeft: 6,
  },
  welcomeContainer: {
    textAlign: 'center',
    color: 'white',
  },
  phoneNumberInput: {
    marginTop: '0.5em',
  },
  emailLoginTextField: {
    height: '4em',
    marginTop: 14,
  },
  facebookOAuthButton: {
    backgroundColor: 'white',
    textTransform: 'none',
    color: '#3b5998',
    height: '4em',
    display: 'flex',
    justifyContent: 'left',
  },
  googleOAuthButton: {
    backgroundColor: 'white',
    textTransform: 'none',
    marginTop: '0.5em',
    height: '4em',
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
});
