import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-apollo";
import { css, StyleSheet } from "aphrodite";
import { EntryRequestQuery } from "../../graphql/queries";
import { ponisoNumber } from "../../utils/constants";
import CenteredContent from "../../components/CenteredContent";

// eslint-disable-next-line react/prop-types
export default function HoldScreen({ match }) {
  const { loading, data, stopPolling } = useQuery(EntryRequestQuery, {
    // eslint-disable-next-line react/prop-types
    variables: { id: match.params.id },
    pollInterval: 5000
  });
  useEffect(() => {
    return function cleanup() {
      stopPolling();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (loading) {
    return <CenteredContent>Waiting for approval</CenteredContent>
  }
  // removed the browser check, assuming this API is supported
  if (data.result.grantedState === 1) {
    window.navigator.vibrate([900]);
    return  <CenteredContent>Approved</CenteredContent>;
  } 
  if (data.result.grantedState === 2) {
    window.navigator.vibrate([900]);
    return  <CenteredContent>Denied</CenteredContent>
  }
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
          href={`tel:${ponisoNumber}`}
          className={`btn btn-lg btn-block ${css(styles.callButton)}`}
        >
          Call Poniso
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
