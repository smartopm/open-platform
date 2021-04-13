import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Menu,
  MenuItem,
  IconButton
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DataList from '../../../../shared/list/DataList';
import { dateToString } from '../../../../components/DateContainer';
import {
  formatError,
  formatMoney,
  InvoiceStatusColor,
  propAccessor
} from '../../../../utils/helpers';
import Text, { HiddenText } from '../../../../shared/Text';
import Label from '../../../../shared/label/Label';
import { invoiceStatus } from '../../../../utils/constants';
import { Context as AuthStateContext } from '../../../../containers/Provider/AuthStateProvider';
import MessageAlert from '../../../../components/MessageAlert';
import MenuList from '../../../../shared/MenuList';
import DeleteDialogueBox from '../../../../components/Business/DeleteDialogue';
import { InvoiceCancel } from '../../../../graphql/mutations';
import PaymentPlanUpdateMutation from '../../graphql/payment_plan_mutations';
import { Spinner } from '../../../../shared/Loading';
import { suffixedNumber } from '../../helpers';

export default function UserPaymentPlanItem({ plans, currencyData, userId, refetch }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [details, setPlanDetails] = useState({
    isLoading: false,
    planId: null,
    isError: false,
    info: ''
  });
  const [updatePaymentPlan] = useMutation(PaymentPlanUpdateMutation);
  const validDays = [...Array(28).keys()];
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const menuOpen = Boolean(menuAnchorEl);
  const authState = useContext(AuthStateContext);
  const userType = authState?.user?.userType;
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [isSuccessAlert, setIsSuccessAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const [invoiceId, setInvoiceId] = useState(false);
  const [cancelInvoice] = useMutation(InvoiceCancel);

  const planHeader = [
    { title: 'Plot Number', col: 2 },
    { title: 'Balance', col: 2 },
    { title: 'Start Date', col: 2 },
    { title: '% of total valuation', col: 2 },
    { title: 'Payment Day', col: 2 }
  ];

  const invoiceHeader = [
    { title: 'Issue Date', col: 2 },
    { title: 'Due Date', col: 2 },
    { title: 'Description', col: 2 },
    { title: 'Amount', col: 1 },
    { title: 'Payment Date', col: 2 },
    { title: 'Status', col: 2 },
    { title: 'Menu', col: 1 }
  ];

  const menuList = [{ content: 'Cancel Invoice', isAdmin: true, color: 'red', handleClick }];

  const handleClose = () => {
    setAnchorEl(null);
  };
  function handleOpenDateMenu(event, planId) {
    // avoid collapsing that shows invoices
    event.stopPropagation();
    setPlanDetails({ ...details, planId });
    setAnchorEl(event.currentTarget);
  }

  function handleSetDay(paymentDay) {
    // close the menu immediately to show mutation feedback
    handleClose();
    setPlanDetails({ ...details, isLoading: true });
    updatePaymentPlan({
      variables: {
        id: details.planId,
        userId,
        paymentDay
      }
    })
      .then(() => {
        setPlanDetails({
          ...details,
          isLoading: false,
          isError: false,
          info: 'Payment Day successfully updated'
        });
        refetch();
      })
      .catch(err => {
        setPlanDetails({
          ...details,
          isLoading: false,
          isError: true,
          info: formatError(err.message)
        });
      });
  }

  function handleClick(event, invId, userName) {
    event.stopPropagation();
    setInvoiceId(invId);
    setName(userName);
    setModalOpen(true);
  }

  function handleOpenMenu(event) {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  }

  function handleClose(event) {
    event.stopPropagation();
    setMenuAnchorEl(null);
  }

  function handleDeleteClose(event) {
    event.stopPropagation();
    setModalOpen(false);
  }

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setMessageAlert('');
  }

  function handleOnClick(event) {
    event.stopPropagation();
    cancelInvoice({
      variables: {
        invoiceId
      }
    })
      .then(() => {
        setMenuAnchorEl(null);
        setMessageAlert('Invoice successfully cancelled');
        setIsSuccessAlert(true);
        setModalOpen(false);
        refetch();
      })
      .catch(err => {
        setMessageAlert(formatError(err.message));
        setIsSuccessAlert(false);
      });
  }

  const menuData = {
    menuList,
    handleOpenMenu,
    anchorEl: setMenuAnchorEl,
    menuOpen,
    userType,
    handleClose
  };

  return (
    <>
      <MessageAlert
        type={!details.isError ? 'success' : 'error'}
        message={details.info}
        open={!!details.info}
        handleClose={() => setPlanDetails({ ...details, info: '' })}
      />
      <Menu
        id="set-payment-date-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        data-testid="menu-open"
      >
        {validDays.map(day => (
          <MenuItem
            key={day}
            data-testid={`payment-day-${day}`}
            onClick={() => handleSetDay(day + 1)}
          >
            {day + 1}
          </MenuItem>
        ))}
      </Menu>
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
      {plans?.map(plan => (
        <Accordion key={plan.id}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-label="Expand"
            id="additional-actions3-header"
            classes={{ content: classes.content }}
            data-testid="summary"
          >
            <DataList
              keys={planHeader}
              data={[
                renderPlan(plan, currencyData, currentUser.userType, {
                  handleMenu: event => handleOpenDateMenu(event, plan.id),
                  loading: details.isLoading
                })
              ]}
              hasHeader={false}
              clickable={false}
            />
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.content }}>
            {plan.invoices && Boolean(plan.invoices?.length) && (
              <Typography color="primary" style={{ margin: '0 0 10px 50px' }}>
                Invoices
              </Typography>
            )}
            {plan.invoices
              ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map(inv => (
                <div key={inv.id} style={{ margin: '0 50px' }}>
                  <DataList
                    keys={invoiceHeader}
                    data={[renderInvoice(inv, currencyData, menuData)]}
                    hasHeader={false}
                    clickable={false}
                  />
                </div>
              ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}

export function renderPlan(plan, currencyData, userType, { handleMenu, loading }) {
  return {
    'Plot Number': (
      <Grid item xs={12} md={2} data-testid="plot-number">
        {plan.landParcel.parcelNumber}
      </Grid>
    ),
    Balance: (
      <Grid item xs={12} md={2} data-testid="balance">
        {`-${formatMoney(currencyData, plan.pendingBalance)}`}
      </Grid>
    ),
    'Start Date': (
      <Grid item xs={12} md={2} data-testid="start-date">
        {dateToString(plan.startDate)}
      </Grid>
    ),
    '% of total valuation': (
      <Grid item xs={12} md={2} data-testid="percentage">
        {plan.percentage}
      </Grid>
    ),
    'Payment Day': (
      <Grid item xs={12} md={2}>
        <Button
          aria-controls="set-payment-date-menu"
          variant={userType === 'admin' ? 'outlined' : 'text'}
          aria-haspopup="true"
          data-testid="menu"
          disabled={userType !== 'admin'}
          onClick={handleMenu}
        >
          {loading && <Spinner />}

          {
          !loading && userType === 'admin' ?  (
            <span>
              <EditIcon fontSize="small" style={{marginBottom: -4}} />
              {`   ${suffixedNumber(plan.paymentDay)}`}
            </span>
          )
           : suffixedNumber(plan.paymentDay)
          }
        </Button>
      </Grid>
    )
  };
}

export function renderInvoice(inv, currencyData, menuData) {
  return {
    'Issue Date': (
      <Grid item xs={12} md={2} data-testid="issue-date">
        <HiddenText smDown title="Issue Date" />
        <Text content={dateToString(inv.createdAt)} />
      </Grid>
    ),
    'Due Date': (
      <Grid item xs={12} md={2} data-testid="due-date">
        <HiddenText smDown title="Due Date" />
        <Text content={dateToString(inv.dueDate)} />
      </Grid>
    ),
    Description: (
      <Grid item xs={12} md={2} data-testid="description">
        <HiddenText smDown title="Description" />
        <Text content={`Invoice #${inv.invoiceNumber}`} />
      </Grid>
    ),
    Amount: (
      <Grid item xs={12} md={1} data-testid="amount">
        <HiddenText smDown title="Amount" />
        <Text content={formatMoney(currencyData, inv.amount)} />
      </Grid>
    ),
    'Payment Date': (
      <Grid item xs={12} md={2} data-testid="payment-date">
        <HiddenText smDown title="Payment Date" />
        {inv.status === 'paid' && inv.payments?.length ? (
          <Text content={dateToString(inv.payments[0]?.createdAt)} />
        ) : (
          '-'
        )}
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
      <Grid item xs={12} md={1} data-testid="menu">
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

UserPaymentPlanItem.propTypes = {
  plans: PropTypes.arrayOf(
    PropTypes.shape({
      plotNumber: PropTypes.number,
      plotBalance: PropTypes.number,
      balance: PropTypes.string,
      startDate: PropTypes.string,
      createdAt: PropTypes.string
    })
  ).isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired,
  userId: PropTypes.string.isRequired,
  currentUser: PropTypes.shape({
    userType: PropTypes.string
  }).isRequired,
  refetch: PropTypes.func.isRequired
};

const useStyles = makeStyles(() => ({
  content: {
    display: 'inline'
  }
}));
