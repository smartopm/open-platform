import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useMutation, useLazyQuery } from 'react-apollo';
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { useHistory } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
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
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DataList from '../../../../shared/list/DataList';
import { dateToString } from '../../../../components/DateContainer';
import {
  formatError,
  formatMoney,
  InvoiceStatusColor,
  objectAccessor,
  capitalize,
  titleize
} from '../../../../utils/helpers';
import Text from '../../../../shared/Text';
import Label from '../../../../shared/label/Label';
import { invoiceStatus } from '../../../../utils/constants';
import PaymentPlanUpdateMutation, {
  PaymentPlanCancelMutation
} from '../../graphql/payment_plan_mutations';
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
import TransferPlanModal from './TransferPlanModal';
import PlanMobileDataList, { PaymentMobileDataList } from './PaymentMobileDataList';
import { SnackbarContext } from '../../../../shared/snackbar/Context';

export default function UserPaymentPlanItem({
  plans,
  currencyData,
  currentUser,
  userId,
  refetch,
  balanceRefetch
}) {
  const classes = useStyles();
  const { t } = useTranslation(['payment', 'common']);
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchor, setAnchor] = useState(null);
  const [planAnchor, setPlanAnchor] = useState(null);
  const [paymentId, setPaymentId] = useState('');
  const [planId, setPlanId] = useState('');
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [transDetailOpen, setTransDetailOpen] = useState(false);
  const [transData, setTransData] = useState({});
  const [planDetailOpen, setPlanDetailOpen] = useState(false);
  const [planData, setPlanData] = useState({});
  const [paymentData, setPaymentData] = useState({});
  const [statementOpen, setStatementOpen] = useState(false);
  const [details, setPlanDetails] = useState({
    isLoading: false,
    planId: null,
    isError: false,
    info: ''
  });
  const [confirmPlanCancelOpen, setConfirmPlanCancelOpen] = useState(false);
  const [TransferPlanModalOpen, setTransferPlanModalOpen] = useState(false);
  const [transferType, setTransferType] = useState('');
  const [updatePaymentPlan] = useMutation(PaymentPlanUpdateMutation);
  const [cancelPaymentPlan] = useMutation(PaymentPlanCancelMutation);
  const validDays = [...Array(28).keys()];
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const anchorElOpen = Boolean(anchor);
  const planAnchorElOpen = Boolean(planAnchor);

  const { showSnackbar, messageType } = useContext(SnackbarContext);

  const [loadReceiptDetails, { loading, error, data }] = useLazyQuery(ReceiptPayment, {
    variables: { userId, id: paymentId },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  });

  const [
    loadStatement,
    { loading: statementLoad, error: statementError, data: statementData }
  ] = useLazyQuery(PlanStatement, {
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
    { title: 'Payment Date', value: t('common:table_headers.payment_date'), col: 2 },
    { title: 'Payment Type', value: t('common:table_headers.payment_type'), col: 2 },
    { title: 'Amount', value: t('common:table_headers.amount'), col: 2 },
    { title: 'Status', value: t('common:table_headers.status'), col: 2 },
    { title: 'Menu', value: t('common:table_headers.menu'), col: 2 }
  ];
  const menuList = [
    {
      content: t('common:menu.view_receipt'),
      isAdmin: false,
      handleClick: event => handleClick(event)
    },
    {
      content: t('actions.transfer_payment'),
      isAdmin: true,
      handleClick: event => handleConfirmPlanTransferClick(event, 'payment')
    }
  ];

  const planMenuList = [
    {
      content: t('common:menu.cancel_plan'),
      isAdmin: true,
      handleClick: event => handleCancelPlanClick(event)
    },
    {
      content: t('common:menu.view_statement'),
      isAdmin: true,
      handleClick: event => handlePlanClick(event)
    },
    {
      content: t('common:menu.view_transactions'),
      isAdmin: true,
      handleClick: event => handleTransactionClick(event)
    },
    {
      content: t('common:menu.view_details'),
      isAdmin: true,
      handleClick: event => handlePlanDetailClick(event)
    },
    {
      content: t('common:menu.transfer_payment_plan'),
      isAdmin: true,
      handleClick: event => handleConfirmPlanTransferClick(event, 'plan')
    }
  ];

  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleCloseConfirmModal() {
    setConfirmPlanCancelOpen(false);
    setAnchor(null);
    handleClose();
  }
  function handleOpenDateMenu(event, id) {
    // avoid collapsing that shows invoices
    event.stopPropagation();
    setPlanDetails({ ...details, planId: id });
    setAnchorEl(event.currentTarget);
  }

  function handleClick(event) {
    event.stopPropagation();
    loadReceiptDetails();
    setReceiptOpen(true);
    setAnchor(null);
  }

  function handleCancelPlanClick(event) {
    event.stopPropagation();
    setConfirmPlanCancelOpen(true);
  }

  function handleTransferPlanModalClose() {
    setTransferPlanModalOpen(false)
    setAnchor(null);
  }

  function handleCancelPlan(event) {
    event.stopPropagation();
    handleCloseConfirmModal();
    setPlanDetails({ ...details, isLoading: true });
    cancelPaymentPlan({
      variables: {
        id: planId,
        userId
      }
    })
      .then(() => {
        showSnackbar({ type: messageType.success, message: t('misc.payment_cancelled')})
        setPlanDetails({...details, isLoading: false });
        refetch();
        balanceRefetch();
      })
      .catch(err => {
        showSnackbar({ type: messageType.error, message: formatError(err.message)})
        setPlanDetails({...details, isLoading: false });
      });
  }

  function handlePlanClick(event) {
    event.stopPropagation();
    loadStatement();
    setStatementOpen(true);
    setPlanAnchor(null);
  }

  function handleTransactionClick(event) {
    event.stopPropagation();
    history.push(`?tab=Plans&subtab=Transactions&id=${planId}`);
  }

  function handleConfirmPlanTransferClick(event, transferObject) {
    event.stopPropagation();
    setTransferType(transferObject);
    setTransferPlanModalOpen(true);
  }

  function transactionDetailOpen(trans) {
    if (currentUser.userType !== 'admin') return;
    setTransData(trans);
    setTransDetailOpen(true);
  }

  function handlePlanDetailClick(event) {
    event.stopPropagation();
    setPlanDetailOpen(true);
  }

  function handleTransactionMenu(event, pay) {
    event.stopPropagation();
    setAnchor(event.currentTarget);
    setPaymentId(pay.id);
    setPaymentData(pay)
  }

  function handlePlanMenu(event, plan) {
    event.stopPropagation();
    setPlanAnchor(event.currentTarget);
    setPlanId(plan.id);
    setPlanData(plan);
  }

  function handlePlanListClose(event) {
    event.stopPropagation();
    setPlanAnchor(null);
  }

  function headersForNonAdminUsers(payments) {
    if (
      currentUser.userType !== 'admin' &&
      payments?.every(payment => payment.status === 'cancelled')
    ) {
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
        planId: details.planId,
        paymentDay
      }
    })
      .then(() => {
        showSnackbar({ type: messageType.success, message: t('misc.pay_day_updated')})
        setPlanDetails({ ...details, isLoading: false });
        refetch();
        balanceRefetch();
      })
      .catch(err => {
        showSnackbar({ type: messageType.error, message: formatError(err.message)})
        setPlanDetails({ ...details, isLoading: false });
      });
  }

  function handlePaymentMenuClose(event) {
    event.stopPropagation();
    setAnchor(null);
  }

  const menuData = {
    menuList,
    handleTransactionMenu,
    anchorEl: anchor,
    open: anchorElOpen,
    userType: currentUser.userType,
    handleClose: event => handlePaymentMenuClose(event)
  };

  const planMenuData = {
    menuList: planMenuList,
    handlePlanMenu,
    anchorEl: planAnchor,
    open: planAnchorElOpen,
    userType: currentUser.userType,
    handleClose: event => handlePlanListClose(event)
  };

  function handleReceiptClose() {
    setReceiptOpen(false);
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
          updatePaymentPlan={updatePaymentPlan}
          plansRefetch={refetch}
          showSnackbar={showSnackbar}
          messageType={messageType}
        />
      )}
      <TransferPlanModal
        open={TransferPlanModalOpen}
        handleModalClose={handleTransferPlanModalClose}
        planData={planData}
        userId={userId}
        paymentPlanId={planId}
        refetch={refetch}
        balanceRefetch={balanceRefetch}
        currencyData={currencyData}
        transferType={transferType}
        paymentId={paymentId}
        paymentData={paymentData}
      />
      {error && <CenteredContent>{error.message}</CenteredContent>}
      {statementError && <CenteredContent>{statementError.message}</CenteredContent>}
      {loading ? (
        <Spinner />
      ) : (
        <PaymentReceipt
          paymentData={data?.paymentReceipt}
          open={receiptOpen}
          handleClose={() => handleReceiptClose()}
          currencyData={currencyData}
        />
      )}
      {statementLoad ? (
        <Spinner />
      ) : (
        <StatementPlan
          open={statementOpen}
          handleClose={() => setStatementOpen(false)}
          data={statementData?.paymentPlanStatement}
          currencyData={currencyData}
        />
      )}
      <ActionDialog
        open={confirmPlanCancelOpen}
        type={t('misc.confirm')}
        message={t('misc.about_to_cancel')}
        handleClose={handleCloseConfirmModal}
        handleOnSave={handleCancelPlan}
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
      {plans.filter(plan => plan.status !== 'general').map(plan => (
        <Accordion key={plan.id} style={{ backgroundColor: '#FDFDFD' }}>
          <AccordionSummary
            aria-label="Expand"
            id="additional-actions3-header"
            classes={{ content: classes.content }}
            data-testid="summary"
            className={classes.accordion}
          >
            {!matches ? (
              <PlanMobileDataList
                keys={planHeader}
                data={[
                  renderPlan(
                    plan,
                    currencyData,
                    currentUser,
                    {
                      handleMenu: event => handleOpenDateMenu(event, plan.id),
                      loading: details.isLoading,
                      planList: true
                    },
                    planMenuData,
                    t
                  )
                ]}
                clickable={false}
              />
            ) : (
              <DataList
                keys={planHeader}
                data={[
                  renderPlan(
                    plan,
                    currencyData,
                    currentUser,
                    {
                      handleMenu: event => handleOpenDateMenu(event, plan.id),
                      loading: details.isLoading
                    },
                    planMenuData,
                    t
                  )
                ]}
                hasHeader={false}
                clickable={false}
                color
              />
            )}
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.content }}>
            {plan.planPayments &&
              Boolean(plan.planPayments?.length) &&
              headersForNonAdminUsers(plan?.planPayments) && (
                <div>
                  <Typography
                    color="primary"
                    className={matches ? classes.payment : classes.paymentMobile}
                  >
                    {t('common:menu.payment_plural')}
                  </Typography>
                  <div className={classes.paymentList}>
                    {matches && <ListHeader headers={paymentHeader} color />}
                  </div>
                </div>
              )}
            {plan.planPayments
              ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map(
                pay =>
                  (currentUser.userType === 'admin' || pay?.status !== 'cancelled') && (
                    <div key={pay.id}>
                      {matches ? (
                        <div className={classes.paymentList}>
                          <DataList
                            keys={paymentHeader}
                            data={[
                              renderPayments(pay, currencyData, currentUser, menuData)
                            ]}
                            hasHeader={false}
                            clickable={currentUser.userType === 'admin'}
                            handleClick={() => transactionDetailOpen(pay)}
                            color
                          />
                        </div>
                      ) : (
                        <PaymentMobileDataList
                          keys={paymentHeader}
                          data={[renderPayments(pay, currencyData, currentUser, menuData)]}
                          clickable
                          handleClick={() => transactionDetailOpen(pay)}
                        />
                      )}
                    </div>
                  )
              )}
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}

export function renderPlan(
  plan,
  currencyData,
  currentUser,
  { handleMenu, loading, planList },
  menuData,
  t
) {
  /* eslint-disable no-unused-expressions */
  const planMenuList = [];
  menuData?.menuList.forEach(obj => {
    if (
      plan.status === 'cancelled' &&
      (obj.content === t('common:menu.cancel_plan') ||
        (obj.content === t('common:menu.transfer_payment_plan') && !plan.paidPaymentsExists))
    )
      return;

    planMenuList.push({ ...obj });
  });

  const paymentPlanPermissions = currentUser?.permissions?.find(permissionObject => permissionObject.module === 'payment_plan')
  const canViewMenuList = paymentPlanPermissions? paymentPlanPermissions.permissions.includes('can_view_menu_list'): false
  const canUpdatePaymentDay = paymentPlanPermissions? paymentPlanPermissions.permissions.includes('can_update_payment_day'): false

  return {
    'Plot Number': (
      <Grid item xs={12} md={2} data-testid="plot-number">
        <Text content={plan.landParcel.parcelNumber} />
        <br />
        <Text
          color="primary"
          content={`Category: ${titleize(plan.landParcel.objectType) || 'Land'}`}
        />
      </Grid>
    ),
    'Payment Plan': (
      <Grid item xs={12} md={2} data-testid="payment-plan">
        {titleize(plan.planType)}
        <br />
        {planList ? (
          <Grid item xs={9} md={2} style={{ marginTop: '10px' }} data-testid="status">
            <Label
              title={objectAccessor(invoiceStatus, plan?.status)}
              color={objectAccessor(InvoiceStatusColor, plan?.status)}
            />
          </Grid>
        ) : (
          <Text color="primary" content={`${plan.status}`} />
        )}
      </Grid>
    ),
    'Start Date': (
      <Grid item xs={12} md={2} data-testid="start-date">
        {dateToString(plan.startDate)}
      </Grid>
    ),
    'Balance/Monthly Amount': (
      <Grid item xs={12} md={2} data-testid="balance">
        <Text
          style={planList ? { fontSize: '18px', fontWeight: '500', color: '#141414' } : null}
          content={formatMoney(currencyData, plan.pendingBalance)}
        />
        {planList && <Text style={{ marginLeft: '8px' }} content="balance" />}
        <br />
        <Text
          color="primary"
          style={planList ? { fontSize: '13px', fontWeight: '300', color: '#595959' } : null}
          content={`${capitalize(plan?.frequency || 'Monthly')} Amount ${formatMoney(
            currencyData,
            plan.installmentAmount
          )}`}
        />
      </Grid>
    ),
    'Payment Day': (
      <Grid item xs={12} md={2}>
        <Button
          aria-controls="set-payment-date-menu"
          variant={canUpdatePaymentDay ? 'outlined' : 'text'}
          aria-haspopup="true"
          data-testid="menu"
          disabled={!canUpdatePaymentDay}
          onClick={handleMenu}
        >
          {loading && <Spinner />}

          {!loading && canUpdatePaymentDay ? (
            <span>
              <EditIcon fontSize="small" style={{ marginBottom: -4 }} />
              {`   ${suffixedNumber(plan.paymentDay)}`}
            </span>
          ) : (
            suffixedNumber(plan.paymentDay)
          )}
        </Button>
        <KeyboardArrowDownIcon style={{ margin: '10px 0 0 15px' }} />
      </Grid>
    ),
    Menu: (
      <Grid item xs={12} md={1} data-testid="menu" style={{textAlign: 'right'}}>
        {canViewMenuList && (
          <>
            <IconButton
              aria-controls="simple-menu"
              aria-haspopup="true"
              data-testid="plan-menu"
              dataid={plan.id}
              onClick={event => menuData.handlePlanMenu(event, plan)}
              color='primary'
              size="large"
            >
              <MoreVertIcon />
            </IconButton>
            <MenuList
              open={menuData?.open && menuData?.anchorEl?.getAttribute('dataid') === plan.id}
              anchorEl={menuData?.anchorEl}
              userType={menuData?.userType}
              handleClose={menuData?.handleClose}
              list={planMenuList}
            />
          </>
        )}
      </Grid>
    )
  };
}

export function renderPayments(pay, currencyData, currentUser, menuData) {
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
          title={objectAccessor(invoiceStatus, pay.status)}
          color={objectAccessor(InvoiceStatusColor, pay.status)}
        />
      </Grid>
    ),
    Menu: (
      <Grid item xs={12} md={1} data-testid="menu" style={{textAlign: 'right'}}>
        {pay.status === 'paid' && (
          <IconButton
            aria-controls="simple-menu"
            aria-haspopup="true"
            data-testid="pay-menu"
            dataid={pay.id}
            onClick={event => menuData.handleTransactionMenu(event, pay)}
            color='primary'
            size="large"
          >
            <MoreVertIcon />
          </IconButton>
        )}
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
    userType: PropTypes.string,
    permissions: PropTypes.arrayOf(PropTypes.shape({
        permissions: PropTypes.arrayOf(PropTypes.string)
      }))
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
  paymentMobile: {
    padding: '0 0 20px 20px',
    fontWeight: 400,
    backgroundColor: '#FDFDFD'
  },
  paymentList: {
    padding: '0 50px',
    backgroundColor: '#FDFDFD'
  }
}));
