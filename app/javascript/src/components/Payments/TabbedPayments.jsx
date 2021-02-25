import React, { useState } from 'react';
import { shape } from 'prop-types';
import { useHistory } from 'react-router';
import { StyledTabs, StyledTab, TabPanel } from '../Tabs';
import InvoiceList from './InvoiceList';
import authStateProps from '../../shared/types/authState';
import { useParamsQuery } from '../../utils/helpers'
import PaymentList from './PaymentList';
import { currencies } from '../../utils/constants';

export default function TabbedPayments({ authState }) {
  const path = useParamsQuery();
  const tab = path.get('tab');
  const [value, setValue] = useState(tab || 'invoice');
  const history = useHistory()
  const currency = currencies[authState.user?.community.currency] || '';
  const currencyData = {currency, locale: authState.user?.community.locale }

  function handleChange(_event, newValue) {
    history.push(`/payments?tab=${newValue}`);
    setValue(newValue);
  }

  return (
    <>
      <StyledTabs value={value} onChange={handleChange} aria-label="request tabs" centered>
        <StyledTab label="Invoices" value='invoice' />
        <StyledTab label="Payments" value='payment' />
      </StyledTabs>

      <TabPanel value={value} index='invoice'>
        <InvoiceList currencyData={currencyData} />
      </TabPanel>
      <TabPanel value={value} index='payment'>
        <PaymentList currencyData={currencyData} />
      </TabPanel>
    </>
  );
}

TabbedPayments.propTypes = {
  authState: shape({ ...authStateProps }).isRequired
};
