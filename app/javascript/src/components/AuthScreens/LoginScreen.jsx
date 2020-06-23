import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Select,
  Typography
} from "@material-ui/core";
import { StyleSheet, css } from "aphrodite";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useMutation } from "react-apollo";
import { loginPhone } from "../../graphql/mutations";
import { getAuthToken } from "../../utils/apollo";
import { ModalDialog } from "../Dialog";
import { areaCode } from '../../utils/constants'
import ReactGA from 'react-ga'


export function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loginPhoneStart] = useMutation(loginPhone);
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [value, setValue] = useState('')
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState(260);
  const history = useHistory()
  const { state } = useLocation()

  function loginWithPhone(event, type = "input") {
    // submit on both click and Enter Key pressed
    if (event.keyCode === 13 || type === "btnClick") {
      setIsLoading(true);
      loginPhoneStart({
        variables: { phoneNumber: `${countryCode}${phoneNumber}` }
      })
        .then(({ data }) => {
          setIsLoading(false);
          return data;
        })
        .then(data => {
          history.push({
            pathname: "/code/" + data.loginPhoneStart.user.id,
            state: {
              phoneNumber: `${countryCode}${phoneNumber}`,
              from: `${!state ? '/' : state.from.pathname}`
            }
          });
        })
        .catch(error => {
          setError(error.message);
          setIsLoading(false);
        });
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
    window.open(`mailto:support@doublegdp.com?subject=Nkwashi App Login Request&body=Hi, I would like access to the Nkwashi app. Please provide me with my login credentials. Full Name: ${username}, Phone Number or Email: ${value}`, 'emailWindow')
    setOpen(!open);

    //Google Analytics tracking 
    ReactGA.event({
      category: 'LoginPage',
      action: 'TroubleLogging',
      eventLabel: "Trouble Logging on Login Page",
      nonInteraction: true
    });
  }


  return (
    <div style={{ height: "100vh" }} className="login-page">
      <nav className={`${css(styles.navBar)} navbar`}>
        <Link to={"/welcome"}>
          <i className={`material-icons`}>arrow_back</i>
        </Link>
      </nav>
      <div className="container ">
        <div
          className={`row justify-content-center align-items-center ${css(
            styles.welcomeContainer
          )}`}
        >
          <h4 className={css(styles.welcomeText)}>Welcome to Nkwashi App</h4>
          <Typography color="textSecondary" variant="body2">
            Hello! This is your all inclusive stop for Nkwashi news, payments, client requests, gate access, and support.
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
          <TextField
            id="phone"
            placeholder="Enter Phone Number"
            type="tel"
            maxLength={10}
            autoFocus
            style={{
              width: "65%"
            }}
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            onKeyDown={loginWithPhone}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Select
                    native
                    value={countryCode}
                    style={{
                      width: 85
                    }}
                    onChange={e => setCountryCode(e.target.value)}
                  >
                    {Object.entries(areaCode).map(([key, val]) => (
                      <option key={key} value={key}>{val}</option>
                    ))}
                  </Select>
                </InputAdornment>
              )
            }}
          />
        </div>
        <br />
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
            onClick={event => loginWithPhone(event, "btnClick")}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={25} color="inherit" />
            ) : (
                <span>Next</span>
              )}
          </Button>
        </div>

        <div className="row justify-content-center align-items-center">
          <a className={css(styles.googleLink)} href={"/login_oauth"}>
            Or Login with Google instead
          </a>
        </div>
      </div>

      <div data-testid="trouble-logging-div" className="row justify-content-center align-items-center">
        <p onClick={handleModal} style={{ marginTop: '1%' }}><u><strong>Trouble logging in?</strong></u></p>
      </div>

      <ModalDialog
        open={open}
        handleClose={handleModal}
        handleConfirm={handleClick}
        action='Send Email'
      >
        <h6>
          To request your login information, email: <a>support@doublegdp.com</a>
        </h6>
        <br />
        <input
          className="form-control"
          type="text"
          onChange={event => setUsername(event.target.value)}
          name="name"
          placeholder="Enter Full name here"
        />
        <input
          className="form-control"
          type="text"
          onChange={event => setValue(event.target.value)}
          name="email-number"
          placeholder="Enter Email/Phone number"
        />

      </ModalDialog>

    </div>
  );
}

const styles = StyleSheet.create({
  getStartedButton: {
    backgroundColor: "#25c0b0",
    color: "#FFF",
    width: "55%",
    height: 51,
    boxShadow: "none",
    marginTop: 50
  },
  linksSection: {
    marginTop: 20
  },
  navBar: {
    boxShadow: "none",
    backgroundColor: "#fafafa"
  },
  welcomeText: {
    marginTop: 33,
    color: "#1f2026"
    // fontSize: "1.3em",
  },
  flag: {
    display: "inline-block",
    marginTop: 7
  },
  countryCode: {
    display: "inline-block",
    marginTop: -2,
    marginLeft: 6
  },
  welcomeContainer: {
    position: "relative",
    textAlign: "center",
    color: "white"
  },
  phoneNumberInput: {
    marginTop: 30
  },
  googleLink: {
    margin: 40,
    marginBottom: 47,
    textDecoration: "none"
  },
  "[type='number']": {
    fontSize: 30
  }
});
