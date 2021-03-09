/* eslint-disable */
// kindly re-enable eslint here
import React from 'react'
import PropTypes from 'prop-types'
import {
  Grid, Typography, Accordion, AccordionSummary, AccordionDetails
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DataList from '../../shared/list/DataList';
import { GridText } from '../../shared/Text';
import { dateToString } from '../DateContainer';
import { formatMoney } from '../../utils/helpers';

export default function UserPaymentPlanItem({ plan, currencyData }){
  const keys = [
    { title: 'Plot Number', col: 1 },
    { title: 'Balance', col: 2 },
    { title: 'Start Date', col: 2 },
    { title: '% of total valuation', col: 1 },
    { title: 'Plan Type', col: 3 }
  ];

  return (
    <>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-label="Expand"
          aria-controls="additional-actions3-content"
          id="additional-actions3-header"
        >
          <DataList
            keys={keys} 
            data={[renderPlan(plan, currencyData)]}
            hasHeader={false} 
            clickable={false}
            handleClick={() => console.log('click')}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Typography color="textSecondary">
            Demo Text
          </Typography>
        </AccordionDetails>
      </Accordion>
    </>
  )
}

export function renderPlan(plan, currencyData) {
  return {
    'Plot Number': (
      <GridText
        col={4}
        content={ plan?.landParcel?.parcelNumber }
      />
    ),
    Balance: (
      <GridText
        col={4}
        content={ formatMoney(currencyData, plan?.plotBalance) }
      />
    ),
    'Start Date': (
      <GridText
        col={4}
        content={ dateToString(plan?.startDate) }
      />
    ),
    '% of total valuation': (
      <GridText
      col={4}
      content={ plan?.percentage }
    />
    ),
  };
}
UserPaymentPlanItem.propTypes = {
  plan: PropTypes.shape({
    plotNumber: PropTypes.number,
    plotBalance: PropTypes.number,
    balance: PropTypes.string,
    startDate: PropTypes.string,
    createdAt: PropTypes.string
  }).isRequired
};
