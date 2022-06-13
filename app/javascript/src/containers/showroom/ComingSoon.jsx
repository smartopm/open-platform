/* eslint-disable */
import React from "react";
import { css, StyleSheet } from "aphrodite";
import { Button } from "@mui/material";
import { Footer } from "../../components/Footer";
import logo from "../../../../assets/images/logo_nkwashi.svg";

// Todo: Add another step in this component(why are you here)
export default function ComingSoon({ history }) {
  return (
    <div className={`${css(styles.welcomePage)}`}>
      <img
        src={logo}
        className={`nz-logo-nkwashi ${css(styles.nkLogo)}`}
        alt="nkwashi logo"
      />
      <div>
        <h5 className="text-center">
          Thanks for coming in! Our team will help you soon.
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
          data-testid="go_back_btn"
          color="primary"
        >
          Go Back
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
    marginBottom: 70,
    marginLeft: "11.5vw",
    margingTop: 70
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
  }
});
