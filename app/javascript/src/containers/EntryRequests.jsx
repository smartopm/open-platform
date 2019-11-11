import React, { useState } from "react";
import { useQuery } from "react-apollo";
import Nav from "../components/Nav";

import Loading from "../components/Loading.jsx";
import DateUtil from "../utils/dateutil.js";
import { AllEntryRequestsQuery } from "../graphql/queries.js";

import {
  a11yProps,
  StyledTabs,
  StyledTab,
  TabPanel
} from "../components/Tabs.jsx";

export default () => {
  return allEntryRequests();
};

const allEntryRequests = () => {
  const { loading, error, data } = useQuery(AllEntryRequestsQuery, {
    fetchPolicy: "no-cache"
  });
  if (loading) return <Loading />;
  if (error) return `Error! ${error}`;

  console.log(data)
  return <IndexComponent data={data} />;
};

export function IndexComponent({ data }) {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  function logs(entries) {
    console.log(entries)
    return entries.map(entry => (
      <tr key={entry.id}>
        <td>{entry.name}</td>
        <td>{DateUtil.dateToString(new Date(entry.createdAt))}</td>
        <td>{DateUtil.dateTimeToString(new Date(entry.createdAt))}</td>
        <td>{["Pending", "Granted", "Denied"][entry.grantedState] || "Pending"}</td>
      </tr>
    ));
  }
  return (
    <div>
      <div
        style={{
          backgroundColor: "#53d6a5"
        }}
      >
        <Nav menuButton="back" navName="Logs" boxShadow={"none"} />
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="request tabs"
          centered
        >
          <StyledTab label="Entry Requests" {...a11yProps(0)} />
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
                  <th scope="col">State</th>
                </tr>
              </thead>
              <tbody>{logs(data.result)}</tbody>
            </table>
          </div>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <h4 className="text-center">Entry Requests</h4>
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
