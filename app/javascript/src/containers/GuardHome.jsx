import React, { useState, Fragment, useReducer } from "react";
import { Link, Redirect } from "react-router-dom";
import { StyleSheet, css } from "aphrodite";
import Nav from "../components/Nav";
import ScanIcon from "../../../assets/images/shape.svg";
import SupportIcon from "../../../assets/images/icon_discover_card_fill.svg";
import PersonIcon from "@material-ui/icons/Person";
import ClearIcon from "@material-ui/icons/Clear";
import CheckIcon from "@material-ui/icons/Check";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";

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
        peopleCount: state.peopleCount - 1
      };
    default:
      break;
  }
};

export default function GuardHome() {
  const [redirect, setRedirect] = useState(false);

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
  function handleGrantAccess() {
    // update user
    console.log(state);
  }

  function handleDenyAccess() {}

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
              {state.person || state.truck ? null : (
                <Fragment>
                  <div className="card align-self-center text-center">
                    <div
                      onClick={() =>
                        dispatch({ type: "person", payload: true })
                      }
                      className="card-body"
                    >
                      <h5 className="card-title">
                        <PersonIcon className={css(styles.homeIconColor)} />
                      </h5>
                      <p>Person</p>
                    </div>
                  </div>
                  <div className="card align-self-center text-center">
                    <div
                      onClick={() => dispatch({ type: "truck", payload: true })}
                      className="card-body"
                    >
                      <h5 className="card-title">
                        <PersonIcon className={css(styles.homeIconColor)} />
                      </h5>
                      <p>Truck</p>
                    </div>
                  </div>
                </Fragment>
              )}

              {state.person && !state.guest ? (
                <Fragment>
                  <div className="card align-self-center text-center">
                    <Link to={"/scan"} className={`card-link`}>
                      <div className="card-body">
                        <h5 className="card-title">
                          <img src={ScanIcon} alt="scan icon" />
                        </h5>
                        <p>Scan</p>
                      </div>
                    </Link>
                  </div>

                  <div className="card align-self-center text-center">
                    <div
                      onClick={() => dispatch({ type: "guest", payload: true })}
                      className="card-body"
                    >
                      <h5 className="card-title">
                        <img src={SupportIcon} alt="support icon" />
                      </h5>
                      <p>Guest</p>
                    </div>
                  </div>
                </Fragment>
              ) : null}

              {state.guest ? (
                <Fragment>
                  <div className="container">
                    <div className="form-group">
                      <label className="bmd-label-static" htmlFor="visitor">
                        Visitor Name
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        onChange={e =>
                          dispatchInputs({
                            type: "visitor",
                            payload: e.target.value
                          })
                        }
                        value={formState.visitor}
                        name="visitor"
                        required
                      />
                    </div>
                    <br />
                    <div className="form-group">
                      <label className="bmd-label-static" htmlFor="host">
                        Host Name
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        onChange={e =>
                          dispatchInputs({
                            type: "host",
                            payload: e.target.value
                          })
                        }
                        value={formState.host}
                        name="host"
                        required
                      />
                    </div>
                    <br />
                    <div className="form-group">
                      <label className="bmd-label-static" htmlFor="plot-number">
                        Plot Number
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        onChange={e =>
                          dispatchInputs({
                            type: "plotNumber",
                            payload: e.target.value
                          })
                        }
                        value={formState.plotNumber}
                        name="plot-numer"
                        required
                      />
                    </div>
                    <div className="row justify-content-center align-items-center">
                      <CheckIcon
                        className={`btn ${css(styles.grantIcon)}`}
                        size={32}
                        onClick={handleGrantAccess}
                      />
                      <ClearIcon
                        className={`btn ${css(styles.denyIcon)}`}
                        size={32}
                        onClick={handleDenyAccess}
                      />
                      <br />
                      <div className="row ">
                        <a
                          href="tel:+260976064298"
                          className={`btn btn-primary btn-lg btn-block ${css(
                            styles.callButton
                          )}`}
                        >
                          Call Poniso
                        </a>
                      </div>
                    </div>
                  </div>
                </Fragment>
              ) : null}
              {/* Truck */}

              {state.truck ? (
                <Fragment>
                  <RemoveIcon
                    onClick={() =>
                      dispatchInputs({ type: "peopleCountRemove" })
                    }
                    size={28}
                  />
                  <h3> {formState.peopleCount} </h3>
                  <AddIcon
                    onClick={() => dispatchInputs({ type: "peopleCountAdd" })}
                    size={28}
                  />
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
