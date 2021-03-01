/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, IconButton, Tooltip, Menu, MenuItem } from '@material-ui/core';
import { MoreHorizOutlined } from '@material-ui/icons';
import DataList from '../../shared/list/DataList';
import Text, { GridText } from '../../shared/Text';
import { dateToString } from '../DateContainer';
import CenteredContent from '../CenteredContent';
import Label from '../../shared/label/Label';
import TransactionDetails from './TransactionDetails'
import { formatMoney } from '../../utils/helpers';
import PaymentReceipt from './PaymentReceipt';

const transactionHeader = [
  { title: 'Date Created', col: 1 },
  { title: 'Description', col: 1 },
  { title: 'Amount', col: 1 },
  { title: 'Balance', col: 1 },
  { title: 'Status', col: 1 },
  { title: 'Menu', col: 1 },
];

export default function UserTransactionsList({ transaction, currencyData, userData }) {
  const [open, setOpen] = useState(false)
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const anchorElOpen = Boolean(anchorEl)

  const menuList = [
    { content: 'View Receipt', isAdmin: true, color: '', handleClick: handleOpenReceipt}
  ]

  useEffect(() => {
    if (anchorElOpen) {
      setOpen(false)
    }
  }, [anchorElOpen])


  if (!Object.keys(transaction).length || Object.keys(transaction).length === 0) {
    return <CenteredContent><Text content="No Transactions Yet" align="justify" /></CenteredContent>
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

  function handleClose() {
    setAnchorEl(null)
  }

  const menuData = {
    menuList,
    handleTransactionMenu,
    anchorEl,
    open: anchorElOpen,
    userType: 'admin',
    handleClose
  }
  return (
    <div>
      <DataList 
        keys={transactionHeader} 
        data={[renderTransactions(transaction, currencyData, menuData)]} 
        hasHeader={false} 
        clickable={!anchorElOpen}
        handleClick={() => setOpen(true)} 
      />
      <TransactionDetails 
        detailsOpen={open} 
        handleClose={() => setOpen(false)} 
        data={transaction}
        currencyData={currencyData}
        title={`${transaction.__typename === 'WalletTransaction'? 'Transaction' : 'Invoice'}`}
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
        col={4}
        content={
          transaction.__typename === 'WalletTransaction'
            ? `Deposit date ${dateToString(transaction.createdAt)}`
            : `Issue date ${dateToString(transaction.createdAt)}`
        }
      />
    ),
    Description: (
      <GridText
        col={4}
        content={`${
          // eslint-disable-next-line no-nested-ternary
          transaction.__typename !== 'WalletTransaction'
            ? `Invoice ${transaction.invoiceNumber}`
            : transaction.source === 'wallet'
            ? 'Invoice'
            : 'Deposit'
        }`}
      />
    ),
    Amount: (
      <Grid item xs={3} md={2} data-testid="description">
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
        col={3}
        content={
          transaction.__typename === 'WalletTransaction'
            ? formatMoney(currencyData, transaction.currentWalletBalance)
            : `-${formatMoney(currencyData, transaction.balance)}`
        }
      />
    ),
    Status: (
      <Grid item xs={4} md={2} data-testid="status">
        {transaction.__typename === 'WalletTransaction' ? (
          <Label title="Paid" color="#58B71B" />
        ) : (
          <Label title="Unpaid" color="#EF6F51" />
        )}
      </Grid>
    ),
    Menu: (
      <Grid item xs={1}>
        <IconButton
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={(event) => menuData.handleTransactionMenu(event, transaction)}
        >
          <MoreHorizOutlined />
        </IconButton>
        <MenuList
          // open={menuData.open && menuData.anchorEl.getAttribute('dataid') === transaction.id}
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
  }).isRequired
};



// temporal menuList
export function MenuList({
  list,
  anchorEl,
  handleClose,
  userType,
  open
}) {
  let listData = list
  if (userType !== 'admin') {
    listData = list.filter(lis => lis.isAdmin === false) 
  }
  return (
    <Menu
      id='long-menu'
      anchorEl={anchorEl}
      open={open}
      keepMounted
      onClose={handleClose}
      PaperProps={{
          style: {
            width: 200
          }
         }}
    >
      {listData.map((menu, index) => (
        <MenuItem
          id={index}
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          style={menu.color ? {color: menu.color} : null}
          onClick={(event) => menu.handleClick(event, anchorEl.getAttribute('dataid'), anchorEl.getAttribute('name'))}
        >
          {menu.content}
        </MenuItem>
        )
      )}
    </Menu>
  );
}

MenuList.defaultProps = {
  anchorEl: {},
}

MenuList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  open: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  anchorEl: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
  userType: PropTypes.string.isRequired
}
