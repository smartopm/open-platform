import React, { useState, useReducer } from "react";
import { Link, Redirect } from "react-router-dom";
import { StyleSheet, css } from "aphrodite";
import Nav from "../components/Nav";
import ScanIcon from "../../../assets/images/shape.svg";
import SupportIcon from "../../../assets/images/icon_discover_card_fill.svg";
import LogIcon from "../../../assets/images/icon_contact_card_fill.svg";
import QRIcon from "../../../assets/images/icon_qr_card_fill_copy.svg";
import { useTranslation } from "react-i18next";

// Todo: put reducers in their own file
// Todo: Add other cases
// Todo: Make this the default home page for securiry guards
// Todo: Clean up the flow

const initialState = {
  guest: false,
  person: false,
  truck: false
};

const initialStateFormState = {
  visitor: "",
  host: "",
  plotNumber: "",
  peopleCount: 0
};

const homeReducer = (state, action) => {
  switch (action.type) {
    case "person":
      return {
        ...initialState,
        person: action.payload
      };
    case "guest":
      return {
        ...state,
        guest: action.payload
      };
    case "truck":
      return {
        ...initialState,
        truck: action.payload
      };
    default:
      break;
  }
};

const formReducer = (state, action) => {
  switch (action.type) {
    case "visitor":
      return {
        ...state,
        visitor: action.payload
      };
    case "host":
      return {
        ...state,
        host: action.payload
      };
    case "plotNumber":
      return {
        ...state,
        plotNumber: action.payload
      };
    case "peopleCountAdd":
      return {
        ...state,
        peopleCount: state.peopleCount + 1
      };
    case "peopleCountRemove":
      return {
        ...state,
        peopleCount: state.peopleCount === 0 ? 0 : state.peopleCount - 1
      };
    default:
      break;
  }
};

export default function GuardHome() {
  const [redirect, setRedirect] = useState(false);
  const { t } = useTranslation();

  const [state, dispatch] = useReducer(homeReducer, initialState);
  const [formState, dispatchInputs] = useReducer(
    formReducer,
    initialStateFormState
  );

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
                <Link to={`/log_entry`} className={`card-link`}>
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
                <Link to={`/support`} className={`card-link`}>
                  <div className="card-body">
                    <h5 className="card-title">
                      <img src={SupportIcon} alt="support icon" />
                    </h5>
                    <p>{t("home.support")}</p>
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
  },
  grantIcon: {
    color: "#53d6a5",
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
