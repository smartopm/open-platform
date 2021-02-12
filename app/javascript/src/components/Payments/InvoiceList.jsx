/* eslint-disable no-nested-ternary */
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
import ListHeader from '../../shared/list/ListHeader';

const invoiceHeaders = [
  { title: 'Issue Date', col: 3 },
  { title: 'User', col: 4 },
  { title: 'Description', col: 4 },
  { title: 'Amount', col: 3 },
  { title: 'Payment Date', col: 3 },
  { title: 'Status', col: 4 }
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
        // Todo: add a proper filter toggle function
        handleFilter={() => {}}
        handleClear={() => setSearchValue('')}
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
          <div>
            <ListHeader headers={invoiceHeaders} />
            <DataList
              keys={invoiceHeaders}
              data={renderInvoices(invoicesData?.invoices, currency)}
              hasHeader={false}
            />
          </div>
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
      'Issue Date': (
        <Grid item xs={3} md={2} data-testid="issue_date">
          <Text content={dateToString(invoice.createdAt)} />
        </Grid>
      ),
      'User': (
        <Grid item xs={4} md={2} data-testid="created_by">
          {invoice.user.name}
        </Grid>
      ),
      'Description': (
        <Grid item xs={4} md={2} data-testid="description">
          <Text content={`Invoice Number #${invoice.invoiceNumber}`} /> 
          <br />
          <Text color='primary' content={`Plot Number #${invoice.landParcel.parcelNumber}`} />
        </Grid>
      ),
      Amount: (
        <Grid item xs={3} md={2} data-testid="invoice_amount">
          <Text content={`${currency}${invoice.amount}`} />
        </Grid>
      ),
      'Payment Date': (
        <Grid item xs={3} md={2}>
          {invoice.status === 'paid' && invoice.payments.length
            ? <Text content={dateToString(invoice.payments[0]?.createdAt)} /> : '-'}
          
        </Grid>
      ),
      'Status': (
        <Grid item xs={4} md={2} data-testid="status">
          {new Date(invoice.dueDate) < new Date().setHours(0,0,0,0) && invoice.status === 'in_progress' ? (
            <Label
              title='Due'
              color='#B63422'
            />
          ) : (
            <Label
              title={propAccessor(invoiceStatus, invoice.status)}
              color={propAccessor(InvoiceStatusColor, invoice.status)}
            />
          ) }
        </Grid>
      )
    };
  });
}
InvoiceList.propTypes = {
  currency: string.isRequired
};
