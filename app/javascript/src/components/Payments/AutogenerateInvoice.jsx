import React, { useState } from 'react'
import { Button, Grid, Typography } from '@material-ui/core'
import { useMutation, useQuery } from 'react-apollo'
import PropTypes from 'prop-types'
import { GenerateCurrentMonthInvoices } from '../../graphql/mutations'
import { Spinner } from '../../shared/Loading';
import CenteredContent from '../CenteredContent'
import MessageAlert from "../MessageAlert"
import { formatError, formatMoney } from '../../utils/helpers'
import { InvoiceAutogenerationData } from '../../graphql/queries'
import currency from '../../shared/types/currency';

export default function AutogenerateInvoice({ currencyData, close }) {
  const [generateCurrentMonthInvoices] = useMutation(GenerateCurrentMonthInvoices)
  const [messageAlert, setMessageAlert] = useState('')
  const [isSuccessAlert, setIsSuccessAlert] = useState(false)
  const { loading, data, error } = useQuery(InvoiceAutogenerationData)

  function handleInvoiceGenerate() {
    generateCurrentMonthInvoices({}).then(() => {
      setMessageAlert('Invoices Generated')
      setIsSuccessAlert(true)
      // show the message for a second before autoclosing the dialog
      setTimeout(() =>close(), 1000)
    }).catch((err) => {
      setMessageAlert(formatError(err.message))
      setIsSuccessAlert(false)
    })
  }
  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return
    }
    setMessageAlert('')
  }
  if (loading) return <Spinner />

  if (error) {
    return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  }

  const disable = (data?.invoiceAutogenerationData.numberOfInvoices === 0)
  return (
    <>
      <MessageAlert
        type={isSuccessAlert ? 'success' : 'error'}
        message={messageAlert}
        open={!!messageAlert}
        handleClose={handleMessageAlertClose}
      />
      <Typography variant="body1" data-testid="title_msg">
        This will generate all invoices for this month.
      </Typography>
      <Typography variant="body1" data-testid="number_invoices">
        {` Number of invoices for this month: ${data?.invoiceAutogenerationData.numberOfInvoices}`}
      </Typography>
      <Typography variant="body1" data-testid="invoices_amount">
        {`Total amount for invoices this month: ${formatMoney(currencyData, data?.invoiceAutogenerationData.totalAmount)}`}
      </Typography>
      <Grid
        container
        direction="row-reverse"
        justify="space-around"
        alignItems="center"
      >
        <CenteredContent>
          <Button 
            variant="contained" 
            data-testid="invoice-generate-button" 
            color="primary" 
            onClick={handleInvoiceGenerate}
            style={{marginLeft: '5px'}}
            disabled={disable}
          >
            Generate Invoices
          </Button>
        </CenteredContent>
      </Grid>
      <br />
    </>
  )
}

AutogenerateInvoice.propTypes = {
  currencyData: PropTypes.shape({ ...currency}).isRequired,
  close: PropTypes.func.isRequired
}