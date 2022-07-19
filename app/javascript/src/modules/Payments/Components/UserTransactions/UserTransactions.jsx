/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';
import { useMutation } from 'react-apollo';
import PropTypes from 'prop-types';
import { MoreHorizOutlined } from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import DataList from '../../../../shared/list/DataList';
import Text, { GridText } from '../../../../shared/Text';
import { dateToString } from '../../../../components/DateContainer';
import CenteredContent from '../../../../components/CenteredContent';
import { formatMoney, formatError } from '../../../../utils/helpers';
import MenuList from '../../../../shared/MenuList';
import { TransactionRevert } from '../../graphql/payment_mutations';
import DeleteDialogueBox from '../../../../shared/dialogs/DeleteDialogue';
import TransactionDetails from './TransactionDetails';
import { TransactionMobileDataList } from './PaymentMobileDataList';
import { SnackbarContext } from '../../../../shared/snackbar/Context';

export default function UserTransactionsList({
  transaction,
  currencyData,
  userType,
  userData,
  refetch,
  balanceRefetch
}) {
  const { t } = useTranslation('common');
  const [transactionId, setTransactionId] = useState(false);
  const [name, setName] = useState('');
  const [revertModalOpen, setRevertModalOpen] = useState(false);
  const [revertTransactionLoading, setRevertTransactionLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const anchorElOpen = Boolean(anchorEl);
  const [revertTransaction] = useMutation(TransactionRevert);
  const [transDetailOpen, setTransDetailOpen] = useState(false);
  const [transData, setTransData] = useState({});
  const matches = useMediaQuery('(max-width:600px)');

  const { showSnackbar, messageType } = useContext(SnackbarContext);

  const transactionHeader = [
    { title: 'Date', value: t('common:table_headers.date'), col: 1 },
    { title: 'Recorded by', value: t('common:table_headers.recorded_by'), col: 1 },
    { title: 'Payment Type', value: t('common:table_headers.payment_type'), col: 2 },
    { title: 'Amount Paid', value: t('common:table_headers.amount_paid'), col: 1 },
    { title: 'Menu', value: t('common:table_headers.menu'), col: 1 }
  ];

  function handleClick(event, txn, user) {
    const txnId = txn.id;
    const userName = user.name;
    event.stopPropagation();
    setTransactionId(txnId);
    setName(userName);
    setRevertModalOpen(true);
  }

  function handleRevertClose(event) {
    event.stopPropagation();
    setRevertModalOpen(false);
    setRevertTransactionLoading(false);
  }

  function handleTransactionMenu(event) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  }

  function transactionDetailOpen(trans) {
    setTransData(trans);
    setTransDetailOpen(true);
  }

  function handleRevertTransaction(event) {
    event.stopPropagation();
    setRevertTransactionLoading(true);
    revertTransaction({
      variables: {
        id: transactionId
      }
    })
      .then(() => {
        setAnchorEl(null);
        showSnackbar({ type: messageType.success, message: 'Transaction reverted' });
        setRevertModalOpen(false);
        setRevertTransactionLoading(false);
        refetch();
        balanceRefetch();
      })
      .catch(err => {
        showSnackbar({ type: messageType.error, message: formatError(err.message) });
        setRevertTransactionLoading(false);
      });
  }

  const menuList = [
    {
      content: t('common:menu.revert_transaction'),
      isAdmin: true,
      color: 'red',
      handleClick: event => handleClick(event, transaction, userData)
    }
  ];

  function handleClose(event) {
    event.stopPropagation();
    setAnchorEl(null);
  }

  const menuData = {
    menuList,
    handleTransactionMenu,
    anchorEl,
    open: anchorElOpen,
    userType,
    handleClose: event => handleClose(event)
  };

  if (!Object.keys(transaction).length || Object.keys(transaction).length === 0) {
    return (
      <CenteredContent>
        <Text content="No Transactions Yet" align="justify" />
      </CenteredContent>
    );
  }

  return (
    <div>
      {transDetailOpen && (
        <TransactionDetails
          open={transDetailOpen}
          handleModalClose={() => setTransDetailOpen(false)}
          data={transData}
          currencyData={currencyData}
        />
      )}
      <DeleteDialogueBox
        open={revertModalOpen}
        handleClose={event => handleRevertClose(event)}
        handleAction={event => handleRevertTransaction(event)}
        title="Transaction"
        action="delete"
        user={name}
        loading={revertTransactionLoading}
      />
      {matches ? (
        <TransactionMobileDataList
          keys={transactionHeader}
          data={[renderTransactions(transaction, currencyData, menuData)]}
          handleClick={() => transactionDetailOpen(transaction)}
        />
      ) : (
        <DataList
          keys={transactionHeader}
          data={[renderTransactions(transaction, currencyData, menuData)]}
          hasHeader={false}
          clickable
          handleClick={() => transactionDetailOpen(transaction)}
          color
        />
      )}
    </div>
  );
}

export function renderTransactions(transaction, currencyData, menuData) {
  return {
    Date: <GridText data-testid="date" content={dateToString(transaction.createdAt)} />,
    'Recorded by': <GridText data-testid="recorded" content={transaction.depositor.name} />,
    'Payment Type': <GridText data-testid="description" content={transaction.source} />,
    'Amount Paid': (
      <Grid item xs={12} md={2} data-testid="amount">
        <Text content={formatMoney(currencyData, transaction.allocatedAmount)} />
        <br />
        <Text
          color="primary"
          content={`unallocated ${formatMoney(currencyData, transaction.unallocatedAmount)}`}
        />
      </Grid>
    ),
    Menu: (
      <Grid item xs={12} md={1} data-testid="menu">
        {transaction.status !== 'cancelled' && (
          <IconButton
            aria-controls="simple-menu"
            aria-haspopup="true"
            data-testid="menu"
            onClick={event => menuData.handleTransactionMenu(event)}
            size="large"
          >
            <MoreHorizOutlined />
          </IconButton>
        )}
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
  refetch: PropTypes.func.isRequired,
  balanceRefetch: PropTypes.func.isRequired
};
