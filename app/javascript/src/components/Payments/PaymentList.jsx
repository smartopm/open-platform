/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Container, Grid, List, IconButton, MenuItem } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router';
import { useQuery } from 'react-apollo';
import PropTypes from 'prop-types';
import CenteredContent from '../CenteredContent';
import Paginate from '../Paginate';
import { InvoicesQuery, InvoiceStatsQuery } from '../../graphql/queries';
import { Spinner } from '../Loading';
import { formatError, useParamsQuery, InvoiceType, InvoiceStatusColor } from '../../utils/helpers';
import { dateToString } from '../DateContainer';
import { currencies, invoiceStatus } from '../../utils/constants';
import PaymentListHeading from './PaymentListHeading';
import ActionMenu from './PaymentActionMenu';
import InvoiceTiles from './InvoiceTiles';
import Item from '../List/ListHeader';
import ListItem from '../List/ListItem';

const Iheaders = ['Select', 'Parcel', 'Amount', 'Due date', 'Paid by', 'Status', 'Action'];
const IData = ['box', 'first col', 'second col', 'thrid date', 'fourth by', 'fifth', 'sixth'];

const data = { a: 1, b: 2, c: 3, d: 4 };
const keys = ['a', 'b', 'c', 'd'];
const dataList = [data, data, data, data];

// function extend(base, ...objs) {
//   objs.forEach(obj => {
//     Object.keys(obj).forEach(key => {
//       // eslint-disable-next-line security/detect-object-injection
//       base[key] = obj[key];
//     })
//   });
//   return base;
// }

export default function PaymentList({ authState }) {
  const history = useHistory();
  const classes = useStyles();
  const path = useParamsQuery();
  const limit = 50;
  const page = path.get('page');
  const status = path.get('status');
  const pageNumber = Number(page);
  const [currentTile, setCurrentTile] = useState(status || '');

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { loading, data: invoicesData, error } = useQuery(InvoicesQuery, {
    variables: { limit, offset: pageNumber, status },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });
  const invoiceStats = useQuery(InvoiceStatsQuery, {
    fetchPolicy: 'cache-and-network'
  });
  const currency = currencies[authState.user?.community.currency] || '';

  function handleFilter(key) {
    setCurrentTile(key);
    const state = key === 'inProgress' ? 'in_progress' : key;
    history.push(`/payments?page=0&status=${state}`);
  }

  function handleOpenMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function paginate(action) {
    if (action === 'prev') {
      if (pageNumber < limit) return;
      history.push(`/payments?page=${pageNumber - limit}&status=${status}`);
    } else if (action === 'next') {
      if (invoicesData?.invoices.length < limit) return;
      history.push(`/payments?page=${pageNumber + limit}&status=${status}`);
    }
  }
  if (error && !invoicesData) {
    return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  }

  // console.log();
  const newData = invoicesData?.invoices.map(invoice => {
    return {
      a: invoice.landParcel.parcelNumber,
      b: invoice.dueDate,
      c: (
        <span
          className={classes.typography}
          style={{
            // marginTop: '8px',
            textAlign: 'center',
            background: `${InvoiceStatusColor[invoice.status]}`,
            padding: '14px',
            color: 'white',
            borderRadius: '9px'
            // marginRight: '15px'
          }}
        >
          {invoiceStatus[invoice.status]}
        </span>
      ),
      d: invoice.payments.map(pay => (
        <span key={pay.id}>
          {pay.user.name}
          {pay.length > 1 ? ',' : ''}
        </span>
      ))
    };
  });

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
        {// eslint-disable-next-line no-nested-ternary
        loading ? (
          <Spinner />
        ) : invoicesData?.invoices.length ? (
          <div>
            {/* <PaymentListHeading /> */}

            <Item headers={Iheaders} />
            {/* <Item headers={Iheaders} /> */}
            {/* <ListItem headers={Iheaders} dataList={IData} /> */}
            {/* <ListItem headers={Iheaders} dataList={IData} /> */}
            <ListItem keys={keys} data={newData} />
            {/* headers={Iheaders} dataList={IData} */}

            {/* {invoicesData?.invoices.map(invoice => (
              <div key={invoice.id}>
                <Grid
                  container
                  direction="row"
                  justify="space-evenly"
                  alignItems="center"
                  className={classes.list}
                >
                  <Typography className={classes.typography} data-testid="landparcel">
                    {invoice.landParcel.parcelNumber}
                  </Typography>
                  <Typography className={classes.typography}>
                    {invoice.payments.map(pay => (
                      <span key={pay.id}>
                        {currency}
                        {pay.amount}, {InvoiceType[pay.paymentType]}
                      </span>
                    ))}
                  </Typography>
                  <Typography className={classes.typography} data-testid="duedate">
                    {dateToString(invoice.dueDate)}
                  </Typography>
                  <Typography className={classes.typography}>
                    {invoice.payments.map(pay => (
                      <span key={pay.id}>
                        {pay.user.name}
                        {pay.length > 1 ? ',' : ''}
                      </span>
                    ))}
                  </Typography>
                  <div style={{ display: 'flex' }}>
                    <Typography
                      className={classes.typography}
                      style={{
                        marginTop: '8px',
                        textAlign: 'center',
                        background: `${InvoiceStatusColor[invoice.status]}`,
                        paddingTop: '7px',
                        color: 'white',
                        borderRadius: '15px',
                        marginRight: '15px'
                      }}
                    >
                      {invoiceStatus[invoice.status]}
                    </Typography>
                    <IconButton
                      className={classes.option}
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      onClick={handleOpenMenu}
                    >
                      <MoreHorizIcon />
                    </IconButton>
                  </div>
                </Grid>
              </div>
            ))} */}
            <ActionMenu anchorEl={anchorEl} handleClose={handleClose} open={open}>
              <MenuItem id="view-button" key="view-user">
                View
              </MenuItem>
              <MenuItem id="edit-button" key="edit-user">
                Edit
              </MenuItem>
              <MenuItem id="cancel-button" key="cancel-user" style={{ color: 'red' }}>
                Cancel Invoice
              </MenuItem>
            </ActionMenu>
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
  );
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
    width: '40px'
  }
}));

PaymentList.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  authState: PropTypes.object.isRequired
};
