import React from "react";
import {
  Container,
  Button,
  TextField,
  InputAdornment
} from "@material-ui/core";
import { StyleSheet, css } from "aphrodite";

export function LoginScreen() {
  return (
    <Container component="div" maxWidth="xs" style={{ height: "100vh" }}>
      <div
        className={`row justify-content-center align-items-center ${css(
          styles.welcomeContainer
        )}`}
      >
        <p className={css(styles.welcomeText)}>Welcome to Nkwashi App</p>
      </div>
      <div className="row justify-content-center align-items-center">
        <TextField
          id="input-with-icon-textfield"
          placeholder="Enter Phone Number"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <h3
                  style={{
                    display: "inline-block",
                    marginTop: 7
                  }}
                >
                  🇿🇲{" "}
                </h3>
                <span
                  style={{
                    display: "inline-block",
                    marginTop: -2,
                    marginLeft: 6
                  }}
                >
                  +260
                </span>
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
        >
          Next
        </Button>
      </div>
    </Container>
  );
}

const styles = StyleSheet.create({
  getStartedButton: {
    backgroundColor: "#53d6a5",
    color: "#FFF",
    width: "75%",
    boxShadow: "none"
  },
  bgImage: {
    width: "100%"
  },
  googleLink: {
    margin: 40,
    marginBottom: 47
  },
  linksSection: {
    marginTop: 40
  },
  overlaySection: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  },
  welcomeText: {
    marginTop: 33,
    color: "#1f2026",
    fontSize: 18
  },
  subText: {
    color: "#818188"
  },
  welcomeContainer: {
    position: "relative",
    textAlign: "center",
    color: "white"
  }
});
