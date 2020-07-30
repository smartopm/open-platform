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
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { useMutation } from 'react-apollo'
import { loginPhone } from '../../graphql/mutations'
import { getAuthToken } from '../../utils/apollo'
import { ModalDialog } from '../Dialog'
import ReactGA from 'react-ga'
import GoogleIcon from '../../../../assets/images/google_icon.svg'
import FacebookIcon from '@material-ui/icons/Facebook'
import { Context as ThemeContext } from '../../../Themes/Nkwashi/ThemeProvider'

export function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loginPhoneStart] = useMutation(loginPhone)
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [value, setValue] = useState('')
  const [Interest, setInterest] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { state } = useLocation()
  const history = useHistory()
  const theme = useContext(ThemeContext)

  function loginWithPhone(event, type = 'input') {
    // submit on both click and Enter Key pressed
    if (event.keyCode === 13 || type === 'btnClick') {
      setIsLoading(true)
      loginPhoneStart({
        variables: { phoneNumber: `${phoneNumber}` }
      })
        .then(({ data }) => {
          setIsLoading(false)
          return data
        })
        .then(data => {
          history.push({
            pathname: '/code/' + data.loginPhoneStart.user.id,
            state: {
              phoneNumber: `${phoneNumber}`,
              from: `${!state ? '/' : state.from.pathname}`
            }
          })
        })
        .catch(error => {
          setError(error.message)
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
  function handleClick() {
    //Google Analytics tracking
    ReactGA.event({
      category: 'LoginPage',
      action: 'TroubleLogging',
      eventLabel: 'Trouble Logging on Login Page',
      nonInteraction: true
    })
    window.open(
      `mailto:support@doublegdp.com?subject=Nkwashi App Login Request&body=Hi,
       I would like access to the Nkwashi app. Please provide me with my login credentials. 
       Full Name: ${username}, Email: ${value}, Phone Number: ${phone}, Why are you interested in Nkwashi?: ${Interest}`,
      'emailWindow'
    )
    setOpen(!open)
  }

  console.log(phoneNumber)
  return (
    <div style={{ overflow: 'hidden' }}>
      <nav className={`${css(styles.navBar)} navbar`}>
        <Link to={'/welcome'} style={{ color: theme.primaryColor }}>
          <i className={`material-icons`}>arrow_back</i>
        </Link>
      </nav>
      <div className="container ">
        <div
          className={`justify-content-center align-items-center ${css(
            styles.welcomeContainer
          )}`}
        >
          <h4 className={css(styles.welcomeText)}>Welcome to Nkwashi App</h4>
          <Typography color="textSecondary" variant="body2">
            Hello! This is your all inclusive stop for Nkwashi news, payments,
            client requests, gate access, and support.
          </Typography>

          <br />
          <br />
          <Typography color="textSecondary" variant="body2">
            Please log in with your phone number here:
          </Typography>
        </div>
        <div
          className={`${css(
            styles.phoneNumberInput
          )} row justify-content-center align-items-center`}
        >
          <div className={css(styles.phone)}>
            <PhoneInput
              country={'zm'}
              value={phoneNumber}
              enableSearch={true}
              placeholder={'260 900 000000'}
              onChange={phone => setPhoneNumber(phone)}
            />
          </div>
        </div>
        <br />
        {error && <p className=" text-center text-danger">{error}</p>}
        <div
          className={`row justify-content-center align-items-center ${css(
            styles.linksSection
          )}`}
        >
          <Button
            variant="contained"
            className={`btn ${css(styles.getStartedButton)} enz-lg-btn`}
            style={{ backgroundColor: theme.primaryColor }}
            onClick={event => loginWithPhone(event, 'btnClick')}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={25} color="inherit" />
            ) : (
              <span>Next</span>
            )}
          </Button>
        </div>

        <br />
        <div className="d-flex row justify-content-center align-items-center">
          <Divider
            style={{ width: '24%', height: 1, backgroundColor: 'grey' }}
          />{' '}
          <p style={{ margin: 10 }}>OR</p>{' '}
          <Divider
            style={{ width: '24%', height: 1, backgroundColor: 'grey' }}
          />
        </div>

        <div className="container">
          <div className="d-flex row justify-content-center ">
            <Button
              href={'/login_oauth'}
              style={{
                backgroundColor: 'white',
                textTransform: 'none'
              }}
              variant="contained"
              startIcon={<img src={GoogleIcon} alt={'google-icon'} />}
            >
              Sign In with Google
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
              Sign In with Facebook
            </Button>
          </div>
          <br />
        </div>
      </div>

      <div
        data-testid="trouble-logging-div"
        className="row justify-content-center align-items-center"
      >
        <p onClick={handleModal} style={{ marginTop: '1%' }}>
          <u>
            <strong>Dont have an Account?</strong>
          </u>
        </p>
      </div>

      <ModalDialog
        open={open}
        handleClose={handleModal}
        handleConfirm={handleClick}
        action="Send Email"
      >
        <div className="container">
          <div className="d-flex row justify-content-center ">
            <Button
              href={'/login_oauth'}
              style={{ backgroundColor: 'white', textTransform: 'none' }}
              variant="contained"
              startIcon={<img src={GoogleIcon} alt={'google-icon'} />}
            >
              Sign Up with Google
            </Button>
            <Button
              href="/fb_oauth"
              variant="contained"
              startIcon={<FacebookIcon />}
              className={css(styles.signUpBtns)}
            >
              Sign Up with Facebook
            </Button>
          </div>
        </div>
        <div className="d-flex row justify-content-center align-items-center">
          <Divider
            style={{ width: '42%', height: 1, backgroundColor: 'grey' }}
          />{' '}
          <strong>
            <p style={{ margin: 10 }}>OR</p>
          </strong>{' '}
          <Divider
            style={{ width: '42%', height: 1, backgroundColor: 'grey' }}
          />
        </div>

        <br />
        <h6>
          To request your login information, email: <a>support@doublegdp.com</a>
        </h6>
        <br />
        <TextField
          variant="outlined"
          required
          fullWidth
          name="name"
          label="Full name"
          onChange={event => setUsername(event.target.value)}
        />

        <TextField
          variant="outlined"
          margin="normal"
          type="email"
          required
          fullWidth
          name="email"
          label="Email"
          onChange={event => setValue(event.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          type="number"
          required
          fullWidth
          name="number"
          label="Phone number"
          onChange={event => setPhone(event.target.value)}
        />
        <FormControl className={css(styles.formControl)}>
          <InputLabel id="demo-simple-select-outlined-label">
            Why are you interested in Nkwashi?
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={Interest}
            onChange={event => setInterest(event.target.value)}
            label="interest"
          >
            <MenuItem value={'I own property at Nkwashi'}>
              I own property at Nkwashi.
            </MenuItem>
            <MenuItem value={'I want to own property at Nkwashi'}>
              I want to own property at Nkwashi
            </MenuItem>
            <MenuItem value={'I want to learn more about Nkwashi.'}>
              I want to learn more about Nkwashi.
            </MenuItem>
          </Select>
        </FormControl>
      </ModalDialog>
    </div>
  )
}

const styles = StyleSheet.create({
  getStartedButton: {
    color: '#FFF',
    width: '35%',
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
    // fontSize: "1.3em",
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
  phone: {
    paddingLeft: 50
  }
})
