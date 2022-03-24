/* eslint-disable max-statements */
import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useHistory } from 'react-router-dom';
import Card from '../../../../shared/Card';
import { formatMoney, objectAccessor, InvoiceStatusColor } from '../../../../utils/helpers';
import ListHeader from '../../../../shared/list/ListHeader';
import DataList from '../../../../shared/list/DataList';
import Text from '../../../../shared/Text';
import { dateToString } from '../../../../components/DateContainer';
import Label from '../../../../shared/label/Label';
import { invoiceStatus } from '../../../../utils/constants';
import MenuList from '../../../../shared/MenuList';
import { PaymentMobileDataList } from './PaymentMobileDataList';
import PaymentReceipt from './PaymentReceipt';
import StatementPlan from './PlanStatement';
import AllocatePlanModal from './AllocatePlanModal';

export default function GeneralPlanList({
  data,
  currencyData,
  currentUser,
  userId,
  balanceRefetch,
  genRefetch,
  paymentPlansRefetch
}) {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [statementOpen, setStatementOpen] = useState(false);
  const [openAllocateModal, setOpenAllocateModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [planId, setPlanId] = useState(null);
  const classes = useStyles();
  const { t } = useTranslation(['payment', 'common']);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({});
  const [anchor, setAnchor] = useState(null);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const anchorElOpen = Boolean(anchor);
  const open = Boolean(anchorEl);
  const history = useHistory();
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
    }
  ];

  const planMenuList = [
    {
      content: t('common:menu.view_statement'),
      isAdmin: true,
      handleClick: event => handlePlanClick(event)
    },
    {
      content: t('common:menu.allocate_funds'),
      isAdmin: true,
      handleClick: event => handleAllocateFunds(event)
    },
    {
      content: t('common:menu.view_transactions'),
      isAdmin: true,
      handleClick: event => handleTransactionClick(event)
    }
  ];

  const menuData = {
    menuList,
    handleTransactionMenu,
    anchorEl: anchor,
    open: anchorElOpen,
    userType: currentUser.userType,
    handleClose: event => handlePaymentMenuClose(event)
  };

  const statementData = {
    statements: data?.planPayments.filter(payment => payment.status === 'paid').map(res => ({
      paymentDate: res.createdAt,
      amountPaid: res.amount,
      receiptNumber: res.receiptNumber
    })),
    paymentPlan: {
      user: data?.planPayments[0]?.user,
      landParcel: { community: data?.planPayments[0]?.community }
    }
  };

  function handleAllocateFunds(event) {
    event.stopPropagation();
    setOpenAllocateModal(true);
  }

  function handlePlanListClose(event) {
    event.stopPropagation();
    setAnchorEl(null);
  }

  function handleClick(event) {
    event.stopPropagation();
    setReceiptOpen(true);
    setAnchor(null);
  }

  function handleTransactionMenu(event, pay) {
    event.stopPropagation();
    setAnchor(event.currentTarget);
    setPaymentData(pay);
  }

  function handlePaymentMenuClose(event) {
    event.stopPropagation();
    setAnchor(null);
  }

  function handleReceiptClose() {
    setReceiptOpen(false);
    setAnchor(null);
  }

  function handlePlanMenu(event, plan) {
    event.stopPropagation();
    setPlanId(plan.id)
    setAnchorEl(event.currentTarget);
  }

  function handlePlanClick(event) {
    event.stopPropagation();
    setStatementOpen(true);
    setAnchorEl(null);
  }

  function handleTransactionClick(event) {
    event.stopPropagation();
    history.push(`?tab=Plans&subtab=Transactions&id=${planId}`);
  }

  return (
    <>
      <Card
        clickData={{ clickable: true, handleClick: () => setPaymentOpen(!paymentOpen) }}
        styles={{ backgroundColor: '#FDFDFD' }}
        data-testid='card'
      >
        <Grid container>
          <Grid item md={2} xs={4} style={{ marginTop: '10px' }} data-testid='title'>
            {t('common:misc.general_funds')}
          </Grid>
          <Grid item md={9} xs={6} style={{ marginTop: '10px' }} data-testid='amount'>
            {`Balance/Amount ${formatMoney(currencyData, data?.generalPayments)}`}
          </Grid>
          <Grid item md={1} xs={2} style={{ textAlign: 'right' }}>
            <IconButton
              aria-controls="simple-menu"
              aria-haspopup="true"
              data-testid="plan-menu"
              onClick={event => handlePlanMenu(event, data)}
              color="primary"
              size="large"
            >
              <MoreVertIcon />
            </IconButton>
          </Grid>
          <MenuList
            open={open}
            anchorEl={anchorEl}
            userType={currentUser.userType}
            handleClose={event => handlePlanListClose(event)}
            list={planMenuList}
          />
        </Grid>
      </Card>
      <div style={{ marginBottom: '20px' }}>
        {matches && paymentOpen && (
        <div className={classes.paymentList}>
          <ListHeader headers={paymentHeader} color />
        </div>
      )}
        {paymentOpen &&
        data.planPayments
          ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map(
            pay =>
              (currentUser.userType === 'admin' || pay?.status !== 'cancelled') && (
                <div key={pay.id}>
                  {matches ? (
                    <div className={classes.paymentList}>
                      <DataList
                        keys={paymentHeader}
                        data={[renderPayments(pay, currencyData, menuData)]}
                        hasHeader={false}
                        color
                      />
                    </div>
                  ) : (
                    <PaymentMobileDataList
                      keys={paymentHeader}
                      data={[renderPayments(pay, currencyData, menuData)]}
                    />
                  )}
                </div>
              )
          )}
      </div>
      <PaymentReceipt
        paymentData={paymentData}
        open={receiptOpen}
        handleClose={() => handleReceiptClose()}
        currencyData={currencyData}
      />
      <StatementPlan
        open={statementOpen}
        handleClose={() => setStatementOpen(false)}
        data={statementData}
        currencyData={currencyData}
      />
      <AllocatePlanModal
        open={openAllocateModal}
        handleClose={() => setOpenAllocateModal(false)}
        userId={userId}
        balanceRefetch={balanceRefetch}
        genRefetch={genRefetch}
        paymentPlansRefetch={paymentPlansRefetch}
      />
    </>
);
}

export function renderPayments(pay, currencyData, menuData) {
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
      <Grid item xs={12} md={2} data-testid="pay-amount">
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
      <Grid item xs={12} md={1} data-testid="menu">
        {pay.status === 'paid' && (
          <IconButton
            aria-controls="simple-menu"
            aria-haspopup="true"
            data-testid="pay-menu"
            dataid={pay.id}
            onClick={event => menuData.handleTransactionMenu(event, pay)}
            color="primary"
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

const useStyles = makeStyles(() => ({
  paymentList: {
    padding: '0 30px',
    backgroundColor: '#FDFDFD'
  }
}));

GeneralPlanList.defaultProps = {
  genRefetch: () => {},
  paymentPlansRefetch: () => {},
  balanceRefetch: () => {}
}

GeneralPlanList.propTypes = {
  data: PropTypes.shape({
    generalPayments: PropTypes.number,
    planPayments: PropTypes.arrayOf(PropTypes.shape)
  }).isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired,
  userId: PropTypes.string.isRequired,
  currentUser: PropTypes.shape({
    userType: PropTypes.string,
  }).isRequired,
  genRefetch: PropTypes.func,
  paymentPlansRefetch: PropTypes.func,
  balanceRefetch: PropTypes.func
};
