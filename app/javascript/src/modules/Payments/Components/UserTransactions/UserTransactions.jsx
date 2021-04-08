/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-apollo';
import PropTypes from 'prop-types';
import { Grid, IconButton, Tooltip } from '@material-ui/core';
import { MoreHorizOutlined } from '@material-ui/icons';
import { WalletTransactionRevert } from '../../../../graphql/mutations/transactions';
import DataList from '../../../../shared/list/DataList';
import Text, { GridText } from '../../../../shared/Text';
import { dateToString } from '../../../../components/DateContainer';
import CenteredContent from '../../../../components/CenteredContent';
import Label from '../../../../shared/label/Label';
import TransactionDetails from '../TransactionDetails'
import { formatMoney, formatError } from '../../../../utils/helpers';
import PaymentReceipt from './PaymentReceipt';
import MenuList from '../../../../shared/MenuList'
import DeleteDialogueBox from '../../../../components/Business/DeleteDialogue'
import MessageAlert from "../../../../components/MessageAlert"

const transactionHeader = [
  { title: 'Date Created', col: 1 },
  { title: 'Parcel Number', col: 1 },
  { title: 'Description', col: 1 },
  { title: 'Amount', col: 1 },
  { title: 'Balance', col: 1 },
  { title: 'Status', col: 1 },
  { title: 'Menu', col: 1 },
];

export default function UserTransactionsList({ transaction, currencyData, userData, userType, walletRefetch }) {
  const [open, setOpen] = useState(false)
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [revertModalOpen, setRevertModalOpen] = useState(false)
  const [isSuccessAlert, setIsSuccessAlert] = useState(false)
  const [transactionId, setTransactionId] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')
  const [name, setName] = useState('')
  const [revertTransaction] = useMutation(WalletTransactionRevert)
  const anchorElOpen = Boolean(anchorEl)

  const menuList = [
    { content: 'View Receipt', isAdmin: true, color: '', handleClick: handleOpenReceipt},
    { content: 'Edit Payment', isAdmin: true, color: '', handleClick: handleOpenEdit},
    { content: 'Revert Transaction', isAdmin: true, color: 'red', handleClick: (event) => handleClick(event, transaction, userData)},
  ]

  useEffect(() => {
    if (anchorElOpen) {
      setOpen(false)
    }
  }, [anchorElOpen])


  if (!Object.keys(transaction).length || Object.keys(transaction).length === 0) {
    return <CenteredContent><Text content="No Transactions Yet" align="justify" /></CenteredContent>
  }

  function handleRevertTransaction(event) {
    event.stopPropagation()
    revertTransaction({
      variables: {
        transactionId
      }
    }).then(() => {
      setAnchorEl(null)
      setMessageAlert('Transaction reverted')
      walletRefetch()
      setIsSuccessAlert(true)
      setRevertModalOpen(false)
    })
    .catch((err) => {
      setMessageAlert(formatError(err.message))
      setIsSuccessAlert(false)
    })
  }

  function handleClick(event, txn, user){
    const txnId = txn.id
    const userName = user.name
    event.stopPropagation()
    setTransactionId(txnId)
    setName(userName)
    setRevertModalOpen(true)
  }

  function handleRevertClose(event){
    event.stopPropagation()
    setRevertModalOpen(false)
  }

  function handleTransactionMenu(event){
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  function handleOpenReceipt(){
    setOpen(false)
    setReceiptOpen(!receiptOpen)
    handleClose()
  }

  function handleOpenEdit(){
    setOpen(true)
    setIsEditing(true)
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

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setMessageAlert('');
  }

  const menuData = {
    menuList,
    handleTransactionMenu,
    anchorEl,
    open: anchorElOpen,
    userType,
    handleClose
  }

  return (
    <div>
      <MessageAlert
        type={isSuccessAlert ? 'success' : 'error'}
        message={messageAlert}
        open={!!messageAlert}
        handleClose={handleMessageAlertClose}
      />
      <DeleteDialogueBox
        open={revertModalOpen}
        handleClose={(event) => handleRevertClose(event)}
        handleAction={(event) => handleRevertTransaction(event)}
        title='Transaction'
        action='delete'
        user={name}
      />
      <DataList
        keys={transactionHeader}
        data={[renderTransactions(transaction, currencyData, menuData)]}
        hasHeader={false}
        clickable={!anchorElOpen}
        handleClick={handleOpenDetails}
      />
      <TransactionDetails
        detailsOpen={open}
        handleClose={() => setOpen(false)}
        data={transaction}
        currencyData={currencyData}
        title={`${transaction.__typename === 'WalletTransaction'? 'Transaction' : 'Invoice'}`}
        isEditing={isEditing}
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

export function renderTransactions(transaction, currencyData, menuData) {
  return {
    'Date Created': (
      <GridText
        content={
          transaction.__typename === 'WalletTransaction'
            ? dateToString(transaction.createdAt)
            : dateToString(transaction.createdAt)
        }
      />
    ),
    'Parcel Number': (
      <GridText
        content={
          transaction.__typename === 'WalletTransaction'
            ? transaction.paymentPlan?.landParcel?.parcelNumber
            : transaction.parcelNumber
        }
      />
    ),
    Description: (
      <GridText
        data-testid="description"
        content={`${
          transaction.__typename !== 'WalletTransaction'
            ? `Invoice ${transaction.invoiceNumber}`
            : transaction.source === 'wallet'
            ? 'Invoice' : transaction.source === 'invoice' ? 'Reversal'
            : 'Deposit'
        }`}
      />
    ),
    Amount: (
      <Grid item xs={12} md={1} data-testid="amount">
        {transaction.__typename === 'WalletTransaction' ? (
          <Text content={formatMoney(currencyData, transaction.amount)} />
        ) : (
          <Tooltip placement="top" title="Pending Amount">
            <span style={{ fontSize: '0.75rem' }}>
              {formatMoney(currencyData, transaction.pendingAmount)}
            </span>
          </Tooltip>
        )}
      </Grid>
    ),
    Balance: (
      <GridText
        statusColor={transaction.__typename !== 'WalletTransaction' && '#D65252'}
        data-testid="balance"
        content={
          transaction.__typename === 'WalletTransaction'
            ? formatMoney(currencyData, transaction.currentWalletBalance)
            : `-${formatMoney(currencyData, transaction.balance)}`
        }
      />
    ),
    Status: (
      <Grid item xs={12} md={2} data-testid="status">
        {transaction.__typename === 'WalletTransaction' ? (
          <Label
            title={transaction.status === 'settled' ? 'Paid' : 'Cancelled'}
            color={transaction.status === 'settled' ? '#66A69B' : '#E74540'}
          />
        ) : (
          <Label title="Unpaid" color="#EF6F51" />
        )}
      </Grid>
    ),
    Menu: (
      <Grid item xs={12} md={1} data-testid="menu">
        {
          transaction.__typename === 'WalletTransaction'
          && transaction.status === 'settled' && transaction.destination !== 'invoice' && transaction.source !== 'invoice'
          ? (
            <IconButton
              aria-controls="simple-menu"
              aria-haspopup="true"
              data-testid="receipt-menu"
              onClick={(event) => menuData.handleTransactionMenu(event)}
            >
              <MoreHorizOutlined />
            </IconButton>
          )
          : null
        }
        <MenuList
          open={menuData.open}
          anchorEl={menuData.anchorEl}
          userType={menuData.userType}
          handleClose={menuData.handleClose}
          list={menuData.menuList}
        />
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
  }).isRequired,
  userType: PropTypes.string.isRequired,
  walletRefetch: PropTypes.func.isRequired,
};
