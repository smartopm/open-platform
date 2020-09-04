/* eslint-disable */
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-apollo";
import { css, StyleSheet } from "aphrodite";
import { addSeconds, format } from "date-fns";
import { EntryRequestQuery } from "../../graphql/queries";
import { ponisoNumber } from "../../utils/constants.js";
import useTimer from "../../utils/customHooks";

export default function HoldScreen({ match }) {
  const { loading, data, stopPolling } = useQuery(EntryRequestQuery, {
    variables: { id: match.params.id },
    pollInterval: 5000
  });
  useEffect(() => {
    return function cleanup() {
      stopPolling();
    };
  // /* eslint-disable */-next-line react-hooks/exhaustive-deps
  }, []);
  if (loading) {
    return <WaitScreen />;
  }
  // removed the browser check, assuming this API is supported
  if (data.result.grantedState === 1) {
    window.navigator.vibrate([900]);
    return <GrantedScreen />;
  } else if (data.result.grantedState === 2) {
    window.navigator.vibrate([900]);
    return <DeniedScreen />;
  }
  return <WaitScreen />;
}

export function WaitScreen() {
  const timeLeft = useTimer(180, 1000)

  return (
    <div
      className={`row justify-content-center align-items-center ${css(
        styles.waitPage
      )}`}
    >
      <h4 className={`${css(styles.title)} text-center col-sm-12 `}>
        Waiting for Approval
      </h4>
      <br />
      <br />
      <br />

      <h1 className={`${css(styles.clockStyles)} text-center col-sm-12`}>
        {formatTime(timeLeft)}
      </h1>

      <span
        style={{
          color: "#FFFFFF"
        }}
      >
        {timeLeft === 0 && "No Response"}
      </span>

      <div className="col-10 col-sm-12">
        {timeLeft === 0 && (
          <a
            href={`tel:${ponisoNumber}`}
            className={`btn btn-lg btn-block ${css(styles.callButton)}`}
          >
            Call Poniso
          </a>
        )}
        {timeLeft > 0 && (
          <h5 className="text-center text-white">
            Please wait, This may take some time
          </h5>
        )}
      </div>
    </div>
  );
}
/**
 *
 * @param {String} seconds
 * @description formats seconds in minute:seconds format
 * @returns {String} formatted string
 */
function formatTime(seconds) {
  const formattedSeconds = addSeconds(new Date(0), seconds);
  return format(formattedSeconds, "mm:ss");
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
