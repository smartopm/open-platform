/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { useMutation, useQuery } from 'react-apollo';
import { useLocation } from 'react-router-dom';
import { CustomizedDialogs } from '../Dialog';
import DetailsField from '../../shared/DetailField';
import { dateToString } from '../DateContainer';
import { formatError, formatMoney } from '../../utils/helpers';
import { StyledTab, StyledTabs, TabPanel } from '../Tabs';
import { WalletTransactionUpdate } from '../../graphql/mutations/transactions';
import MessageAlert from '../MessageAlert';
import { AllEventLogsQuery } from '../../graphql/queries';
import { Spinner } from '../../shared/Loading';
import CenteredContent from '../CenteredContent';
import EventTimeLine from '../../shared/TimeLine';


export default function TransactionDetails({ data, detailsOpen, handleClose, currencyData, isEditing }) {
  
  const initialValues = {
    PaymentType: data?.source === 'wallet' ? 'From-balance' : data?.source,
    PaymentDate: '',
    TransactionNumber: data.transactionNumber,
    Status: 'Paid',
    BankName: data.bankName,
    ChequeNumber: data.chequeNumber,
  }
  const balance = data.__typename === 'WalletTransaction' ? data.currentWalletBalance : data.balance;
  const { pathname } = useLocation();
  const [inputValues, setInputValues] = useState({ ...initialValues })
  const [tabValue, setTabValue] = useState('Details');
  const [updateTransaction] = useMutation(WalletTransactionUpdate)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [response, setResponse] = useState({ isError: false, message: '' })
  const changeLogs = useQuery(AllEventLogsQuery, {
    variables: {
      refId: data.id,
      refType: 'WalletTransaction',
      subject: 'payment_update'
    }
  })

  useEffect(() => {
    changeLogs.refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabValue])


  function handleSubmit(){
    setIsSubmitting(true)
    updateTransaction({
      variables: {
        id: data.id,
        source: inputValues.PaymentType,
        status: inputValues.Status,
        bankName: inputValues.BankName,
        chequeNumber: inputValues.ChequeNumber,
        transactionNumber: inputValues.TransactionNumber
      }
    })
    .then(() => {
      setIsSubmitting(false)
      setResponse({ ...response, message: 'Successfully Updated Payment' })
      handleClose()
    })
    .catch(err => {
      setIsSubmitting(false)
      setResponse({ isError: true, message: formatError(err.message) })
    })
  }

  function handleChange(event){
    const { name, value } = event.target
    setInputValues({ ...inputValues, [name]: value})
  }

  function handleTabChange(_event, value){
    setTabValue(value);
  }

  function handleAlertClose(_event, reason){
    if (reason === 'clickaway') {
      return;
    }
    setResponse({ ...response, message: '' })
  }

  if (changeLogs.loading) return <Spinner />
  if (changeLogs.error) return <CenteredContent>{formatError(changeLogs?.error.message)}</CenteredContent>
  
  return (
    <>
      <MessageAlert
        type={response.isError ? 'error' : 'success'}
        message={response.message}
        open={!!response.message}
        handleClose={handleAlertClose}
      />

      <CustomizedDialogs
        handleModal={handleClose}
        open={detailsOpen}
        dialogHeader={data.__typename === 'WalletTransaction' ? 'Transaction' : 'Invoice'}
        handleBatchFilter={handleSubmit}
        actionable={isEditing}
        saveAction={isSubmitting ? 'Saving ...' : 'Save'}
      >
        <StyledTabs value={tabValue} onChange={handleTabChange} aria-label="land parcel tabs">
          <StyledTab label="Details" value="Details" />
          <StyledTab label="Edit Log" value="Log" />
        </StyledTabs>

        <TabPanel value={tabValue} index="Details">
          {pathname !== '/payments' && (
          <div style={{ marginLeft: '20px' }}>
            <Typography variant="caption">Current Wallet Balance</Typography>
            <Typography color="primary" variant="h5">
              {formatMoney(currencyData, balance)}
            </Typography>
          </div>
        )}
          <DetailsField editable={false} title="Amount" value={formatMoney(currencyData, data?.amount)} />
          {data.balance && (
          <div>
            <DetailsField
              title="Pending Amount"
              value={formatMoney(currencyData, data?.pendingAmount)}
              editable={false}
            />
            <DetailsField editable={false} title="Invoice Number" value={data?.invoiceNumber} />
            <DetailsField editable={false} title="Status" value="Unpaid" />
            <DetailsField
              editable={false}
              title="Issued Date"
              value={dateToString(data?.createdAt)}
            />
            <DetailsField editable={false} title="Due Date" value={dateToString(data?.dueDate)} />
          </div>
        )}
          {data.__typename === 'WalletTransaction' && (
          <div>
            <DetailsField
              editable={isEditing}
              title="Payment Type"
              value={inputValues.PaymentType}
              handleChange={handleChange}
            />
            <DetailsField
              editable={isEditing}
              title="Payment Date"
              value={dateToString(data?.createdAt)}
              handleChange={handleChange}
            />
            <DetailsField 
              editable={isEditing} 
              title="Status" 
              value={inputValues.Status}
              handleChange={handleChange}
            />
            {
              inputValues.PaymentType === 'cheque/cashier_cheque' && (
                <> 
                  <DetailsField 
                    editable={isEditing} 
                    title="Bank Name" 
                    value={inputValues.BankName}
                    handleChange={handleChange}
                  />
                  <DetailsField 
                    editable={isEditing} 
                    title="Cheque Number" 
                    value={inputValues.ChequeNumber}
                    handleChange={handleChange}
                  />
                </>
              )
            }
            <DetailsField editable={false} title="Payment Made By" value={data?.user?.name} />
          </div>
        )}
        </TabPanel>
        <TabPanel value={tabValue} index="Log">
          <EventTimeLine data={changeLogs.data?.result} />
        </TabPanel>
      </CustomizedDialogs>
    </>
  );
}
TransactionDetails.defaultProps = {
  isEditing: false
}
TransactionDetails.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired,
  detailsOpen: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool,
  handleClose: PropTypes.func.isRequired
};
