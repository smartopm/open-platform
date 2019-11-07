import React, { useState } from "react";
import QrReader from "react-qr-reader";
import {
  a11yProps,
  StyledTabs,
  StyledTab,
  TabPanel
} from "../components/Tabs.jsx";
import Nav from "../components/Nav";
import IdCard from "./IdCard.jsx";

export default function QRScan() {
  const [scanned, setScanned] = useState(false);
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleScan = data => {
    if (data) {
      setScanned(true);
      window.location = data;
    }
  };

  const handleError = err => {
    console.error(err);
  };

  return (
    <div>
      <div
        style={{
          backgroundColor: "#53d6a5"
        }}
      >
        <Nav navName="Scanner" menuButton="back" boxShadow={"none"} />
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="scanner tabs"
          centered
        >
          <StyledTab label="My ID" {...a11yProps(0)} />
          <StyledTab label="ID Scanner" {...a11yProps(1)} />
        </StyledTabs>
      </div>
      <TabPanel value={value} index={0}>
        <div className="container">
          <IdCard />
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        {scanned ? (
          <h1>Decoding...</h1>
        ) : (
          <QrReader
            delay={100}
            onError={handleError}
            onScan={handleScan}
            style={{ width: "100%" }}
          />
        )}
      </TabPanel>
    </div>
  );
}
