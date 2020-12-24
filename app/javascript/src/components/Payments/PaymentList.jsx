import React, { useEffect, useState, useContext } from 'react'
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
import CenteredContent from '../CenteredContent'
import Paginate from '../Paginate'
import { InvoicesQuery, InvoiceStatsQuery } from '../../graphql/queries'
import { Spinner } from '../Loading'
import { formatError, InvoiceStatus, useParamsQuery } from '../../utils/helpers'
import { dateToString } from '../DateContainer'
import PaymentItem from './PaymentItem'
import InvoiceTiles from './InvoiceTiles'
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider'
import { currencies } from '../../utils/constants'

export default function PaymentList() {
  const history = useHistory()
  const path = useParamsQuery()
  const authState = useContext(AuthStateContext)
  const limit = 50
  const page = path.get('page')
  const status = path.get('status')
  const pageNumber = Number(page)
  const [currentTile, setCurrentTile] = useState(status || '')
  const { loading, data: invoicesData, error, refetch } = useQuery(
    InvoicesQuery,
    {
      variables: { limit, offset: pageNumber, status },
      errorPolicy: 'all'
    }
  )
  const invoiceStats = useQuery(InvoiceStatsQuery, {
    fetchPolicy: 'cache-first'
  })
  const currency = currencies[authState.user.community.currency]

  function handleFilter(_evt, key) {
    setCurrentTile(key)
    const state = key === 'inProgress' ? 'in_progress' : key
    history.push(`/payments?page=0&status=${state}`)
  }

  useEffect(() => {
    refetch({ status, offset: pageNumber })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page])

  function paginate(action) {
    if (action === 'prev') {
      if (pageNumber < limit) return
      history.push(`/payments?page=${pageNumber - limit}&status=${status}`)
    } else if (action === 'next') {
      if (invoicesData?.invoices.length < limit) return
      history.push(`/payments?page=${pageNumber + limit}&status=${status}`)
    }
  }
  if (error && !invoicesData) {
    return <CenteredContent>{formatError(error.message)}</CenteredContent>
  }

  return (
    <Container>
      <br />
      <Grid container spacing={3}>
        <InvoiceTiles
          invoiceData={invoiceStats || []}
          filter={handleFilter}
          currentTile={currentTile}
        />
      </Grid>
      <List>
        {
        // eslint-disable-next-line no-nested-ternary
        loading ? <Spinner /> : invoicesData?.invoices.length ? (
          invoicesData?.invoices.map(invoice => (
            <ListItem key={invoice.id}>
              <ListItemText
                disableTypography
                primary={invoice.description}
                secondary={(
                  <div>
                    <Grid container spacing={10} style={{ color: '#808080' }}>
                      <Grid xs item data-testid="amount">
                        {`Invoice amount: ${currency}${invoice.amount}`}
                      </Grid>
                      <Grid xs item data-testid="landparcel">
                        Parcel number:
                        {' '}
                        {invoice.landParcel?.parcelNumber}
                      </Grid>
                      <Grid xs item data-testid="duedate">
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
        )
        }
      </List>

      <CenteredContent>
        <Paginate
          offSet={pageNumber}
          limit={limit}
          active={pageNumber >= 1}
          handlePageChange={paginate}
          count={invoicesData?.invoices.length}
        />
      </CenteredContent>
    </Container>
  )
}
