/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import DataList from '../../../../shared/list/DataList';
import Text, { GridText } from '../../../../shared/Text';
import { dateToString } from '../../../../components/DateContainer';
import CenteredContent from '../../../../components/CenteredContent';
import { formatMoney } from '../../../../utils/helpers';

export default function UserTransactionsList({transaction, currencyData }) {
  const { t } = useTranslation('common')

  const transactionHeader = [
    { title: 'Date', value: t('common:table_headers.date'), col: 1 },
    { title: 'Recorded by', value: t('common:table_headers.recorded_by'), col: 1 },
    { title: 'Payment Type', value: t('common:table_headers.payment_type'), col: 2 },
    { title: 'Payment/Receipt ID', value: t('common:table_headers.payment_id'), col: 1 },
    { title: 'Amount Paid', value: t('common:table_headers.amount_paid'), col: 1 }
  ];

  if (!Object.keys(transaction).length || Object.keys(transaction).length === 0) {
    return <CenteredContent><Text content="No Transactions Yet" align="justify" /></CenteredContent>
  }

  return (
    <div>
      <DataList
        keys={transactionHeader}
        data={[renderTransactions(transaction, currencyData)]}
        hasHeader={false}
        color
      />
    </div>
  )
}

export function renderTransactions(transaction, currencyData) {
  return {
    'Date': (
      <GridText
        data-testid="date"
        content={dateToString(transaction.createdAt)}
      />
    ),
    'Recorded by': (
      <GridText
        data-testid="recorded"
        content={transaction.depositor.name}
      />
    ),
    "Payment Type": (
      <GridText
        data-testid="description"
        content={transaction.source}
      />
    ),
    "Amount Paid": (
      <Grid item xs={12} md={2} data-testid="amount">
        <Text content={formatMoney(currencyData, transaction.allocatedAmount)} />
        <br />
        <Text color="primary" content={`unallocated ${formatMoney(currencyData, transaction.unallocatedAmount)}`} />
      </Grid>
    )
  };
}

UserTransactionsList.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  transaction: PropTypes.object.isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired,
  userData: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired
};
