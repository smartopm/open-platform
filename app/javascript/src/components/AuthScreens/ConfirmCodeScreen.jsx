import React, { useState, useContext, useRef, useEffect, createRef } from "react";
import { Redirect } from "react-router-dom";
import { Button, CircularProgress } from "@material-ui/core";
import { StyleSheet, css } from "aphrodite";
import { Link } from "react-router-dom";
import { useMutation } from "react-apollo";
import { loginPhoneConfirmCode } from "../../graphql/mutations";
import { Context as AuthStateContext } from "../../containers/Provider/AuthStateProvider";


const randomCodeData = [1, 2, 3, 4, 5, 6, 7]

export default function ConfirmCodeScreen({ match }) {
  const authState = useContext(AuthStateContext);
  const { id } = match.params;
  const [loginPhoneComplete] = useMutation(loginPhoneConfirmCode);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // generate refs to use later
  let elementsRef = useRef(randomCodeData.map(() => createRef()));
  const inputRef = useRef(null)

  useEffect(() => {
    // force focus to just be on the first element
    elementsRef.current[1].current.focus()
  })

  function handleConfirmCode() {
    setIsLoading(true);

    // Todo: Find more efficient way of getting values from the input
    const code1 = elementsRef.current[1].current.value
    const code2 = elementsRef.current[2].current.value
    const code3 = elementsRef.current[3].current.value
    const code4 = elementsRef.current[4].current.value
    const code5 = elementsRef.current[5].current.value
    const code6 = elementsRef.current[6].current.value

    // Todo: refactor this 
    const code = `${code1}${code2}${code3}${code4}${code5}${code6}`

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
    // window.location.href = "/"
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
                onChange={() => item < 6 ? elementsRef.current[item + 1].current.focus() : inputRef.current.click()}
                // hide the seventh input for the next ref to work [6]
                hidden={item === 7 && true}
              />
            ))
          }
        </div>

        <div className="row justify-content-center align-items-center">
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
            ref={inputRef}
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
