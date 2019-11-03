import React from "react";
import { Container, Grid, Link, Button } from "@material-ui/core";
import { StyleSheet, css } from "aphrodite";
import logo from "../../../../assets/images/logo_nkwashi.svg";

export function WelcomeScreen() {
  return (
    <Container component="main" maxWidth="xs">
      <div
        className="row justify-content-center align-items-center"
        style={{
          marginTop: 91
        }}
      >
        <img src={logo} width="137px" height="40px" />
        <h3
          style={{
            marginTop: 33
          }}
        >
          Welcome to Nkwashi App
        </h3>
        <br />
        <br />
        <br />
        <p
          style={{
            marginTop: 18
          }}
        >
          First smart city in Zambia
        </p>
        <Button
          variant="contained"
          className={`btn ${css(styles.getStartedButton)}`}
        >
          Get Started
        </Button>
        <Link href="#" className={css(styles.googleLink)} variant="body2">
          Or Login with Google instead
        </Link>
      </div>
    </Container>
  );
}

const styles = StyleSheet.create({
  getStartedButton: {
    backgroundColor: "#53d6a5",
    color: "#FFF",
    margin: 60,
    width: "75%",
    boxShadow: "none"
  },
  googleLink: {
    margin: 40
  }
});
