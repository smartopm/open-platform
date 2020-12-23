import React, { useState } from 'react'
import {
    Container,
  Grid,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText
} from '@material-ui/core'
import { useHistory } from 'react-router'
import { useQuery } from 'react-apollo'
import { InvoiceStatus } from './InvoiceItem'
import CenteredContent from '../CenteredContent'
import Paginate from '../Paginate'
import { InvoicesQuery } from '../../graphql/queries'
import Loading from '../Loading'
import { formatError } from '../../utils/helpers'
import { dateToString } from '../DateContainer'
import PaymentItem from './PaymentItem'

export default function PaymentList() {
  const history = useHistory()
  const limit = 10
  const [offset, setOffset] = useState(0)
  const { loading, data: invoicesData, error } = useQuery(
    InvoicesQuery,
    {
      variables: { limit, offset },
      errorPolicy: 'all'
    }
  )

  function paginate(action) {
    if (action === 'prev') {
      if (offset < limit) return
      setOffset(offset - limit)
      history.push(`/payments?page=${offset - limit}`)
    } else if (action === 'next') {
      setOffset(offset + limit)
      history.push(`/payments?page=${offset + limit}`)
    }
  }
  if (loading) return <Loading />
  if (error && !invoicesData) return <CenteredContent>{formatError(error.message)}</CenteredContent>
    return (
      <Container>
        <List>
          {invoicesData?.invoices.length ? (
          invoicesData?.invoices.map(invoice => (
            <ListItem key={invoice.id}>
              <ListItemText
                disableTypography
                primary={invoice.description}
                secondary={(
                  <div>
                    <Grid container spacing={10} style={{ color: '#808080' }}>
                      <Grid
                        xs
                        item
                        data-testid="amount"
                      >
                        {`Invoice amount: k${invoice.amount}`}
                      </Grid>
                      <Grid xs item data-testid="landparcel">
                        Parcel number: 
                        {' '}
                        {invoice.landParcel?.parcelNumber}
                      </Grid>
                      <Grid
                        xs
                        item
                        data-testid="duedate"
                      >
                        {`Due at: ${dateToString(invoice.dueDate)}`}
                      </Grid>
                    </Grid>
                    {invoice.payments?.map(payment => (
                      <div key={payment.id}>
                        <i>
                          <PaymentItem paymentData={payment} />
                        </i>
                      </div>
                    ))}
                  </div>
                )}
              />
              <ListItemSecondaryAction data-testid="status">
                {InvoiceStatus[invoice.status]}
              </ListItemSecondaryAction>
            </ListItem>
          ))
        ) : (
          <CenteredContent>No Invoices Yet</CenteredContent>
        )}
        </List>

        <CenteredContent>
          <Paginate
            offSet={offset}
            limit={limit}
            active={offset >= 1}
            handlePageChange={paginate}
            count={invoicesData?.invoices.length}
          />
        </CenteredContent>
      </Container>
  )
}
