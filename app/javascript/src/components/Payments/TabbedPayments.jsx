import React, { useState } from 'react';
import { shape } from 'prop-types';
import { useHistory } from 'react-router';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@material-ui/core'
import { StyledTabs, StyledTab, TabPanel } from '../Tabs';
import InvoiceList from './InvoiceList';
import AutogenerateInvoice from './AutogenerateInvoice';
import authStateProps from '../../shared/types/authState';
import CenteredContent from '../CenteredContent'
import { useParamsQuery } from '../../utils/helpers'
import PaymentList from './PaymentList';
import { currencies } from '../../utils/constants';

export default function TabbedPayments({ authState }) {
  const path = useParamsQuery();
  const tab = path.get('tab');
  const [value, setValue] = useState(tab || 'invoice');
  const history = useHistory()
  const currency = currencies[authState.user?.community.currency] || '';
  const [isDialogOpen, setDialogOpen] = useState(false)

  function handleChange(_event, newValue) {
    history.push(`/payments?tab=${newValue}`);
    setValue(newValue);
  }

  function handleGenerateDialog() {
    setDialogOpen(!isDialogOpen)
  }

  return (
    <>
      <Dialog
        open={isDialogOpen}
        fullWidth
        maxWidth="md"
        scroll="paper"
        onClose={handleGenerateDialog}
        aria-labelledby="generate_invoices"
      >
        <DialogTitle id="generate_invoices_dialog">
          <CenteredContent>
            <span>Generate Monthly Invoices</span>
          </CenteredContent>
        </DialogTitle>
        <DialogContent>
          <AutogenerateInvoice close={handleGenerateDialog} />
        </DialogContent>
      </Dialog>
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
            onClick={handleGenerateDialog}
            style={{marginLeft: '5px'}}
          >
            Create Monthly Invoices
          </Button>
        </CenteredContent>
      )}
    </>
  );
}

TabbedPayments.propTypes = {
  authState: shape({ ...authStateProps }).isRequired
};
