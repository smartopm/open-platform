/* eslint-disable */
// kindly re-enable eslint here
import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CenteredContent from '../CenteredContent';
import DataList from '../../shared/list/DataList';
import { useQuery } from 'react-apollo';
import { GridText } from '../../shared/Text';
import { Spinner } from '../../shared/Loading';
import { dateToString } from '../DateContainer';
import { formatMoney, formatError } from '../../utils/helpers';
import UserInvoiceItem from './UserInvoiceItem';
import { PaidInvoicesByPlan } from '../../graphql/queries';
import ListHeader from '../../shared/list/ListHeader';
export default function UserPaymentPlanItem({ plans, currencyData }) {
  console.log(plans);
  // const paymentPlanId = plan.id
  // const { loading, data: invoicesByPlan, error, refetch } = useQuery(
  //   PaidInvoicesByPlan,
  //   {
  //     variables: { paymentPlanId },
  //     errorPolicy: 'all'
  //   }
  // )

  const planHeader = [
    { title: 'Plot Number', col: 1 },
    { title: 'Balance', col: 2 },
    { title: 'Start Date', col: 2 },
    { title: '% of total valuation', col: 1 },
    { title: 'Plan Type', col: 3 }
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
      {plans.map(plan => (
        <Accordion key={plan.id}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-label="Expand"
            aria-controls="additional-actions3-content"
            id="additional-actions3-header"
          >
            <DataList
              keys={planHeader}
              data={[renderPlan(plan, currencyData)]}
              hasHeader={false}
              clickable={false}
              handleClick={() => console.log('click')}
            />
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="textSecondary">
              <ListHeader headers={invoiceHeader} />
              {plan.invoices
                ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map(inv => (
                  <UserInvoiceItem key={inv.id} invoice={inv} currencyData={currencyData} />
                ))}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}

export function renderPlan(plan, currencyData) {
  return {
    'Plot Number': <Grid item xs={12} sm={2} data-testid="plot-number"> 
                      {plan.landParcel.parcelNumber}
                   </Grid>,
    Balance: <Grid item xs={12} sm={2} data-testid="balance"> 
                {formatMoney(currencyData, plan?.plotBalance)}
             </Grid>,
    'Start Date': <Grid item xs={12} sm={2} data-testid="start-date"> 
                    {dateToString(plan.startDate)}
                  </Grid>,
    '% of total valuation': <Grid item xs={12} sm={2} data-testid="percentage"> 
                              {plan.percentage}
                            </Grid>,
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
  ).isRequired
};
