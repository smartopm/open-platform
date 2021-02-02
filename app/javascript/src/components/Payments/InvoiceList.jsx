import React, { useState } from 'react';
import { Grid, List } from '@material-ui/core';
import { useHistory } from 'react-router';
import { useQuery } from 'react-apollo';
import { string } from 'prop-types';
import CenteredContent from '../CenteredContent';
import Paginate from '../Paginate';
import { InvoicesQuery, InvoiceStatsQuery } from '../../graphql/queries';
import { Spinner } from '../../shared/Loading';
import { formatError, useParamsQuery, InvoiceStatusColor, propAccessor } from '../../utils/helpers';
import { dateToString } from '../DateContainer';
import { invoiceStatus } from '../../utils/constants';
import InvoiceTiles from './InvoiceTiles';
import DataList from '../../shared/list/DataList';
import Label from '../../shared/label/Label';
import SearchInput from '../../shared/search/SearchInput';
import useDebounce from '../../utils/useDebounce';
import Text from '../../shared/Text';

const invoiceHeaders = [
  { title: 'CreatedBy', col: 2 },
  { title: 'Parcel Number', col: 2 },
  { title: 'Amount', col: 2 },
  { title: 'Issued date', col: 1 },
  { title: 'Due date', col: 1 },
  { title: 'Invoice Status', col: 2 }
];
export default function InvoiceList({ currency }) {
  const history = useHistory();
  const path = useParamsQuery();
  const limit = 50;
  const page = path.get('page');
  const status = path.get('status');
  const pageNumber = Number(page);
  const [currentTile, setCurrentTile] = useState(status || '');
  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce(searchValue, 500);

  const { loading, data: invoicesData, error } = useQuery(InvoicesQuery, {
    variables: { limit, offset: pageNumber, status, query: debouncedValue },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });
  const invoiceStats = useQuery(InvoiceStatsQuery, {
    fetchPolicy: 'cache-and-network'
  });

  function handleFilter(key) {
    setCurrentTile(key);
    const state = key === 'inProgress' ? 'in_progress' : key;
    history.push(`/payments?page=0&status=${state}`);
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
    <>
      <SearchInput 
        title='Invoices' 
        searchValue={searchValue} 
        handleSearch={event => setSearchValue(event.target.value)} 
        handleFilter={handleFilter}
      />
      <br />
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
        loading ? (
          <Spinner />
        ) :(
          <DataList
            keys={invoiceHeaders}
            data={renderInvoices(invoicesData?.invoices, currency)}
            hasHeader={false}
          />
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
    </>
  );
}

/**
 *
 * @param {object} invoices list of tasks
 * @param {function} handleOpenMenu a function that opens the menu for each task
 * @param {String} currency community currency
 * @returns {object} an object with properties that DataList component uses to render
 */
export function renderInvoices(invoices, currency) {
  return invoices.map(invoice => {
    return {
      'CreatedBy': (
        <Grid item xs={4} md={2} data-testid="created_by">
          {invoice.user.name}
        </Grid>
      ),
      'Parcel Number': (
        <Grid item xs={4} md={2} data-testid="parcel_number">
          {invoice.landParcel.parcelNumber}
        </Grid>
      ),
      Amount: (
        <Grid item xs={4} md={2} data-testid="invoice_amount">
          <Text content={`Amount: ${currency}${invoice.amount}`} />
          { invoice.status === 'in_progress' && <Text content={`Amount Paid: ${currency}${invoice.amount - invoice.pendingAmount}`} /> }
        </Grid>
      ),
      'Issued date': (
        <Grid item xs={4} md={2}>
          <Text content={`Issued: ${dateToString(invoice.createdAt)}`} />
          {invoice.status === 'paid' && invoice.payments.length 
            ? <Text content={`Paid: ${dateToString(invoice.payments[0]?.createdAt)} `} /> : null}
        </Grid>
      ),
      'Due date': (
        <Grid item xs={4} md={2}>
          <Text content={`Due: ${dateToString(invoice.dueDate)}`} />
        </Grid>
      ),
      'Invoice Status': (
        <Grid item xs={4} md={2} data-testid="invoice_status">
          <Label
            title={propAccessor(invoiceStatus, invoice.status)}
            color={propAccessor(InvoiceStatusColor, invoice.status)}
          />
        </Grid>
      )
    };
  });
}
InvoiceList.propTypes = {
  currency: string.isRequired
};
