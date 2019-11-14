import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-apollo";
import { css, StyleSheet } from "aphrodite";
import { addSeconds, format } from "date-fns";
import { EntryRequestQuery } from "../graphql/queries.js";

// Todo: Test the vibration on android
export default function HoldScreen({ match }) {
  const { loading, data, stopPolling } = useQuery(EntryRequestQuery, {
    variables: { id: match.params.id },
    pollInterval: 5000
  });
  useEffect(() => {
    return function cleanup() {
      stopPolling();
    };
  }, []);
  if (loading) {
    return <WaitScreen />;
  }
  if (data.result.grantedState === 1) {
    if (window.navigator.vibrate) {
      navigator.vibrate([600]);
    }
    return <GrantedScreen />;
  } else if (data.result.grantedState === 2) {
    if (window.navigator.vibrate) {
      navigator.vibrate([600]);
    }
    return <DeniedScreen />;
  }
  return <WaitScreen />;
}

function WaitScreen() {
  const [timeLeft, setTimeLeft] = useState(180);

  useEffect(() => {
    if (!timeLeft) return;
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  return (
    <div
      className={`row justify-content-center align-items-center ${css(
        styles.waitPage
      )}`}
    >
      <h4 className={css(styles.title)}>Waiting on Approval</h4>

      <br />

      <div className="col-10 col-sm-10">
        {timeLeft === 0 && (
          <a
            href="tel:+260976064298"
            className={`btn btn-lg btn-block ${css(styles.callButton)}`}
          >
            Call Poniso
          </a>
        )}
        {timeLeft > 0 && (
          <h5 className="text-center text-white">
            Sending request, Wait for {formatTime(timeLeft)} to call Poniso{" "}
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

function GrantedScreen() {
  return (
    <div
      className={`row justify-content-center align-items-center ${css(
        styles.grantedPage
      )}`}
    >
      <h4 className={css(styles.title)}>Granted</h4>
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

function DeniedScreen() {
  return (
    <div
      className={`row justify-content-center align-items-center ${css(
        styles.deniedPage
      )}`}
    >
      <h4 className={css(styles.title)}>Denied</h4>
      <br />
      <div className="col-10 col-sm-10">
        <a
          href="tel:+260976064298"
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
  }
});
