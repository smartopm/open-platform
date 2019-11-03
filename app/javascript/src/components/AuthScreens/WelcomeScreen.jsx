import React from "react";
import { Container, Grid, Link, Button } from "@material-ui/core";
import { StyleSheet, css } from "aphrodite";
import logo from "../../../../assets/images/nkwashi_white_logo_transparent.png";

export function WelcomeScreen() {
  return (
    <Container component="main" maxWidth="xs">
      <div className="row justify-content-center align-items-center">
        <img src={logo} width="240px" height="120px" />

        <h3>Welcome to Nkwashi App</h3>
        <br />
        <br />
        <p>First smart city in Zambia</p>

        <Button
          variant="contained"
          className={`btn ${css(styles.grantButton)}`}
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
  grantButton: {
    backgroundColor: "rgb(61, 199, 113)",
    color: "#FFF",
    margin: 60,
    width: "75%"
  },
  googleLink: {
    margin: 40
  }
});
