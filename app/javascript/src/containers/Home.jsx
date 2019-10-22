import React, { useContext, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { StyleSheet, css } from "aphrodite";
import Nav from "../components/Nav";
import Loading from "../components/Loading.jsx";

import { Context as AuthStateContext } from "./Provider/AuthStateProvider.js";

export default function Home() {
  const authState = useContext(AuthStateContext);
  if (!authState.loggedIn) return <Loading />;
  return <Component authState={authState} />;
}

export function Component({ authState }) {
  const [redirect, setRedirect] = useState(false);

  function inputToSearch() {
    setRedirect("/search");
  }

  if (redirect) {
    return <Redirect push to={redirect} />;
  }

  return (
    <div>
      <Nav>
        <div className={css(styles.inputGroup)}>
          <input
            className={`form-control ${css(styles.input)}`}
            onFocus={inputToSearch}
            type="text"
            placeholder="Search"
          />
          <i className={`material-icons ${css(styles.searchIcon)}`}>search</i>
          <i className={`material-icons ${css(styles.scanIcon)}`}>crop_free</i>
        </div>
      </Nav>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-4-lg col-12-sm index-cards">
            <div className="d-flex flex-row flex-wrap justify-content-center mb-3">
              <div className="card align-self-center text-center">
                <Link to={`/id/${authState.user.id}`} className={`card-link`}>
                  <div className="card-body">
                    <h5 className="card-title">
                      <i className="material-icons">perm_identity</i>
                    </h5>
                    <p>Identity</p>
                  </div>
                </Link>
              </div>
              <div className="card align-self-center text-center">
                <Link to={`/user/request`} className={`card-link`}>
                  <div className="card-body">
                    <h5 className="card-title">
                      <i className="material-icons">perm_identity</i>
                    </h5>
                    <p>Request</p>
                  </div>
                </Link>
              </div>
              <div className="card align-self-center text-center">
                <Link to={`/user/pending`} className={`card-link`}>
                  <div className="card-body">
                    <h5 className="card-title">
                      <i className="material-icons">perm_identity</i>
                    </h5>
                    <p>Pending Requests</p>
                  </div>
                </Link>
              </div>
              <div className="card align-self-center text-center">
                <Link to={`/user/new`} className={`card-link`}>
                  <div className="card-body">
                    <h5 className="card-title">
                      <i className="material-icons">perm_identity</i>
                    </h5>
                    <p>New User</p>
                  </div>
                </Link>
              </div>
              <div className="card align-self-center text-center">
                <Link to={`/id/${authState.user.id}`} className={`card-link`}>
                  <div className="card-body">
                    <h5 className="card-title">
                      <i className="material-icons">payment</i>
                    </h5>
                    <p>Pay</p>
                  </div>
                </Link>
              </div>
              <div className="card align-self-center text-center">
                <Link to={`/id/${authState.user.id}`} className={`card-link`}>
                  <div className="card-body">
                    <h5 className="card-title">
                      <i className="material-icons">directions</i>
                    </h5>
                    <p>Map</p>
                  </div>
                </Link>
              </div>
              <div className="card align-self-center text-center">
                <Link to="/scan" className={`card-link`}>
                  <div className="card-body">
                    <h5 className="card-title">
                      <i className="material-icons">photo_camera</i>
                    </h5>
                    <p>Scan</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    position: "relative"
  },
  input: {
    marginTop: "1em",
    padding: "0.5em 1em 0.5em 2em",
    height: "30px",
    color: "#222",
    border: "none",
    borderRadius: "5px",
    backgroundImage: "none",
    backgroundColor: "#FFF",
    "::placeholder": {
      color: "#999"
    }
  },
  searchIcon: {
    color: "#999",
    position: "absolute",
    left: "4px",
    top: "20px",
    bottom: "4px",
    "z-index": 9
  },
  scanIcon: {
    position: "absolute",
    bottom: 2,
    right: 5,
    width: 24,
    height: 24
  }
});
