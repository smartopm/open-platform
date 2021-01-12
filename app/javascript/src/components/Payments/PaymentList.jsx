import React, { useState } from 'react'
import {
  Container,
  Grid,
  List,
  IconButton
} from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'
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
import PaymentActionMenu from './PaymentActionMenu'

export default function PaymentList({ authState }) {
  const history = useHistory()
  const classes = useStyles();
  const path = useParamsQuery()
  const limit = 50
  const page = path.get('page')
  const status = path.get('status')
  const pageNumber = Number(page)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const { loading, data: invoicesData, error } = useQuery(
    InvoicesQuery,
    {
      variables: { limit, offset: pageNumber, status },
      errorPolicy: 'all'
    }
  )
  const currency = currencies[authState.user?.community.currency] || ''

  function handleOpenMenu(event) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose() {
    setAnchorEl(null)
  }

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
      <List>
        {
        // eslint-disable-next-line no-nested-ternary
        loading ? <Spinner /> : invoicesData?.invoices.length ? (
          <div>
            <PaymentListHeading />
            {invoicesData?.invoices.map(invoice => (
              <div key={invoice.id}>
                <Grid
                  container
                  direction="row"
                  justify="space-evenly"
                  alignItems="center"
                  className={classes.list}
                >
                  <Typography className={classes.typography} data-testid="landparcel">{invoice.landParcel.parcelNumber}</Typography>
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
                  <Typography className={classes.typography} data-testid="duedate">{dateToString(invoice.dueDate)}</Typography>
                  <Typography className={classes.typography}>
                    {invoice.payments.map((pay) => (
                      <Typography key={pay.id}>
                        {pay.user.name}
                        ,
                      </Typography>
                  ))}
                  </Typography>
                  <div style={{display: 'flex'}}>
                    <Typography 
                      className={classes.typography}
                    >
                      {InvoiceStatus[invoice.status]}
                    </Typography>
                    <IconButton
                      className={classes.option}
                      aria-label="more-payment"
                      aria-controls="long-menu"
                      aria-haspopup="true"
                      onClick={handleOpenMenu}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </div>
                </Grid>
                <PaymentActionMenu
                  anchorEl={anchorEl}
                  handleClose={handleClose}
                  open={open}
                />
              </div>
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
  },
  option: {
    width: '10px'
  }
}));

PaymentList.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  authState: PropTypes.object.isRequired
}
