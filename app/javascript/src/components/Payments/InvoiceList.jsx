/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import { useHistory } from 'react-router';
import { useQuery } from 'react-apollo';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  List,
} from '@material-ui/core'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import CenteredContent from '../CenteredContent';
import Paginate from '../Paginate';
import { InvoicesQuery, InvoiceStatsQuery } from '../../graphql/queries';
import { Spinner } from '../../shared/Loading';
import {
  formatError,
  useParamsQuery,
  InvoiceStatusColor,
  propAccessor,
  formatMoney
} from '../../utils/helpers';
import { dateToString } from '../DateContainer';
import { invoiceStatus } from '../../utils/constants';
import InvoiceTiles from './InvoiceTiles';
import DataList from '../../shared/list/DataList';
import Label from '../../shared/label/Label';
import SearchInput from '../../shared/search/SearchInput';
import useDebounce from '../../utils/useDebounce';
import Text from '../../shared/Text';
import InvoiceDetails from './InvoiceDetail';
import ListHeader from '../../shared/list/ListHeader';
import currencyTypes from '../../shared/types/currency';
import AutogenerateInvoice from './AutogenerateInvoice';

const invoiceHeaders = [
  { title: 'Issue Date', col: 2 },
  { title: 'User', col: 4 },
  { title: 'Description', col: 4 },
  { title: 'Amount', col: 3 },
  { title: 'Payment Date', col: 3 },
  { title: 'Status', col: 4 }
];
export default function InvoiceList({ currencyData }) {
  const history = useHistory();
  const path = useParamsQuery();
  const limit = 50;
  const page = path.get('page');
  const status = path.get('status');
  const pageNumber = Number(page);
  const [currentTile, setCurrentTile] = useState(status || '');
  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce(searchValue, 500);
  const [isDialogOpen, setDialogOpen] = useState(false)

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

  function handleGenerateDialog() {
    setDialogOpen(!isDialogOpen)
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
  if (loading) return <Spinner />;
  if (error && !invoicesData) {
    return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  }

  return (
    <>
      <Grid container>
        <Grid item xs={12} sm={10}>
          <SearchInput
            title='Invoices'
            searchValue={searchValue}
            handleSearch={event => setSearchValue(event.target.value)}
            // Todo: add a proper filter toggle function
            handleFilter={() => {}}
            handleClear={() => setSearchValue('')}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Dialog
            open={isDialogOpen}
            fullWidth
            maxWidth="md"
            scroll="paper"
            onClose={handleGenerateDialog}
            aria-labelledby="generate_invoices"
          >
            <DialogTitle id="generate_invoices_dialog">
              <CenteredContent>
                <span>Generate Monthly Invoices</span>
              </CenteredContent>
            </DialogTitle>
            <DialogContent>
              <AutogenerateInvoice close={handleGenerateDialog} />
            </DialogContent>
          </Dialog>
          <CenteredContent>
            <Button 
              variant="contained" 
              data-testid="invoice-generate-button" 
              color="primary" 
              onClick={handleGenerateDialog}
              style={{marginLeft: '5px', marginTop: '10px'}}
            >
              Create Monthly Invoices
            </Button>
          </CenteredContent>
        </Grid>
      </Grid>
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
        <ListHeader headers={invoiceHeaders} />
        {invoicesData?.invoices.length && invoicesData?.invoices.length > 0 
        ? 
          invoicesData?.invoices.map((invoice) => (
            <InvoiceItem invoice={invoice} key={invoice.id} currencyData={currencyData} />
          ))
        : (
          <CenteredContent>No Invoices Available</CenteredContent>
        )}
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
 * @param {object} currencyData community currencyData current and locale
 * @returns {object} an object with properties that DataList component uses to render
 */
export function renderInvoice(invoice, currencyData) {
  return [
    {
      'Issue Date': (
        <Grid item xs={2} md={2} data-testid="issue_date">
          <Text content={dateToString(invoice?.createdAt)} />
        </Grid>
      ),
      User: (
        <Grid item xs={4} md={2} data-testid="created_by">
          <Link to={`/user/${invoice.user.id}?tab=Payments`} style={{ textDecoration: 'none'}}>
            <div style={{ display: 'flex' }}>
              <Avatar src={invoice.user?.imageUrl} alt="avatar-image" />
              <span style={{ margin: '7px' }}>{invoice.user?.name}</span>
            </div>
          </Link>
        </Grid>
      ),
      Description: (
        <Grid item xs={4} md={2} data-testid="description">
          <Text content={`Invoice Number #${invoice.invoiceNumber}`} />
          <br />
          <Text color="primary" content={`Plot Number #${invoice.landParcel.parcelNumber}`} />
        </Grid>
      ),
      Amount: (
        <Grid item xs={3} md={2} data-testid="invoice_amount">
          <Text content={formatMoney(currencyData, invoice.amount)} />
        </Grid>
      ),
      'Payment Date': (
        <Grid item xs={3} md={2}>
          {invoice.status === 'paid' && invoice.payments.length ? (
            <Text content={dateToString(invoice.payments[0]?.createdAt)} />
          ) : (
            '-'
          )}
        </Grid>
      ),
      Status: (
        <Grid item xs={4} md={2} data-testid="status">
          {new Date(invoice.dueDate) < new Date().setHours(0, 0, 0, 0) &&
          invoice.status === 'in_progress' ? (
            <Label title="Due" color="#B63422" />
          ) : (
            <Label
              title={propAccessor(invoiceStatus, invoice.status)}
              color={propAccessor(InvoiceStatusColor, invoice.status)}
            />
          )}
        </Grid>
      )
    }
  ];
}

export function InvoiceItem({invoice, currencyData}){
  const [detailsOpen, setDetailsOpen] = useState(false)
  return (
    <div>
      <InvoiceDetails
        detailsOpen={detailsOpen}
        handleClose={() => setDetailsOpen(false)}
        data={invoice}
        currencyData={currencyData}
      />
      <DataList
        keys={invoiceHeaders}
        data={renderInvoice(invoice, currencyData)}
        hasHeader={false}
        clickable
        handleClick={() => setDetailsOpen(true)}
      />
    </div>
  )
}
InvoiceList.propTypes = {
  currencyData: PropTypes.shape({ ...currencyTypes }).isRequired
};
InvoiceItem.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  invoice: PropTypes.object.isRequired,
  currencyData: PropTypes.shape({ ...currencyTypes }).isRequired
}