import React, { Fragment } from "react";
import Nav from "../Nav";
import { css, StyleSheet } from "aphrodite";
import { withStyles, Tab } from "@material-ui/core";
import { a11yProps, StyledTabs, TabPanel } from "../Tabs";

export const StyledTab = withStyles({
  root: {
    textTransform: "none",
    color: "inherit"
  }
})(props => <Tab {...props} />);

export default function ClientView() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Fragment>
      <Nav navName="Client View" menuButton="back" backTo="/client_list" />
      <div className="row">
        <div className="container book-box">
          <div className="row row-one">
            <div className="col-md-3 col-sm-2 ">
              <img
                className="rounded-circle"
                src="http://via.placeholder.com/200x200"
              />
            </div>

            <div className="col-md-1 col-sm-2 "></div>
            <div className="col-md-8 col-sm-8 ">
              <h4>Olivier JM</h4>
              <span>Client since 2019</span>
            </div>
          </div>
        </div>
      </div>

      <StyledTabs
        value={value}
        onChange={handleChange}
        aria-label="request tabs"
        centered
      >
        <StyledTab label="Content" {...a11yProps(0)} />
        <StyledTab label="Notes" {...a11yProps(1)} />
        <StyledTab label="Plots" {...a11yProps(2)} />
        <StyledTab label="Interactions" {...a11yProps(4)} />
        <StyledTab label="Payments" {...a11yProps(5)} />
        <StyledTab label="Activity" {...a11yProps(3)} />
      </StyledTabs>

      <TabPanel value={value} index={0}>
        <div className="container">
        <h4 className="text-center">Content</h4>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <h4 className="text-center">Notes</h4>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <h4 className="text-center">Plots</h4>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <h4 className="text-center">Interactions</h4>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <h4 className="text-center">Payments</h4>
      </TabPanel>
      <TabPanel value={value} index={5}>
        <h4 className="text-center">Activity</h4>
      </TabPanel>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  userAvatar: {
    borderRadius: "20%"
  }
});
