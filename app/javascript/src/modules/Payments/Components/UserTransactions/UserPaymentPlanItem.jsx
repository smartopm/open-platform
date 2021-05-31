import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Menu,
  MenuItem
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DataList from '../../../../shared/list/DataList';
import { dateToString } from '../../../../components/DateContainer';
import {
  formatError,
  formatMoney,
  InvoiceStatusColor,
  propAccessor
} from '../../../../utils/helpers';
import Text from '../../../../shared/Text';
import Label from '../../../../shared/label/Label';
import { invoiceStatus } from '../../../../utils/constants';
import MessageAlert from '../../../../components/MessageAlert';
import PaymentPlanUpdateMutation from '../../graphql/payment_plan_mutations';
import { Spinner } from '../../../../shared/Loading';
import { suffixedNumber } from '../../helpers';
import ListHeader from '../../../../shared/list/ListHeader';

export default function UserPaymentPlanItem({
  plans,
  currencyData,
  currentUser,
  userId,
  refetch,
  balanceRefetch
}) {
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
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  const planHeader = [
    { title: 'Plot Number', col: 2 },
    { title: 'Payment Plan', col: 2 },
    { title: 'Start Date', col: 2 },
    { title: 'Balance', col: 2 },
    { title: 'Monthly Amount', col: 2 },
    { title: 'Payment Day', col: 2 }
  ];

  const paymentHeader = [
    { title: 'Payment Date', col: 2 },
    { title: 'Payment Type', col: 2 },
    { title: 'Amount', col: 2 },
    { title: 'Status', col: 2 }
  ];

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
      {plans?.map(plan => (
        <Accordion key={plan.id} style={{backgroundColor: '#FDFDFD'}}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
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
                })
              ]}
              hasHeader={false}
              clickable={false}
              color
            />
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.content }}>
            {plan.planPayments && Boolean(plan.planPayments?.length) && (
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
                <div key={pay.id} className={classes.paymentList}>
                  <DataList
                    keys={paymentHeader}
                    data={[renderPayments(pay, currencyData)]}
                    hasHeader={false}
                    clickable={false}
                    color
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
    'Payment Plan': (
      <Grid item xs={12} md={2} data-testid="payment-plan">
        {plan.planType}
      </Grid>
    ),
    'Start Date': (
      <Grid item xs={12} md={2} data-testid="start-date">
        {dateToString(plan.startDate)}
      </Grid>
    ),
    'Balance': (
      <Grid item xs={12} md={2} data-testid="percentage">
        {formatMoney(currencyData, plan.pendingBalance)}
      </Grid>
    ),
    'Monthly Amount': (
      <Grid item xs={12} md={2} data-testid="monthly-amount">
        {formatMoney(currencyData, plan.monthlyAmount)}
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
      </Grid>
    )
  };
}

export function renderPayments(pay, currencyData) {
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
