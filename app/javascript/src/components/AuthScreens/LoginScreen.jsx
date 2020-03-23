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
import { Link } from "react-router-dom";
import { useMutation } from "react-apollo";
import { loginPhone } from "../../graphql/mutations";
import { getAuthToken } from "../../utils/apollo";


export function LoginScreen({ history }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loginPhoneStart] = useMutation(loginPhone);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState(260);

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
          history.push("/code/" + data.loginPhoneStart.user.id);
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
      history.push('/')
    }
  })


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
          The Nkwashi app, powered by DoubleGDP, provides clients and visitors with fast, easy, and secure access to the site through a digital ID / QR Code.
          </Typography>

          <br />
          <br />
          <Typography color="textSecondary" variant="body1">
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
                    <option value={260}>🇿🇲 +260</option>
                    <option value={1}>🇺🇸 +1</option>
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
