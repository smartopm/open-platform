import React from "react";
import { Container, Link, Button } from "@material-ui/core";
import { StyleSheet, css } from "aphrodite";
import logo from "../../../../assets/images/logo_nkwashi.svg";
import bgImage from "../../../../assets/images/nkwashi_bgi.jpg";

export function WelcomeScreen() {
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
          <img src={logo} alt="nkwashi logo" />
          <p className={css(styles.welcomeText)}>Welcome to Nkwashi App</p>
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
