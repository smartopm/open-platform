import React, { useState, useEffect } from 'react'
import {
  Button,
  TextField,
  CircularProgress,
  Select,
  Typography,
  Divider,
  FormControl,
  MenuItem,
  InputLabel,
  Grid
} from '@mui/material'
import { StyleSheet, css } from 'aphrodite'
import { useHistory, useLocation, Link } from 'react-router-dom'
import { useMutation, useQuery } from 'react-apollo'
import ReactGA from 'react-ga'
import { useTranslation } from 'react-i18next'
import FacebookIcon from '@mui/icons-material/Facebook'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmailIcon from '@mui/icons-material/Email';
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import PhoneInput from 'react-phone-input-2'
import { getAuthToken } from '../../utils/apollo'
import { ModalDialog } from '../Dialog'
import GoogleIcon from '../../../../assets/images/google_icon.svg'
import { loginPhoneMutation, loginEmailMutation } from '../../graphql/mutations'
import { CurrentCommunityQuery } from '../../modules/Community/graphql/community_query'
import { Spinner } from '../../shared/Loading'
import { extractCountry } from '../../utils/helpers'

export default function LoginScreen() {
  const { data: communityData, loading } = useQuery(CurrentCommunityQuery)
  const [loginPhoneStart] = useMutation(loginPhoneMutation)
  const [loginEmail] = useMutation(loginEmailMutation)
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [interest, setInterest] = useState('')
  const [impact, setImpact] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { state } = useLocation()
  const history = useHistory()
  const { t } = useTranslation(['login', 'common'])
  const [userLogin, setUserLogin] = useState({ email: '', phone: ''})
  const [emailLoginSent, setEmailLoginSet] = useState(false)

  const communityName = communityData?.currentCommunity?.name || 'Double GDP'
  const communitySupportEmail = (communityData?.currentCommunity?.supportEmail
                                                                  ?.find(({ category }) => category === 'customer_care')?.email)
                                                                  || 'support@doublegdp.com';

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
        'Other'
      ],
    }
  }

  function loginWithPhone() {
      setIsLoading(true)
      loginPhoneStart({
        variables: { phoneNumber: userLogin.phone.trim() }
      })
        .then(({ data }) => {
          setIsLoading(false)
          return data
        })
        .then(data => {
          history.push({
            pathname: `/code/${  data.loginPhoneStart.user.id}`,
            state: {
              phoneNumber: userLogin.phone,
              from: `${!state ? '/' : state.from.pathname}`
            }
          })
        })
        .catch(err => {
          setError(err.message.replace(/GraphQL error:/, ""))
          setIsLoading(false)
        })
  }

  function loginWithEmail(){
    setIsLoading(true)
      loginEmail({
        variables: { email: userLogin.email.trim() }
      })
        .then(() => {
          setIsLoading(false)
          setEmailLoginSet(true)
        })
        .catch(err => {
          setError(err.message.replace(/GraphQL error:/, ""))
          setIsLoading(false)
        })
  }

  useEffect(() => {
    // check if user is logged in
    const token = getAuthToken()
    if (token) {
      // return to home
      history.push(`${!state ? '/' : state.from.pathname}`)
    }
  })

  function handleModal() {
    setOpen(!open)
  }
  /* eslint-disable security/detect-non-literal-fs-filename */
  function handleClick() {
    // Google Analytics tracking
    ReactGA.event({
      category: 'LoginPage',
      action: 'TroubleLogging',
      eventLabel: 'Trouble Logging on Login Page',
      nonInteraction: true
    })
    window.open(
      `mailto:${communitySupportEmail}?subject=${communityName} App Login Request&body=Hi,
       I would like access to the ${communityName} app. Please provide me with my login credentials.
       Full Name: ${username}, Email: ${email}, Phone Number: ${phone}, Why are you interested in ${communityName}?: ${interest},
       How did you hear about ${communityName}?: ${impact}`,
      'emailWindow'
    )
    setOpen(!open)
  }

  function handleUserLogin(event, type = 'input'){
    // submit on both click and Enter Key pressed
    if (event.keyCode === 13 || type === 'btnClick') {
      if(userLogin.email) {
        // handle login with email
        loginWithEmail()
      }

      if(userLogin.phone) {
        // handle login with phone
        loginWithPhone()
      }
    }
  }

  return (
    <div style={{ overflow: 'hidden' }}>
      {
        communityName === 'Nkwashi' &&
        (
        <nav className={`${css(styles.navBar)} navbar`}>
          <Link to="/welcome" color='primary'>
            <i className="material-icons" style={{color: '#000000'}}>arrow_back</i>
          </Link>
        </nav>
)
      }
      <div className="container">
        <div
          className={`justify-content-center align-items-center ${css(
            styles.welcomeContainer
          )}`}
        >
          <h4 className={css(styles.welcomeText)}>
            { loading ? <Spinner /> : t('login.welcome', { appName: communityData?.currentCommunity?.name  })}
          </h4>
          <Typography color="textSecondary" variant="body2" data-testid="tagline" id="tagline">
            {communityData?.currentCommunity?.tagline}
          </Typography>

          <br />
          <br />
        </div>
        <Grid container className="justify-content-center">
          <Grid item xs={12} md={5}>
            <Typography color="textSecondary" variant="body2">{t('login.login_text')}</Typography>
            <div
              className={`${css(
                  styles.phoneNumberInput
                )}`}
            >
              <PhoneInput
                value={userLogin.phone}
                containerStyle={{ width: "100%" }}
                inputClass="phone-login-input"
                inputStyle={{ width: "100%", height: "3.5em" }}
                country={extractCountry(communityData?.currentCommunity?.locale)}
                enableSearch
                placeholder={t('common:form_placeholders.phone_number')}
                onChange={value => setUserLogin({phone: value, email: '' })}
                preferredCountries={['hn', 'ke', 'zm', 'cr', 'ng', 'in', 'us']}
              />
            </div>
          </Grid>
          <Grid item xs={12} md={1}>
            <div className={`${css(styles.verticalDivider)}`}>
              <Divider className={`${css(styles.verticalDividerLine)}`} />
              {' '}
              <p style={{ marginLeft: '40%', marginTop: '0.2em', marginBottom: '0.2em' }}>{t('common:misc:or')}</p>
              {' '}
              <Divider className={`${css(styles.verticalDividerLine)}`} />
            </div>
            <div className={`${css(styles.horizontalDivider)}`}>
              <Divider className={`${css(styles.horizontalDividerLine)}`} />
              {' '}
              <p style={{  marginTop: '4%', marginLeft: '0.2em', marginRight: '0.2em' }}>{t('common:misc:or')}</p>
              {' '}
              <Divider className={`${css(styles.horizontalDividerLine)}`} />
            </div>
          </Grid>
          <Grid item xs={12} md={3}>
            <div className={`${css(styles.socialLoginSection )}`}>
              <TextField
                value={userLogin.email}
                variant="outlined"
                fullWidth
                type="email"
                name="email_login"
                data-testid="email_text_input"
                className={`${css(styles.emailLoginTextField )}`}
                placeholder={t('login.login_email')}
                label={t('login.login_email')}
                onChange={event => setUserLogin({email: event.target.value, phone: '' })}
                InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <IconButton size="large">
                              <EmailIcon />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
              />
              <Button
                href="/fb_oauth"
                variant="outlined"
                startIcon={<FacebookIcon className={`${css(styles.socialLoginButtonIcons )}`} />}
                size="large"
                fullWidth
                className={`${css(styles.facebookOAuthButton )}`}
              >
                {t('login.login_facebook')}
              </Button>
              <Button
                href="/login_oauth"
                variant="outlined"
                startIcon={<img src={GoogleIcon} alt="google-icon" className={`${css(styles.socialLoginButtonIcons )}`} />}
                className={`${css(styles.googleOAuthButton )} google-sign-in-btn`}
                size="large"
                fullWidth
              >
                {t('login.login_google')}
              </Button>
            </div>
          </Grid>
        </Grid>
        {error && <p className=" text-center text-danger">{error}</p>}
        <div
          className={`row justify-content-center align-items-center ${css(
            styles.linksSection
          )}`}
        >
          <Button
            data-testid="login-btn"
            variant="contained"
            color="primary"
            style={((!userLogin.email && !userLogin.phone) || isLoading || emailLoginSent) ? {}: { backgroundColor: '#ff8000' }}
            endIcon={<ArrowForwardIcon />}
            className={`${css(styles.getStartedButton)} enz-lg-btn next-btn`}
            onClick={event => handleUserLogin(event, 'btnClick')}
            disabled={(!userLogin.email && !userLogin.phone) || isLoading || emailLoginSent}
          >
            {isLoading ? (
              <CircularProgress size={25} color="primary" />
            ) : (
              <span>{emailLoginSent ? t('login.email_otp_text') : t('login.login_button_text')}</span>
              )}
          </Button>
        </div>
        <br />
      </div>

      <div
        data-testid="trouble-logging-div"
        id="trouble-logging-div"
        className="row justify-content-center align-items-center"
      >
        <p style={{ marginTop: '1%' }}>
          <Button size="medium" id="trigger-modal-dialog" data-testid="trouble-logging-in-btn" onClick={handleModal} style={{ textTransform: 'none'}}>
            <u>
              <strong>{t('login.request_account')}</strong>
            </u>
          </Button>
        </p>
      </div>

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
        <div className="d-flex row justify-content-center align-items-center">
          <Divider
            style={{ width: '42%', height: 1, backgroundColor: 'grey' }}
          />
          {' '}
          <strong>
            <p style={{ margin: 10 }}>{t('common:misc:or')}</p>
          </strong>
          {' '}
          <Divider
            style={{ width: '42%', height: 1, backgroundColor: 'grey' }}
          />
        </div>

        <br />
        <h6>
          {t('login.request_login', { communityEmail: communitySupportEmail })}
        </h6>
        <br />
        <TextField
          variant="outlined"
          required
          fullWidth
          name="name"
          label={t('common:form_fields.full_name')}
          onChange={event => setUsername(event.target.value)}
        />

        <TextField
          variant="outlined"
          margin="normal"
          type="email"
          required
          fullWidth
          name="email"
          label={t('common:form_fields.email')}
          onChange={event => setEmail(event.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          type="number"
          required
          fullWidth
          name="number"
          label={t('common:form_fields.phone_number')}
          onChange={event => setPhone(event.target.value)}
        />
        <FormControl className={css(styles.formControl)}>
          <InputLabel id="demo-simple-select-outlined-label">
            {AppLoginRequestSurvey.interest.question}
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            data-testid="interest"
            value={interest}
            onChange={event => setInterest(event.target.value)}
            label="interest"
            required
          >
            {AppLoginRequestSurvey.interest.responses.map((value) => (
              <MenuItem value={value} key={value}>
                {value}
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
            value={impact}
            onChange={event => setImpact(event.target.value)}
            label="impact"
            required
          >
            {AppLoginRequestSurvey.impact.responses.map((value) => (
              <MenuItem value={value} key={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </ModalDialog>
    </div>
  );
}

const styles = StyleSheet.create({
  getStartedButton: {
    color: '#FFF',
    width: '55%',
    height: 51,
    boxShadow: 'none',
    marginTop: 30
  },
  linksSection: {
    marginTop: 20
  },
  navBar: {
    boxShadow: 'none',
    backgroundColor: '#fafafa'
  },
  welcomeText: {
    marginTop: 33,
    color: '#1f2026'
  },
  flag: {
    display: 'inline-block',
    marginTop: 7
  },
  countryCode: {
    display: 'inline-block',
    marginTop: -2,
    marginLeft: 6
  },
  welcomeContainer: {
    textAlign: 'center',
    color: 'white'
  },
  phoneNumberInput: {
    marginTop: '0.5em'
  },
  socialLoginSection: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: '1.6em',
    '@media (min-device-width: 320px) and (max-device-height: 568px)' : {
      marginTop: 0,
     } ,

     '@media (min-device-width: 414px) and (max-device-height: 736px)' : {
       marginTop: 0,
     },

     '@media (min-device-width: 375px) and (max-device-height: 667px) and (orientation: portrait)' : {
       marginTop: 0,
     },
     '@media  (min-device-width: 360px) and (max-device-height: 640px)' : {
       marginTop: 0,
     }
  },
  emailLoginTextField:{
    height: '4em',
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
    marginRight: '0.5em'
  },
  "[type='number']": {
    fontSize: 30
  },
  signUpBtns: {
    backgroundColor: 'white',
    textTransform: 'none',
    color: '#3b5998',
    marginLeft: 20,
    '@media (max-width: 520px)': {
      marginTop: 12,
      marginLeft: 0
    }
  },
  formControl: {
    minWidth: 120,
    width: '100%'
  },
  loginInput: {
    width: '55%',
    marginLeft: 100
  },
  verticalDivider: {
    height: '100%',
    '@media (min-device-width: 320px) and (max-device-height: 568px)' : {
      display: "none",
     } ,

     '@media (min-device-width: 414px) and (max-device-height: 736px)' : {
       display: "none",
     },

     '@media (min-device-width: 375px) and (max-device-height: 667px) and (orientation: portrait)' : {
       display: "none",
     },
     '@media  (min-device-width: 360px) and (max-device-height: 640px)' : {
       display: "none",
     }
  },
  horizontalDivider: {
    display: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    '@media (min-device-width: 320px) and (max-device-height: 568px)' : {
     display: "flex",
    } ,

    '@media (min-device-width: 414px) and (max-device-height: 736px)' : {
      display: "flex",
    },

    '@media (min-device-width: 375px) and (max-device-height: 667px) and (orientation: portrait)' : {
      display: "flex",
    },
    '@media  (min-device-width: 360px) and (max-device-height: 640px)' : {
      display: "flex",
    }
  },
  horizontalDividerLine: {
    width: '40%',
    height: '1px',
    backgroundColor: 'grey' ,
  },
  verticalDividerLine: {
    width: '1px',
    height: '40%',
    backgroundColor: 'grey',
    marginLeft: '50%'
  }
})
