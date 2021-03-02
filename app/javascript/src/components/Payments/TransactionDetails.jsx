/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { useLocation } from 'react-router-dom';
import { DetailsDialog } from '../Dialog';
import DetailsField from '../../shared/DetailField';
import { dateToString } from '../DateContainer';
import { formatMoney } from '../../utils/helpers';

export default function TransactionDetails({ data, detailsOpen, handleClose, currencyData, isEditing }) {
  const balance = data.__typename === 'WalletTransaction' ? data.currentWalletBalance : data.balance;
  const { pathname } = useLocation();
  return (
    <>
      <DetailsDialog
        handleClose={handleClose}
        open={detailsOpen}
        title={data.__typename === 'WalletTransaction' ? 'Transaction' : 'Invoice'}
      >
        {pathname !== '/payments' && (
          <div style={{ marginLeft: '20px' }}>
            <Typography variant="caption">Current Wallet Balance</Typography>
            <Typography color="primary" variant="h5">
              {formatMoney(currencyData, balance)}
            </Typography>
          </div>
        )}
        <DetailsField editable={false} title="Amount" value={formatMoney(currencyData, data?.amount)} />
        {data.balance && (
          <div>
            <DetailsField
              title="Pending Amount"
              value={formatMoney(currencyData, data?.pendingAmount)}
              editable={false}
            />
            <DetailsField editable={false} title="Invoice Number" value={data?.invoiceNumber} />
            <DetailsField editable={false} title="Status" value="Unpaid" />
            <DetailsField
              editable={false}
              title="Issued Date"
              value={dateToString(data?.createdAt)}
            />
            <DetailsField editable={false} title="Due Date" value={dateToString(data?.dueDate)} />
          </div>
        )}
        {data.__typename === 'WalletTransaction' && (
          <div>
            <DetailsField
              editable={isEditing}
              title="Payment Type"
              value={data?.source === 'wallet' ? 'From-balance' : data?.source}
            />
            <DetailsField
              editable={isEditing}
              title="Payment Date"
              value={dateToString(data?.createdAt)}
            />
            <DetailsField editable={false} title="Payment Made By" value={data?.user?.name} />
            <DetailsField editable={isEditing} title="Status" value="Paid" />
          </div>
        )}
      </DetailsDialog>
    </>
  );
}
TransactionDetails.defaultProps = {
  isEditing: false
}
TransactionDetails.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired,
  detailsOpen: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool,
  handleClose: PropTypes.func.isRequired
};
