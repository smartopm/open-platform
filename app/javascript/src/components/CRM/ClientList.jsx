import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";

export default function ClientList() {
  return (
    <Fragment >
      <div className="container">
        <div className="row justify-content-between">
          <div className="col-xs-8">
            <span className={css(styles.logTitle)}>Name</span>
          </div>
          <div className="col-xs-4">
            <span className={css(styles.subTitle)}>Account Name</span>
          </div>
        </div>
        <div className="row justify-content-between">
          <div className="col-xs-8">
            <span className={css(styles.subTitle)}>NRC</span>
          </div>
          <div className="col-xs-4">
            <span className={css(styles.subTitle)}>Plot Type</span>
          </div>
        </div>
        <br />
      </div>
      <div className="border-top my-3" />
    </Fragment>
  );
}

const styles = StyleSheet.create({
  logTitle: {
    color: "#1f2026",
    fontSize: 16,
    fontWeight: 700
  },
  subTitle: {
    color: "#818188",
    fontSize: 14,
    letterSpacing: 0.17,
    fontWeight: 400
  }
});
