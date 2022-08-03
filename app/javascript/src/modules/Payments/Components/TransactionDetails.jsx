/* eslint-disable no-underscore-dangle */
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-apollo';
import { useLocation } from 'react-router-dom';
import { MenuItem } from '@mui/material';
import { subDays } from 'date-fns';
import { CustomizedDialogs } from '../../../components/Dialog';
import DetailsField from '../../../shared/DetailField';
import { dateToString } from '../../../components/DateContainer';
import { formatError, formatMoney } from '../../../utils/helpers';
import { StyledTab, StyledTabs, TabPanel } from '../../../components/Tabs';
import { WalletTransactionUpdate } from '../../../graphql/mutations/transactions';
import { AllEventLogsQuery } from '../../../graphql/queries';
import { Spinner } from '../../../shared/Loading';
import CenteredContent from '../../../components/CenteredContent';
import EventTimeLine from '../../../shared/TimeLine';
import { paymentStatus } from '../../../utils/constants';
import DatePickerDialog from '../../../components/DatePickerDialog';
import { SnackbarContext } from '../../../shared/snackbar/Context';

export default function TransactionDetails({ data, detailsOpen, handleClose, currencyData, isEditing, refetchTransactions }) {
  const initialValues = {
    PaymentType: data?.source === 'wallet' ? 'From-balance' : data?.source,
    PaymentDate: data.createdAt,
    TransactionNumber: data.transactionNumber,
    Status: data.status === 'settled' ? 'Paid' : 'Cancelled',
    BankName: data.bankName,
    ChequeNumber: data.chequeNumber,
  }
  const balance = data.__typename === 'WalletTransaction' ? data.currentWalletBalance : data.balance;
  const { pathname } = useLocation();
  const [inputValues, setInputValues] = useState({ ...initialValues })
  const [tabValue, setTabValue] = useState('Details');
  const [updateTransaction] = useMutation(WalletTransactionUpdate)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { t } = useTranslation('common')

  const { showSnackbar, messageType } = useContext(SnackbarContext);

  const changeLogs = useQuery(AllEventLogsQuery, {
    variables: {
      subject: ['payment_update'],
      refId: data.id,
      refType: 'Payments::WalletTransaction',
    },
    errorPolicy: 'all'
  })

  useEffect(() => {
    if (changeLogs) {
      changeLogs.refetch()
    }
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
        transactionNumber: inputValues.TransactionNumber,
        createdAt: inputValues.PaymentDate,
      }
    })
    .then(() => {
      setIsSubmitting(false)
      showSnackbar({ type: messageType.success, message: 'Successfully Updated Payment' });
      refetchTransactions()
      handleClose()
    })
    .catch(err => {
      setIsSubmitting(false)
      showSnackbar({ type: messageType.error, message: formatError(err.message) });
    })
  }

  function handleChange(event){
    const { name, value } = event.target
    setInputValues({ ...inputValues, [name]: value})
  }

  function handleTabChange(_event, value){
    setTabValue(value);
  }

  if (changeLogs.loading) return <Spinner />
  if (changeLogs.error) return <CenteredContent>{formatError(changeLogs?.error.message)}</CenteredContent>

  return (
    <>
      <CustomizedDialogs
        handleModal={handleClose}
        open={detailsOpen}
        dialogHeader={data.__typename === 'WalletTransaction' ? t("common:menu.transaction") : t("common:menu.invoice")}
        handleBatchFilter={handleSubmit}
        actionable={isEditing}
        saveAction={isSubmitting ? t("common:form_actions.saving") : t("common:form_actions.save")}
      >
        <StyledTabs value={tabValue} onChange={handleTabChange} aria-label="land parcel tabs">
          <StyledTab label={t("common:misc.details")} value="Details" />
          {
            data.destination === 'wallet' && (
              <StyledTab label={t("common:misc.edit_log")} value="Log" />
            )
          }
        </StyledTabs>

        <TabPanel value={tabValue} index="Details">
          {pathname !== '/payments' && (
          <div style={{ marginLeft: '20px' }}>
            <Typography variant="caption">{t("common:form_fields.wallet_balance")}</Typography>
            <Typography color="primary" variant="h5">
              {formatMoney(currencyData, balance)}
            </Typography>
          </div>
        )}
          <DetailsField editable={false} title={t("common:table_headers.amount")} value={formatMoney(currencyData, data?.amount)} />
          {data.balance && (
          <div>
            <DetailsField
              title={t("common:form_fields.pending_amount")}
              value={formatMoney(currencyData, data?.pendingAmount)}
              editable={false}
            />
            <DetailsField editable={false} title={t("common:form_fields.invoice_number")} value={data?.invoiceNumber} />
            <DetailsField editable={false} title={t("common:table_headers.status")} value="Unpaid" />
            <DetailsField
              editable={false}
              title={t("common:table_headers.issue_dated")}
              value={dateToString(data?.createdAt)}
            />
            <DetailsField editable={false} title={t("common:table_headers.due_date")} value={dateToString(data?.dueDate)} />
          </div>
        )}
          {data.__typename === 'WalletTransaction' && (
          <div>
            <DetailsField
              editable={isEditing}
              title={t("common:form_fields.payment_Type")}
              value={inputValues.PaymentType}
              handleChange={handleChange}
              options={{
                isSelect: isEditing,
                children: [
                  <MenuItem key="cash" value='cash'>Cash</MenuItem>,
                  <MenuItem key="cashier_cheque" value='cheque/cashier_cheque'>Cheque/Cashier Cheque</MenuItem>,
                  <MenuItem key="mobile_money" value='mobile_money'>Mobile Money</MenuItem>,
                  <MenuItem key="cash_deposit" value='bank_transfer/cash_deposit'>Bank Transfer/Cash Deposit</MenuItem>,
                  <MenuItem key="bank_transfer" value='bank_transfer/eft'>Bank Transfer/EFT</MenuItem>,
                  <MenuItem key="pos" value='pos'>Point of Sale</MenuItem>,
                ]
              }}
            />

              {
                isEditing
                ? (
                  <DatePickerDialog
                    selectedDate={inputValues.PaymentDate}
                    label="Payment Date"
                    handleDateChange={date => setInputValues({...inputValues, PaymentDate: date})}
                    maxDate={subDays(new Date(), 1)}
                    width="89%"
                    styles={{ marginLeft: 23 }}
                    t={t}
                  />
              )
                  : (
                    <DetailsField
                      editable={false}
                      title={t("common:table_headers.payment_date")}
                      value={dateToString(data?.createdAt)}
                    />
                )
              }

            <DetailsField
              editable={isEditing}
              title={t("common:table_headers.status")}
              value={!isEditing ? inputValues.Status : 'settled'}
              handleChange={handleChange}
              options={{
                isSelect: isEditing,
                children: Object.entries(paymentStatus).map(([key, val]) => (
                  <MenuItem key={key} value={key}>
                    {val}
                  </MenuItem>
                ))
              }}
            />
            <DetailsField
              editable={isEditing}
              title={t("common:table_headers.transaction_number")}
              value={inputValues.TransactionNumber}
              handleChange={handleChange}
            />
            {
              inputValues.PaymentType === 'cheque/cashier_cheque' && (
                <>
                  <DetailsField
                    editable={isEditing}
                    title={t("common:table_headers.bank_name")}
                    value={inputValues.BankName}
                    handleChange={handleChange}
                  />
                  <DetailsField
                    editable={isEditing}
                    title={t("common:table_headers.cheque_number")}
                    value={inputValues.ChequeNumber}
                    handleChange={handleChange}
                  />
                </>
              )
            }
            <DetailsField editable={false} title={t("common:table_headers.payment_made")} value={data?.depositor?.name} />
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
  isEditing: false,
  refetchTransactions: () => {}
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
  handleClose: PropTypes.func.isRequired,
  refetchTransactions: PropTypes.func,
};
