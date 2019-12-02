import React, { useState } from "react";
import {
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Select
} from "@material-ui/core";
import { StyleSheet, css } from "aphrodite";
import { Link } from "react-router-dom";
import { useMutation } from "react-apollo";
import { loginPhone } from "../../graphql/mutations";

export function LoginScreen({ history }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loginPhoneStart] = useMutation(loginPhone);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState(260)

  function loginWithPhone() {
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
  return (
    <div style={{ height: "100vh" }}>
      <nav className={`${css(styles.navBar)} navbar`}>
        <Link to={"/welcome"}>
          <i className={`material-icons`}>arrow_back</i>
        </Link>
      </nav>
      <div className="container">
        <div
          className={`row justify-content-center align-items-center ${css(
            styles.welcomeContainer
          )}`}
        >
          <p className={css(styles.welcomeText)}>Welcome to Nkwashi App</p>
        </div>
        <div
          className={`${css(
            styles.phoneNumberInput
          )} row justify-content-center align-items-center`}
        >
          <TextField
            id="phone"
            placeholder="Enter Phone Number"
            type="number"
            maxLength={10}
            autoFocus
            style={{
              width: "65%",
            }}
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Select
                    native
                    value={countryCode}
                    style={{
                      width: 85,
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

        <div
          className={`row justify-content-center align-items-center ${css(
            styles.linksSection
          )}`}
        >
          <Button
            variant="contained"
            className={`btn ${css(styles.getStartedButton)}`}
            onClick={loginWithPhone}
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
        <div className="row justify-content-center align-items-center">
          {error && (
            <p
              className=" text-center text-danger"
              style={{
                margin: 40
              }}
            >
              {error}
            </p>
          )}
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
    marginTop: 100
  },
  linksSection: {
    marginTop: 40
  },
  navBar: {
    boxShadow: "none",
    backgroundColor: "#fafafa"
  },
  welcomeText: {
    marginTop: 33,
    color: "#1f2026",
    fontSize: 18
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
    marginTop: 50,
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
