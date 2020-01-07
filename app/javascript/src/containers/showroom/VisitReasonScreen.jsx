import React from "react";
import { css, StyleSheet } from "aphrodite";
import { Button } from "@material-ui/core";
import logo from "../../../../assets/images/logo_nkwashi.svg";
import { Footer } from "../../components/Footer";

export default function VisitingReason({ history }) {
  return (
    <div 
      className={`${css(styles.welcomePage)}`}
    >
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
        <p className={css(styles.reasonTitle)} >Why are you here today?</p>
    
        <Button
          variant="contained"
          className={`btn col-sm-12 ${css(styles.getStartedButton)}`}
          onClick={() => history.push("/sh_entry")}
        >
          Visiting the Nkwashi Showroom
        </Button>
        <br />
        <Button
          variant="contained"
          className={`btn col-sm-12 ${css(styles.getStartedButton)}`}
          onClick={() => history.push("/soon")}
        >
          Payments & Account Management
        </Button>
        <br />
        <Button
          variant="contained"
          className={`btn col-sm-12 ${css(styles.getStartedButton)}`}
          onClick={() => history.push("/soon")}
        >
          Other
        </Button>
      </div>
      <Footer position={"5vh"} />
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
    backgroundColor: "#25c0b0",
    color: "#FFF",
    // width: "80%",
    height: 51,
    boxShadow: "none",
    marginBottom: 30
    // paddingLeft: 60,
    // paddingRight: 60
  },
  buttonSection: {
    marginTop: "35%"
  },
  reasonTitle: {
    marginBottom: "20%"
  }
});
