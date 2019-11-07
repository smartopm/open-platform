import React from "react";
import { Button, TextField } from "@material-ui/core";
import { StyleSheet, css } from "aphrodite";
import { Link } from "react-router-dom";

export default function ConfirmCodeScreen() {
  return (
    <div style={{ height: "100vh" }}>
      <nav className={`${css(styles.navBar)} navbar`}>
        <Link to={"/login_w"}>
          <i className={`material-icons`}>arrow_back</i>
        </Link>
      </nav>
      <div
        className={`row justify-content-center align-items-center ${css(
          styles.welcomeContainer
        )}`}
      >
        <p className={css(styles.welcomeText)}>Welcome to Nkwashi App</p>

        <div className="container ">
          <div className={css(styles.phoneNumberInput)}>
            <TextField
              style={{
                width: 60,
                gridArea: "1 / 4 / 2 / 5"
              }}
              id="outlined-basic"
              margin="normal"
              variant="outlined"
            />
            <TextField
              style={{
                width: 60,
                gridArea: "1 / 5 / 2 / 6"
              }}
              id="outlined-basic"
              margin="normal"
              variant="outlined"
            />
            <TextField
              style={{
                width: 60,
                gridArea: "1 / 3 / 2 / 4"
              }}
              id="outlined-basic"
              margin="normal"
              variant="outlined"
            />
            <TextField
              style={{
                width: 60,
                gridArea: "1 / 2 / 2 / 3"
              }}
              id="outlined-basic"
              margin="normal"
              variant="outlined"
            />
            <TextField
              style={{
                width: 60,
                gridArea: "1 / 6 / 2 / 7"
              }}
              id="outlined-basic"
              margin="normal"
              variant="outlined"
            />
            <TextField
              style={{
                width: 60,
                gridArea: "1 / 7 / 3 / 8"
              }}
              id="outlined-basic"
              margin="normal"
              variant="outlined"
            />
          </div>
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
          <Link className={css(styles.getStartedLink)} to={"/"}>
            Next
          </Link>
        </Button>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  getStartedButton: {
    backgroundColor: "#53d6a5",
    color: "#FFF",
    width: "75%",
    boxShadow: "none",
    marginTop: 100
  },
  getStartedLink: {
    textDecoration: "none",
    color: "#FFFFFF"
  },
  linksSection: {
    marginTop: 40
  },
  navBar: {
    boxShadow: "none",
    backgroundColor: "#fafafa"
  },
  welcomeText: {
    marginTop: 33,
    color: "#1f2026",
    fontSize: 18
  },
  flag: {
    display: "inline-block",
    marginTop: 7
  },
  countryCode: {
    display: "inline-block",
    marginTop: -2,
    marginLeft: 6
  },
  welcomeContainer: {
    position: "relative",
    textAlign: "center",
    color: "white"
  },
  phoneNumberInput: {
    marginTop: 50,
    display: "grid",
    "grid-template-rows": "1fr",
    "grid-template-column": "repeat(6, 1fr)",
    "grid-column-gap": "2px",
    "grid-row-gap": "0px"
  }
});
