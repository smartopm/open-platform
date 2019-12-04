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
import ErrorPage from "../components/Error";

export default ({ match, location, history }) => {
  // auto route to gate logs if user is from requestUpdate
  const tabIndex = location.state ? location.state.tab : 0;
  return allEventLogs(tabIndex, history);
};

const allEventLogs = (tabId, history) => {
  const { loading, error, data } = useQuery(AllEventLogsQuery, {
    variables: {subject: null, refId: null, refType: null},
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

  function routeToAction(eventLog) {
    if (eventLog.refType === 'EntryRequest') {
      return router.push(`/entry_request/${eventLog.refId}`);
    } else if (eventLog.refType === 'User') {
      return router.push(`/user/${eventLog.refId}`);
    }
  }
  function logs(eventLogs) {
    return eventLogs.map(entry => (
      <tr
        key={entry.id}
        onClick={() => routeToAction(entry)}
        style={{
          cursor: "pointer"
        }}
      >
        <td>{entry.subject}</td>
        <td>{entry.sentence}</td>
        <td>{DateUtil.dateToString(new Date(entry.createdAt))}</td>
        <td>{DateUtil.dateTimeToString(new Date(entry.createdAt))}</td>
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
                  <th scope="col">Subject</th>
                  <th scope="col">Description</th>
                  <th scope="col">Date</th>
                  <th scope="col">Time</th>
                </tr>
              </thead>
              <tbody>{logs(data.eventLogs)}</tbody>
            </table>
          </div>
        </div>
      </TabPanel>
    </div>
  );
}

export function UserComponent({ data }) {
  function logs(entries) {
    return entries.map(entry => (
      <tr key={entry.id}>
        <td>{DateUtil.dateToString(new Date(entry.createdAt))}</td>
        <td>{DateUtil.dateTimeToString(new Date(entry.createdAt))}</td>
        <td>{entry.reportingUser.name}</td>
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
            <tbody>{logs(data.entryLogs)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
