/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import DataList from '../../../../shared/list/DataList';
import Text, { GridText } from '../../../../shared/Text';
import { dateToString } from '../../../../components/DateContainer';
import CenteredContent from '../../../../components/CenteredContent';
import TransactionDetails from '../TransactionDetails'
import { formatMoney } from '../../../../utils/helpers';
import PaymentReceipt from './PaymentReceipt';

export default function UserTransactionsList({transaction, currencyData, userData, depRefetch }) {
  const [open, setOpen] = useState(false)
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const anchorElOpen = Boolean(anchorEl)
  const { t } = useTranslation('common')


  const transactionHeader = [
    { title: 'Date', value: t('common:table_headers.date'), col: 1 },
    { title: 'Recorded by', value: t('common:table_headers.recorded_by'), col: 1 },
    { title: 'Payment Type', value: t('common:table_headers.payment_type'), col: 2 },
    { title: 'Payment/Receipt ID', value: t('common:table_headers.payment_id'), col: 1 },
    { title: 'Amount Paid', value: t('common:table_headers.amount_paid'), col: 1 }
  ];

  useEffect(() => {
    if (anchorElOpen) {
      setOpen(false)
    }
  }, [anchorElOpen])


  if (!Object.keys(transaction).length || Object.keys(transaction).length === 0) {
    return <CenteredContent><Text content="No Transactions Yet" align="justify" /></CenteredContent>
  }

  function handleOpenReceipt(){
    setOpen(false)
    setReceiptOpen(!receiptOpen)
    handleClose()
  }

  function handleClose() {
    setAnchorEl(null)
  }

  function handleOpenDetails(){
    // in case the user had earlier opened with the editing menu
    setIsEditing(false)
    setOpen(true)
  }

  return (
    <div>
      <DataList
        keys={transactionHeader}
        data={[renderTransactions(transaction, currencyData)]}
        hasHeader={false}
        clickable={!anchorElOpen}
        handleClick={handleOpenDetails}
        color
      />
      <TransactionDetails
        detailsOpen={open}
        handleClose={() => setOpen(false)}
        data={transaction}
        currencyData={currencyData}
        title={`${transaction.__typename === 'WalletTransaction'? 'Transaction' : 'Invoice'}`}
        isEditing={isEditing}
        refetchTransactions={depRefetch}
      />
      <PaymentReceipt
        paymentData={transaction}
        open={receiptOpen}
        handleClose={handleOpenReceipt}
        userData={userData}
        currencyData={currencyData}
      />
    </div>
  )
}

export function renderTransactions(transaction, currencyData) {
  return {
    'Date': (
      <GridText
        content={dateToString(transaction.createdAt)}
      />
    ),
    'Recorded by': (
      <GridText
        content={transaction.user.name}
      />
    ),
    "Payment Type": (
      <GridText
        data-testid="description"
        content={transaction.source}
      />
    ),
    "Payment/Receipt ID": (
      <GridText
        data-testid="description"
        content={transaction.transactionNumber}
      />
    ),
    "Amount Paid": (
      <GridText
        data-testid="description"
        content={formatMoney(currencyData, transaction.amount)}
      />
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
  }).isRequired,
  depRefetch: PropTypes.func.isRequired,
};
