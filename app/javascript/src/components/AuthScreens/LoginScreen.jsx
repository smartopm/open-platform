import React, { useState } from "react";
import {
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Typography
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

  function loginWithPhone() {
    setIsLoading(true);
    loginPhoneStart({
      variables: { phoneNumber: `260${phoneNumber}` }
    })
      .then(({ data }) => {
        setIsLoading(false);
        return data;
      })
      .then(data => {
        history.push("/code", { id: data.loginPhoneStart.user.id });
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
          id="input-with-icon-textfield"
          placeholder="Enter Phone Number"
          type="number"
          maxLength={10}
          autoFocus
          value={phoneNumber}
          onChange={e => setPhoneNumber(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <h3 className={css(styles.flag)}>🇿🇲 </h3>
                <span className={css(styles.countryCode)}>+260</span>
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
            <CircularProgress size={25} color="inherit" />           ) : (
            <span>Next</span>
          )}
        </Button>
        <br />
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

        <a className={css(styles.googleLink)} href={"/login_oauth"}>
          Or Login with Google instead
        </a>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  getStartedButton: {
    backgroundColor: "#25c0b0",
    color: "#FFF",
    width: "75%",
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
    marginTop: 50
  },
  googleLink: {
    margin: 40,
    marginBottom: 47,
    textDecoration: "none"
  }
});
