/* eslint-disable no-nested-ternary */
/* eslint-disable security/detect-object-injection */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery, useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import subDays from 'date-fns/subDays';
import { useMediaQuery } from '@mui/material';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import { CustomizedDialogs } from '../../../../components/Dialog';
import PaymentCreate from '../../graphql/payment_mutations';
import { UserLandParcelWithPlan, UsersLiteQuery } from '../../../../graphql/queries';
import MessageAlert from '../../../../components/MessageAlert';
import {
  extractCurrency,
  formatError,
  formatMoney,
  objectAccessor
} from '../../../../utils/helpers';
import ReceiptModal from './ReceiptModal';
import { Spinner } from '../../../../shared/Loading';
import DatePickerDialog from '../../../../components/DatePickerDialog';
import useDebounce from '../../../../utils/useDebounce';
import UserAutoResult from '../../../../shared/UserAutoResult';
import SwitchInput from '../../../Forms/components/FormProperties/SwitchInput';
import { dateToString } from '../../../../components/DateContainer';

const initialValues = {
  transactionType: '',
  bankName: '',
  chequeNumber: '',
  transactionNumber: '',
  pastPayment: false,
  paidDate: subDays(new Date(), 1),
  paymentsAttributes: [{ amount: '', receiptNumber: '', paymentPlanId: '' }]
};

// Plan to reuse this component
// - Make the landparcels query lazy to get the plots only when the userId is available
// - Add an inline search component that finds the user and updates the userId
// - Refetch the data after payment has been made
//  -

export default function PaymentModal({
  open,
  handleModalClose,
  userId,
  currencyData,
  refetch,
  walletRefetch,
  userData,
  transRefetch,
  genRefetch
}) {
  const classes = useStyles();
  const [inputValue, setInputValue] = useState(initialValues);
  const [plotInputValue, setPlotInputValue] = useState([]);
  const [createPayment] = useMutation(PaymentCreate);
  const [isSuccessAlert, setIsSuccessAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const [promptOpen, setPromptOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({});
  const [isError, setIsError] = useState(false);
  const [submitting, setIsSubmitting] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [searchedUser, setSearchUser] = useState('');
  const debouncedValue = useDebounce(searchedUser, 500);
  const [paymentUserId, setPaymentUserId] = useState(userId);
  const [mutationLoading, setMutationStatus] = useState(false);
  const { t } = useTranslation(['payment', 'common']);
  const matches = useMediaQuery('(max-width:800px)');
  function confirm(event) {
    event.preventDefault();

    const receiptCheck = plotInputValue.map(val => !!val.receiptNumber).every(Boolean);
    const amountCheck = plotInputValue.map(val => !!val.amount).every(Boolean);

    if (totalAmount() === 0 || !inputValue.transactionType) {
      setIsError(true);
      setIsSubmitting(true);
      return;
    }

    if (inputValue.pastPayment && !receiptCheck) {
      setIsError(true);
      setIsSubmitting(true);
      setIsSuccessAlert(false);
      setMessageAlert('Receipt Number cannot be blank');
      return;
    }

    if (inputValue.pastPayment && !amountCheck) {
      setIsError(true);
      setIsSubmitting(true);
      setIsSuccessAlert(false);
      setMessageAlert('Amount cannot be blank');
      return;
    }

    setIsConfirm(true);
  }

  const [
    loadLandParcel,
    { loading, data: paymentPlans, refetch: paymentPlansRefetch }
  ] = useLazyQuery(UserLandParcelWithPlan, {
    variables: { userId: paymentUserId },
    errorPolicy: 'all',
    fetchPolicy: 'no-cache'
  });

  const [searchUser, { data }] = useLazyQuery(UsersLiteQuery, {
    variables: { query: debouncedValue.length > 0 ? debouncedValue : 'all', limit: 10 },
    errorPolicy: 'all',
    fetchPolicy: 'no-cache'
  });

  // reset bank details when transaction type and pastPayment are changed
  // To avoid wrong details with wrong transaction type e.g: Cheque Number when paid using cash
  useEffect(() => {
    setInputValue({
      ...inputValue,
      bankName: '',
      chequeNumber: '',
      paidDate: subDays(new Date(), 1)
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue.transactionType, inputValue.pastPayment]);

  useEffect(() => {
    if (open && userId) {
      loadLandParcel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    setPlotInputValue([]);
    setIsError(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleSearchPlot(user) {
    setPaymentUserId(user.id);
    loadLandParcel();
  }

  function totalAmount() {
    return plotInputValue.reduce((baseVal, val) => baseVal + parseFloat(val.amount || 0), 0);
  }

  function onChangePlotInputFields(event, plan) {
    updatePlotInputFields(event.target.name, event.target.value, plan.id);
    if (event.target.name === 'amount') {
      totalAmount();
    }
  }

  function checkInputValues(id) {
    const res = plotInputValue.find(ele => ele.paymentPlanId === id);
    return {
      amount: res?.amount || '',
      receiptNumber: res?.receiptNumber || ''
    };
  }

  function validatePlotInput(input) {
    return input.map(({ amount, paymentPlanId }) => ({ amount, paymentPlanId }));
  }

  // eslint-disable-next-line consistent-return
  function updatePlotInputFields(name, value, paymentPlanId) {
    const fields = [...plotInputValue];
    const index = fields.findIndex(val => val.paymentPlanId === paymentPlanId);
    if (value === '') {
      const a = objectAccessor(fields, index).receiptNumber;
      const r = objectAccessor(fields, index).amount;
      if (!a || !r) {
        fields.splice(index, 1);
        return setPlotInputValue(fields);
      }
    }
    if (objectAccessor(fields, index)) {
      fields[Number(index)] = {
        ...objectAccessor(fields, index),
        [name]: name === 'amount' && value !== '' ? parseFloat(value) : value
      };
    } else {
      fields.push({ [name]: name === 'amount' ? parseFloat(value) : value, paymentPlanId });
    }
    setPlotInputValue(fields);
  }

  function cancelPayment() {
    if (isConfirm) {
      setIsConfirm(false);
      return;
    }
    handleModalClose();
  }

  function handlePaymentData(payments) {
    /* It filters out the payments made for plan and excludes the payment made for general fund */
    const planPayments = payments.filter(payment => payment.paymentPlan);
    setPaymentData({ planPayments });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMutationStatus(true);
    createPayment({
      variables: {
        userId: paymentUserId,
        source: inputValue.transactionType,
        bankName: inputValue.bankName,
        chequeNumber: inputValue.chequeNumber,
        transactionNumber: inputValue.transactionNumber,
        amount: totalAmount(),
        // allow rails to pick its default date rather than the initialValue past on top
        createdAt: inputValue.pastPayment ? inputValue.paidDate : '',
        paymentsAttributes: inputValue.pastPayment
          ? plotInputValue
          : validatePlotInput(plotInputValue)
      }
    })
      .then(res => {
        setMessageAlert('Payment made successfully');
        setIsSuccessAlert(true);
        handleModalClose();
        refetch();
        walletRefetch();
        transRefetch();
        genRefetch();
        paymentPlansRefetch();
        handlePaymentData(res.data.transactionCreate.transaction.planPayments);
        setInputValue(initialValues);
        setPromptOpen(!!userId);
        setIsConfirm(false);
        setMutationStatus(false);
      })
      .catch(err => {
        setIsConfirm(false);
        setMessageAlert(formatError(err.message));
        setIsSuccessAlert(false);
        setMutationStatus(false);
      });
  }

  function validateAmount(plan) {
    const index = plotInputValue.findIndex(obj => obj.paymentPlanId === plan.id);
    if (index === -1 || plotInputValue[index].amount <= plan.pendingBalance) {
      return 0;
    }
    return plotInputValue[index].amount - plan.pendingBalance;
  }

  function amountHelperText(plan) {
    if (isError && totalAmount() === 0) return t('errors.amount_required');
    const extraAmount = validateAmount(plan);
    if (extraAmount > 0) {
      return t('misc.payment_split_message', { amount: formatMoney(currencyData, extraAmount) });
    }
    return '';
  }

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setMessageAlert('');
  }

  function handlePromptClose() {
    setPromptOpen(false);
  }

  return (
    <>
      <MessageAlert
        type={isSuccessAlert ? 'success' : 'error'}
        message={messageAlert}
        open={!!messageAlert}
        handleClose={handleMessageAlertClose}
      />
      <ReceiptModal
        open={promptOpen}
        handleClose={() => handlePromptClose()}
        paymentData={paymentData}
        userData={userData}
        currencyData={currencyData}
      />
      <CustomizedDialogs
        open={open}
        handleModal={cancelPayment}
        dialogHeader={isConfirm ? t('misc.make_payment_details') : t('misc.make_a_payment')}
        handleBatchFilter={isConfirm ? handleSubmit : confirm}
        saveAction={
        isConfirm && !mutationLoading
          ? t('misc.confirm')
          : mutationLoading
          ? t('common:form_actions.submitting')
          : t('actions.pay')
      }
        cancelAction={isConfirm ? t('actions.go_back') : t('common:form_actions.cancel')}
        disableActionBtn={mutationLoading}
      >
        {isConfirm ? (
          <PaymentDetails
            inputValue={inputValue}
            totalAmount={totalAmount()}
            currencyData={currencyData}
          />
      ) : (
        <>
          <div className={classes.invoiceForm}>
            <Typography className={classes.title}>{t('misc.make_payment_towards')}</Typography>
            <SwitchInput
              name="pastPayment"
              label={t('misc.manual_payment')}
              value={inputValue.pastPayment}
              handleChange={event =>
                setInputValue({ ...inputValue, pastPayment: event.target.checked })
              }
              labelPlacement="end"
            />
            {inputValue.pastPayment && (
              <>
                <DatePickerDialog
                  selectedDate={inputValue.paidDate}
                  label={t('table_headers.paid_date')}
                  handleDateChange={date => setInputValue({ ...inputValue, paidDate: date })}
                />
              </>
            )}
            {!userId && (
              <Grid container>
                <Autocomplete
                  style={{ width: matches ? 300 : '100%', marginLeft: matches && 2 }}
                  id="payment-user-input"
                  options={data?.usersLite || []}
                  getOptionLabel={option => option?.name}
                  isOptionEqualToValue={(option, value) => option.name === value.name}
                  onChange={(_event, user) => handleSearchPlot(user)}
                  classes={{
                    option: classes.AutocompleteOption,
                    listbox: classes.AutocompleteOption
                  }}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <UserAutoResult user={option} t={t} />
                    </li>
                  )}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label={t('table_headers.input_user_name')}
                      style={{ width: '100%' }}
                      name="name"
                      onChange={event => setSearchUser(event.target.value)}
                      onKeyDown={() => searchUser()}
                    />
                  )}
                />
              </Grid>
            )}
            {searchedUser && !paymentPlans?.userLandParcelWithPlan.length && (
              <Typography color="secondary">{t('errors.selected_user')}</Typography>
            )}
            {loading && <Spinner />}
            <div style={{ display: 'flex' }}>
              <TextField
                margin="normal"
                id="transaction-type"
                inputProps={{
                  'data-testid': 'transaction-type',
                  className: 'transaction-type-select-input'
                }}
                label={t('table_headers.transaction_type')}
                value={inputValue.transactionType}
                onChange={event =>
                  setInputValue({ ...inputValue, transactionType: event.target.value })
                }
                required
                select
                error={isError && submitting && !inputValue.transactionType}
                helperText={
                  isError && !inputValue.transactionType && t('errors.transaction_required')
                }
                style={{ width: '50%', marginRight: '20px' }}
              >
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="cheque/cashier_cheque">Cheque/Cashier Cheque</MenuItem>
                <MenuItem value="mobile_money">Mobile Money</MenuItem>
                <MenuItem value="bank_transfer/cash_deposit">Bank Transfer/Cash Deposit</MenuItem>
                <MenuItem value="bank_transfer/eft">Bank Transfer/EFT</MenuItem>
                <MenuItem value="pos">Point of Sale</MenuItem>
              </TextField>
              <TextField
                margin="normal"
                id="transaction-number"
                label={t('common:table_headers.transaction_number')}
                type="string"
                style={{ width: '50%' }}
                value={inputValue.transactionNumber}
                onChange={event =>
                  setInputValue({ ...inputValue, transactionNumber: event.target.value })
                }
                className="transaction-number-input"
              />
            </div>

            {inputValue.transactionType === 'cheque/cashier_cheque' && (
              <div style={{ display: 'flex' }}>
                <TextField
                  autoFocus
                  margin="normal"
                  id="bank-name"
                  label={t('common:table_headers.bank_name')}
                  type="string"
                  style={{ width: '50%', marginRight: '20px' }}
                  value={inputValue.bankName}
                  onChange={event =>
                    setInputValue({ ...inputValue, bankName: event.target.value })
                  }
                />
                <TextField
                  autoFocus
                  margin="normal"
                  id="cheque-number"
                  label={t('common:table_headers.cheque_number')}
                  type="string"
                  value={inputValue.chequeNumber}
                  style={{ width: '50%' }}
                  onChange={event =>
                    setInputValue({ ...inputValue, chequeNumber: event.target.value })
                  }
                />
              </div>
            )}
            {paymentPlans?.userLandParcelWithPlan?.map(plan => (
              <div key={plan.id} className={classes.plotCard}>
                <div style={{ width: '50%' }}>
                  <Typography className={classes.plotNoTitle}>
                    {t('table_headers.plot_no')}
                  </Typography>
                  <Typography className={classes.plotNo}>
                    {plan?.landParcel?.parcelNumber.toUpperCase()}
                  </Typography>
                  <Typography className={classes.plotNoTitle}>
                    {`${t('common:table_headers.start_date')}: ${dateToString(plan?.startDate)}`}
                  </Typography>
                  <Typography className={classes.plotNoTitle}>
                    {t('table_headers.remaining_balance', {
                      amount: formatMoney(currencyData, plan?.pendingBalance)
                    })}
                  </Typography>
                  {inputValue.pastPayment && (
                    <TextField
                      margin="normal"
                      id="receipt-number"
                      label={t('table_headers.receipt_number')}
                      type="string"
                      value={checkInputValues(plan.id)?.receiptNumber}
                      name="receiptNumber"
                      onChange={event => onChangePlotInputFields(event, plan)}
                    />
                  )}
                </div>
                <TextField
                  margin="normal"
                  id="amount"
                  label={t('common:table_headers.amount')}
                  type="number"
                  name="amount"
                  style={{ width: '50%' }}
                  value={checkInputValues(plan.id)?.amount}
                  onChange={event => onChangePlotInputFields(event, plan)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {extractCurrency(currencyData)}
                      </InputAdornment>
                    ),
                    'data-testid': 'amount',
                    step: 0.01
                  }}
                  className="transaction-amount-input"
                  required
                  error={isError && submitting && totalAmount() === 0}
                  helperText={amountHelperText(plan)}
                />
              </div>
            ))}
          </div>
          <div className={classes.totalAmountBody}>
            <Typography className={classes.plotNoTitle}>
              {t('table_headers.total_amount')}
            </Typography>
            <Typography color="primary" className={classes.totalAmount}>
              <b>{formatMoney(currencyData, totalAmount())}</b>
            </Typography>
          </div>
        </>
      )}
      </CustomizedDialogs>
    </>
);
}

export function PaymentDetails({ inputValue, totalAmount, currencyData }) {
  const { t } = useTranslation(['payment', 'common']);
  return (
    <div>
      <Typography variant="subtitle1" data-testid="amount" align="center" key="amount">
        {t('table_headers.total_amount')}
        :
        <b>{formatMoney(currencyData, totalAmount)}</b>
      </Typography>
      <Typography variant="subtitle1" data-testid="type" align="center" key="type">
        {t('table_headers.transaction_type')}
        :
        <b>{` ${inputValue.transactionType}`}</b>
      </Typography>
      <Typography variant="subtitle1" data-testid="transactionNumber" align="center" key="number">
        {inputValue.transactionNumber && (
          <>
            {t('common:table_headers.transaction_number')}
            :
            <b>{` ${inputValue.transactionNumber}`}</b>
          </>
        )}
      </Typography>
      <Typography variant="subtitle1" data-testid="bankName" align="center" key="bankName">
        {inputValue.bankName && (
          <>
            {t('common:table_headers.bank_name')}
            :
            <b>{` ${inputValue.bankName}`}</b>
          </>
        )}
      </Typography>
      <Typography variant="subtitle1" data-testid="chequeNumber" align="center" key="cheque">
        {inputValue.chequeNumber && (
          <>
            {t('common:table_headers.cheque_number')}
            :
            <b>{` ${inputValue.chequeNumber}`}</b>
          </>
        )}
      </Typography>
    </div>
  );
}

const useStyles = makeStyles({
  invoiceForm: {
    display: 'flex',
    flexDirection: 'column',
    width: '500px'
  },
  AutocompleteOption: {
    padding: '0px'
  },
  title: {
    fontWeight: 500,
    fontSize: '15px',
    color: '#313131',
    marginBottom: '20px'
  },
  plotNoTitle: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#8B8B8B'
  },
  plotNumber: {
    fontSize: '16px',
    fontWeight: 500,
    color: '#212121'
  },
  plotCard: {
    display: 'flex',
    padding: '20px 18px',
    border: '1px solid #E4E4E4',
    borderRadius: '12px',
    margin: '20px 0'
  },
  totalAmountBody: {
    width: '100%',
    textAlign: 'right',
    background: '#FBFAFA',
    padding: '15px 20px'
  },
  totalAmount: {
    fontSize: '32px',
    fontWeight: 600
  }
});

PaymentDetails.propTypes = {
  inputValue: PropTypes.shape({
    transactionType: PropTypes.string.isRequired,
    status: PropTypes.string,
    bankName: PropTypes.string,
    chequeNumber: PropTypes.string,
    transactionNumber: PropTypes.string,
    pastPayment: PropTypes.bool
  }).isRequired,
  totalAmount: PropTypes.number.isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired
};

PaymentModal.defaultProps = {
  transRefetch: () => {},
  walletRefetch: () => {},
  genRefetch: () => {},
  userData: {},
  userId: null
};
PaymentModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  userId: PropTypes.string,
  userData: PropTypes.shape({
    name: PropTypes.string,
    transactionNumber: PropTypes.number
  }),
  refetch: PropTypes.func.isRequired,
  transRefetch: PropTypes.func,
  walletRefetch: PropTypes.func,
  genRefetch: PropTypes.func,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired
};
