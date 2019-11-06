import React, { useContext, useState, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import { StyleSheet, css } from "aphrodite";
import { useTranslation } from "react-i18next";
import { Context as AuthStateContext } from "./Provider/AuthStateProvider.js";
import Nav from "../components/Nav";
import Loading from "../components/Loading.jsx";
import ScanIcon from "../../../assets/images/shape.svg";
import RequestIcon from "../../../assets/images/icon_request.svg";
import SupportIcon from "../../../assets/images/icon_discover_card_fill.svg";
import ExploreIcon from "../../../assets/images/icon_map";
import PersonIcon from "@material-ui/icons/Person";
import LogIcon from "@material-ui/icons/Assignment";

export default function Home() {
  const authState = useContext(AuthStateContext);
  if (!authState.loggedIn) return <Loading />;
  return <Component authState={authState} />;
}

export function Component({ authState }) {
  const [redirect, setRedirect] = useState(false);
  const { t } = useTranslation();
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
          <Link to="/scan">
            <img
              src={ScanIcon}
              alt="scan icon"
              className={` ${css(styles.scanIcon)}`}
            />
          </Link>
        </div>
      </Nav>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-4-lg col-12-sm index-cards">
            <div className="d-flex flex-row flex-wrap justify-content-center mb-3">
              {!["security guard", "resident"].includes(
                authState.user.userType.toLowerCase()
              ) ? (
                <Fragment>
                  <div className="card align-self-center text-center">
                    <Link to={"/map"} className={`card-link`}>
                      <div className="card-body">
                        <h5 className="card-title">
                          <img src={ExploreIcon} alt="map icon" />
                        </h5>
                        <p>{t("home.explore")}</p>
                      </div>
                    </Link>
                  </div>
                  <div className="card align-self-center text-center">
                    <Link to={`/user/pending`} className={`card-link`}>
                      <div className="card-body">
                        <h5 className="card-title">
                          <img src={RequestIcon} alt="request icon" />
                        </h5>
                        <p>{t("home.request")}</p>
                      </div>
                    </Link>
                  </div>
                </Fragment>
              ) : null}

              <div className="card align-self-center text-center">
                <Link to={`/id/${authState.user.id}`} className={`card-link`}>
                  <div className="card-body">
                    <h5 className="card-title">
                      <PersonIcon className={css(styles.homeIconColor)} />
                    </h5>
                    <p>{t("home.identity")}</p>
                  </div>
                </Link>
              </div>

              <div className="card align-self-center text-center">
                <Link to={``} className={`card-link`}>
                  <div className="card-body">
                    <h5 className="card-title">
                      <img src={SupportIcon} alt="support icon" />
                    </h5>
                    <p>{t("home.support")}</p>
                  </div>
                </Link>
              </div>
              {["security_guard", "admin"].includes(
                authState.user.userType.toLowerCase()
              ) ? (
                <Fragment>
                  <div className="card align-self-center text-center">
                    <Link to={"/entry_logs"} className={`card-link`}>
                      <div className="card-body">
                        <h5 className="card-title">
                          <LogIcon className={css(styles.homeIconColor)} />
                        </h5>
                        <p>{t("home.entry_logs")}</p>
                      </div>
                    </Link>
                  </div>
                </Fragment>
              ) : null}
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
    height: 40,
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
    left: 4,
    top: 26,
    bottom: "4px",
    "z-index": 9
  },
  bellIcon: {
    color: "#53d6a5"
  },
  scanIcon: {
    position: "absolute",
    top: 26,
    bottom: 4,
    right: 5,
    width: 20
  },
  homeIconColor: {
    color: "#53d6a5"
  }
});
