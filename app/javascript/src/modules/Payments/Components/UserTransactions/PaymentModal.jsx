/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery, useMutation } from 'react-apollo';
import subDays from 'date-fns/subDays';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import { CustomizedDialogs } from '../../../../components/Dialog';
import PaymentCreate from '../../graphql/payment_mutations';
import { UserLandParcelWithPlan, UsersLiteQuery } from '../../../../graphql/queries';
import MessageAlert from '../../../../components/MessageAlert';
import { extractCurrency, formatError, formatMoney } from '../../../../utils/helpers';
import ReceiptModal from './ReceiptModal';
import { Spinner } from '../../../../shared/Loading';
import DatePickerDialog from '../../../../components/DatePickerDialog';
import useDebounce from '../../../../utils/useDebounce';
import UserAutoResult from '../../../../shared/UserAutoResult';
import SwitchInput from '../../../Forms/components/SwitchInput';

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
  transRefetch
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

  function confirm(event) {
    event.preventDefault();
    
    const receiptCheck = plotInputValue.map((val) => !!val.receiptNumber).every(Boolean)

    if (totalAmount() === 0 || !inputValue.transactionType || (inputValue.pastPayment && !receiptCheck)) {
      setIsError(true);
      setIsSubmitting(true);
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
      receiptNumber: '',
      paidDate: subDays(new Date(), 1)
    });
    setPlotInputValue([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue.transactionType, inputValue.pastPayment]);

  useEffect(() => {
    if (open && userId) {
      loadLandParcel()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])


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
    return plotInputValue.reduce((baseVal, val) => baseVal + parseInt(val.amount, 10), 0)
  }

  function onChangePlotInputFields(event, plan) {
    updatePlotInputFields(event.target.name, event.target.value, plan.id);
    if (event.target.name === 'amount') { totalAmount() }
  }

  function checkInputValues(id, type) {
    const res = plotInputValue.find(ele => ele.paymentPlanId === id)
    if (type === "amount") {
      return res?.amount
    } 
    return res?.receiptNumber
  }

  // eslint-disable-next-line consistent-return
  function updatePlotInputFields(name, value, paymentPlanId) {
    const fields = [...plotInputValue];
    const index = fields.findIndex(val => val.paymentPlanId === paymentPlanId);
    if(name === 'amount' && value === '') {
      fields.splice(index, 1);
      return setPlotInputValue(fields);
    }
    if (fields[Number(index)]) {
      fields[Number(index)] = {
        ...fields[Number(index)],
        [name]: name === 'amount' ? parseFloat(value) : value
      };
    } else {
      fields.push({ [name]: value, paymentPlanId });
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
        paymentsAttributes: plotInputValue
      }
    })
      .then(res => {
        setMessageAlert('Payment made successfully');
        setIsSuccessAlert(true);
        handleModalClose();
        refetch();
        walletRefetch();
        transRefetch();
        paymentPlansRefetch();
        setPaymentData(res.data.transactionCreate.transaction);
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
        dialogHeader={
          isConfirm ? 'You are about to make a payment with following details' : 'Make a Payment'
        }
        handleBatchFilter={isConfirm ? handleSubmit : confirm}
        saveAction={
          isConfirm && !mutationLoading ? 'Confirm' : mutationLoading ? 'Submitting ...' : 'Pay'
        }
        cancelAction={isConfirm ? 'Go Back' : 'Cancel'}
        disableActionBtn={mutationLoading}
      >
        {isConfirm ? (
          <PaymentDetails inputValue={inputValue} totalAmount={totalAmount()} currencyData={currencyData} />
        ) : (
          <>
            <div className={classes.invoiceForm}>
              <Typography className={classes.title}>
                Make payment towards any of your plans below. You can make payment towards multiple
                plans as well.
              </Typography>
              <SwitchInput
                name="pastPayment"
                label="Is this a manual payment?"
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
                    label="Paid Date"
                    handleDateChange={date => setInputValue({ ...inputValue, paidDate: date })}
                  />
                </>
              )}
              {!userId && (
                <Grid container>
                  <Autocomplete
                    style={{ width: '100%' }}
                    id="payment-user-input"
                    options={data?.usersLite || []}
                    getOptionLabel={option => option?.name}
                    getOptionSelected={(option, value) => option.name === value.name}
                    onChange={(_event, user) => handleSearchPlot(user)}
                    classes={{
                      option: classes.AutocompleteOption,
                      listbox: classes.AutocompleteOption
                    }}
                    renderOption={option => <UserAutoResult user={option} />}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label="Input User Name"
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
                <Typography color="secondary">Selected user has no plots</Typography>
              )}
              {loading && <Spinner />}
              <div style={{ display: 'flex' }}>
                <TextField
                  margin="normal"
                  id="transaction-type"
                  inputProps={{ 'data-testid': 'transaction-type' }}
                  label="Transaction Type"
                  value={inputValue.transactionType}
                  onChange={event =>
                    setInputValue({ ...inputValue, transactionType: event.target.value })
                  }
                  required
                  select
                  error={isError && submitting && !inputValue.transactionType}
                  helperText={
                    isError && !inputValue.transactionType && 'TransactionType is required'
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
                  label="Transaction Number"
                  type="string"
                  style={{ width: '50%' }}
                  value={inputValue.transactionNumber}
                  onChange={event =>
                    setInputValue({ ...inputValue, transactionNumber: event.target.value })
                  }
                />
              </div>

              {inputValue.transactionType === 'cheque/cashier_cheque' && (
                <div style={{ display: 'flex' }}>
                  <TextField
                    autoFocus
                    margin="normal"
                    id="bank-name"
                    label="Bank Name"
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
                    label="Cheque Number"
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
                    <Typography className={classes.plotNoTitle}>Plot No</Typography>
                    <Typography className={classes.plotNo}>
                      {plan?.landParcel?.parcelNumber.toUpperCase()}
                    </Typography>
                    <Typography
                      className={classes.plotNoTitle}
                    >
                      {`${plan?.pendingBalance} remaining balance`}
                    </Typography>
                    {inputValue.pastPayment && (
                      <TextField
                        margin="normal"
                        id="receipt-number"
                        label="Receipt Number"
                        type="string"
                        value={checkInputValues(plan.id, 'receipt')}
                        name="receiptNumber"
                        onChange={event => onChangePlotInputFields(event, plan)}
                      />
                    )}
                  </div>
                  <TextField
                    margin="normal"
                    id="amount"
                    label="Amount"
                    type="number"
                    name="amount"
                    style={{ width: '50%' }}
                    value={checkInputValues(plan.id, 'amount')}
                    onChange={event => onChangePlotInputFields(event, plan)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {extractCurrency(currencyData)}
                        </InputAdornment>
                      ),
                      'data-testid': 'amount',
                      min: "0", max: "10", step: "1"
                    }}
                    required
                    error={isError && submitting && totalAmount() === 0}
                    helperText={isError && totalAmount() === 0 && 'amount is required'}
                  />
                </div>
              ))}
            </div>
            <div className={classes.totalAmountBody}>
              <Typography className={classes.plotNoTitle}>Total Amount</Typography>
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
  return (
    <div>
      <Typography variant="subtitle1" data-testid="amount" align="center" key="amount">
        Total Amount: 
        {' '}
        <b>{formatMoney(currencyData, totalAmount)}</b>
      </Typography>
      <Typography variant="subtitle1" data-testid="type" align="center" key="type">
        Transaction Type:
        <b>{` ${inputValue.transactionType}`}</b>
      </Typography>
      <Typography variant="subtitle1" data-testid="transactionNumber" align="center" key="number">
        {inputValue.transactionNumber && (
          <>
            Transaction Number:
            <b>{` ${inputValue.transactionNumber}`}</b>
          </>
        )}
      </Typography>
      <Typography variant="subtitle1" data-testid="bankName" align="center" key="bankName">
        {inputValue.bankName && (
          <>
            Bank Name:
            <b>{` ${inputValue.bankName}`}</b>
          </>
        )}
      </Typography>
      <Typography variant="subtitle1" data-testid="chequeNumber" align="center" key="cheque">
        {inputValue.chequeNumber && (
          <>
            Cheque Number:
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
  totalAmount: PropTypes.string.isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired
};

PaymentModal.defaultProps = {
  transRefetch: () => {},
  walletRefetch: () => {},
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
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired
};
