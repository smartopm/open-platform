import React, { useState, useContext, useRef, useEffect, createRef } from "react";
import { Redirect } from "react-router-dom";
import { Button, TextField, CircularProgress } from "@material-ui/core";
import { StyleSheet, css } from "aphrodite";
import { Link } from "react-router-dom";
import { useMutation } from "react-apollo";
import { loginPhoneConfirmCode } from "../../graphql/mutations";
import { Context as AuthStateContext } from "../../containers/Provider/AuthStateProvider";


const randomCodeData = [1, 2, 3, 4, 5, 6, 7]

export default function ConfirmCodeScreen({ match }) {
  const authState = useContext(AuthStateContext);
  const { id } = match.params;
  const [code, setCode] = useState("");
  const [loginPhoneComplete] = useMutation(loginPhoneConfirmCode);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  const elementsRef = useRef(randomCodeData.map(() => createRef()));


  useEffect(() => {
    elementsRef.current[1].current.focus()
  }, [elementsRef.current])

  function handleConfirmCode() {
    setIsLoading(true);
    // console.log(elementsRef.current[3].current.value)
    let arr = []
    randomCodeData.map((index) => {
      arr.push(elementsRef.current[index].current.value)
      console.log(arr.join(""))
    })
    loginPhoneComplete({
      variables: { id, token: code }
    })
      .then(({ data }) => {
        authState.setToken({ type: 'update', token: data.loginPhoneComplete.authToken })
      })
      .catch(error => {
        setError(error.message);
        setIsLoading(false);
      });
  }

  // Redirect once our authState.setToken does it's job
  if (authState.loggedIn) {
    return <Redirect to='/' />
  }


  return (
    <div style={{ height: "100vh" }}>
      <nav className={`${css(styles.navBar)} navbar`}>
        <Link to={"/login"}>
          <i className={`material-icons`}>arrow_back</i>
        </Link>
      </nav>
      <div className="container ">
        <div
          className={`row justify-content-center align-items-center ${css(
            styles.welcomeContainer
          )}`}
        >
          <p className={css(styles.welcomeText)}>Welcome to Nkwashi App</p>
        </div>
        <br />
        <br />
        <div className="row justify-content-center align-items-center">

          {
            randomCodeData.map(item => (
              <input
                key={item}
                name={`code${item}`}
                maxLength="1"
                type="tel"
                autoFocus
                ref={elementsRef.current[item]}
                className={css(styles.newInput)}
                onChange={() => elementsRef.current[item + 1].current.focus()}
                hidden={item === 7 && true}
              />
            ))
          }
        </div>
        <div className="row">
          <br />
          {error && (
            <p
              className="text-center text-danger"
              style={{
                margin: 40
              }}
            >
              {error}
            </p>
          )}
        </div>
        <div
          className={`row justify-content-center align-items-center ${css(
            styles.linksSection
          )}`}
        >
          <Button
            variant="contained"
            className={`btn ${css(styles.getStartedButton)}`}
            onClick={handleConfirmCode}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={25} color="inherit" />
            ) : (
                <span>Verify</span>
              )}
          </Button>
        </div>
      </div>
    </div>
  );
}



const styles = StyleSheet.create({
  getStartedButton: {
    backgroundColor: "#25c0b0",
    color: "#FFF",
    width: "55%",
    boxShadow: "none",
    marginTop: 80
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
  phoneCodeInput: {
    marginTop: 50
  },
  newInput: {
    width: 50,
    height: 60,
    fontSize: 20,
    textAlign: "center",
    border: '2px solid #1C6EA4',
    borderRadius: 5,
    borderTop: "none",
    borderRight: "none",
    borderLeft: "none",
    // padding: 20,
    margin: 9,
    paddingRight: 10,
  }
});
