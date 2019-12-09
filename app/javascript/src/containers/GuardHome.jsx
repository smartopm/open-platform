import React, { useState, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import { StyleSheet, css } from "aphrodite";
import { useTranslation } from "react-i18next";
import Nav from "../components/Nav";
import ScanIcon from "../../../assets/images/shape.svg";
import LogIcon from "../../../assets/images/icon_contact_card_fill.svg";
import QRIcon from "../../../assets/images/icon_qr_card_fill_copy.svg";
import LogEntryIcon from "@material-ui/icons/Assignment";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import CallIcon from "@material-ui/icons/Call";
import { ponisoNumber } from "../utils/constants";
import Avatar from "../components/Avatar";
import { Context } from "./Provider/AuthStateProvider";
import { FormControl, Select, InputBase, MenuItem } from "@material-ui/core";
import { useQuery, useMutation } from "react-apollo";
import { SecurityGuards } from "../graphql/queries";
import Loading from "../components/Loading";
import ErrorPage from "../components/Error";
import { AUTH_TOKEN_KEY } from "../utils/apollo";
import { switchGuards } from "../graphql/mutations";
import { withStyles } from "@material-ui/core/styles"

const BootstrapInput = withStyles(() => ({
  input: {
    borderRadius: 6,
    position: 'relative',
    backgroundColor: "transparent",
    border: '1px solid #fff',
    fontSize: 18,
    fontWeight: "bold",
    padding: '14px 26px 4px 16px',
    height: 30,
    color: '#fff'
  }
}))(InputBase)

export default function GuardHome() {
  const [redirect, setRedirect] = useState(false);
  const authState = useContext(Context);
  const { t } = useTranslation();
  const hideGuardSwitching = false;
  const [id, setId] = React.useState(authState.user.id);
  const { data, loading, error } = useQuery(SecurityGuards)
  const [loginSwitchUser] = useMutation(switchGuards)

  function inputToSearch() {
    setRedirect("/search");
  }
  const handleChange = event => {
    setId(event.target.value);
    loginSwitchUser({
      variables: { id: event.target.value }
    })
      .then(({ data }) => {
        localStorage.setItem(AUTH_TOKEN_KEY, data.loginSwitchUser.authToken)
        // reloading the page to propagate the new user details
        window.location.href = "/guard_home";
      })
      .catch(error => {
        console.log(error.message);
      });
  };
  if (redirect) {
    return <Redirect push to={redirect} />;
  }
  if (loading) return <Loading />;
  if (error) return <ErrorPage title={error.message} />;
  return (
    <div>
      <Nav>
        <div className={css(styles.inputGroup)}>
          <br />
          {hideGuardSwitching ? null :
            <div>
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
                  <span className={`${css(styles.link)}`}>
                    Switch account
              </span>
                  <br />
                  <Select
                    id="demo-simple-select-outlined"
                    value={id}
                    onChange={handleChange}
                    style={{
                      width: 180,
                      // color: 'red'
                    }}
                    input={<BootstrapInput />}
                    IconComponent={() => <ArrowDropDownIcon style={{
                      marginLeft: -34,
                      color: "#FFFFFF"
                    }} />}
                  >
                    {
                      data.securityGuards.map(guard => (
                        <MenuItem
                          value={guard.id}
                          key={guard.id}
                          style={{}}
                        >
                          {guard.name}
                        </MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </div>
            </div>
          }

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
                      <LogEntryIcon className={css(styles.homeIconColor)} fontSize="large" />
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
                      <CallIcon className={css(styles.homeIconColor)} fontSize="large" />
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
    height: 50,
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
    bottom: 11,
    "z-index": 9
  },
  bellIcon: {
    color: "#25c0b0"
  },
  scanIcon: {
    position: "absolute",
    marginTop: 75,
    right: 9,
    width: 20,
    bottom: 12
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
  },
  link: {
    color: "#FFFFFF",
    textDecoration: "none",
    marginLeft: 25
  }
});
