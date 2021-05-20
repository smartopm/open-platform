/* eslint-disable react/prop-types */
import React from "react";
import { css, StyleSheet } from "aphrodite";
import { Button } from "@material-ui/core";
import logo from "../../../../assets/images/logo_nkwashi.svg";
import { Footer } from "../../components/Footer";

export default function VisitingReason({ history }) {
  return (
    <div className={`${css(styles.welcomePage)}`}>
      <img
        className={`nz-logo-nkwashi ${css(styles.nkLogo)}`}
        src={logo}
        alt="nkwashi logo"
      />
      <div
        className={`row justify-content-center align-items-center ${css(
          styles.buttonSection
        )}`}
      >
        <p className={css(styles.reasonTitle)}>Why are you here today?</p>

        <Button
          variant="contained"
          className={`btn col-sm-12 ${css(styles.getStartedButton)}`}
          onClick={() => history.push("/sh_entry")}
          data-testid="visit_btn"
          color="primary"
        >
          Visiting the Nkwashi Showroom
        </Button>
        <br />
        <Button
          variant="contained"
          className={`btn col-sm-12 ${css(styles.getStartedButton)}`}
          onClick={() => history.push("/sh_soon")}
          data-testid="payment_btn"
          color="primary"
        >
          Payments & Account Management
        </Button>
        <br />
        <Button
          variant="contained"
          className={`btn col-sm-12 ${css(styles.getStartedButton)}`}
          onClick={() => history.push("/sh_soon")}
          data-testid="other"
          color="primary"
        >
          Other
        </Button>
      </div>
      <Footer position="5vh" />
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
    marginTop: "20%",
    marginLeft: "15vw"
  },
  getStartedButton: {
    height: 51,
    boxShadow: "none",
    marginBottom: 30
  },
  buttonSection: {
    marginTop: "35%"
  },
  reasonTitle: {
    marginBottom: "20%"
  }
});
