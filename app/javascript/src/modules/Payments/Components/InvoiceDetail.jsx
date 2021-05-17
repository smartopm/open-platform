import React from 'react'
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { DetailsDialog } from '../../../components/Dialog'
import { invoiceStatus } from '../../../utils/constants';
import { dateToString } from '../../../components/DateContainer';
import { formatMoney } from '../../../utils/helpers';
import DetailsField from '../../../shared/DetailField';

export  default function InvoiceDetails({ data, detailsOpen, handleClose, currencyData }){
  const { t } = useTranslation('users')
  return (
    <>
      <DetailsDialog
        handleClose={handleClose}
        open={detailsOpen}
        title={t("common:form_fields.invoice_details")}
      >
        <DetailsField
          title={t("common:form_fields.invoice_details")}
          value={`#${data?.invoiceNumber}`}
        />
        <DetailsField
          title={t("common:table_headers.issue_dated")}
          value={dateToString(data?.createdAt)}
        />
        <DetailsField 
          title={t("common:table_headers.due_date")} 
          value={dateToString(data?.dueDate)}
        />
        <DetailsField
          title={t("common:table_headers.amount")}
          value={formatMoney(currencyData, data?.amount)}
        />
        <DetailsField
          title={t("common:table_headers.status")}
          value={data?.status === 'paid' ? t("common:table_content.paid_on", {date: dateToString(data?.updatedAt)}) : invoiceStatus[data?.status]}
        />
        <DetailsField
          title={t("common:table_headers.plot_number")}
          value={data?.landParcel?.parcelNumber}
        />
        {data?.status === 'paid' && (
          <div>
            <Typography variant="h6" align="center" color='primary'>Invoice Payment Details</Typography>
            {data.payments.map((pay) => (
              <div style={{display: 'flex', margin: '15px 23px', borderBottom: '1px solid #9E9E9E', paddingBottom: '5px', color: '#9E9E9E'}} key={pay.id}>
                <Typography style={{marginRight: '20px'}}>
                  {t("common:table_content.pay_date", {date: dateToString(pay.createdAt)})}
                </Typography>
                <Typography style={{marginRight: '10px'}}>
                  {formatMoney(currencyData, pay.amount)}
                </Typography>
                <Typography style={{marginRight: '10px'}}>
                  {pay.paymentType}
                </Typography>
                <Typography>
                  {pay.user?.name}
                </Typography>
              </div>
            ))}
          </div>
        )}
      </DetailsDialog>
    </>
  )
}

InvoiceDetails.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  currencyData: PropTypes.shape({
      currency: PropTypes.string,
      locale: PropTypes.string
  }).isRequired,
  detailsOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};
