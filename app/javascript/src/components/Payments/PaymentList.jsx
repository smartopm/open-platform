import React, { useState } from 'react';
import { Container, Grid, List, IconButton, MenuItem, Checkbox } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
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
import ActionMenu from './PaymentActionMenu';
import InvoiceTiles from './InvoiceTiles';
import DataList from '../List/DataList';

const Iheaders = [
  'Select',
  'Parcel Number',
  'Amount/Payment Type',
  'Due date',
  'Payment made by',
  'Invoice Status',
  'Menu'
];
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
  // the following are for prototyping
  function handleChange() {}
  const checked = false;
  const newData = invoicesData?.invoices.map(invoice => {
    return {
      Select: (
        <Checkbox
          checked={checked}
          onChange={handleChange}
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
      ),
      'Parcel Number': invoice.landParcel.parcelNumber,
      'Amount/Payment Type': invoice.payments.map(pay => (
        <span key={pay.id}>{`${currency}${pay.amount} ${InvoiceType[pay.paymentType]}`}</span>
      )),
      'Due date': dateToString(invoice.dueDate),
      'Payment made by': invoice.payments.map(pay => (
        <span key={pay.id}>
          {pay.user.name}
          {pay.length > 1 ? ',' : ''}
        </span>
      )),
      'Invoice Status': (
        <p
          style={{
            textAlign: 'center',
            background: `${InvoiceStatusColor[invoice.status]}`,
            padding: '9px',
            color: 'white',
            borderRadius: '15px',
            width: 120
          }}
        >
          {invoiceStatus[invoice.status]}
        </p>
      ),
      Menu: (
        <IconButton
          className={classes.option}
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleOpenMenu}
        >
          <MoreHorizIcon />
        </IconButton>
      )
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
            <DataList keys={Iheaders} data={newData} />
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
    // width: 40,
    marginRight: -120
  }
}));

PaymentList.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  authState: PropTypes.object.isRequired
};
