import React from "react";
import { css, StyleSheet } from "aphrodite";

export default function WaitScreen() {
  return (
    <div
      className={`row justify-content-center align-items-center ${css(
        styles.waitPage
      )}`}
    >
      <h4 className={css(styles.title)}>Waiting on Approval</h4>
      <br />
      <div className="col-10 col-sm-10 col-md-6">
        <a
          href="tel:+260976064298"
          className={`btn btn-lg btn-block ${css(styles.callButton)}`}
        >
          Call Poniso
        </a>
      </div>
    </div>
  );
}
const styles = StyleSheet.create({
  callButton: {
    backgroundColor: "rgb(233, 147, 83)",
    textTransform: "unset",
    color: "#FFFFFF",
    border: "2px solid black",
    borderColor: "#FFFFFF"
  },
  waitPage: {
    backgroundColor: "rgb(233, 147, 83)",
    height: "100vh"
  },
  title: {
    color: "#FFFFFF"
  }
});
