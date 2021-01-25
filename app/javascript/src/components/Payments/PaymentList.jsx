import React, { useState } from 'react';
import { Container, Grid, List, IconButton, MenuItem, Checkbox } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useHistory } from 'react-router';
import { useQuery } from 'react-apollo';
import PropTypes from 'prop-types';
import CenteredContent from '../CenteredContent';
import Paginate from '../Paginate';
import { InvoicesQuery, InvoiceStatsQuery } from '../../graphql/queries';
import { Spinner } from '../Loading';
import {
  formatError,
  useParamsQuery,
  InvoiceType,
  InvoiceStatusColor,
  propAccessor
} from '../../utils/helpers';
import { dateToString } from '../DateContainer';
import { currencies, invoiceStatus } from '../../utils/constants';
import ActionMenu from './PaymentActionMenu';
import InvoiceTiles from './InvoiceTiles';
import DataList from '../List/DataList';
import Label from '../List/Label';

const paymentHeaders = [
  { title: 'Select', col: 1 },
  { title: 'Parcel Number', col: 2 },
  { title: 'Amount/Payment Type', col: 2 },
  { title: 'Due date', col: 1 },
  { title: 'Payment made by', col: 3 },
  { title: 'Invoice Status', col: 2 },
  { title: 'Menu', col: 1 }
];
export default function PaymentList({ authState }) {
  const history = useHistory();
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
            <DataList
              keys={paymentHeaders}
              data={renderPayments(invoicesData?.invoices, handleOpenMenu, currency)}
            />
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

export function renderPayments(payments, handleOpenMenu, currency) {
  // the following are for checkbox prototyping
  function handleChange() {}
  return payments.map(invoice => {
    return {
      Select: (
        <Grid item xs={1}>
          <Checkbox
            checked={false}
            onChange={handleChange}
            inputProps={{
              'aria-label': 'primary checkbox',
              'data-testid': 'select_payment'
            }}
          />
        </Grid>
      ),
      'Parcel Number': (
        <Grid item xs={2} data-testid="parcel_number">
          {invoice.landParcel.parcelNumber}
        </Grid>
      ),
      'Amount/Payment Type': (
        <Grid item xs={2}>
          {invoice.payments.map(pay => (
            <span key={pay.id}>{`${currency}${pay.amount} ${InvoiceType[pay.paymentType]}`}</span>
          ))}
        </Grid>
      ),
      'Due date': (
        <Grid item xs={1}>
          {dateToString(invoice.dueDate)}
        </Grid>
      ),
      'Payment made by': (
        <Grid item xs={3}>
          {invoice.payments.map(pay => (
            <span key={pay.id}>
              {pay.user.name}
              {pay.length > 1 ? ',' : ''}
            </span>
          ))}
        </Grid>
      ),
      'Invoice Status': (
        <Grid item xs={2} data-testid="invoice_status">
          <Label
            title={propAccessor(invoiceStatus, invoice.status)}
            color={propAccessor(InvoiceStatusColor, invoice.status)}
          />
        </Grid>
      ),
      Menu: (
        <Grid item xs={1}>
          <IconButton
            style={{ marginRight: -120 }}
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleOpenMenu}
          >
            <MoreHorizIcon />
          </IconButton>
        </Grid>
      )
    };
  });
}
PaymentList.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  authState: PropTypes.object.isRequired
};
