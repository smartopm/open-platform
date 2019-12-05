import React, { useState } from "react";
import { useQuery } from "react-apollo";
import Nav from "../components/Nav";

import Loading from "../components/Loading.jsx";
import DateUtil from "../utils/dateutil.js";
import { AllEventLogsQuery } from "../graphql/queries.js";
import {
  a11yProps,
  StyledTabs,
  StyledTab,
  TabPanel
} from "../components/Tabs.jsx";
import EntryRequests from "./EntryRequests";
import ErrorPage from "../components/Error";

export default ({ match, location, history }) => {
  // auto route to gate logs if user is from requestUpdate
  const tabIndex = location.state ? location.state.tab : 0;
  if (match.params.userId) {
    return userEntryLogs(match.params.userId);
  } else {
    return allEntryLogs(tabIndex, history);
  }
};

const userEntryLogs = userId => {
  const { loading, error, data } = useQuery(AllEventLogsQuery, {
    variables: {
      subject: 'user_entry',
      refId: userId,
      refType: "User",
    },
    fetchPolicy: "no-cache"
  });
  if (loading) return <Loading />;
  if (error) return <ErrorPage title={error.message} />;

  return <UserComponent data={data} />;
};

const allEntryLogs = (tabId, history) => {
  const { loading, error, data } = useQuery(AllEventLogsQuery, {
    variables: {
      subject: 'user_entry',
      refId: null,
      refType: null,
    },
    fetchPolicy: "no-cache"
  });
  if (loading) return <Loading />;
  if (error) return <ErrorPage title={error.message} />;

  return <IndexComponent data={data} tabId={tabId} router={history} />;
};

export function IndexComponent({ data, tabId, router }) {
  const [value, setValue] = useState(tabId || 0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function routeToUserInfo(userId) {
    return router.push(`/user/${userId}/edit`);
  }
  function logs(entries) {
    return entries.map(entry => (
      <tr
        key={entry.id}
        onClick={() => routeToUserInfo(entry.user.id)}
        style={{
          cursor: "pointer"
        }}
      >
        <td>{entry.data.ref_name}</td>
        <td>{DateUtil.dateToString(new Date(entry.createdAt))}</td>
        <td>{DateUtil.dateTimeToString(new Date(entry.createdAt))}</td>
        <td>{entry.actingUser.name}</td>
      </tr>
    ));
  }
  return (
    <div>
      <div
        style={{
          backgroundColor: "#25c0b0"
        }}
      >
        <Nav menuButton="back" navName="Logs" boxShadow={"none"} />
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="request tabs"
          centered
        >
          <StyledTab label="Users" {...a11yProps(0)} />
          <StyledTab label="Gate Logs" {...a11yProps(1)} />
        </StyledTabs>
      </div>
      <TabPanel value={value} index={0}>
        <div className="row justify-content-center">
          <div className="col-10 col-sm-10 col-md-6">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Visitor</th>
                  <th scope="col">Date</th>
                  <th scope="col">Time</th>
                  <th scope="col">Reporter</th>
                </tr>
              </thead>
              <tbody>{logs(data.result)}</tbody>
            </table>
          </div>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <EntryRequests />
      </TabPanel>
    </div>
  );
}

export function UserComponent({ data }) {
  function logs(entries) {
    return entries.map(entry => (
      <tr key={entry.refId}>
        <td>{DateUtil.dateToString(new Date(entry.createdAt))}</td>
        <td>{DateUtil.dateTimeToString(new Date(entry.createdAt))}</td>
        <td>{entry.actingUser.name}</td>
      </tr>
    ));
  }

  return (
    <div>
      <Nav menuButton="back" />
      <div className="row justify-content-center">
        <div className="col-10 col-sm-10 col-md-6">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Time</th>
                <th scope="col">Reporter</th>
              </tr>
            </thead>
            <tbody>{logs(data.result)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
