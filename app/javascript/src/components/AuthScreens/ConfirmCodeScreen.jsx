import React, { useState } from "react";
import { Button, TextField } from "@material-ui/core";
import { StyleSheet, css } from "aphrodite";
import { Link } from "react-router-dom";
import { useMutation } from "react-apollo";
import { loginPhoneConfirmCode } from "../../graphql/mutations";
import { AUTH_TOKEN_KEY } from "../../utils/apollo";

export default function ConfirmCodeScreen({ location }) {
  const { id } = location.state;
  const [code, setCode] = useState("");
  const [loginPhoneComplete] = useMutation(loginPhoneConfirmCode);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleConfirmCode() {
    setIsLoading(true);
    loginPhoneComplete({
      variables: { id, token: code }
    })
      .then(({ data }) => {
        localStorage.setItem(AUTH_TOKEN_KEY, data.loginPhoneComplete.authToken);
        setIsLoading(false);
        // do a reload for home to read user info
        window.location.href = "/";
      })
      .catch(error => {
        setError(error.message);
        setIsLoading(false);
      });
  }

  return (
    <div style={{ height: "100vh" }}>
      <nav className={`${css(styles.navBar)} navbar`}>
        <Link to={"/login"}>
          <i className={`material-icons`}>arrow_back</i>
        </Link>
      </nav>
      <div
        className={`row justify-content-center align-items-center ${css(
          styles.welcomeContainer
        )}`}
      >
        <p className={css(styles.welcomeText)}>Welcome to Nkwashi App</p>

        <div className="container ">
          <div className={css(styles.phoneCodeInput)}>
            <TextField
              id="outlined-basic"
              margin="normal"
              variant="outlined"
              autoFocus
              type="number"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Confirmation code"
            />
          </div>
        </div>
      </div>
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
          {isLoading ? "Verifying ..." : "Next"}
        </Button>
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
  }
});
