import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-apollo";
import gql from "graphql-tag";
import { StyleSheet, css } from "aphrodite";
import { formatDistance } from "date-fns";
import Nav from "../components/Nav.jsx";
import Loading from "../components/Loading.jsx";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { CardContent, Card, withStyles } from "@material-ui/core";
import Avatar from "../components/Avatar";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

const QUERY = gql`
  {
    results: pendingUsers {
      id
      userType
      name
      state
      roleName
      createdAt
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
                  <Avatar imageURL={user.imageURL} user={user} />
                </div>
                <div className={`col ${css(styles.userInfo)}`}>
                  <h6 className={css(styles.title)}>{user.name}</h6>
                  <br />
                  <small className={css(styles.small)}> {user.roleName} </small>
                </div>
                <div className={`col ${css(styles.userInfo)}`}>
                  <div className={`px-2 align-items-center`}>
                    {`${formatDistance(
                      new Date(user.createdAt),
                      new Date()
                    )} ago`}
                  </div>
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

const StyledTabs = withStyles({
  indicator: {
    backgroundColor: "transparent",
    "& > div": {
      maxWidth: 40,
      width: "100%",
      backgroundColor: "#FFF"
    }
  }
})(props => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />);

const StyledTab = withStyles({
  root: {
    textTransform: "none",
    color: "#fff",
    display: "flex",
    justifyContent: "center"
  }
})(props => <Tab {...props} />);

export default () => {
  const { loading, error, data } = useQuery(QUERY, { variables: { name } });
  const [value, setValue] = React.useState(0);
  if (error) return `Error! ${error}`;
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`
    };
  }
  return (
    <div>
      <div
        style={{
          backgroundColor: "#46ce84"
        }}
      >
        <Nav navName="Requests" menuButton="back" boxShadow={"none"} />
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="request tabs"
          centered
        >
          <StyledTab label="Pending" {...a11yProps(0)} />
          <StyledTab label="Closed" {...a11yProps(1)} />
        </StyledTabs>
      </div>
      <TabPanel value={value} index={0}>
        <div className="container">
          <div
            className={`row justify-content-center ${css(styles.inputGroup)}`}
          >
            <Results {...{ data, loading }} />
          </div>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Nothing yet
      </TabPanel>
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
    width: "50px"
  },
  statusBadgePending: {
    border: "1px dashed #46ce84",
    color: "#46ce84",
    borderRadius: "10px"
  }
});
