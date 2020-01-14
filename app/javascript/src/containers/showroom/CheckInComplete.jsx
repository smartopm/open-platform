import React, { useEffect, useState } from "react";
import { css, StyleSheet } from "aphrodite";
import { Button } from "@material-ui/core";
import { Redirect } from "react-router-dom";
import { Footer } from "../../components/Footer";

export default function CheckInComplete({ history }) {
  const [time, setTime] = useState(10);

  useEffect(() => {
    if (!time) return;

    const intervalId = setInterval(() => {
      setTime(time - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [time]);

  if (time === 0) {
    return <Redirect to="/sh_reason" />;
  }
  return (
    <div className={`${css(styles.welcomePage)}`}>
      <div>
        <h5 className="text-center">Thank You for Checking In</h5>
      </div>
      <div
        className={`row justify-content-center align-items-center ${css(
          styles.buttonSection
        )}`}
      >
        <Button
          variant="contained"
          className={`btn ${css(styles.getStartedButton)}`}
          onClick={() => history.push("/sh_reason")}
        >
          Check-In Another Visitor
        </Button>
      </div>
      <Footer position={"30vh"} />
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
    width: "85%",
    height: 51,
    boxShadow: "none",
    paddingLeft: 60,
    paddingRight: 60
  },
  buttonSection: {
    marginTop: "50%"
  }
});
