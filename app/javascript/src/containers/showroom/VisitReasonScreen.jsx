import React from "react";
import { css, StyleSheet } from "aphrodite";
import { Button } from "@material-ui/core";
import logo from "../../../../assets/images/logo_nkwashi.svg";

export default function VisitingReason() {
  return (
    <div className={`${css(styles.welcomePage)}`}>
         <img className="nz-logo-nkwashi" src={logo} className={css(styles.nkLogo)} alt="nkwashi logo" />
      <div className={css(styles.reasonTitle)}>
        <h3 className="text-center">Why are you here today?</h3>
      </div>
      <div
        className={`row justify-content-center align-items-center ${css(
          styles.buttonSection
        )}`}
      >
        <Button
          variant="contained"
          className={`btn col-sm-12 ${css(styles.getStartedButton)}`}
          // onClick={() => history.push("/push")}
        >
          Visiting the Nkwashi Showroom
        </Button>
        <br/>
        <Button
          variant="contained"
          className={`btn col-sm-12 ${css(styles.getStartedButton)}`}
          // onClick={() => history.push("/push")}
          >
          Payments & Account Management
        </Button>
          <br/>
        <Button
          variant="contained"
          className={`btn col-sm-12 ${css(styles.getStartedButton)}`}
          // onClick={() => history.push("/push")}
        >
          Other
        </Button>
      </div>
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
    marginBottom: 50,
    marginLeft: "15vw"
  },
  getStartedButton: {
    backgroundColor: "#25c0b0",
    color: "#FFF",
    // width: "80%",
    height: 51,
    boxShadow: "none",
    marginBottom: 30,
    // paddingLeft: 60,
    // paddingRight: 60
  },
  buttonSection: {
    marginTop: "35%"
  },
  reasonTitle: {
      marginLeft:"10vw"
  }
});
