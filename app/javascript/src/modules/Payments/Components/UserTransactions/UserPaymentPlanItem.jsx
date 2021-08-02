import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useMutation, useLazyQuery } from 'react-apollo';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
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
import { MoreHorizOutlined } from '@material-ui/icons';
import EditIcon from '@material-ui/icons/Edit';
import DataList from '../../../../shared/list/DataList';
import { dateToString } from '../../../../components/DateContainer';
import {
  formatError,
  formatMoney,
  InvoiceStatusColor,
  propAccessor,
  capitalize
} from '../../../../utils/helpers';
import Text from '../../../../shared/Text';
import Label from '../../../../shared/label/Label';
import { invoiceStatus } from '../../../../utils/constants';
import MessageAlert from '../../../../components/MessageAlert';
import PaymentPlanUpdateMutation, { PaymentPlanCancelMutation } from '../../graphql/payment_plan_mutations';
import { Spinner } from '../../../../shared/Loading';
import { suffixedNumber } from '../../helpers';
import ListHeader from '../../../../shared/list/ListHeader';
import MenuList from '../../../../shared/MenuList';
import { ReceiptPayment, PlanStatement } from '../../graphql/payment_query';
import PaymentReceipt from './PaymentReceipt';
import CenteredContent from '../../../../components/CenteredContent';
import StatementPlan from './PlanStatement';
import { ActionDialog } from '../../../../components/Dialog';
import PlanDetail from './PlanDetail';
import TransactionDetails from './TransactionDetails';

export default function UserPaymentPlanItem({
  plans,
  currencyData,
  currentUser,
  userId,
  refetch,
  balanceRefetch
}) {
  const classes = useStyles();
  const { t } = useTranslation(['form', 'common']);
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchor, setAnchor] = useState(null);
  const [planAnchor, setPlanAnchor] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [planId, setPlanId] = useState('');
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [transDetailOpen, setTransDetailOpen] = useState(false);
  const [transData, setTransData] = useState({});
  const [planDetailOpen, setPlanDetailOpen] = useState(false);
  const [planData, setPlanData] = useState({});
  const [statementOpen, setStatementOpen] = useState(false);
  const [details, setPlanDetails] = useState({
    isLoading: false,
    planId: null,
    isError: false,
    info: ''
  });
  const [confirmPlanCancelOpen, setConfirmPlanCancelOpen] = useState(false)
  const [updatePaymentPlan] = useMutation(PaymentPlanUpdateMutation);
  const [cancelPaymentPlan] = useMutation(PaymentPlanCancelMutation);
  const validDays = [...Array(28).keys()];
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const anchorElOpen = Boolean(anchor)
  const planAnchorElOpen = Boolean(planAnchor)
  const [loadReceiptDetails, { loading, error, data }] = useLazyQuery(ReceiptPayment, {
    variables: { id: transactionId },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  });

  const [loadStatement, { loading: statementLoad, error: statementError, data: statementData }] = useLazyQuery(PlanStatement, {
    variables: { paymentPlanId: planId },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  });

  const planHeader = [
    { title: 'Plot Number', col: 2 },
    { title: 'Payment Plan', col: 2 },
    { title: 'Start Date', col: 2 },
    { title: 'Balance/Monthly Amount', col: 2 },
    { title: 'Payment Day', col: 2 },
    { title: 'Menu', col: 2 }
  ];

  const paymentHeader = [
    { title: 'Payment Date', col: 2 },
    { title: 'Payment Type', col: 2 },
    { title: 'Amount', col: 2 },
    { title: 'Status', col: 2 },
    { title: 'Menu', col: 2 }
  ];
  const menuList = [
    { content: 'View Receipt', isAdmin: true, handleClick: (event) => handleClick(event)},
  ]

  const planMenuList = [
    { content: 'Cancel Plan', isAdmin: true, handleClick: (event) => handleCancelPlanClick(event)},
    { content: 'View Statement', isAdmin: true, handleClick: (event) => handlePlanClick(event)},
    { content: 'View Transactions', isAdmin: true, handleClick: (event) => handleTransactionClick(event)},
    { content: 'View Details', isAdmin: true, handleClick: (event) => handlePlanDetailClick(event)}
  ]

  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleCloseConfirmModal(){
    setConfirmPlanCancelOpen(false)
    setAnchor(null)
    handleClose()
  }
  function handleOpenDateMenu(event, id) {
    // avoid collapsing that shows invoices
    event.stopPropagation();
    setPlanDetails({ ...details, planId: id });
    setAnchorEl(event.currentTarget);
  }

  function handleClick(event){
    event.stopPropagation()
    loadReceiptDetails()
    setReceiptOpen(true)
    setAnchor(null)
  }

  function handleCancelPlanClick(event){
    event.stopPropagation()
    setConfirmPlanCancelOpen(true)
  }

  function handleCancelPlan(event){
    event.stopPropagation()
    handleCloseConfirmModal();
    setPlanDetails({ ...details, isLoading: true });
    cancelPaymentPlan({
      variables: {
        id: planId,
        userId,
      }
    })
      .then(() => {
        setPlanDetails({
          ...details,
          isLoading: false,
          isError: false,
          info: 'Payment Plan successfully canceled'
        });
        refetch();
        balanceRefetch()
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

  function handlePlanClick(event){
    event.stopPropagation()
    loadStatement()
    setStatementOpen(true)
    setPlanAnchor(null)
  }

  function handleTransactionClick(event) {
    event.stopPropagation()
    history.push(`?tab=Plans&subtab=Transactions&id=${planId}`)
  }

  function transactionDetailOpen(trans) {
    setTransData(trans)
    setTransDetailOpen(true)
  }

  function handlePlanDetailClick(event) {
    event.stopPropagation()
    setPlanDetailOpen(true)
  }

  function handleTransactionMenu(event, payId){
    event.stopPropagation()
    setAnchor(event.currentTarget)
    setTransactionId(payId)
  }

  function handlePlanMenu(event, plan){
    event.stopPropagation()
    setPlanAnchor(event.currentTarget)
    setPlanId(plan.id)
    setPlanData(plan)
  }

  function handlePlanListClose(event) {
    event.stopPropagation()
    setPlanAnchor(null)
  }

  function headersForNonAdminUsers(payments){
    if(currentUser.userType !== 'admin' && payments?.every((payment) => payment.status === 'cancelled')){
      return false;
    }
    return true;
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
        balanceRefetch()
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

    function handlePaymentMenuClose(event) {
      event.stopPropagation()
      setAnchor(null)
    }

    const menuData = {
      menuList,
      handleTransactionMenu,
      anchorEl: anchor,
      open: anchorElOpen,
      userType: currentUser.userType,
      handleClose: (event) => handlePaymentMenuClose(event)
    }

    const planMenuData = {
      menuList: planMenuList,
      handlePlanMenu,
      anchorEl: planAnchor,
      open: planAnchorElOpen,
      userType: currentUser.userType,
      handleClose: (event) => handlePlanListClose(event)
    }

    function handleReceiptClose() {
      setReceiptOpen(false)
      setAnchor(null);
    }

  return (
    <>
      {transDetailOpen && (
        <TransactionDetails
          open={transDetailOpen}
          handleModalClose={() => setTransDetailOpen(false)}
          data={transData}
          currencyData={currencyData}
        />
      )}
      {planDetailOpen && (
        <PlanDetail
          open={planDetailOpen}
          handleModalClose={() => setPlanDetailOpen(false)}
          planData={planData}
          currencyData={currencyData}
        />
      )}
      {error && (
        <CenteredContent>{error.message}</CenteredContent>
      )}
      {statementError && (
        <CenteredContent>{statementError.message}</CenteredContent>
      )}
      {loading ? <Spinner /> : (
        <PaymentReceipt
          paymentData={data?.paymentReceipt}
          open={receiptOpen}
          handleClose={() => handleReceiptClose()}
          currencyData={currencyData}
        />
      )}
      {statementLoad ? <Spinner /> : (
        <StatementPlan 
          open={statementOpen}
          handleClose={() => setStatementOpen(false)}
          data={statementData?.paymentPlanStatement}
          currencyData={currencyData}
        />
      )}
      <ActionDialog
        open={confirmPlanCancelOpen}
        type="confirm"
        message="You are about to cancel this payment plan?"
        handleClose={handleCloseConfirmModal}
        handleOnSave={handleCancelPlan}
      />
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
      {plans?.map(plan => (
        <Accordion key={plan.id} style={{backgroundColor: '#FDFDFD'}}>
          <AccordionSummary
            aria-label="Expand"
            id="additional-actions3-header"
            classes={{ content: classes.content }}
            data-testid="summary"
            className={classes.accordion}
          >
            <DataList
              keys={planHeader}
              data={[
                renderPlan(plan, currencyData, currentUser.userType, {
                  handleMenu: event => handleOpenDateMenu(event, plan.id),
                  loading: details.isLoading
                }, planMenuData)
              ]}
              hasHeader={false}
              clickable={false}
              color
            />
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.content }}>
            {plan.planPayments && Boolean(plan.planPayments?.length) && headersForNonAdminUsers(plan?.planPayments) &&   (
              <div>
                <Typography color="primary" className={classes.payment}>
                  Payments
                </Typography>
                <div className={classes.paymentList}>
                  {matches && <ListHeader headers={paymentHeader} color />}
                </div>
              </div>
            )}
            {plan.planPayments
              ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map(pay => (
                (currentUser.userType === 'admin' || pay?.status !== 'cancelled') && (
                <div key={pay.id} className={classes.paymentList}>
                  <DataList
                    keys={paymentHeader}
                    data={[renderPayments(pay, currencyData, currentUser.userType, menuData)]}
                    hasHeader={false}
                    clickable
                    handleClick={() => transactionDetailOpen(pay)}
                    color
                  />
                </div>
              )
              ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}

export function renderPlan(plan, currencyData, userType, { handleMenu, loading }, menuData) {
  return {
    'Plot Number': (
      <Grid item xs={12} md={2} data-testid="plot-number">
        {plan.landParcel.parcelNumber}
      </Grid>
    ),
    'Payment Plan': (
      <Grid item xs={12} md={2} data-testid="payment-plan">
        {plan.planType}
        <br />
        <Text color="primary" content={`${plan.status}`} />
      </Grid>
    ),
    'Start Date': (
      <Grid item xs={12} md={2} data-testid="start-date">
        {dateToString(plan.startDate)}
      </Grid>
    ),
    'Balance/Monthly Amount': (
      <Grid item xs={12} md={2} data-testid="balance">
        <Text content={formatMoney(currencyData, plan.pendingBalance)} />
        <br />
        <Text color="primary" content={`${capitalize(plan?.frequency || 'Monthly')} Amount ${formatMoney(currencyData, plan.installmentAmount)}`} />
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

          {!loading && userType === 'admin' ? (
            <span>
              <EditIcon fontSize="small" style={{ marginBottom: -4 }} />
              {`   ${suffixedNumber(plan.paymentDay)}`}
            </span>
          ) : (
            suffixedNumber(plan.paymentDay)
          )}
        </Button>
        <KeyboardArrowDownIcon style={{ margin: '10px 0 0 15px'}} />
      </Grid>
    ),
    Menu: (
      <Grid item xs={12} md={1} data-testid="menu">
        {userType === 'admin' && (
          <>
            <IconButton
              aria-controls="simple-menu"
              aria-haspopup="true"
              data-testid="plan-menu"
              dataid={plan.id}
              onClick={(event) => menuData.handlePlanMenu(event, plan)}
            >
              <MoreHorizOutlined />
            </IconButton>
            <MenuList
              open={menuData?.open && menuData?.anchorEl?.getAttribute('dataid') === plan.id}
              anchorEl={menuData?.anchorEl}
              userType={menuData?.userType}
              handleClose={menuData?.handleClose}
              list={menuData?.menuList}
            />
          </>
        )}
      </Grid>
    )
  };
}

export function renderPayments(pay, currencyData, userType, menuData) {
  return {
    'Payment Date': (
      <Grid item xs={12} md={2} data-testid="payment-date">
        <Text content={dateToString(pay.createdAt)} />
      </Grid>
    ),
    'Payment Type': (
      <Grid item xs={12} md={2} data-testid="payment-type">
        <Text content={pay.userTransaction.source} />
      </Grid>
    ),
    Amount: (
      <Grid item xs={12} md={2} data-testid="amount">
        <Text content={formatMoney(currencyData, pay.amount)} />
      </Grid>
    ),
    Status: (
      <Grid item xs={12} md={2} data-testid="status">
        <Label
          title={propAccessor(invoiceStatus, pay.status)}
          color={propAccessor(InvoiceStatusColor, pay.status)}
        />
      </Grid>
    ),
    Menu: (
      <Grid item xs={12} md={1} data-testid="menu">
        {
          userType === 'admin' && pay.status !== 'cancelled' &&
          (
            <IconButton
              aria-controls="simple-menu"
              aria-haspopup="true"
              data-testid="pay-menu"
              dataid={pay.id}
              onClick={(event) => menuData.handleTransactionMenu(event, pay.id)}
            >
              <MoreHorizOutlined />
            </IconButton>
          )
        }
        <MenuList
          open={menuData.open && menuData?.anchorEl?.getAttribute('dataid') === pay.id}
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
  refetch: PropTypes.func.isRequired,
  balanceRefetch: PropTypes.func.isRequired
};

const useStyles = makeStyles(() => ({
  content: {
    display: 'inline',
    backgroundColor: '#FDFDFD'
  },
  accordion: {
    backgroundColor: '#FDFDFD'
  },
  payment: {
    padding: '0 0 20px 50px',
    fontWeight: 400,
    backgroundColor: '#FDFDFD'
  },
  paymentList: {
    padding: '0 50px',
    backgroundColor: '#FDFDFD'
  }
}));
