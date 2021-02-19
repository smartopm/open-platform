/* eslint-disable */
import React, { useState } from 'react'
import { Button, Grid, Typography } from '@material-ui/core'
import { useMutation } from 'react-apollo'
import { GenerateCurrentMonthInvoices } from '../../graphql/mutations'
import CenteredContent from '../CenteredContent'
import MessageAlert from "../MessageAlert"
import { formatError } from '../../utils/helpers'

export default function AutogenerateInvoice() {
  const [generateCurrentMonthInvoices] = useMutation(GenerateCurrentMonthInvoices)
  const [messageAlert, setMessageAlert] = useState('')
  const [isSuccessAlert, setIsSuccessAlert] = useState(false)

  function handleInvoiceGenerate() {
    generateCurrentMonthInvoices({}).then(() => {
      setMessageAlert('Invoices Generated')
      setIsSuccessAlert(true)
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

  return (
    <>
      <MessageAlert
        type={isSuccessAlert ? 'success' : 'error'}
        message={messageAlert}
        open={!!messageAlert}
        handleClose={handleMessageAlertClose}
      />
      <Typography variant="body1">
        This will generate all invoices for this month.
      </Typography>
      <Typography variant="body1">
        Number of invoices for this month: 1
      </Typography>
      <Typography variant="body1">
        Total amount for invoices this month: 100
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
          >
            Generate Invoices
          </Button>
        </CenteredContent>
      </Grid>
      <br />
    </>
  )
}
