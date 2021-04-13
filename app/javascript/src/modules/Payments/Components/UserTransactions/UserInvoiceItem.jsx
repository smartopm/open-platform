import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo';
import { Grid, IconButton } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import DataList from '../../../../shared/list/DataList';
import Text, { GridText } from '../../../../shared/Text';
import { dateToString } from '../../../../components/DateContainer';
import Label from '../../../../shared/label/Label';
import InvoiceDetails from '../InvoiceDetail';
import { invoiceStatus } from '../../../../utils/constants';
import {
  formatMoney,
  InvoiceStatusColor,
  propAccessor,
  formatError
} from '../../../../utils/helpers';
import MenuList from '../../../../shared/MenuList';
import { Context as AuthStateContext } from '../../../../containers/Provider/AuthStateProvider';
import DeleteDialogueBox from '../../../../components/Business/DeleteDialogue';
import MessageAlert from '../../../../components/MessageAlert';
import { InvoiceCancel } from '../../../../graphql/mutations';

const invoiceHeader = [
  { title: 'Issue Date', col: 4 },
  { title: 'Description', col: 4 },
  { title: 'Amount', col: 3 },
  { title: 'Payment Date', col: 3 },
  { title: 'Status', col: 4 },
  { title: 'Menu', col: 4 }
];
export default function UserInvoiceItem({ invoice, currencyData, refetch, walletRefetch }) {
  const [open, setOpen] = useState(false);
  const [invoiceId, setInvoiceId] = useState(false);
  const [name, setName] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const authState = useContext(AuthStateContext);
  const userType = authState?.user?.userType;
  const [isSuccessAlert, setIsSuccessAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const [cancelInvoice] = useMutation(InvoiceCancel);

  const menuList = [{ content: 'Cancel Invoice', isAdmin: true, color: 'red', handleClick }];

  function handleClick(event, invId, userName) {
    event.stopPropagation();
    setInvoiceId(invId);
    setName(userName);
    setModalOpen(true);
  }

  function handleDeleteClose(event) {
    event.stopPropagation();
    setModalOpen(false);
  }

  function handleOpenMenu(event) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  }

  function handleClose(event) {
    event.stopPropagation();
    setAnchorEl(null);
  }

  function handleOnClick(event) {
    event.stopPropagation();
    cancelInvoice({
      variables: {
        invoiceId
      }
    })
      .then(() => {
        setAnchorEl(null);
        setMessageAlert('Invoice successfully cancelled');
        setIsSuccessAlert(true);
        setModalOpen(false);
        walletRefetch();
        refetch();
      })
      .catch(err => {
        setMessageAlert(formatError(err.message));
        setIsSuccessAlert(false);
      });
  }

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setMessageAlert('');
  }

  const menuData = {
    menuList,
    handleOpenMenu,
    anchorEl,
    menuOpen,
    userType,
    handleClose
  };

  if (!Object.keys(invoice).length) {
    return <Text content="No Invoice Available" align="center" />;
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
        open={modalOpen}
        handleClose={event => handleDeleteClose(event)}
        handleAction={event => handleOnClick(event)}
        title="Invoice"
        action="delete"
        user={name}
      />
      <DataList
        keys={invoiceHeader}
        data={[renderInvoices(invoice, currencyData, menuData)]}
        hasHeader={false}
        clickable
        handleClick={() => setOpen(true)}
      />
      <InvoiceDetails
        detailsOpen={open}
        handleClose={() => setOpen(false)}
        data={invoice}
        currencyData={currencyData}
      />
    </div>
  );
}

export function renderInvoices(inv, currencyData, menuData) {
  return {
    'Issue Date': <GridText content={dateToString(inv.createdAt)} col={12} />,
    Description: (
      <Grid item xs={12} md={2} data-testid="description">
        <Text content={`Invoice Number #${inv.invoiceNumber}`} />
        <br />
        <Text color="primary" content={`Plot Number #${inv.landParcel.parcelNumber}`} />
      </Grid>
    ),
    Amount: <GridText content={formatMoney(currencyData, inv.amount)} data-testid="amount" />,
    'Payment Date': (
      <Grid item xs={12} md={2}>
        {inv.payments.length ? <Text content={dateToString(inv.payments[0]?.createdAt)} /> : '-'}
      </Grid>
    ),
    Status: (
      <Grid item xs={12} md={2} data-testid="status">
        {new Date(inv.dueDate) < new Date().setHours(0, 0, 0, 0) && inv.status === 'in_progress' ? (
          <Label title="Due" color="#B63422" />
        ) : (
          <Label
            title={propAccessor(invoiceStatus, inv.status)}
            color={propAccessor(InvoiceStatusColor, inv.status)}
          />
        )}
      </Grid>
    ),
    Menu: (
      <Grid item xs={12} md={2} data-testid="menu">
        {inv.status !== 'cancelled' && (
          <IconButton
            aria-label="more-verticon"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={event => menuData.handleOpenMenu(event)}
            dataid={inv.id}
            name={inv.user?.name}
          >
            <MoreHorizIcon />
          </IconButton>
        )}
        <MenuList
          open={menuData.menuOpen && menuData.anchorEl?.getAttribute('dataid') === inv.id}
          anchorEl={menuData.anchorEl}
          userType={menuData.userType}
          handleClose={menuData.handleClose}
          list={menuData.menuList}
        />
      </Grid>
    )
  };
}

UserInvoiceItem.propTypes = {
  invoice: PropTypes.shape({
    invoiceNumber: PropTypes.number,
    status: PropTypes.string,
    amount: PropTypes.number,
    createdAt: PropTypes.string
  }).isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired,
  refetch: PropTypes.func.isRequired,
  walletRefetch: PropTypes.func.isRequired,
};
