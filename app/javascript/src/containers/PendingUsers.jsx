import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-apollo";
import gql from "graphql-tag";
import { StyleSheet, css } from "aphrodite";
import Nav from "../components/Nav.jsx";
import Loading from "../components/Loading.jsx";
import { CardContent, Card } from "@material-ui/core";

const QUERY = gql`
  {
    results: pendingUsers {
      id
      userType
      name
      state
      roleName
      imageUrl
    }
  }
`;

function Results({ data, loading }) {
  function memberList(users) {
    return users.map(user => (
      <Link
        to={`/user/${user.id}/edit`}
        key={user.id}
        className={css(styles.link)}
      >
        <Card>
          <CardContent>
            <div className="container">
              <div className="row">
                <div className={`col ${css(styles.userInfo)}`}>
                  <img
                    src="/images/default_avatar.svg"
                    className={css(styles.avatarImg)}
                    alt="user_picture"
                  />
                </div>
                <div className={`col ${css(styles.userInfo)}`}>
                  <h6 className={css(styles.title)}>{user.name}</h6>
                  <br />
                  <small className={css(styles.small)}> {user.roleName} </small>
                </div>
                <div className={`col ${css(styles.userInfo)}`}>
                  <div className={`px-2 align-items-center`}>2 hours</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    ));
  }
  if (loading) {
    return <Loading />;
  }

  if (data) {
    return (
      <div className={`col-12 ${css(styles.results)}`}>
        {data.results && data.results.length > 0 ? (
          memberList(data.results)
        ) : (
          <h4>No Pending Users Found</h4>
        )}
      </div>
    );
  }
  return false;
}

export default () => {
  const { loading, error, data } = useQuery(QUERY, { variables: { name } });
  if (error) return `Error! ${error}`;
  console.log(data);

  return (
    <div>
      <Nav navName="Pending Users" menuButton="cancel" />
      <div className="container">
        <div className={`row justify-content-center ${css(styles.inputGroup)}`}>
          <Results {...{ data, loading }} />
        </div>
      </div>
    </div>
  );
};

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
    width: "100px"
  },
  statusBadgePending: {
    border: "1px dashed #46ce84",
    color: "#46ce84",
    borderRadius: "10px"
  },
  userInfo: {
    padding: 5
  }
});
