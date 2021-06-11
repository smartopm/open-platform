/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery, useMutation, useQuery } from 'react-apollo';
import { useHistory } from 'react-router-dom';
import subDays from 'date-fns/subDays';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { CustomizedDialogs } from '../../../../components/Dialog';
import PaymentCreate from '../../graphql/payment_mutations';
import { UserLandParcelWithPlan, UsersLiteQuery } from '../../../../graphql/queries';
import MessageAlert from '../../../../components/MessageAlert';
import { extractCurrency, formatError, formatMoney } from '../../../../utils/helpers';
import ReceiptModal from './ReceiptModal';
import { Spinner } from '../../../../shared/Loading';
import SwitchInput from '../../../../components/Forms/SwitchInput';
import DatePickerDialog from '../../../../components/DatePickerDialog';
import useDebounce from '../../../../utils/useDebounce';

const initialValues = {
  amount: '',
  transactionType: '',
  bankName: '',
  chequeNumber: '',
  transactionNumber: '',
  landParcelId: '',
  pastPayment: false,
  paidDate: subDays(new Date(), 1),
  receiptNumber: ''
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
  csvRefetch
}) {
  const classes = useStyles();
  const history = useHistory();
  const [inputValue, setInputValue] = useState(initialValues);
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
  const [paymentUserId, setPaymentUserId] = useState(userId)
  const [mutationLoading, setMutationStatus] = useState(false);

  function confirm(event) {
    event.preventDefault();

    const checkReceipt = inputValue.pastPayment && !inputValue.receiptNumber;

    if (!inputValue.amount || !inputValue.transactionType || checkReceipt) {
      setIsError(true);
      setIsSubmitting(true);
      return;
    }
    setIsConfirm(true);
  }

  // make this a lazy query to only load when the userId is available
  const { loading, data: landParcels } = useQuery(UserLandParcelWithPlan, {
    variables: { paymentUserId },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  const [searchUser, { data }] = useLazyQuery(UsersLiteQuery, {
    variables: { query: debouncedValue, limit: 10 },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue.transactionType, inputValue.pastPayment]);

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
        amount: parseFloat(inputValue.amount),
        source: inputValue.transactionType,
        bankName: inputValue.bankName,
        chequeNumber: inputValue.chequeNumber,
        transactionNumber: inputValue.transactionNumber,
        receiptNumber: inputValue.receiptNumber,
        // allow rails to pick its default date rather than the initialValue past on top
        createdAt: inputValue.pastPayment ? inputValue.paidDate : '',
        landParcelId: inputValue.landParcelId
      }
    })
      .then(res => {
        setMessageAlert('Payment made successfully');
        setIsSuccessAlert(true);
        handleModalClose();
        refetch();
        walletRefetch();
        csvRefetch();
        setPaymentData(res.data.transactionCreate.transaction);
        setInputValue(initialValues);
        setPromptOpen(true);
        setIsConfirm(false);
        setMutationStatus(false);
      })
      .catch(err => {
        setIsConfirm(false);
        setMessageAlert(formatError(err.message));
        setIsSuccessAlert(false);
        setMutationStatus(false);
        history.push(`/user/${userId}?tab=Payments`);
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

  if (loading) return <Spinner />;

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
          <PaymentDetails inputValue={inputValue} currencyData={currencyData} />
        ) : (
          <>
            <div className={classes.invoiceForm}>
              <TextField
                autoFocus
                margin="dense"
                id="amount"
                label="Amount"
                type="number"
                value={inputValue.amount}
                onChange={event => setInputValue({ ...inputValue, amount: event.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {extractCurrency(currencyData)}
                    </InputAdornment>
                  ),
                  'data-testid': 'amount',
                  step: 0.01
                }}
                required
                error={isError && submitting && !inputValue.amount}
                helperText={isError && !inputValue.amount && 'amount is required'}
              />

              <Autocomplete
                style={{ width: '100%' }}
                id="payment-user-input"
                inputProps={{ 'data-testid': 'payment_user'}}
                options={data?.usersLite || []}
                getOptionLabel={option => option?.name}
                getOptionSelected={(option, value) => option.name === value.name}
                // value={ownershipFields[Number(index)]}
                onChange={(_event, user) => setPaymentUserId(user.id)}
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
              <TextField
                autoFocus
                margin="dense"
                id="parcel-number"
                inputProps={{ 'data-testid': 'parcel-number' }}
                label="Plot No"
                value={inputValue.landParcelId}
                onChange={event =>
                  setInputValue({ ...inputValue, landParcelId: event.target.value })}
                required
                select
                error={isError && submitting && !inputValue.landParcelId}
                helperText={isError && !inputValue.landParcelId && 'Land Parcel is required'}
              >
                {landParcels?.userLandParcelWithPlan?.map(land => (
                  <MenuItem value={land.id} key={land.id}>
                    {land.parcelNumber}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                margin="dense"
                id="transaction-type"
                inputProps={{ 'data-testid': 'transaction-type' }}
                label="Transaction Type"
                value={inputValue.transactionType}
                onChange={event =>
                  setInputValue({ ...inputValue, transactionType: event.target.value })}
                required
                select
                error={isError && submitting && !inputValue.transactionType}
                helperText={isError && !inputValue.transactionType && 'TransactionType is required'}
              >
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="cheque/cashier_cheque">Cheque/Cashier Cheque</MenuItem>
                <MenuItem value="mobile_money">Mobile Money</MenuItem>
                <MenuItem value="bank_transfer/cash_deposit">Bank Transfer/Cash Deposit</MenuItem>
                <MenuItem value="bank_transfer/eft">Bank Transfer/EFT</MenuItem>
                <MenuItem value="pos">Point of Sale</MenuItem>
                <MenuItem value="unallocated_funds">Unallocated Funds</MenuItem>
              </TextField>
              <br />
              <SwitchInput
                name="pastPayment"
                label="Is this a past payment?"
                value={inputValue.pastPayment}
                handleChange={event =>
                  setInputValue({ ...inputValue, pastPayment: event.target.checked })}
                labelPlacement="end"
              />
              {inputValue.pastPayment && (
                <>
                  <TextField
                    margin="dense"
                    id="receipt-number"
                    label="Receipt Number"
                    type="string"
                    value={inputValue.receiptNumber}
                    onChange={event =>
                      setInputValue({ ...inputValue, receiptNumber: event.target.value })}
                    required={inputValue.pastPayment}
                    error={isError && submitting && !inputValue.receiptNumber}
                    helperText={
                      isError &&
                      !inputValue.receiptNumber &&
                      'ReceiptNumber is required for past payments'
                    }
                  />
                  <DatePickerDialog
                    selectedDate={inputValue.paidDate}
                    label="Paid Date"
                    handleDateChange={date => setInputValue({ ...inputValue, paidDate: date })}
                    maxDate={subDays(new Date(), 1)}
                  />
                </>
              )}
              <TextField
                margin="dense"
                id="transaction-number"
                label="Transaction Number"
                type="string"
                value={inputValue.transactionNumber}
                onChange={event =>
                  setInputValue({ ...inputValue, transactionNumber: event.target.value })}
              />
              {inputValue.transactionType === 'cheque/cashier_cheque' && (
                <>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="bank-name"
                    label="Bank Name"
                    type="string"
                    value={inputValue.bankName}
                    onChange={event =>
                      setInputValue({ ...inputValue, bankName: event.target.value })}
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="cheque-number"
                    label="Cheque Number"
                    type="string"
                    value={inputValue.chequeNumber}
                    onChange={event =>
                      setInputValue({ ...inputValue, chequeNumber: event.target.value })}
                  />
                </>
              )}
            </div>
          </>
        )}
      </CustomizedDialogs>
    </>
  );
}

export function PaymentDetails({ inputValue, currencyData }) {
  return (
    <div>
      <Typography variant="subtitle1" data-testid="amount" align="center" key="amount">
        Amount: 
        {' '}
        <b>{formatMoney(currencyData, inputValue.amount)}</b>
      </Typography>
      <Typography variant="subtitle1" data-testid="type" align="center" key="type">
        Transaction Type:
        <b>{` ${inputValue.transactionType}`}</b>
      </Typography>
      {inputValue.pastPayment && (
        <Typography
          variant="subtitle1"
          data-testid="receiptNumber"
          align="center"
          key="receiptNumber"
        >
          Receipt Number:
          <b>{` ${inputValue.receiptNumber}`}</b>
        </Typography>
      )}
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
  }
});

PaymentDetails.propTypes = {
  inputValue: PropTypes.shape({
    amount: PropTypes.string.isRequired,
    transactionType: PropTypes.string.isRequired,
    status: PropTypes.string,
    bankName: PropTypes.string,
    chequeNumber: PropTypes.string,
    transactionNumber: PropTypes.string,
    receiptNumber: PropTypes.string,
    pastPayment: PropTypes.bool
  }).isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired
};

PaymentModal.defaultProps = {
  csvRefetch: () => {},
  walletRefetch: () => {},
  userData: {},
  userId: ""
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
  csvRefetch: PropTypes.func,
  walletRefetch: PropTypes.func,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired
};
