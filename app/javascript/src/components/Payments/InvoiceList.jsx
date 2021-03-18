/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import { useHistory } from 'react-router';
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
import { useQuery, useLazyQuery } from 'react-apollo';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MaterialConfig from 'react-awesome-query-builder/lib/config/material'
import CenteredContent from '../CenteredContent';
import Paginate from '../Paginate';
import { InvoicesQuery, InvoicesStatsDetails } from '../../graphql/queries';
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
import DataList from '../../shared/list/DataList';
import Label from '../../shared/label/Label';
import SearchInput from '../../shared/search/SearchInput';
import useDebounce from '../../utils/useDebounce';
import Text from '../../shared/Text';
import InvoiceDetails from './InvoiceDetail';
import ListHeader from '../../shared/list/ListHeader';
import currencyTypes from '../../shared/types/currency';
import AutogenerateInvoice from './AutogenerateInvoice';
import InvoiceGraph from './InvoiceGraph'
import QueryBuilder from '../QueryBuilder'
import { dateToString as utilDate } from '../../utils/dateutil'

const invoiceHeaders = [
  { title: 'Issue Date', col: 2 },
  { title: 'Description', col: 4 },
  { title: 'Amount', col: 3 },
  { title: 'Payment Date', col: 3 },
  { title: 'Status', col: 4 },
];
export default function InvoiceList({ currencyData, userType }) {
  const menuList = []
  const history = useHistory();
  const path = useParamsQuery();
  const limit = 50;
  const page = path.get('page');
  const pageNumber = Number(page);
  const [searchValue, setSearchValue] = useState('');
  const [listType, setListType] = useState('nongraph')
  const debouncedValue = useDebounce(searchValue, 500);
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [query, setQuery] = useState('')
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const [displayBuilder, setDisplayBuilder] = useState('none')
  const [searchQuery, setSearchQuery] = useState('')

  function handleOpenMenu(event) {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  function handleClose(event) {
    event.stopPropagation()
    setAnchorEl(null)
  }

  const { loading, data: invoicesData, error } = useQuery(InvoicesQuery, {
    variables: { limit, offset: pageNumber, query: debouncedValue || searchQuery },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  function handleGenerateDialog() {
    setDialogOpen(!isDialogOpen)
  }

  function setGraphQuery(qu){
    setQuery(qu.noOfDays)
    loadInvoiceDetail()
    setListType('graph')
  }

  function setsearch(event){
    setSearchValue(event)
    setListType('nongraph')
  }

  function setSearchClear(){
    setSearchValue('')
    setListType('nongraph')
  }

  const [loadInvoiceDetail, {  error: statError, data: invoicesStatData } ] = useLazyQuery(InvoicesStatsDetails,{
    variables: { query },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network'
  })

  const menuData = {
    menuList,
    handleOpenMenu,
    anchorEl,
    open,
    userType,
    handleClose
  }

  function paginate(action) {
    if (action === 'prev') {
      if (pageNumber < limit) return;
      history.push(`/payments?page=${pageNumber - limit}`);
    } else if (action === 'next') {
      if (invoicesData?.invoices.length < limit) return;
      history.push(`/payments?page=${pageNumber + limit}`);
    }
  }

  function toggleFilterMenu() {
    if (displayBuilder === '') {
      setDisplayBuilder('none')
    } else {
      setDisplayBuilder('')
    }
  }

  function handleQueryOnChange(selectedOptions) {
    if (selectedOptions) {
      const andConjugate = selectedOptions.logic?.and
      const orConjugate = selectedOptions.logic?.or
      const availableConjugate = andConjugate || orConjugate
      if (availableConjugate) {
        const conjugate = andConjugate ? 'AND' : 'OR'
        const queryy = availableConjugate
          .map(option => {
            let operator = Object.keys(option)[0]
            // skipped nested object accessor here until fully tested 
            // eslint-disable-next-line security/detect-object-injection
            const property = filterFields[option[operator][0].var]
            let value = propAccessor(option, operator)[1]

            if (operator === '==') operator = '='
            if (property === 'created_at' || property === 'due_date') {
              value = utilDate(value)
            }

            return `${property} ${operator} "${value}"`
          })
          .join(` ${conjugate} `)
        setSearchQuery(queryy)
        setListType('nongraph')
      }
    }
  }

  const InitialConfig = MaterialConfig
  const queryBuilderConfig = {
    ...InitialConfig,
    fields: {
      userName: {
        label: 'User Name',
        type: 'text',
        valueSources: ['value'],
      },
      invoiceNumber: {
        label: 'Invoice Number',
        type: 'text',
        valueSources: ['value']
      },
      phoneNumber: {
        label: 'Phone Number',
        type: 'number',
        valueSources: ['value']
      },
      email: {
        label: 'Email',
        type: 'text',
        valueSources: ['value']
      },
      plotNumber: {
        label: 'Plot Number',
        type: 'text',
        valueSources: ['value']
      },
      issuedDate: {
        label: 'Issued Date',
        type: 'date',
        valueSources: ['value'],
      },
      dueDate: {
        label: 'Due Date',
        type: 'date',
        valueSources: ['value'],
      }
    }
  }

  const queryBuilderInitialValue = {
    // Just any random UUID
    id: '76a8a9ba-0123-3344-c56d-b16e532c8cd0',
    type: 'group',
    children1: {
      '98a8a9ba-0123-4456-b89a-b16e721c8cd0': {
        type: 'rule',
        properties: {
          field: 'userName',
          operator: 'equal',
          value: [''],
          valueSrc: ['value'],
          valueType: ['text']
        }
      }
    }
  }

  const filterFields = {
    userName: 'user',
    invoiceNumber: 'invoice_number',
    phoneNumber: 'phone_number',
    email: 'email',
    plotNumber: 'land_parcel',
    issuedDate: 'created_at',
    dueDate: 'due_date'
  }
  
  if (error && !invoicesData) {
    return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  }
  if (statError) {
    return <CenteredContent>{formatError(statError.message)}</CenteredContent>;
  }

  return (
    <>
      <Grid container>
        <Grid item xs={12} sm={10}>
          <SearchInput
            title='Invoices'
            searchValue={searchValue}
            handleSearch={event => setsearch(event.target.value)}
            // Todo: add a proper filter toggle function
            handleFilter={toggleFilterMenu}
            handleClear={() => setSearchClear()}
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
              <AutogenerateInvoice close={handleGenerateDialog} currencyData={currencyData} />
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
      <Grid
        container
        justify="flex-end"
        style={{
              width: '100.5%',
              position: 'absolute',
              zIndex: 1,
              marginTop: '-2px',
              marginLeft: '-250px',
              display: displayBuilder
            }}
      >
        <QueryBuilder
          handleOnChange={handleQueryOnChange}
          builderConfig={queryBuilderConfig}
          initialQueryValue={queryBuilderInitialValue}
          addRuleLabel="Add filter"
        />
      </Grid>
      <br />
      <br />
      <InvoiceGraph handleClick={setGraphQuery} />
      {loading ? (<Spinner />) : (
        <List>
          {
          listType === 'graph' && invoicesStatData?.invoicesStatDetails?.length && invoicesStatData?.invoicesStatDetails?.length > 0 ?
        (
          <div>
            {matches && <ListHeader headers={invoiceHeaders} />}
            {
              invoicesStatData.invoicesStatDetails.map((invoice) => (
                <InvoiceItem 
                  invoice={invoice} 
                  key={invoice.id} 
                  currencyData={currencyData}
                  menuData={menuData}
                />
              ))
            }
          </div>
        ) : listType === 'nongraph' && invoicesData?.invoices.length && invoicesData?.invoices.length > 0 ? (
          <div>
            {matches && <ListHeader headers={invoiceHeaders} />}
            {
              invoicesData.invoices.map((invoice) => (
                <InvoiceItem 
                  invoice={invoice} 
                  key={invoice.id} 
                  currencyData={currencyData}
                  menuData={menuData}
                />
              ))
            }
          </div>
        ) : (
          <CenteredContent>No Invoices Available</CenteredContent>
        )
        }
        </List>
      )}

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
        <Grid item xs={12} md={2} data-testid="issue_date">
          <Text content={dateToString(invoice?.createdAt)} />
          <br />
        </Grid>
      ),
      Description: (
        <Grid item xs={12} md={2} data-testid="description">
          <Link to={`/user/${invoice.user.id}?tab=Payments`} style={{ textDecoration: 'none'}}>
            <div style={{ display: 'flex', marginTop: '10px'}}>
              <Avatar src={invoice.user?.imageUrl} alt="avatar-image" />
              <span style={{ margin: '7px', fontSize: '12px' }}>{invoice.user?.name}</span>
            </div>
          </Link>
          <br />
          <Text content={`Invoice #${invoice.invoiceNumber}`} />
          <br />
          <Text color="primary" content={`Plot #${invoice.landParcel.parcelNumber}`} />
        </Grid>
      ),
      Amount: (
        <Grid item xs={12} md={2} data-testid="invoice_amount">
          <Text content={formatMoney(currencyData, invoice.amount)} />
        </Grid>
      ),
      'Payment Date': (
        <Grid item xs={12} md={2}>
          {invoice.status === 'paid' && invoice.payments.length ? (
            <Text content={dateToString(invoice.payments[0]?.createdAt)} />
          ) : (
            '-'
          )}
        </Grid>
      ),
      Status: (
        <Grid item xs={12} md={2} data-testid="status">
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

export function InvoiceItem({invoice, currencyData, menuData}){
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
        data={renderInvoice(invoice, currencyData, menuData)}
        hasHeader={false}
        clickable
        handleClick={() => setDetailsOpen(true)}
      />
    </div>
  )
}
InvoiceList.propTypes = {
  currencyData: PropTypes.shape({ ...currencyTypes }).isRequired,
  userType: PropTypes.string.isRequired
};
InvoiceItem.propTypes = {
  invoice: PropTypes.object.isRequired,
  currencyData: PropTypes.shape({ ...currencyTypes }).isRequired,
  menuData: PropTypes.object.isRequired
}