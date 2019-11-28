import React, { useState, useContext, useRef, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Button, TextField, CircularProgress } from "@material-ui/core";
import { StyleSheet, css } from "aphrodite";
import { Link } from "react-router-dom";
import { useMutation } from "react-apollo";
import { loginPhoneConfirmCode } from "../../graphql/mutations";
import { Context as AuthStateContext } from "../../containers/Provider/AuthStateProvider";

export default function ConfirmCodeScreen({ match }) {
  const authState = useContext(AuthStateContext);
  const { id } = match.params;
  const [code, setCode] = useState("");
  const [loginPhoneComplete] = useMutation(loginPhoneConfirmCode);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputEl1 = useRef()
  const inputEl2 = useRef()
  const inputEl3 = useRef()
  const inputEl4 = useRef()
  const inputEl5 = useRef()
  const inputEl6 = useRef()

  function handleConfirmCode() {
    setIsLoading(true);
    loginPhoneComplete({
      variables: { id, token: code }
    })
      .then(({ data }) => {
        authState.setToken({ type: 'update', token: data.loginPhoneComplete.authToken })
      })
      .catch(error => {
        setError(error.message);
        setIsLoading(false);
      });
  }

  // Redirect once our authState.setToken does it's job
  if (authState.loggedIn) {
    return <Redirect to='/' />
  }


  return (
    <div style={{ height: "100vh" }}>
      <nav className={`${css(styles.navBar)} navbar`}>
        <Link to={"/login"}>
          <i className={`material-icons`}>arrow_back</i>
        </Link>
      </nav>
      <div className="container ">
        <div
          className={`row justify-content-center align-items-center ${css(
            styles.welcomeContainer
          )}`}
        >
          <p className={css(styles.welcomeText)}>Welcome to Nkwashi App</p>
        </div>
        <br />
        <br />
        <div className="row justify-content-center align-items-center">
          <input
            name="val"
            maxLength="1"
            type="tel"
            autoFocus
            ref={inputEl1}
            className={css(styles.newInput)}
            onChange={() => inputEl2.current.focus()}

          />
          <input
            name="val2"
            maxLength="1"
            type="tel"
            ref={inputEl2}
            className={css(styles.newInput)}
            onChange={() => inputEl3.current.focus()}

          />
          <input
            name="val"
            maxLength="1"
            type="tel"
            ref={inputEl3}
            className={css(styles.newInput)}
            onChange={() => inputEl4.current.focus()}
          />
          <input
            name="val"
            maxLength="1"
            type="tel"
            ref={inputEl4}
            className={css(styles.newInput)}
            onChange={() => inputEl5.current.focus()}
          />
          <input
            name="val"
            maxLength="1"
            type="tel"
            ref={inputEl5}
            className={css(styles.newInput)}
            onChange={() => inputEl6.current.focus()}

          />
          <input
            name="val"
            maxLength="1"
            type="tel"
            ref={inputEl6}
            className={css(styles.newInput)}
          />
        </div>
        <div className="row">
          <br />
          {error && (
            <p
              className="text-center text-danger"
              style={{
                margin: 40
              }}
            >
              {error}
            </p>
          )}
        </div>
        <div
          className={`row justify-content-center align-items-center ${css(
            styles.linksSection
          )}`}
        >
          <Button
            variant="contained"
            className={`btn ${css(styles.getStartedButton)}`}
            onClick={handleConfirmCode}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={25} color="inherit" />
            ) : (
                <span>Verify</span>
              )}
          </Button>
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
    boxShadow: "none",
    marginTop: 80
  },
  getStartedLink: {
    textDecoration: "none",
    color: "#FFFFFF"
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
  phoneCodeInput: {
    marginTop: 50
  },
  newInput: {
    width: 50,
    height: 60,
    fontSize: 20,
    textAlign: "center",
    border: '2px solid #1C6EA4',
    borderRadius: 5,
    borderTop: "none",
    borderRight: "none",
    borderLeft: "none",
    // padding: 20,
    margin: 9,
    paddingRight: 10,
  }
});
