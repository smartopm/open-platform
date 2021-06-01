
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { css, StyleSheet } from "aphrodite";
import CenteredContent from "../../../components/CenteredContent";
import { Context } from "../../../containers/Provider/AuthStateProvider";

/**
 * 
 * @deprecated The security guard can now approve or deny requests without approval from security manager
 * The rest of the component in here will be removed later
 */
export default function HoldScreen() {
  return (
    <CenteredContent>Waiting for approval</CenteredContent>
  )
}

export function GrantedScreen() {
  return (
    <div
      className={`row justify-content-center align-items-center ${css(
        styles.grantedPage
      )}`}
    >
      <h4 className={`${css(styles.title)}  text-center col-sm-12`}>Granted</h4>
      <br />
      <div className="col-10 col-sm-10">
        <Link
          to="/guard_home"
          className={`btn btn-lg btn-block ${css(styles.callButton)}`}
        >
          Home
        </Link>
      </div>
    </div>
  );
}

export function DeniedScreen() {
  const authState = useContext(Context)
  return (
    <div
      className={`row justify-content-center align-items-center ${css(
        styles.deniedPage
      )}`}
    >
      <h4 className={`${css(styles.title)}  text-center col-sm-12`}>Denied</h4>
      <br />
      <div className="col-10 col-sm-10">
        <a
          href={`tel:${authState.user.community.securityManager}`}
          className={`btn btn-lg btn-block ${css(styles.callButton)}`}
        >
          Call Manager
        </a>
      </div>
      <div className="col-10 col-sm-10">
        <Link
          to="/guard_home"
          className={`btn btn-lg btn-block ${css(styles.callButton)}`}
        >
          Home
        </Link>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  callButton: {
    backgroundColor: "rgb(233, 147, 83, 0)",
    textTransform: "unset",
    color: "#FFFFFF",
    border: "2px solid black",
    borderColor: "#FFFFFF"
  },
  waitPage: {
    backgroundColor: "rgb(233, 147, 83)",
    height: "100vh"
  },
  grantedPage: {
    backgroundColor: "rgb(83, 233, 83)",
    height: "100vh"
  },
  deniedPage: {
    backgroundColor: "rgb(233, 83, 83)",
    height: "100vh"
  },
  title: {
    color: "#FFFFFF"
  },
  clockStyles: {
    fontSize: "7em",
    color: "#FFFFFF"
  }
});
