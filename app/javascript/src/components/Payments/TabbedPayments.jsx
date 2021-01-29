import React from 'react';
import { shape } from 'prop-types';
import { a11yProps, StyledTabs, StyledTab, TabPanel } from '../Tabs';
import PaymentList from './PaymentList';
import authStateProps from '../../shared/types/authState';

export default function TabbedPayments({ authState }) {
  const [value, setValue] = React.useState(0);
  function handleChange(_event, newValue) {
    setValue(newValue);
  }
  return (
    <>
      <StyledTabs value={value} onChange={handleChange} aria-label="request tabs" centered>
        <StyledTab label="Invoices" {...a11yProps(0)} />
        <StyledTab label="Payments" {...a11yProps(1)} />
      </StyledTabs>

      <TabPanel value={value} index={0}>
        <PaymentList authState={authState} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className="container">Coming soon ...</div>
      </TabPanel>
    </>
  );
}

TabbedPayments.propTypes = {
  authState: shape({ ...authStateProps }).isRequired
};
