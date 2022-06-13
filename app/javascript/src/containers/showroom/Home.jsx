/* eslint-disable */
import React from "react";
import { css, StyleSheet } from "aphrodite";
import { Button } from "@mui/material";
import logo from "../../../../assets/images/logo_nkwashi.svg";
import { Footer } from "../../components/Footer";

// Todo: Add another step in this component(why are you here)
export default function ShowRoom({ history }) {
  return (
    <div className={`${css(styles.welcomePage)}`}>
      <img
        src={logo}
        className={`nz-logo-nkwashi ${css(styles.nkLogo)}`}
        alt="nkwashi logo"
      />
      <br />
      <div>
        <h5 className={css(styles.homeTitle)}>
          Welcome to Thebe Investment Management
        </h5>
      </div>
      <div
        className={`row justify-content-center align-items-center ${css(
          styles.buttonSection
        )}`}
      >
        <Button
          variant="contained"
          className={`${css(styles.getStartedButton)}`}
          onClick={() => history.push("/sh_reason")}
          data-testid="checkin_btn"
          color="primary"
        >
          Press Here to Check-In
        </Button>
      </div>
      <Footer position={"30vh"} />
    </div>
  );
}

const styles = StyleSheet.create({
  welcomePage: {
    position: " absolute",
    left: " 50%",
    top: " 50%",
    "-webkit-transform": " translate(-50%, -50%)",
    transform: " translate(-50%, -50%)"
  },
  nkLogo: {
    marginBottom: 20,
    marginLeft: "9vw"
  },
  getStartedButton: {
    width: "75%",
    height: 51,
    boxShadow: "none",
    paddingLeft: 60,
    paddingRight: 60
  },
  buttonSection: {
    marginTop: "50%"
  },
  homeTitle: {
    marginTop: 60
  }
});
