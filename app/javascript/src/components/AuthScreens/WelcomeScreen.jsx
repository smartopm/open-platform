import React from "react";
import { Container, Button } from "@material-ui/core";
import { StyleSheet, css } from "aphrodite";
import logo from "../../../../assets/images/logo_nkwashi.svg";
import bgImage from "../../../../assets/images/nkwashi_bgi.jpg";

export function WelcomeScreen({ history }) {
  return (
    <Container component="div" maxWidth="xs" style={{ height: "100vh" }}>
      <div
        className={`row justify-content-center align-items-center ${css(
          styles.welcomeContainer
        )}`}
      >
        <img
          src={bgImage}
          className={css(styles.bgImage)}
          alt="nkwashi background image"
        />
        <div className={css(styles.overlaySection)}>
          <img className="nz-logo-nkwashi" src={logo} alt="nkwashi logo" />
          <p className={css(styles.welcomeText)}>
            <strong>Welcome to Nkwashi App</strong>
          </p>
          <p className={css(styles.subText)}>First smart city in Zambia</p>
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
          onClick={() => history.push("/push")}
        >
          Get Started
        </Button>
        <a className={css(styles.googleLink)} href={"/login_oauth"}>
          Or Login with Google instead
        </a>
      </div>
    </Container>
  );
}

const styles = StyleSheet.create({
  getStartedButton: {
    backgroundColor: "#25c0b0",
    color: "#FFF",
    width: "75%",
    height: 51,
    boxShadow: "none"
  },
  getStartedLink: {
    textDecoration: "none",
    color: "#FFFFFF"
  },
  bgImage: {
    width: "100%"
  },
  googleLink: {
    margin: 40,
    marginBottom: 47,
    textDecoration: "none"
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
