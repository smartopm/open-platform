/* eslint-disable max-statements */
import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
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

export default function GeneralPlanList({ data, currencyData, currentUser }) {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [statementOpen, setStatementOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const { t } = useTranslation(['payment', 'common']);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({});
  const [anchor, setAnchor] = useState(null);
  const matches = useMediaQuery('(max-width:600px)');
  const anchorElOpen = Boolean(anchor);
  const open = Boolean(anchorEl);
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
      handleClick: event => handleCancelPlanClick(event)
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
    statements: data?.planPayments.map(res => ({
      paymentDate: res.createdAt,
      amountPaid: res.amount,
      receiptNumber: res.receiptNumber
    })),
    paymentPlan: {
      user: data?.planPayments[0].user,
      landParcel: { community: data?.planPayments[0].community }
    }
  };

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

  function handlePlanMenu(event) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  }

  function handlePlanClick(event) {
    event.stopPropagation();
    setStatementOpen(true);
    setAnchorEl(null);
  }
  return (
    <>
      {console.log(paymentData)}
      <Card
        clickData={{ clickable: true, handleClick: () => setPaymentOpen(!paymentOpen) }}
        styles={{ backgroundColor: '#FDFDFD' }}
      >
        <Grid container>
          <Grid item md={2} style={{ marginTop: '10px' }}>
            General Funds
          </Grid>
          <Grid item md={9} style={{ marginTop: '10px' }}>
            {`Balance/Amount ${formatMoney(currencyData, data?.generalPayments)}`}
          </Grid>
          <Grid item md={1} style={{ textAlign: 'right' }}>
            <IconButton
              aria-controls="simple-menu"
              aria-haspopup="true"
              data-testid="plan-menu"
              onClick={event => handlePlanMenu(event)}
              color="primary"
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
        {!matches && paymentOpen && (
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
                    {!matches ? (
                      <div className={classes.paymentList}>
                        <DataList
                          keys={paymentHeader}
                          data={[renderPayments(pay, currencyData, currentUser, menuData)]}
                          hasHeader={false}
                          color
                        />
                      </div>
                    ) : (
                      <PaymentMobileDataList
                        keys={paymentHeader}
                        data={[renderPayments(pay, currencyData, currentUser, menuData)]}
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
    </>
  );
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
      <Grid item xs={12} md={1} data-testid="menu">
        {pay.status === 'paid' && (
          <IconButton
            aria-controls="simple-menu"
            aria-haspopup="true"
            data-testid="pay-menu"
            dataid={pay.id}
            onClick={event => menuData.handleTransactionMenu(event, pay)}
            color="primary"
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
