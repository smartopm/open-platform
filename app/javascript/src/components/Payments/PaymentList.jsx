import React from 'react'
import {
  Container,
  Grid,
  List
} from '@material-ui/core'
import Typography from '@material-ui/core/Typography';
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from 'react-router'
import { useQuery } from 'react-apollo'
import PropTypes from 'prop-types'
import CenteredContent from '../CenteredContent'
import Paginate from '../Paginate'
import { InvoicesQuery } from '../../graphql/queries'
import { Spinner } from '../Loading'
import { formatError, InvoiceStatus, useParamsQuery } from '../../utils/helpers'
import { dateToString } from '../DateContainer'
import { currencies } from '../../utils/constants'
import PaymentListHeading from './PaymentListHeading'

export default function PaymentList({ authState }) {
  const history = useHistory()
  const classes = useStyles();
  const path = useParamsQuery()
  const limit = 50
  const page = path.get('page')
  const status = path.get('status')
  const pageNumber = Number(page)
  const { loading, data: invoicesData, error } = useQuery(
    InvoicesQuery,
    {
      variables: { limit, offset: pageNumber, status },
      errorPolicy: 'all'
    }
  )
  const currency = currencies[authState.user?.community.currency] || ''

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
      {console.log(invoicesData)}
      <List>
        {
        // eslint-disable-next-line no-nested-ternary
        loading ? <Spinner /> : invoicesData?.invoices.length ? (
          <div>
            <PaymentListHeading />
            {invoicesData?.invoices.map(invoice => (
              <Grid
                container
                direction="row"
                justify="space-evenly"
                alignItems="center"
                className={classes.list}
                key={invoice.id}
              >
                <Typography className={classes.typography}>{invoice.landParcel.parcelNumber}</Typography>
                <Typography className={classes.typography}>
                  {invoice.payments.map((pay) => (
                    <div key={pay.id}>
                      <Typography>
                        {currency}
                        {pay.amount}
                        ,
                        {pay.paymentType}
                      </Typography>
                    </div>
                  ))}
                </Typography>
                <Typography className={classes.typography}>{dateToString(invoice.dueDate)}</Typography>
                <Typography className={classes.typography}>
                  {invoice.payments.map((pay) => (
                    <Typography key={pay.id}>
                      {pay.user.name}
                      ,
                    </Typography>
                  ))}
                </Typography>
                <Typography className={classes.typography}>{InvoiceStatus[invoice.status]}</Typography>
              </Grid>
            ))}
          </div>
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

const useStyles = makeStyles(() => ({
  list: {
    backgroundColor: '#FFFFFF',
    padding: '15px 0',
    border: '1px solid #ECECEC',
    marginBottom: '10px'
  },
  typography: {
    width: '150px'
  },
  button: {
    float: 'right',
    marginBottom: '10px' 
  }
}));

PaymentList.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  authState: PropTypes.object.isRequired
}
