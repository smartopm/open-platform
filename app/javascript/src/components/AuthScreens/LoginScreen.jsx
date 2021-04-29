import React, { useState, useEffect, useContext } from 'react'
import {
  Button,
  TextField,
  CircularProgress,
  Select,
  Typography,
  Divider,
  FormControl,
  MenuItem,
  InputLabel
} from '@material-ui/core'
import { StyleSheet, css } from 'aphrodite'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { useMutation, useQuery } from 'react-apollo'
import ReactGA from 'react-ga'
import { useTranslation } from 'react-i18next'
import FacebookIcon from '@material-ui/icons/Facebook'
import PhoneInput from 'react-phone-input-2'
import { getAuthToken } from '../../utils/apollo'
import { ModalDialog } from '../Dialog'
import GoogleIcon from '../../../../assets/images/google_icon.svg'
import { Context as ThemeContext } from '../../../Themes/Nkwashi/ThemeProvider'
import { loginPhone } from '../../graphql/mutations'
import { CurrentCommunityQuery } from '../../modules/Community/graphql/community_query'
import { Spinner } from '../../shared/Loading'

export default function LoginScreen() {
  const { data: communityData, loading } = useQuery(CurrentCommunityQuery)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loginPhoneStart] = useMutation(loginPhone)
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
  const theme = useContext(ThemeContext)
  const { t } = useTranslation(['login', 'common'])

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

  function loginWithPhone(event, type = 'input') {

    // submit on both click and Enter Key pressed
    if (event.keyCode === 13 || type === 'btnClick') {
      setIsLoading(true)
      loginPhoneStart({
        variables: { phoneNumber: phoneNumber.trim() }
      })
        .then(({ data }) => {
          setIsLoading(false)
          return data
        })
        .then(data => {
          history.push({
            pathname: `/code/${  data.loginPhoneStart.user.id}`,
            state: {
              phoneNumber,
              from: `${!state ? '/' : state.from.pathname}`
            }
          })
        })
        .catch(err => {
          setError(err.message)
          setIsLoading(false)
        })
    }
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

  return (
    <div style={{ overflow: 'hidden' }}>
      <nav className={`${css(styles.navBar)} navbar`}>
        <Link to="/welcome" style={{ color: theme.primaryColor }}>
          <i className="material-icons">arrow_back</i>
        </Link>
      </nav>
      <div className="container ">
        <div
          className={`justify-content-center align-items-center ${css(
            styles.welcomeContainer
          )}`}
        >
          <h4 className={css(styles.welcomeText)}>
            { loading ? <Spinner /> : t('login.welcome', { appName: communityData?.currentCommunity?.name  })}
          </h4>
          <Typography color="textSecondary" variant="body2" data-testid="tagline">
            {communityData?.currentCommunity?.tagline}
          </Typography>

          <br />
          <br />
          <Typography color="textSecondary" variant="body2">
            {t('login.login_text')}
            :
          </Typography>
        </div>
        <div
          className={`${css(
            styles.phoneNumberInput
          )} row justify-content-center align-items-center`}
        >

          <PhoneInput
            value={phoneNumber}
            containerClass="a css class"
            containerStyle={{ width: "55%" }}
            inputClass="phone-login-input"
            inputStyle={{ width: "100%", height: 51 }}
            country="zm"
            enableSearch
            placeholder={t('common:form_placeholders.phone_number')}
            onChange={value => setPhoneNumber(value)}
          />
        </div>

        {error && <p className=" text-center text-danger">{error}</p>}
        <div
          className={`row justify-content-center align-items-center ${css(
            styles.linksSection
          )}`}
        >
          <Button
            variant="contained"
            color="primary"
            className={`btn ${css(styles.getStartedButton)} enz-lg-btn next-btn`}
            onClick={event => loginWithPhone(event, 'btnClick')}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={25} color="inherit" />
            ) : (
              <span>{t('login.login_button_text')}</span>
              )}
          </Button>
        </div>

        <br />
        <div className="d-flex row justify-content-center align-items-center">
          <Divider
            style={{ width: '24%', height: 1, backgroundColor: 'grey' }}
          />
          {' '}
          <p style={{ margin: 10 }}>{t('common:misc:or')}</p>
          {' '}
          <Divider
            style={{ width: '24%', height: 1, backgroundColor: 'grey' }}
          />
        </div>

        <div className="container">
          <div className="d-flex row justify-content-center ">
            <Button
              href="/login_oauth"
              style={{
                backgroundColor: 'white',
                textTransform: 'none'
              }}
              variant="contained"
              startIcon={<img src={GoogleIcon} alt="google-icon" />}
              className="google-sign-in-btn"
            >
              {t('login.login_google')}
            </Button>
          </div>
          <br />
          <br />
          <div className="d-flex row justify-content-center ">
            <Button
              href="/fb_oauth"
              variant="contained"
              startIcon={<FacebookIcon />}
              style={{
                backgroundColor: 'white',
                textTransform: 'none',
                color: '#3b5998'
              }}
            >
              {t('login.login_facebook')}
            </Button>
          </div>
          <br />
        </div>
      </div>

      <div
        data-testid="trouble-logging-div"
        id="trouble-logging-div"
        className="row justify-content-center align-items-center"
      >
        <p style={{ marginTop: '1%' }}>
          <Button size="medium" id="trigger-modal-dialog" onClick={handleModal} style={{ textTransform: 'none'}}>
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
  )
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
    marginTop: 30
  },
  googleLink: {
    margin: 40,
    marginBottom: 47,
    textDecoration: 'none'
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
  }
})
