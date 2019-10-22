import React, { useContext } from "react";
import { Link, withRouter } from "react-router-dom";
import { StyleSheet, css } from "aphrodite";

import { Context as AuthStateContext } from "../containers/Provider/AuthStateProvider.js";
import logoUrl from "../../../assets/images/nkwashi_white_logo_transparent.png";

export default withRouter(function Nav({
  children,
  menuButton,
  history,
  navName,
  backTo
}) {
  const authState = useContext(AuthStateContext);
  return (
    <Component
      {...{ children, authState, menuButton, history, navName, backTo }}
    />
  );
});

export function Component({
  children,
  authState,
  menuButton,
  navName,
  backTo,
  history
}) {
  function backButtonOrMenu() {
    const to = backTo || "/";
    if (menuButton === "back") {
      return (
        <a href="#" className={css(styles.buttonLeft)} onClick={history.goBack}>
          <i className={`material-icons ${css(styles.icon)}`}>arrow_back</i>
        </a>
      );
    } else if (menuButton === "cancel") {
      return (
        <Link className={css(styles.buttonLeft)} to={to}>
          <i className={`material-icons ${css(styles.icon)}`}>clear</i>
        </Link>
      );
    }
    return (
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
    );
  }

  function communityName() {
    if (authState.id && authState.community) {
      if (authState.community.logoUrl) {
        return (
          <Link to="/">
            <img
              src={authState.community.logoUrl}
              className={css(styles.logo)}
            />
          </Link>
        );
      }
      return (
        <Link to="/">
          <div>{authState.community.name}</div>
        </Link>
      );
    }
    return "Community";
  }

  return (
    <nav className={`navbar navbar-dark ${css(styles.navBar)}`}>
      <div className={css(styles.topNav)}>
        {backButtonOrMenu()}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
            <li className="nav-item active">
              <a className="nav-link" href="#">
                Home <span className="sr-only">(current)</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Link
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" href="#">
                Disabled
              </a>
            </li>
          </ul>
        </div>

        <ul
          className={`navbar-nav navbar-center ${css(styles.navTitle)}`}
          style={{ margin: "auto" }}
        >
          <li>{navName ? navName : communityName()}</li>
        </ul>
      </div>

      <div className="nav navbar-nav" style={{ width: "100%" }}>
        {children}
      </div>
    </nav>
  );
}

const styles = StyleSheet.create({
  logo: {
    height: "25px"
  },
  topNav: {
    width: "100%",
    position: "relative"
  },
  navTitle: {
    top: "8px",
    color: "#FFF"
  },
  arrow: {
    color: "#fff",
    "font-size": "1.5em"
  },
  navBar: {
    backgroundColor: "#46ce84",
    minHeight: "50px"
  },
  buttonLeft: {
    color: "#FFF"
  },
  icon: {
    lineHeight: "1.7em"
  }
});
