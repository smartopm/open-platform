import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from 'react-apollo';
import { useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import { CustomizedDialogs } from '../../Dialog'
import { PaymentCreate } from '../../../graphql/mutations'
import { UserLandParcel } from '../../../graphql/queries'
import MessageAlert from "../../MessageAlert"
import { extractCurrency, formatError, formatMoney } from '../../../utils/helpers'
import ReceiptModal from './ReceiptModal'
import { Spinner } from '../../../shared/Loading'

const initialValues = {
  amount: '',
  transactionType: '',
  bankName: '',
  chequeNumber: '',
  transactionNumber: '',
  landParcelId: ''
}
export default function PaymentModal({ open, handleModalClose, userId, currencyData, refetch, depRefetch, walletRefetch, userData}){
  const classes = useStyles();
  const history = useHistory()
  const [inputValue, setInputValue] = useState(initialValues)
  const [createPayment] = useMutation(PaymentCreate)
  const [isSuccessAlert, setIsSuccessAlert] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')
  const [promptOpen, setPromptOpen] = useState(false)
  const [paymentData, setPaymentData] = useState({})
  const [isError, setIsError] = useState(false)
  const [submitting, setIsSubmitting] = useState(false)
  const [isConfirm, setIsConfirm] = useState(false);

  function confirm(event) {
    event.preventDefault();
    setIsConfirm(true);
  }

  const { loading, data: landParcels } = useQuery(UserLandParcel, {
    variables: { userId },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  // reset bank details when transaction type is changed
  // To avoid wrong details with wrong transaction type e.g: Cheque Number when paid using cash
  useEffect(() => {
    setInputValue({ ...inputValue, bankName: '', chequeNumber: '' })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue.transactionType])

  function cancelPayment() {
    if (isConfirm) {
      setIsConfirm(false);
      return;
    }
    handleModalClose();
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!inputValue.amount || !inputValue.transactionType) {
      setIsError(true)
      setIsSubmitting(true)
      return
    }
    createPayment({
      variables: {
        userId,
        amount: parseFloat(inputValue.amount),
        source: inputValue.transactionType,
        bankName: inputValue.bankName,
        chequeNumber: inputValue.chequeNumber,
        transactionNumber: inputValue.transactionNumber,
        landParcelId: inputValue.landParcelId
      }
    })
      .then(res => {
        setMessageAlert('Payment made successfully');
        setIsSuccessAlert(true);
        handleModalClose();
        refetch();
        depRefetch();
        walletRefetch();
        setPaymentData(res.data.walletTransactionCreate.walletTransaction);
        setInputValue(initialValues)
        setPromptOpen(true);
      })
      .catch(err => {
        handleModalClose();
        setMessageAlert(formatError(err.message));
        setIsSuccessAlert(false);
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
    history.push(`/user/${userId}?tab=Payments`);
  }

  if (loading) return <Spinner />

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
        saveAction={isConfirm ? 'Confirm' : 'Pay'}
        cancelAction={isConfirm ? 'Go Back' : 'Cancel'}
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
                type='number'
                value={inputValue.amount}
                onChange={(event) => setInputValue({...inputValue, amount: event.target.value})}
                InputProps={{
            startAdornment: <InputAdornment position="start">{extractCurrency(currencyData)}</InputAdornment>,
                "data-testid": "amount",
                step: 0.01
              }}
                required
                error={isError && submitting && !inputValue.amount}
                helperText={isError && !inputValue.amount && 'amount is required'}
              />
              <TextField
                autoFocus
                margin="dense"
                id="parcel-number"
                inputProps={{ "data-testid": "parcel-number" }}
                label="Plot No"
                value={inputValue.landParcelId}
                onChange={(event) => setInputValue({...inputValue, landParcelId: event.target.value})}
                required
                select
                error={isError && submitting && !inputValue.landParcelId}
                helperText={isError && !inputValue.landParcelId && 'Land Parcel is required'}
              >
                {landParcels?.userLandParcel?.map(land => (
                  <MenuItem value={land.id} key={land.id}>{land.parcelNumber}</MenuItem>
                ))}
              </TextField>
              <TextField
                margin="dense"
                id="transaction-type"
                inputProps={{ "data-testid": "transaction-type" }}
                label="Transaction Type"
                value={inputValue.transactionType}
                onChange={(event) => setInputValue({...inputValue, transactionType: event.target.value})}
                required
                select
                error={isError && submitting && !inputValue.transactionType}
                helperText={isError && !inputValue.transactionType && 'TransactionType is required'}
              >
                <MenuItem value='cash'>Cash</MenuItem>
                <MenuItem value='cheque/cashier_cheque'>Cheque/Cashier Cheque</MenuItem>
                <MenuItem value='mobile_money'>Mobile Money</MenuItem>
                <MenuItem value='bank_transfer/cash_deposit'>Bank Transfer/Cash Deposit</MenuItem>
                <MenuItem value='bank_transfer/eft'>Bank Transfer/EFT</MenuItem>
                <MenuItem value='pos'>Point of Sale</MenuItem>
              </TextField>
              <TextField
                margin="dense"
                id="transaction-number"
                label="Transaction Number"
                type='string'
                value={inputValue.transactionNumber}
                onChange={(event) => setInputValue({...inputValue, transactionNumber: event.target.value})}
              />
              {
            inputValue.transactionType === 'cheque/cashier_cheque' && (
              <>
                <TextField
                  autoFocus
                  margin="dense"
                  id="bank-name"
                  label="Bank Name"
                  type='string'
                  value={inputValue.bankName}
                  onChange={(event) => setInputValue({...inputValue, bankName: event.target.value})}
                />
                <TextField
                  autoFocus
                  margin="dense"
                  id="cheque-number"
                  label="Cheque Number"
                  type='string'
                  value={inputValue.chequeNumber}
                  onChange={(event) => setInputValue({...inputValue, chequeNumber: event.target.value})}
                />
              </>
            )
          }
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
    transactionNumber: PropTypes.string
  }).isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired
};

PaymentModal.defaultProps = {
  depRefetch: () => {},
  walletRefetch: () => {},
  userData: {}
};
PaymentModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  userData: PropTypes.shape({
    name: PropTypes.string,
    transactionNumber: PropTypes.number
  }),
  refetch: PropTypes.func.isRequired,
  depRefetch: PropTypes.func,
  walletRefetch: PropTypes.func,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired
}
