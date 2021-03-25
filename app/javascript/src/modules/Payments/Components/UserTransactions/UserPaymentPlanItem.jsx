import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DataList from '../../../../shared/list/DataList';
import { dateToString } from '../../../../components/DateContainer';
import { formatMoney, InvoiceStatusColor, propAccessor } from '../../../../utils/helpers';
import Text from '../../../../shared/Text';
import Label from '../../../../shared/label/Label';
import { invoiceStatus } from '../../../../utils/constants';

export default function UserPaymentPlanItem({ plans, currencyData }) {
  const classes = useStyles();
  const planHeader = [
    { title: 'Plot Number', col: 1 },
    { title: 'Balance', col: 2 },
    { title: 'Start Date', col: 2 },
    { title: '% of total valuation', col: 1 }
  ];

  const invoiceHeader = [
    { title: 'Issue Date', col: 4 },
    { title: 'Description', col: 4 },
    { title: 'Amount', col: 3 },
    { title: 'Payment Date', col: 3 },
    { title: 'Status', col: 4 }
  ];

  return (
    <>
      {plans?.map(plan => (
        <Accordion key={plan.id}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-label="Expand"
            id="additional-actions3-header"
            classes={{ content: classes.content }}
            data-testid="summary"
          >
            <DataList
              keys={planHeader}
              data={[renderPlan(plan, currencyData)]}
              hasHeader={false}
              clickable={false}
            />
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.content }}>
            {plan.invoices && plan.invoices?.length &&
              <Typography color='primary' style={{margin: '0 0 10px 50px'}}>Invoices</Typography>}
            {plan.invoices
                ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map(inv => (
                  <div key={inv.id} style={{margin: '0 50px'}}>
                    <DataList
                      keys={invoiceHeader}
                      data={[renderInvoice(inv, currencyData)]}
                      hasHeader={false}
                      clickable={false}
                    />
                  </div>
                ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}

export function renderPlan(plan, currencyData) {
  return {
    'Plot Number':
  <Grid item xs={12} md={2} data-testid="plot-number">
    {plan.landParcel.parcelNumber}
  </Grid>,
    Balance:
  <Grid item xs={12} md={2} data-testid="balance">
    {formatMoney(currencyData, plan.plotBalance)}
  </Grid>,
    'Start Date':
  <Grid item xs={12} md={2} data-testid="start-date">
    {dateToString(plan.startDate)}
  </Grid>,
    '% of total valuation':
  <Grid item xs={12} md={2} data-testid="percentage">
    {plan.percentage}
  </Grid>,
  };
}

export function renderInvoice(inv, currencyData) {
  return {
    'Issue Date': (
      <Grid item xs={12} md={2} data-testid="issue-date">
        <Text content={dateToString(inv.createdAt)} />
        <br />
        <Typography variant='caption' style={{fontWeight: 'bold'}}>Issue Date</Typography>
      </Grid>),
    'Description': (
      <Grid item xs={12} md={2} data-testid="description">
        <Text content={`Invoice #${inv.invoiceNumber}`} />
        <br />
        <Typography variant='caption' style={{fontWeight: 'bold'}}>Description</Typography>
      </Grid>
    ),
    Amount: (
      <Grid item xs={12} md={2} data-testid="amount">
        <Text content={formatMoney(currencyData, inv.amount)} />
        <br />
        <Typography variant='caption' style={{fontWeight: 'bold'}}>Amount</Typography>
      </Grid>
    ),
    'Payment Date': (
      <Grid item xs={12} md={2} data-testid="payment-date">
        {inv.status === 'paid' && inv.payments?.length
          ? <Text content={dateToString(inv.payments[0]?.createdAt)} /> : '-'}
        <br />
        <Typography variant='caption' style={{fontWeight: 'bold'}}>Payment Date</Typography>
      </Grid>
    ),
    'Status': (
      <Grid item xs={12} md={2} data-testid="status">
        {new Date(inv.dueDate) < new Date().setHours(0,0,0,0) && inv.status === 'in_progress' ? (
          <Label
            title='Due'
            color='#B63422'
          />
        ) : (
          <Label
            title={propAccessor(invoiceStatus, inv.status)}
            color={propAccessor(InvoiceStatusColor, inv.status)}
          />
        ) }
      </Grid>
    ),
  };
}

UserPaymentPlanItem.propTypes = {
  plans: PropTypes.arrayOf(
    PropTypes.shape({
      plotNumber: PropTypes.number,
      plotBalance: PropTypes.number,
      balance: PropTypes.string,
      startDate: PropTypes.string,
      createdAt: PropTypes.string
    })
  ).isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired
};

const useStyles = makeStyles(() => ({
  content: {
    display: 'inline'
  }
}));