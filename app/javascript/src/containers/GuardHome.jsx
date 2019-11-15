import React, { useState, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import { StyleSheet, css } from "aphrodite";
import { useTranslation } from "react-i18next";
import Nav from "../components/Nav";
import ScanIcon from "../../../assets/images/shape.svg";
import LogIcon from "../../../assets/images/icon_contact_card_fill.svg";
import QRIcon from "../../../assets/images/icon_qr_card_fill_copy.svg";
import LogEntryIcon from "@material-ui/icons/Assignment";
import CallIcon from "@material-ui/icons/Call";
import { ponisoNumber } from "../utils/constants";
import Avatar from "../components/Avatar";
import { Context } from "./Provider/AuthStateProvider";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";

export default function GuardHome() {
  const [redirect, setRedirect] = useState(false);
  const authState = useContext(Context);
  const { t } = useTranslation();
  const [name, setName] = React.useState(authState.user.name);

  function inputToSearch() {
    setRedirect("/search");
  }
  const handleChange = event => {
    setName(event.target.value);
  };
  if (redirect) {
    return <Redirect push to={redirect} />;
  }

  return (
    <div>
      <Nav>
        <div className={css(styles.inputGroup)}>
          <br />
          <div className="d-flex flex-row flex-wrap justify-content-center mb-3">
            <Avatar user={authState.user} />
            <br />
            <br />
          </div>
          <div className="d-flex flex-row flex-wrap justify-content-center mb-3">
            <FormControl
              variant="outlined"
              style={{
                minWidth: 120,
                color: "#FFFFFF"
              }}
            >
              <Select
                id="demo-simple-select-outlined"
                value={name}
                onChange={handleChange}
              >
                <MenuItem value={name}>{name}</MenuItem>
              </Select>
            </FormControl>
          </div>

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
              <div
                className="card align-self-center text-center"
                style={{
                  width: "100%"
                }}
              >
                <Link to={`/scan`} className={`card-link`}>
                  <div className="card-body">
                    <h5 className="card-title">
                      <img src={QRIcon} alt="support icon" />
                    </h5>
                    <p>{t("home.scan")}</p>
                  </div>
                </Link>
              </div>
              <div
                className="card align-self-center text-center"
                style={{
                  width: "100%"
                }}
              >
                <Link to={`/entry_request`} className={`card-link`}>
                  <div className="card-body">
                    <h5 className="card-title">
                      <img src={LogIcon} alt="support icon" />
                    </h5>
                    <p>{t("home.log_entry")}</p>
                  </div>
                </Link>
              </div>
              <div
                className="card align-self-center text-center"
                style={{
                  width: "100%"
                }}
              >
                <Link to={`/entry_logs`} className={`card-link`}>
                  <div className="card-body">
                    <h5 className="card-title">
                      <LogEntryIcon className={css(styles.homeIconColor)} />
                    </h5>
                    <p>{t("home.entry_logs")}</p>
                  </div>
                </Link>
              </div>
              <div
                className="card align-self-center text-center"
                style={{
                  width: "100%"
                }}
              >
                <a href={`tel:${ponisoNumber}`}>
                  <div className="card-body">
                    <h5 className="card-title">
                      <CallIcon className={css(styles.homeIconColor)} />
                    </h5>
                    Call Poniso
                  </div>
                </a>
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
    // top: 26,
    // marginTop: 74,
    bottom: 6,
    "z-index": 9
  },
  bellIcon: {
    color: "#25c0b0"
  },
  scanIcon: {
    position: "absolute",
    marginTop: 75,
    right: 5,
    width: 20,
    bottom: 11
  },
  homeIconColor: {
    color: "#25c0b0"
  },
  grantIcon: {
    color: "#25c0b0",
    marginRight: 60,
    width: "35%",
    fontSize: "4em"
  },
  denyIcon: {
    color: "rgb(299, 63, 69)",
    width: "35%",
    fontSize: "4em"
  },
  callButton: {
    backgroundColor: "#fafafa",
    color: "#ed5757",
    textTransform: "unset"
  }
});
