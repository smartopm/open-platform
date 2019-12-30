import React from "react";
import { css, StyleSheet } from "aphrodite";
import { Button } from "@material-ui/core";


// Todo: Add another step in this component(why are you here)
export default function ComingSoon({ history }) {
  return (
    <div className={`${css(styles.welcomePage)}`}>
     
      <div>
        <h5 className="text-center">Thanks for coming in! Our team will help you soon.</h5>
      </div>
      <div className={`row justify-content-center align-items-center ${css(styles.buttonSection)}`}>
      <Button
          variant="contained"
          className={`btn ${css(styles.getStartedButton)}`}
          onClick={() => history.push("/sh_reason")}
        >
          Go Back
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
    marginLeft: "9vw"
  },
  getStartedButton: {
    backgroundColor: "#25c0b0",
    color: "#FFF",
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
