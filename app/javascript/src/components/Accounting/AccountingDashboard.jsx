import React, { useState } from 'react'
import { useHistory } from 'react-router';
import { StyledTabs, StyledTab, TabPanel } from '../Tabs';
import InvoiceGraph from './InvoiceGraph'
import PaymentGraph from './PaymentGraph'
import { useParamsQuery } from '../../utils/helpers';

export default function AccountingDashboard({ userId }) {
  const path = useParamsQuery();
  const tab = path.get('tab');
  const history = useHistory()
  const [value, setValue] = useState(tab || 'invoice');

  function handleChange(_event, newValue) {
    history.push(`/accounting_dashboard?tab=${newValue}`);
    setValue(newValue);
  }
  return (
    <>
      <StyledTabs value={value} onChange={handleChange} aria-label="request tabs" centered>
        <StyledTab label="Invoices" value='invoice' />
        <StyledTab label="Payments" value='payment' />
      </StyledTabs>

      <TabPanel value={value} index='invoice'>
        <InvoiceGraph userId={userId} />
      </TabPanel>
      <TabPanel value={value} index='payment'>
        <PaymentGraph userId={userId} />
      </TabPanel>
    </>
  )
}