/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { DetailsDialog } from '../Dialog';
import DetailsField from './DetailField';
import { dateToString } from '../DateContainer';
import { formatMoney } from '../../utils/helpers';

export default function TransactionDetails({ data, detailsOpen, handleClose, currencyData }) {
  const balance = data.__typename === 'WalletTransaction' ? data.currentWalletBalance : data.balance;
  return (
    <>
      <DetailsDialog
        handleClose={handleClose}
        open={detailsOpen}
        title={data.__typename === 'WalletTransaction' ? 'Transaction' : 'Invoice'}
      >
        <div style={{ marginLeft: '20px' }}>
          <Typography variant="caption">Current Wallet Balance</Typography>
          <Typography color="primary" variant="h5">
            {formatMoney(currencyData, balance)}
          </Typography>
        </div>
        <DetailsField title="Amount" value={formatMoney(currencyData, data?.amount)} />
        {data.balance && (
          <div>
            <DetailsField
              title="Pending Amount"
              value={formatMoney(currencyData, data?.pendingAmount)}
            />
            <DetailsField title="Invoice Number" value={data?.invoiceNumber} />
            <DetailsField title="Status" value="Unpaid" />
            <DetailsField title="Issued Date" value={dateToString(data?.createdAt)} />
            <DetailsField title="Due Date" value={dateToString(data?.dueDate)} />
          </div>
        )}
        {data.__typename === 'WalletTransaction' && (
          <div>
            <DetailsField
              title="Payment Type"
              value={data?.source === 'wallet' ? 'From-balance' : data?.source}
            />
            <DetailsField title="Payment Date" value={dateToString(data?.createdAt)} />
            <DetailsField title="Payment Made By" value={data?.user?.name} />
            <DetailsField title="Status" value="Paid" />
          </div>
        )}
      </DetailsDialog>
    </>
  );
}

TransactionDetails.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired,
  detailsOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};
