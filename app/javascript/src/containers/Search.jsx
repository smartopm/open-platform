import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLazyQuery } from "react-apollo";
import gql from "graphql-tag";
import { StyleSheet, css } from "aphrodite";

import Loading from "../components/Loading.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import Avatar from "../components/Avatar.jsx";
import ScanIcon from "../../../assets/images/shape.svg";
import { Button } from "@material-ui/core";

const QUERY = gql`
  query UserSearch($name: String!) {
    userSearch(name: $name) {
      id
      userType
      name
      state
      roleName
      imageUrl
      avatarUrl
    }
  }
`;

function Results({ data, loading, called }) {
  function memberList(users) {
    return users.map(user => (
      <Link to={`/user/${user.id}`} key={user.id} className={css(styles.link)}>
        <div className="d-flex flex-row align-items-center py-2">
          <Avatar user={user} style="small" />
          <div className={`px-3 w-100`}>
            <h6 className={css(styles.title)}>{user.name}</h6>
            <small className={css(styles.small)}> {user.roleName} </small>
          </div>
          <div className={`px-2 align-items-center`}>
            <StatusBadge label={user.state} />
          </div>
        </div>
      </Link>
    ));
  }
  if (called && loading) {
    return <Loading />;
  }

  if (called && data) {
    return (
      <div className={`col-12 ${css(styles.results)}`}>
        {data.userSearch.length > 0 ? (
          memberList(data.userSearch)
        ) : (
          <div className={`${css(styles.noResults)}`}>
            <h4>No results found!</h4>
            <br />
            <div className="d-flex justify-content-center">
              <Link to="/user/request">
                <Button
                  variant="contained"
                  className={`btn ${css(styles.requestButton)}`}
                >
                  Create a new request
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }
  return false;
}

export default function SearchContainer() {
  function updateSearch(e) {
    const { value } = e.target;
    setName(value || "");
    if (value && value.length > 0) {
      loadGQL({ variables: { name: value } });
    }
  }

  const [name, setName] = useState("");
  const [loadGQL, { called, loading, error, data }] = useLazyQuery(QUERY);
  if (error) {
    return <div>Error {error}</div>;
  }

  return (
    <div className="container">
      <div className={`row justify-content-center ${css(styles.inputGroup)}`}>
        <input
          className={`form-control ${css(styles.input)}`}
          onChange={updateSearch}
          type="text"
          placeholder="Search"
          value={name}
          autoFocus
        />
        <Link to="/" className={css(styles.cancelBtn)}>
          <i className="material-icons">arrow_back</i>
        </Link>
        <Link to="/scan">
          <img
            src={ScanIcon}
            alt="scan icon"
            className={` ${css(styles.scanIcon)}`}
          />
        </Link>

        {name.length > 0 && <Results {...{ data, loading, called }} />}
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  results: {
    margin: "1em 0",
    padding: 0
  },
  link: {
    "text-decoration": "none",
    color: "#222",
    ":hover": {
      "text-decoration": "none",
      color: "#222"
    }
  },
  title: {
    color: "#222",
    "font-size": "0.9em",
    lineHeight: "0.5em",
    margin: "0.5em 0 0 0"
  },
  small: {
    "font-size": "0.8em",
    color: "#666"
  },
  avatar: {},
  vertCenter: {
    alignItems: "center"
  },
  avatarImg: {
    "border-radius": "50%",
    width: "50px"
  },
  statusBadgePending: {
    border: "1px dashed #46ce84",
    color: "#46ce84",
    borderRadius: "10px"
  },
  inputGroup: {
    border: "1px solid #AAA",
    "border-radius": "5px",
    position: "relative",
    height: "48px",
    backgroundColor: "#FFF"
  },
  input: {
    height: "36px",
    border: "none",
    width: "100%",
    padding: "0.7em 0 0em 3em",
    color: "#222",
    "background-image": "none",
    "::placeholder": {
      color: "#999"
    }
  },
  cancelBtn: {
    color: "#666",
    position: "absolute",
    left: "10px",
    top: "12px",
    bottom: "4px",
    "z-index": 9
  },
  scanIcon: {
    position: "absolute",
    bottom: 4,
    right: 5,
    width: 24,
    height: 35
  },
  noResults: {
    margin: "4em 0",
    textAlign: "center"
  },
  requestButton: {
    backgroundColor: "rgb(61, 199, 113)",
    color: "#FFF"
  }
});
