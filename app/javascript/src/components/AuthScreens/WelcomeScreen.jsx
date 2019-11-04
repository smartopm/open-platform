import React from "react";
import { Container, Link, Button } from "@material-ui/core";
import { StyleSheet, css } from "aphrodite";
import logo from "../../../../assets/images/logo_nkwashi.svg";
import bgImage from "../../../../assets/images/nkwashi_bgi.jpg";

export function WelcomeScreen() {
  return (
    <Container component="div" maxWidth="xs" style={{ height: "100vh" }}>
      <div
        className="row justify-content-center align-items-center"
        style={{
          position: "relative",
          textAlign: "center",
          color: "white"
        }}
      >
        <img
          src={bgImage}
          style={{ width: "100%" }}
          alt="nkwashi background image"
        />
        <div className={css(styles.overlaySection)}>
          <img src={logo} style={{ width: "100%" }} alt="nkwashi logo" />
          <p
            style={{
              marginTop: 33,
              color: "#1f2026",
              fontSize: 18
            }}
          >
            Welcome to Nkwashi App
          </p>

          <p
            style={{
              color: "#818188"
            }}
          >
            First smart city in Zambia
          </p>
        </div>
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
          Get Started
        </Button>
        <Link href="#" className={`${css(styles.googleLink)} `} variant="body2">
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
    // margin: 60,
    width: "75%",
    boxShadow: "none"
    // marginBottom: 78
  },
  logoImg: {
    width: 137,
    height: 40
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
  }
});
