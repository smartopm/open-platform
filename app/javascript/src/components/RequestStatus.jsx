import React from "react";
import { css, StyleSheet } from "aphrodite";

export default function RequestStatus(props) {
  return (
    <div
      className={`row justify-content-center align-items-center ${css(
        styles.waitPage
      )}`}
      style={{
        backgroundColor: props.isDenied ? "#ed5757" : "#25c0b0"
      }}
    >
      <h1 className={css(styles.title)}>
        {props.isDenied ? "Denied" : "Approved"}
      </h1>
      <br />
      <div className="col-10 col-sm-10 col-md-6">
        <button
          className={`btn btn-lg btn-block ${css(styles.okButton)}`}
          style={{
            backgroundColor: props.isDenied ? "#ed5757" : "#25c0b0"
          }}
        >
          Ok
        </button>
      </div>
      {props.isDenied ? (
        <div className="col-10 col-sm-10 col-md-6">
          <a
            href="tel:+260976064298"
            className={`btn btn-lg btn-block ${css(styles.callButton)}`}
          >
            Call Poniso
          </a>
        </div>
      ) : null}
    </div>
  );
}
const styles = StyleSheet.create({
  callButton: {
    backgroundColor: "#ed5757",
    textTransform: "unset",
    color: "#FFFFFF",
    border: "2px solid black",
    borderColor: "#FFFFFF"
  },
  okButton: {
    textTransform: "unset",
    color: "#FFFFFF",
    border: "2px solid black",
    borderColor: "#FFFFFF"
  },
  waitPage: {
    height: "100vh"
  },
  title: {
    color: "#FFFFFF"
  }
});
