import React from "react";
import { css, StyleSheet } from "aphrodite";
import { Button } from "@material-ui/core";
import logo from "../../../../assets/images/logo_nkwashi.svg";

// Todo: Add another step in this component(why are you here)
export default function ShowRoom() {
  return (
    <div className={`${css(styles.welcomePage)}`}>
      <img className="nz-logo-nkwashi" src={logo} className={css(styles.nkLogo)} alt="nkwashi logo" />
      <br />
      <div>
        <h5 className="text-center">Welcome to Thebe Investment Management</h5>
      </div>
      <div className={`row justify-content-center align-items-center ${css(styles.buttonSection)}`}>
      <Button
          variant="contained"
          className={`btn ${css(styles.getStartedButton)}`}
          // onClick={() => history.push("/push")}
        >
          Get Started
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
    marginLeft: "27%"
  },
  getStartedButton: {
    backgroundColor: "#25c0b0",
    color: "#FFF",
    width: "75%",
    height: 51,
    boxShadow: "none",
  },
  buttonSection: {
    marginTop: "50%"
  }
});
