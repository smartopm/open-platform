import React, { useState } from 'react';
import { shape } from 'prop-types';
import { useHistory } from 'react-router';
import { useMutation } from 'react-apollo'
import Button from '@material-ui/core/Button'
import { StyledTabs, StyledTab, TabPanel } from '../Tabs';
import InvoiceList from './InvoiceList';
import authStateProps from '../../shared/types/authState';
import CenteredContent from '../CenteredContent'
import { GenerateCurrentMonthInvoices } from '../../graphql/mutations'
import { formatError, useParamsQuery } from '../../utils/helpers'
import PaymentList from './PaymentList';
import { currencies } from '../../utils/constants';
import MessageAlert from "../MessageAlert"

export default function TabbedPayments({ authState }) {
  const path = useParamsQuery();
  const tab = path.get('tab');
  const [value, setValue] = useState(tab || 'invoice');
  const history = useHistory()
  const [isSuccessAlert, setIsSuccessAlert] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')
  const [generateCurrentMonthInvoices] = useMutation(GenerateCurrentMonthInvoices)
  const currency = currencies[authState.user?.community.currency] || '';

  function handleChange(_event, newValue) {
    history.push(`/payments?tab=${newValue}`);
    setValue(newValue);
  }

  function handleInvoiceGenerate() {
    generateCurrentMonthInvoices({}).then(() => {
      setMessageAlert('Invoices Generated')
      setIsSuccessAlert(true)
    }).catch((err) => {
      setMessageAlert(formatError(err.message))
      setIsSuccessAlert(false)
    })
  }

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return
    }
    setMessageAlert('')
  }

  return (
    <>
      <MessageAlert
        type={isSuccessAlert ? 'success' : 'error'}
        message={messageAlert}
        open={!!messageAlert}
        handleClose={handleMessageAlertClose}
      />
      <StyledTabs value={value} onChange={handleChange} aria-label="request tabs" centered>
        <StyledTab label="Invoices" value='invoice' />
        <StyledTab label="Payments" value='payment' />
      </StyledTabs>

      <TabPanel value={value} index='invoice'>
        <InvoiceList currency={currency} />
      </TabPanel>
      <TabPanel value={value} index='payment'>
        <PaymentList currency={currency} />
      </TabPanel>
      {authState.user.userType === 'admin' && (
        <CenteredContent>
          <Button 
            variant="contained" 
            data-testid="invoice-generate-button" 
            color="primary" 
            onClick={handleInvoiceGenerate}
            style={{marginLeft: '5px'}}
          >
            Generate Invoices For This Month
          </Button>
        </CenteredContent>
      )}
    </>
  );
}

TabbedPayments.propTypes = {
  authState: shape({ ...authStateProps }).isRequired
};
