import React from 'react';
import PropTypes from 'prop-types';
import { FullScreenDialog } from '../../../../components/Dialog';
import ReceiptDetail from './ReceiptDetails';
import { dateToString } from '../../../../components/DateContainer';

export default function PaymentReceipt({ paymentData, open, handleClose, currencyData }) {
  function printReceipt() {
    document.title = `${paymentData?.user?.name}-${paymentData?.planPayments ? paymentData?.planPayments[0]?.receiptNumber :
      paymentData.receiptNumber}-${dateToString(paymentData.createdAt)}`;
    window.print();
  }

  return (
    <>
      {console.log(paymentData)}
      <div>
        <FullScreenDialog
          open={open}
          handleClose={handleClose}
          title="Payment Receipt"
          actionText="Print"
          handleSubmit={printReceipt}
        >
          {paymentData?.planPayments?.length ? (
            paymentData.planPayments.map(pay => (
              <div key={pay.id} style={{marginBotton: '100px'}}>
                <ReceiptDetail 
                  paymentData={paymentData} 
                  currencyData={currencyData}
                  planDetail={pay}  
                />
              </div>
            ))
          ) : (
            <ReceiptDetail 
              paymentData={paymentData} 
              currencyData={currencyData}  
            />
          )}
          
        </FullScreenDialog>
      </div>
    </>
  );
}

PaymentReceipt.defaultProps = {
  paymentData: {}
};
PaymentReceipt.propTypes = {
  paymentData: PropTypes.shape({
    id: PropTypes.string,
    source: PropTypes.string,
    amount: PropTypes.number,
    bankName: PropTypes.string,
    chequeNumber: PropTypes.string,
    createdAt: PropTypes.string,
    currentPlotPendingBalance: PropTypes.string,
    userTransaction: PropTypes.shape({
      id: PropTypes.string,
      source: PropTypes.string,
      bankName: PropTypes.string,
      chequeNumber: PropTypes.string,
      depositor: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string
      })
    }),
    community: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      logoUrl: PropTypes.string,
      currency: PropTypes.string,
      bankingDetails: PropTypes.shape({
        bankName: PropTypes.string,
        accountName: PropTypes.string,
        accountNo: PropTypes.string,
        branch: PropTypes.string,
        swiftCode: PropTypes.string,
        sortCode: PropTypes.string,
        address:PropTypes.string,
        city: PropTypes.string,
        country: PropTypes.string,
        taxIdNo: PropTypes.string,
      }),
      socialLinks: PropTypes.shape({
        category: PropTypes.string,
        social_link: PropTypes.string
      }),
      supportEmail: PropTypes.shape({
        category: PropTypes.string,
        email: PropTypes.string
      }),
      supportNumber: PropTypes.shape({
        category: PropTypes.string,
        phone_no: PropTypes.string
      }),
    }),
    user: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      extRefId: PropTypes.string
    }),
    depositor: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string
    }),
    paymentPlan: PropTypes.shape({
      id: PropTypes.string,
      installmentAmount: PropTypes.number,
      landParcel: PropTypes.shape({
        id: PropTypes.string,
        parcelNumber: PropTypes.string
      })
    }),
    receiptNumber: PropTypes.string,
    planPayments: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        receiptNumber: PropTypes.string,
        currentPlotPendingBalance: PropTypes.number,
        paymentPlan: PropTypes.shape({
          id: PropTypes.string,
          landParcel: PropTypes.shape({
            id: PropTypes.string,
            parcelNumber: PropTypes.string
          })
        })
      })
    )
  }),
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired
};
